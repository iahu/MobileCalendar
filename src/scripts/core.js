;(function (exports) {
	'use strict';
	function Calendar() {
		return this;
	}

	Calendar.prototype = {
		constructor: Calendar,
		firstDayVal: 0,
		isDate: function (d) {
			return '[object Date]' === Object.prototype.toString.call(d);
		},
		getPrevDay: function (d, p) {
			if (typeof p === 'undefined') {
				p = 1;
			}
			if (typeof p == 'number' && p >= 0) {
				d = this.isDate(d)? d : new Date(d);
				var ms = + d;
				var nd = new Date(ms - ms%86400000);
				return new Date(nd - 86400000*p);
			} else {
				return null;
			}
		},
		getPrevDayInfo: function (d, p) {
			return this.getDateInfo(this.getPrevDay(d,p));
		},
		getNextDay: function (d, p) {
			if (typeof p === 'undefined') {
				p = 1;
			}
			if (typeof p == 'number' && p >= 0) {
				d = this.isDate(d)? d : new Date(d);
				var ms = + d;
				var nd = new Date( ms - ms%86400000 );
				return new Date(+ nd + 86400000*p);
			} else {
				return null;
			}
		},
		getNextDayInfo: function (d, p) {
			return this.getDateInfo(this.getNextDay(d,p));
		},
		getDateInfo: function(d) {
			d = this.isDate(d)? d : new Date( d );
			return {
				year: d.getFullYear(),
				month: d.getMonth()+1,
				date: d.getDate(),
				day: d.getDay(),
				originDate: d,
				toString: function () {
					return d.toString();
				},
				valueOf: function () {
					return d.valueOf();
				}
			};
		},
		getWeekInfo: function (d) {
			d = this.isDate(d) ? d : d;
			var day = d.getDay();
			var firstDayVal = this.firstDayVal;
			var firstDay = day === firstDayVal ? d : this.getPrevDayInfo(d, day-1);
			var c = this.getDateInfo(firstDay);
			var w = [c];
			for (var i = firstDayVal; i < 6; i++) {
				c = this.getNextDayInfo(c, 1);
				w.push( c );
			}
			return w;
		},
		getMonthInfo: function (d) {
			d = this.isDate(d)? d : new Date( d );
			var info = this.getDateInfo(d);
			var month = info.month;
			var firstDay = new Date( [info.year, info.month, 1].join('/'));
			var c = this.getWeekInfo(firstDay);
			var o = [c];
			var nextDay;
			while (true) {
				nextDay = this.getNextDay(c[6].originDate, 1);
				if ( nextDay.getMonth()+1 === month ) {
					c = this.getWeekInfo(nextDay);
					o.push(c);
				} else {
					break;
				}
			}
			return o;
		}
	};
	exports.Calendar = exports.Calendar || Calendar;
}( typeof exports !== 'undefined'? exports : this));
