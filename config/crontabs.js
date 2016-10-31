module.exports.crontab = {
  "14 * * * *": function getTicket() {
		var job = require('../api/services/redmine.js');
		job.getData();
		// job.registMember();
  }
}