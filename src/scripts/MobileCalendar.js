var Calendar = require('./core.js').Calendar;
var Handlebars = require('./lib/handlebars.js');
var tmpl = require('./template/calendar.coffee');

function MobileCalendar(conf) {
	this.config = conf;
	if (this instanceof MobileCalendar === false) {
		return new MobileCalendar(arguments);
	}
	this.tmpl = tmpl;
}

MobileCalendar.prototype = new Calendar();
MobileCalendar.prototype.constructor = MobileCalendar;

MobileCalendar.prototype.beforeRender = function () {};
MobileCalendar.prototype.renderMonth = function(date) {
	date = date || new Date();
	var data = this.getMonthInfo(date);
	var d = this.getDateInfo(date);
	if (data) {
		this.beforeRender(data);
		var template = Handlebars.compile(this.tmpl);
		return template({
			year: d.year,
			month: d.month,
			months: data
		});
	}
};
MobileCalendar.prototype.show = function() {
	var htmlString = this.renderMonth(this.config.startDate);
	var tmpDiv = document.createElement('div');
	tmpDiv.innerHTML = htmlString;
	htmlString = tmpDiv.firstChild;
	tmpDiv = null;
	this.beforeShow(htmlString);
	document.body.appendChild(htmlString);
};
MobileCalendar.prototype.beforeShow = function(html) {
	if (html) {
		var today = this.getDateInfo(new Date());
		var dataset = html.querySelector('table').dataset;
		var sel = '#mc-'+dataset.year+'-' + dataset.month +' ' + '[data-date=d-'+today.date + ']';
		var $today = html.querySelector(sel);
		if ($today) {
			$today.classList.add('today');
		}
	}
};

module.exports = MobileCalendar;