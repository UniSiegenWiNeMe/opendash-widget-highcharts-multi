let $data, $element, $scope, moment, _, $event;

export default class WidgetController {

    static $inject = ['od.data.service', '$element', '$scope', 'moment', 'lodash', 'od.event.service'];

    constructor(_$data, _$element, _$scope, _moment, _lodash, _$event) {
        $data = _$data;
        $element = _$element;
        $scope = _$scope;
        $event = _$event;
        moment = _moment;
        _ = _lodash;

        this.hcArea = null
    }

    $onInit() {
        this.state.alert = false;

        if (!this.config.id) {
            this.state.config = false;
            return;
        }

        this.load();
        
        $event.on('od-widgets-changed', () => {
            this.load();
        });

        $event.on('od-dashboard-changed', () => {
            this.load();
        });
    }

    load() {
        let sensor = $data.get(this.config.id);

        if (!sensor) {
            console.log("NO_SENSOR"); // TODO
        }

        let request = sensor.history({
            since: moment().subtract(this.config.time, 'day'),
        });

        request.then((data) => {
            var series = [];
            var items = [];
            for (var i = 0; i < data.length; i++) {
                items.push([data[i].date, parseFloat(data[i].value[0].toFixed(2))]);
            }
            items = _.sortBy(items, o => o[0]);
            series.push({
                showInLegend: false,
                color: this.config.color,
                name: 'Werte',
                data: items
            });
            var type = this.config.widgettype;
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
        });

    }
}