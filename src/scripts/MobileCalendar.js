var Handlebars = require('./lib/handlebars.js');
var Calendar = require('./core.js').Calendar;
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
        firstDayVal: 0,
        weekNames: ['日','一','二','三','四','五','六'],
        monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
    }, conf);

    if (this instanceof MobileCalendar === false) {
        return new MobileCalendar(arguments);
    }
    var info = this.getDateInfo(this.config.startDate);
    this.today = new Date();
    this.currentMonth = info.month;
    this.selectedDate = null;
    
    this.tmpl = tmpl;
    this.el = document.createElement('div');
    this.el.className = 'mobile-calendar';
}

MobileCalendar.prototype = new Calendar();
MobileCalendar.prototype.constructor = MobileCalendar;

extend(MobileCalendar.prototype, {
    extend: extend,
    bindUI: function () {
        var __self = this;
        var tt = new TouchTo(this.el, 10, true);
        var d = this.getDateInfo(this.today);

        // swap
        tt.on('moveleft moveright', function(event) {
            __self.swapMonth.call(__self, event);
        });
        // goto current month
        tt.on('moveup', function(event) {
            if (! document.getElementById('mc-'+ d.year+'-'+d.month) ) {
                __self.viewCurrentMonth.call(__self, event);
            }
        });
        // select date
        $(this.el).on('click', '.month-view .mobile-calendar-bt td', function() {
            __self.selectedDate = $(this).data('date');
            __self.onDateSelected.call( this, __self.selectedDate );
        })
        .on('click', '.closer', function(event) {
            event.preventDefault();
            __self.remove();
        });

        this.killView();
    },
    show: function() {
        var html = this.renderMonth(this.config.startDate);
        var el = this.el;
        if ( el.parentNode && el.clientWidth && el.clientHeight ) {
            el.display = 'block';
        } else {
            this.bindUI();
            el.innerHTML = html;
            $('.mobile-calendar-pane:first-child', el).addClass('animated zoomIn');
            document.body.appendChild(el);
            this.afterShow();
        }
    },
    afterShow: function() {
        this.setToday();
    },
    setToday: function () {
        var d = this.getDateInfo(this.today);
        var table = this.el.querySelector('#mc-' + d.year+ '-' + d.month);
        if (table) {
            var sel = '[data-date="'+[d.year,d.month,d.date].join('-') + '"]';
            var $today = this.el.querySelector(sel);
            if ($today) {
                $today.classList.add('today');
            }
        }
    },
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
                monthName: this.config.monthNames[this.currentMonth-1],
                dates: data,
                yearView: yearView,
                weekNames: this.config.weekNames
            });
        }
    },
    swapMonth: function (event) {
        var newYear, newMonth, clsCur, clsNew, html, newTable, pane,$el;
        $el = $(this.el);
        pane = $el.find('.mobile-calendar-pane.animated');
        if ( pane.length || $el.find('.year-view').length) {
            return;
        }

        newYear = this.currentYear;
        if (event.type === 'moveleft') {
            newMonth = (this.currentMonth+1) % 13 || 1;
            newYear += Math.floor((this.currentMonth+1)/13);

            clsCur = 'slideOutLeft';
            clsNew = 'slideInRight';
        } else if(event.type === 'moveright') {
            newMonth = (this.currentMonth-1) % 13 || 12;
            newYear += Math.floor((this.currentMonth-1 || -1)/13);
            clsCur = 'slideOutRight';
            clsNew = 'slideInLeft';
        }
        this.currentYear = newYear;
        this.currentMonth = newMonth;

        html = this.renderMonth( new Date(this.currentYear+' '+this.currentMonth) );
        
        $el.find('.mobile-calendar-pane').addClass('animated kill '+clsCur);
        newTable = $(html).addClass('animated '+ clsNew);
        $el.append( newTable );
        this.afterShow();
    },
    viewCurrentMonth: function () {
        var $el = $(this.el),
            html;
        html = this.renderMonth( this.today );
        html = $(html).addClass('animated slideInDown');
        $el.find('.month-view').addClass('animated slideOutUp kill');
        $el.append( html );
        this.afterShow();
    },
    killView: function () {
        var $el = $(this.el);
        $el.on('animationEnd webkitAnimationEnd', function (e) {
            var $et = $(e.target);
            if ( $et.is('.kill') ) {
                $et.remove();
            }
            $et.removeClass('animated slideInLeft slideInRight zoomIn slideInDown');
        });
    },
    onDateSelected: function () {},
    remove: function () {
        $(this.el).remove();
    },
    hide: function () {
        this.el.style.display = 'none';
    }
});

window.MobileCalendar = MobileCalendar;
