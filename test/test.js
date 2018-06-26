import test from 'ava';

require('dotenv').config();
const {stdout} = require('test-console');
const Uploaders = require('../lib/uploaders');
const config = require('./fixtures/wdio.config');

test('Upload screenshot', t => {
	const uploaders = new Uploaders(config.screenshotUploaderOptions, config, config.capabilities);
	const output = stdout.inspectSync(async () => {
		await uploaders.start();
	});
	t.deepEqual(output, ['\nuploading ']);
});
