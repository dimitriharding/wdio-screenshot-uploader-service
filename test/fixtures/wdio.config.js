// https://github.com/webdriverio/webdriverio/blob/master/examples/wdio/wdio.moc
// ha.conf.js
module.exports = {
		/**
     * server configurations
     */
		host: '0.0.0.0',
		port: 4444,

		/**
     * specify test files
     */
		specs: ['./examples/wdio/runner-specs/mocha.test.js'],
		exclude: [
				'test/spec/multibrowser/**', 'test/spec/mobile/**'
		],

		/**
     * capabilities
     */
		capabilities: [
				{
						browserName: 'phantomjs'
				}, {
						browserName: 'chrome'
				}, {
						browserName: 'firefox'
				}
		],

		/**
     * test configurations
     */
		logLevel: 'silent',
		coloredLogs: true,
		screenshotPath: `${__dirname}/screenshots`,
		screenshotUploaderOptions: {
				storages: ['amazon-s3'],
				clean: false,
				storagesInfo: {
						'amazon-s3': {
								accessKeyId: process.env.S3_ACCESS_KEY_ID,
								secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
								bucket: process.env.S3_BUCKET,
								path: 'snaps'
						}
				}
		},
		baseUrl: 'http://webdriver.io',
		waitforTimeout: 10000,
		framework: 'mocha',

		reporters: ['dot'],
		reporterOptions: {
				outputDir: './'
		},

		mochaOpts: {
				ui: 'bdd'
		},

		/**
     * hooks
     */
		onPrepare: function () {
				console.log("let's go");
		},
		onComplete: function () {
				console.log("that's it");
		}
};
