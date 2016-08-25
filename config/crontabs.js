module.exports.crontab = {

  "*/1 * * * *": function getTicket() {
		var job = require('../api/services/redmine.js');
		job.getData();

  }
}