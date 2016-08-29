module.exports.crontab = {

  "54 * * * *": function getTicket() {
		var job = require('../api/services/redmine.js');
		job.getData();
  }
}