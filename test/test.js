import test from 'ava';

require('dotenv').config();
const Uploaders = require('../lib/uploaders');
const config = require('./fixtures/wdio.config');

test('Upload screenshot', async t => {
	const uploaders = new Uploaders(config.screenshotUploaderOptions, config, config.capabilities);
	await uploaders.start();
	t.log('TO ASSERT');
});
