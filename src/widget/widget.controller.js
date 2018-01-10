var that = null;
export default class WidgetController {
    static $inject = ['od.data.service', '$element', 'moment', 'lodash', "$q", '$timeout', 'od.event.service'];
    constructor($data, $element, moment, lodash, $q, $timeout, $event) {;
        this.state.alert = false;
        
        if (!this.config.id) {
            this.state.config = false;
            return;
        }
        
        this.moment = moment;
        this.lodash = lodash;
        this.$q = $q;
        this.adapter = $data;
        that = this;
        this.hcArea = null
        this.load();
        $event.on('od-widgets-changed', () => {
            this.load();
    });
        $event.on('od-dashboard-changed', () => {
            this.load();
    });
    }
    load() {
        let _ = this.lodash;
        
            let sensor = this.adapter.get(this.config.id);
            if(!sensor) {
                console.log("NO_SENSOR"); // TODO
            }
            let request = sensor.history({
                since: this.moment().subtract(this.config.time, 'day'),
            });
            request.then(function(data) {
                var series = [];
                var items = [];
                for(var i = 0; i < data.length; i++) {
                    items.push([data[i].date,parseFloat(data[i].value[0].toFixed(2))]); 
                }
                items = that.lodash.sortBy(items, o => o[0]);
                series.push({
                    showInLegend: false,
                    color: that.config.color,
                    name: 'Werte',
                    data: items
                });
                var type = that.config.widgettype;
                that.hcArea = {
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
                    //color: that.config.color,
                    plotOptions: {
                        series: {
                          turboThreshold: 10
                        }},
                    series: series,
                    height: null,
                }

            that.loading = false;
            });
        
    }
}