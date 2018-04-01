let $data, $element, $scope, moment, _, $event;

export default class WidgetController {

    static get $inject() { return ['opendash/services/data', '$element', '$scope', 'moment', 'lodash', 'opendash/services/event']; }

    constructor(_$data, _$element, _$scope, _moment, _lodash, _$event) {
        $data = _$data;
        $element = _$element;
        $scope = _$scope;
        $event = _$event;
        moment = _moment;
        _ = _lodash;

        this.hcArea = null
    }

    async $onInit() {
        this.state.alert = false;

        if (!this.config.id || !this.config.color || !this.config.widgettype || !this.config.time) {
            this.state.config = false;
            return;
        }

        let id = JSON.parse(this.config.id)[0];
        let valueNumber = JSON.parse(this.config.id)[1];

        let sensor = $data.get(id);

        if (!sensor || !sensor.history) {
            console.log('[opendash-widget-highchart-multi] BAD CONFIG');
            this.state.config = false;
            return;
        }

        let data = await sensor.history({
            since: moment().subtract(this.config.time, 'day'),
        });

        let items = _.chain(data).map(e => [e.date, parseFloat(e.value[valueNumber].toFixed(2))]).sortBy(e => e[0]).value();

        let series = [{
            showInLegend: false,
            color: this.config.color,
            name: 'Werte',
            data: items
        }];

        let type = this.config.widgettype;

        this.hcArea = {
            useHighStock: true,
            chart: {
                type: type,
                zoomType: 'x',
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                minRange: 1000 * 3600,
            },
            yAxis: {},
            //color: this.config.color,
            plotOptions: {
                series: {
                    turboThreshold: 10
                }
            },
            series: series,
            height: null,
        }

        this.loading = false;
    }
}