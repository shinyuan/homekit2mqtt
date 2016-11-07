module.exports = function (iface) {

    var {mqttPub, mqttSub, mqttStatus, log, newAccessory, Service, Characteristic} = iface;

    return function createAccessory_CarbonDioxideSensor(settings) {

        var sensor = newAccessory(settings);

        sensor.addService(Service.CarbonDioxideSensor, settings.name)
            .getCharacteristic(Characteristic.CarbonDioxideDetected)
            .on('get', function (callback) {
                log.debug('< hap get', settings.name, 'CarbonDioxideDetected');
                var contact = mqttStatus[settings.topic.statusCarbonDioxideDetected] === settings.payload.onCarbonDioxideDetected
                    ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
                    : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;

                log.debug('> hap re_get', settings.name, 'CarbonDioxideDetected', contact);
                callback(null, contact);
            });

        mqttSub(settings.topic.statusCarbonDioxideDetected, function (val) {
            var contact = val === settings.payload.onCarbonDioxideDetected
                ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
                : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
            log.debug('> hap set', settings.name, 'CarbonDioxideDetected', contact);
            sensor.getService(Service.CarbonDioxideSensor)
                .setCharacteristic(Characteristic.CarbonDioxideDetected, contact)
        });

        if (settings.topic.statusLowBattery) {
            sensor.getService(Service.CarbonDioxideSensor, settings.name)
                .getCharacteristic(Characteristic.StatusLowBattery)
                .on('get', function (callback) {
                    log.debug('< hap get', settings.name, 'StatusLowBattery');
                    var bat = mqttStatus[settings.topic.statusLowBattery] === settings.payload.onLowBattery
                        ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
                        : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
                    log.debug('> hap re_get', settings.name, 'StatusLowBattery', bat);
                    callback(null, bat);
                });

            mqttSub(settings.topic.statusLowBattery, function (val) {
                var bat = val === settings.payload.onLowBattery
                    ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
                    : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
                log.debug('> hap set', settings.name, 'StatusLowBattery', bat);
                sensor.getService(Service.CarbonDioxideSensor)
                    .setCharacteristic(Characteristic.StatusLowBattery, bat)
            });
        }

        return sensor;

    }
};


