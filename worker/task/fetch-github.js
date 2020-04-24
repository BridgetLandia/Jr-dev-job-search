const fetch = require('node-fetch');
const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');

const setAsync = promisify(client.set).bind(client);

const baseUrl = 'https://jobs.github.com/positions.json';

//fetch all pages

async function fetchGitHub() {
	let resultCount = 1;
	let onPage = 0;
	const allJobs = [];

	while (resultCount > 0) {
		const res = await fetch(`${baseUrl}/?page=${onPage}`);
		const jobs = await res.json();
		allJobs.push(...jobs);
		resultCount = jobs.length;
		console.log('got ', jobs.length);
		onPage++;
	}

	// filter algo

	const jrJobs = allJobs.filter((job) => {
		const jobTitle = job.title.toLowerCase();
		let isJunior = true;

		// algo logic
		if (
			jobTitle.includes('senior') ||
			jobTitle.includes('manager') ||
			jobTitle.includes('sr.') ||
			jobTitle.includes('architect')
		) {
			return false;
		}

		return true;
	});

	// set in redis
	console.log('got', resultCount, 'jobs');
	const success = await setAsync('github', JSON.stringify(jrJobs));
	console.log({ success });
}

module.exports = fetchGitHub;
