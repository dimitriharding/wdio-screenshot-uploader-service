const Uploaders = require('./uploaders');

class ScreenshotUploaderService {
	constructor() {
		this._uploaders = null;
	}

	onPrepare(config, capabilities) {
		const options = config.screenshotUploaderOptions;
		this._uploaders = new Uploaders(options, config, capabilities);
	}

	onComplete(exitCode, config, capabilities) {
		// Upload screenshots on complete
		return this
			._uploaders
			.start(capabilities);
	}
}

module.exports = ScreenshotUploaderService;
