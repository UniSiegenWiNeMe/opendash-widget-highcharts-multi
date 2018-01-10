export default class SettingsController {

    static $inject = ['od.data.service', 'lodash'];

    constructor($data, _) {
        let items = $data.list();
        this.devices = _.map(items, sensor => {
            return {
                id: sensor.id,
                name: sensor.id
            };
    });
    }
}