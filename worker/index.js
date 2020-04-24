var CronJob = require('cron').CronJob;

const fetchGitHub = require('./task/fetch-github.js');

var job = new CronJob('*/1 * * * * *', fetchGitHub, null, true, 'America/Los_Angeles');
job.start();
