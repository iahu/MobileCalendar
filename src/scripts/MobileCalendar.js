require('./lib/zepto.js');
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
        var table = this.el.querySelector('#mc-' + d.year+ '-' + d.month);
        if (table) {
            var sel = '[data-date="'+[d.year,d.month,d.date].join('-') + '"]';
            var $today = this.el.querySelector(sel);
            if ($today) {
                $today.classList.add('today');
            }
        }
    },
    bindUI: function () {
        var el = this.el;
        var $el = $(el);
        var tt = new TouchTo(el, 20, true);
        var __self = this;
        var yearView = false;


        tt.on('moveleft moveright', function(event) {
            __self.swapMonth.call(__self, event);
        });

        tt.on('movedown', function() {
            if ( !yearView ) {
                __self.viewAll();
                yearView = true;
            }
        });
        tt.on('moveup', function() {
            if ( !yearView ) {
                __self.viewCurrentMonth();
                yearView = false;
            }
        });

        $el.on('touchstart', '.mobile-calender-hd', function(event) {
            event.preventDefault();
            __self.viewAll();
        })
        .on('click', '.year-view .mobile-calender-pane', function(e) {
            var ym = $(this).find('.mobile-calender-bt').attr('id').substr(3);
            var guss = $(e.target).closest('td').data('date');

            __self.viewMonth(ym, function () {
                if (guss) {
                    __self.setGussDate(guss);
                }
            });
        });

        this.selectDate();
        this.killView();
    },
    swapMonth: function (event) {
        var newYear, newMonth, clsCur, clsNew, html, newTable, pane,$el;
        $el = $(this.el);
        pane = $el.find('.mobile-calender-pane.animated');
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
        
        $(this.el.firstChild).addClass('animated kill '+clsCur);
        newTable = $(html).addClass('animated '+ clsNew);
        $el.append( newTable );
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
    viewAll: function () {
        var el = this.el,
            yv = document.createElement('div'),
            Y = this.currentYear,
            html = '<div class="mobile-calender-ynum">'+Y+'</div>';
        if (this.yearView) {
            return;
        }
        yv.classList.add('year-view');
        for (var i = 1; i <= 12; i++) {
            html += this.renderMonth(new Date( Y+' '+ i), true);
        }
        yv.innerHTML = html;
        el.firstChild.classList.add('animated');
        el.firstChild.classList.add('slideOutDown');
        el.firstChild.classList.add('kill');

        el.insertBefore(yv, el.firstChild);
        this.afterShow();
        html = null;
    },
    viewMonth: function (ym, cb) {
        ym = new Date(ym);
        var html;
        html = this.renderMonth( ym );
        this.el.firstChild.classList.add('animated');
        this.el.firstChild.classList.add('slideOutDown');
        this.el.firstChild.classList.add('kill');
        this.el.firstChild.insertAdjacentHTML('beforebegin', html);
        this.afterShow();
        if (cb && typeof cb === 'function') {
            cb();
        }
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
    selectDate: function () {
        var __self = this;
        $(this.el).on('click', '.month-view .cell', function() {
            __self.onDateSelected( $(this).parent().data('date') );
        });
    },
    setGussDate: function (d) {
        $('[data-date="'+d+'"]').addClass('guss');
    },
    onDateSelected: function () {},
    onMonthSelected: function () {}
});


module.exports = MobileCalendar;