import { Characteristic, CharacteristicValue, Service, WithUUID } from 'homebridge';
import { BasicLogger } from '../logger';

export type MqttToHomeKitValueTransformer = (value: unknown) => CharacteristicValue | undefined;

export interface CharacteristicMonitor {
  callback(state: Record<string, unknown>, logger: BasicLogger): void;
}

abstract class BaseCharacteristicMonitor implements CharacteristicMonitor {
  constructor(
    private readonly key: string,
    protected readonly service: Service,
    protected readonly characteristic: string | WithUUID<new () => Characteristic>
  ) {}

  abstract transformValueFromMqtt(value: unknown): CharacteristicValue | undefined;

  callback(state: Record<string, unknown>, logger: BasicLogger): void {
    if (this.key in state) {
      const value = state[this.key];
      if (value !== undefined) {
        const transformed_value = this.transformValueFromMqtt(value);
        if (transformed_value !== undefined) {
          this.updateRangeIfNeeded(transformed_value, logger);
          this.service.updateCharacteristic(this.characteristic, transformed_value);
        }
      }
    }
  }

  private updateRangeIfNeeded(value: CharacteristicValue, logger: BasicLogger): void {
    if (typeof value !== 'number') {
      // Only numeric values have a range
      return;
    }

    const c = this.service.getCharacteristic(this.characteristic);
    if (c === undefined) {
      return;
    }

    if (c.props.minValue !== undefined && value < c.props.minValue) {
      // Update min value
      logger.warn(`${c.displayName} minimum value updated from ${c.props.minValue} to ${value}, due to received value.`);
      c.setProps({ minValue: value });
    } else if (c.props.maxValue !== undefined && value > c.props.maxValue) {
      // Update max value
      logger.warn(`${c.displayName} maximum value updated from ${c.props.maxValue} to ${value}, due to received value.`);
      c.setProps({ maxValue: value });
    }
  }
}

export class NestedCharacteristicMonitor implements CharacteristicMonitor {
  constructor(
    private readonly key: string,
    private readonly monitors: CharacteristicMonitor[]
  ) {
    if (monitors.length === 0) {
      throw new RangeError(`No monitors passed to NestedCharacteristicMonitor for key ${key}.`);
    }
  }

  callback(state: Record<string, unknown>, logger: BasicLogger): void {
    if (this.key in state) {
      const nested_state = state[this.key] as Record<string, unknown>;
      this.monitors.forEach((m) => m.callback(nested_state, logger));
    }
  }
}

export class PassthroughCharacteristicMonitor extends BaseCharacteristicMonitor {
  transformValueFromMqtt(value: unknown): CharacteristicValue | undefined {
    return value as CharacteristicValue;
  }
}

export class MappingCharacteristicMonitor extends BaseCharacteristicMonitor {
  constructor(
    key: string,
    service: Service,
    characteristic: string | WithUUID<new () => Characteristic>,
    private readonly mapping: Map<CharacteristicValue, CharacteristicValue>
  ) {
    super(key, service, characteristic);
    if (mapping.size === 0) {
      throw new RangeError(`Empty mapping passed to MappingCharacteristicMonitor for key ${key} on service ${this.service.UUID}.`);
    }
  }

  transformValueFromMqtt(value: unknown): CharacteristicValue | undefined {
    return this.mapping.get(value as CharacteristicValue);
  }
}

export type BinaryConditionBasedOnValue = (value: unknown) => boolean;

export class BinaryConditionCharacteristicMonitor extends BaseCharacteristicMonitor {
  constructor(
    key: string,
    service: Service,
    characteristic: string | WithUUID<new () => Characteristic>,
    private readonly condition: BinaryConditionBasedOnValue,
    private readonly value_true: CharacteristicValue,
    private readonly value_false: CharacteristicValue
  ) {
    super(key, service, characteristic);
  }

  transformValueFromMqtt(value: unknown): CharacteristicValue | undefined {
    return this.condition(value) ? this.value_true : this.value_false;
  }
}

export class NumericCharacteristicMonitor extends BaseCharacteristicMonitor {
  constructor(
    key: string,
    service: Service,
    characteristic: string | WithUUID<new () => Characteristic>,
    private readonly input_min: number,
    private readonly input_max: number,
    private readonly output_min?: number | undefined,
    private readonly output_max?: number | undefined,
    private readonly ceilAlmostZeroValue = false
  ) {
    super(key, service, characteristic);
    if (input_min === input_max) {
      throw new RangeError(`input min/max equal on NumericCharacteristicMonitor for key ${key} on service ${this.service.UUID}.`);
    }
    if (output_min !== undefined && output_min === output_max) {
      throw new RangeError(`output min/max equal on NumericCharacteristicMonitor for key ${key} on service ${this.service.UUID}.`);
    }
  }

  transformValueFromMqtt(value: unknown): CharacteristicValue | undefined {
    const input = value as number;
    let out_minimum: number;
    let out_maximum: number;

    const actualCharacteristic = this.service.getCharacteristic(this.characteristic);
    if (this.output_min === undefined) {
      if (actualCharacteristic === undefined || actualCharacteristic.props.minValue === undefined) {
        throw new Error('NumericCharacteristicMonitor initialized without output_min, but it is not provided by characteristic either.');
      }
      out_minimum = actualCharacteristic.props.minValue;
    } else {
      out_minimum = this.output_min;
    }

    if (this.output_max === undefined) {
      if (actualCharacteristic === undefined || actualCharacteristic.props.maxValue === undefined) {
        throw new Error('NumericCharacteristicMonitor initialized without output_max, but it is not provided by characteristic either.');
      }
      out_maximum = actualCharacteristic.props.maxValue;
    } else {
      out_maximum = this.output_max;
    }

    if (input <= this.input_min) {
      return out_minimum;
    }
    if (input >= this.input_max) {
      return out_maximum;
    }
    const percentage = (input - this.input_min) / (this.input_max - this.input_min);

    const result = out_minimum + percentage * (out_maximum - out_minimum);
    if (this.ceilAlmostZeroValue && result > 0 && result < 1) {
      return 1;
    }
    return result;
  }
}
