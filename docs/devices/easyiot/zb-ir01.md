---
title: "easyiot ZB-IR01 Homebridge/HomeKit integration"
description: "Add HomeKit support to your easyiot ZB-IR01, using Homebridge, Zigbee2MQTT and homebridge-z2m."
---
<!---
This file has been GENERATED using src/docgen/docgen.ts
DO NOT EDIT THIS FILE MANUALLY!
-->
# easyiot ZB-IR01
> This is an infrared remote control equipped with a local code library,supporting devices such as air conditioners, televisions, projectors, and more.


# Unsupported

This device is currently *UNSUPPORTED*.
Want to have this device supported? Please check the [GitHub issue section](https://github.com/itavero/homebridge-z2m/issues?q=ZB-IR01) to see if a request already exists for this device.
If it doesn't exist yet, you can [open a new request](https://github.com/itavero/homebridge-z2m/issues/new?assignees=&labels=enhancement&template=device_support.yml&title=%5BDevice%5D+easyiot%20ZB-IR01&model=easyiot%20ZB-IR01&exposes=%5B%0A%20%20%7B%0A%20%20%20%20%22type%22%3A%20%22text%22%2C%0A%20%20%20%20%22name%22%3A%20%22last_received_command%22%2C%0A%20%20%20%20%22label%22%3A%20%22Last%20received%20command%22%2C%0A%20%20%20%20%22property%22%3A%20%22last_received_command%22%2C%0A%20%20%20%20%22access%22%3A%201%2C%0A%20%20%20%20%22description%22%3A%20%22Received%20infrared%20control%20command%22%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20%22type%22%3A%20%22text%22%2C%0A%20%20%20%20%22name%22%3A%20%22send_command%22%2C%0A%20%20%20%20%22label%22%3A%20%22Send%20command%22%2C%0A%20%20%20%20%22property%22%3A%20%22send_command%22%2C%0A%20%20%20%20%22access%22%3A%202%2C%0A%20%20%20%20%22description%22%3A%20%22Send%20infrared%20control%20command%22%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20%22type%22%3A%20%22numeric%22%2C%0A%20%20%20%20%22name%22%3A%20%22linkquality%22%2C%0A%20%20%20%20%22label%22%3A%20%22Linkquality%22%2C%0A%20%20%20%20%22property%22%3A%20%22linkquality%22%2C%0A%20%20%20%20%22access%22%3A%201%2C%0A%20%20%20%20%22unit%22%3A%20%22lqi%22%2C%0A%20%20%20%20%22description%22%3A%20%22Link%20quality%20(signal%20strength)%22%2C%0A%20%20%20%20%22value_min%22%3A%200%2C%0A%20%20%20%20%22value_max%22%3A%20255%0A%20%20%7D%0A%5D) by filling in the _Device support_ issue template.

## Exposes

This is the information provided by Zigbee2MQTT for this device:

```json
[
  {
    "type": "text",
    "name": "last_received_command",
    "label": "Last received command",
    "property": "last_received_command",
    "access": 1,
    "description": "Received infrared control command"
  },
  {
    "type": "text",
    "name": "send_command",
    "label": "Send command",
    "property": "send_command",
    "access": 2,
    "description": "Send infrared control command"
  },
  {
    "type": "numeric",
    "name": "linkquality",
    "label": "Linkquality",
    "property": "linkquality",
    "access": 1,
    "unit": "lqi",
    "description": "Link quality (signal strength)",
    "value_min": 0,
    "value_max": 255
  }
]
```

# Related
* [Other devices from easyiot](../index.md#easyiot)
* [Zigbee2MQTT documentation for this device](https://www.zigbee2mqtt.io/devices/ZB-IR01.html)