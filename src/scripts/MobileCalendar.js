var Calendar = require('./core.js').Calendar;
var Handlebars = require('./lib/handlebars.js');
var tmpl = require('./template/calendar.coffee');
var TouchTo = require('./TouchTo.js');
var extend = function (out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
            continue;
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
                out[key] = arguments[i][key];
        }
    }
    return out;
};
function MobileCalendar(conf) {
    this.config = extend({
        startDate: new Date(),
        firstDayVal: 0
    }, conf);

    if (this instanceof MobileCalendar === false) {
        return new MobileCalendar(arguments);
    }
    this.tmpl = tmpl;
    this.el = document.createElement('div');
    this.el.className = 'mobile-calender';
    this.weekNames = ['日','一','二','三','四','五','六'];
    this.monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    var info = this.getDateInfo(this.config.startDate);
    this.today = new Date();
    this.currentYear = info.year;
    this.currentMonth = info.month;
}

MobileCalendar.prototype = new Calendar();
MobileCalendar.prototype.constructor = MobileCalendar;

extend(MobileCalendar.prototype, {
    beforeRender: function (data) {
        var YM = [this.currentYear, this.currentMonth].join('');
        return data.map(function(week){
            return week.map(function (date) {
                var ym = [date.year, date.month].join('');
                date.cls = date.cls || ' ';
                date.cls += ym > YM ?
                    'nextMonth'
                    : ym < YM ? 'prevMonth' : 'currentMonth';
                ym = null;
                return date;
            });
        });
        YM = null;
        return data;
    },
    renderMonth: function(date, yearView) {
        date = date || this.config.startDate;
        var data = this.getMonthInfo(date);
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth()+1;
        if (data) {
            this.beforeRender(data);
            var template = Handlebars.compile(this.tmpl);
            return template({
                year: this.currentYear,
                month: this.currentMonth,
                monthName: this.monthNames[this.currentMonth-1],
                dates: data,
                yearView: yearView,
                weekNames: this.weekNames
            });
        }
    },
    show: function() {
        var html = this.renderMonth(this.config.startDate);
        var el = this.el;
        if ( el.parentNode && el.clientWidth && el.clientHeight ) {
            return;
        }
        this.bindUI();
        el.innerHTML = html;
        el.firstChild.classList.add('animated');
        el.firstChild.classList.add('zoomIn');
        document.body.appendChild(el);
        this.afterShow();
    },
    afterShow: function() {
        var d = this.getDateInfo(this.today);
        var dataset = this.el.querySelector('.mobile-calender-bt').dataset;
        if (dataset.year === d.year && dataset.month === d.month) {
            var sel = '[data-date="'+[d.year,d.month,d.date].join('-') + '"]';
            var $today = this.el.querySelector(sel);
            if ($today) {
                $today.classList.add('today');
            }
        }
    },
    bindUI: function () {
        this.swapeMonth();
        this.viewAllYear();
    },
    swapeMonth: function () {
        var tt = new TouchTo(this.el, 50, true);
        var __self = this;
        tt.on('MoveLeft MoveRight', function(event) {
            var d, newYear, newMonth, clsCur, clsNew, html,tmpDiv, newTable, pane;
            pane = this.querySelector('.mobile-calender-pane');
            if ( pane && pane.classList.contains('animated') ||
                el.classList.contains('year-view')) {
                return;
            }

            newYear = __self.currentYear;
            if (event.type === 'MoveLeft') {
                newMonth = (__self.currentMonth+1) % 13 || 1;
                newYear += Math.floor((__self.currentMonth+1)/13);

                clsCur = 'slideOutLeft';
                clsNew = 'slideInRight';
            } else {
                newMonth = (__self.currentMonth-1) % 13 || 12;
                newYear += Math.floor((__self.currentMonth-1 || -1)/13);
                clsCur = 'slideOutRight';
                clsNew = 'slideInLeft';
            }
            __self.currentYear = newYear;
            __self.currentMonth = newMonth;

            html = __self.renderMonth( new Date(__self.currentYear+' '+__self.currentMonth) );
            tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = html;
            newTable = tmpDiv.firstChild;
            newTable.classList.add('animated');
            newTable.classList.add(clsNew);
            __self.el.querySelector('.mobile-calender-pane').classList.add('animated');
            __self.el.querySelector('.mobile-calender-pane').classList.add(clsCur);
            __self.el.appendChild( newTable );
            __self.afterShow();
            tmpDiv = null;
        });

        function endHandler(e) {
            var et = e.target;
            et.classList.remove('animated');
            if ( et.classList.contains('slideOutRight') ) {
                et.classList.remove('slideOutRight');
                et.remove();
            } else if ( et.classList.contains('slideOutLeft') ) {
                et.classList.remove('slideOutLeft');
                et.remove();
            }
            et.classList.remove('slideInLeft');
            et.classList.remove('slideInRight');
            et.classList.remove('zoomIn');
        }
        this.el.addEventListener('animationEnd', endHandler);
        this.el.addEventListener('webkitAnimationEnd', endHandler);
    },
    viewAllYear: function () {
        var __self = this;
        var renderMonth = __self.renderMonth;
        var Y = __self.currentYear;
        var el = __self.el;

        el.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if ( document.querySelector('.mobile-calender-hd') && 
                document.querySelector('.mobile-calender-hd').contains(e.target) ) {
                var html = '<div class="mobile-calender-ynum">'+Y+'</div>';
                el.classList.add('year-view');
                for (var i = 1; i <= 12; i++) {
                    html += renderMonth.call(__self, new Date( Y+' '+ i), true);
                }
                el.innerHTML = html;
                __self.afterShow();
                html = null;
            }
        });
    }
});


module.exports = MobileCalendar;