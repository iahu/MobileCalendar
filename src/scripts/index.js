var MobileCalendar = require('./lib/zepto.js');
var MobileCalendar = require('./calendar/MobileCalendar.js');
var mc = new MobileCalendar({startDate: new Date()});
document.querySelector('#i').addEventListener('click', function(e) {
	mc.show();

	mc.onDateSelected = function (date) {
		if (date) {
			$('.q-l-content').text(date);
			$(this).addClass('selected');
		}

		setTimeout(function() {
			mc.remove();
		}, 50);
	};
});