var MobileCalendar = require('MobileCalendar.js');
var mc = new MobileCalendar({startDate: new Date()});
document.querySelector('#i').addEventListener('click', function(e) {
	mc.show();
});