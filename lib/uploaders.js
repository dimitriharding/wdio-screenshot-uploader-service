const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const chalk = require('chalk');

const AMAZON_S3 = 'amazon-s3';

class Uploaders {
	/**
	 * @param {Object} screenshotUploaderOptions - wdio.config.screenshotUploaderOptions
	 * @param {String} [screenshotUploaderOptions.screenshotPath=wdio.config.screenshotPath] - Path of screenshots
	 * @param {Array} screenshotUploaderOptions.storages - List of storage services to use e.g. ["amazon-s3","google-cloud"]
	 * @param {Object} screenshotUploaderOptions.storagesInfo - Credentials and additional information for each service
	 * @param {Boolean} [screenshotUploaderOptions.clean=true] - Whether or not to remove files from dir on initialization
	 * @param {Object} config wdio configuration object
	 * @param {Array.<Object>} capabilities list of capabilities details
	 */
	constructor(screenshotUploaderOptions, config, capabilities) {
		const options = screenshotUploaderOptions;

		if (options.clean === undefined) {
			options.clean = true;
		}
		this._validate(options, 'storages');
		this._validate(options, 'storagesInfo');

		options.config = config;
		options.capabilities = capabilities;

		this._screenshotFolder = path.resolve(options.screenshotPath || options.config.screenshotPath);
		this._s3Bucket = null;
		this._storages = options.storages || [];
		this._uploaderPromises = [];
		this._storagesInfo = options.storagesInfo || {};
		this._clean = options.clean;

		if (this._storagesInfo[AMAZON_S3]) {
			AWS
				.config
				.update({
					accessKeyId: process.env.S3_ACCESS_KEY_ID || options.storagesInfo[AMAZON_S3].accessKeyId,
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || options.storagesInfo[AMAZON_S3].secretAccessKey
				});
			this._s3Bucket = new AWS.S3({
				params: {
					Bucket: process.env.S3_BUCKET || options.storagesInfo[AMAZON_S3].bucket
				}
			});
		}
		if (this._clean) {
			this.rmdir(this._screenshotFolder);
		}
	}

	/**
	 * @param {Object} options - sus configuration object
	 * @param {String} name - Key to check for in options
	 * @private
	 */
	_validate(options, name) {
		if (options === null) {
			throw new Error('Missing screenshotUploaderOptions in wdio.conf');
		}
		if (options[name] === null) {
			throw new Error(`Missing ${name} value. Please update screenshotUploaderOptions in wdio.conf`);
		}
	}

	/**
	 * @param screenshotData
	 * @param screenshotData.filePath
	 * @param screenshotData.name
	 * @return {Object}
	 */
	[AMAZON_S3](screenshotData) {
		const { filePath, name } = screenshotData;
		const { path: _path, ACL } = this._storagesInfo[AMAZON_S3];
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, (err, data) => {
				if (err) {
					reject(err);
				}

				const type = path
					.extname(filePath)
					.replace('.', '');
				const params = {
					Key: _path ?
						`${_path}/${name}` : name,
					Body: data,
					ACL: ACL || 'public-read',
					ContentEncoding: 'base64',
					ContentType: `image/${type}`
				};

				// See:
				// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
				this
					._s3Bucket
					.upload(params, (err, data) => {
						if (err) {
							this.logUploadFailed();
							reject(err);
						}
						data.uploader = AMAZON_S3;
						resolve(data);
						this.logUploadSuccess();
					});
			});
		});
	}

	logUploadSuccess() {
		process
			.stdout
			.write(chalk.green('+'));
	}

	logUploadFailed() {
		process
			.stdout
			.write(chalk.red('-'));
	}

	/**
	 * Delete Dir
	 * @param {String} dir
	 */
	rmdir(dir) {
		if (fs.existsSync(dir)) {
			const list = fs.readdirSync(dir);
			for (let i = 0; i < list.length; i++) {
				const filename = path.join(dir, list[i]);
				const stat = fs.statSync(filename);

				if (filename === '.' || filename === '..') {
					// Pass these files
				} else if (stat.isDirectory()) {
					// Rmdir recursively
					this.rmdir(filename);
				} else {
					// Rm fiilename
					fs.unlinkSync(filename);
				}
			}
			fs.rmdirSync(dir);
		}
	}

	start() {
		if (fs.existsSync(this._screenshotFolder)) {
			const screenshots = fs.readdirSync(this._screenshotFolder);
			if (screenshots.length > 0) {
				Object
					.keys(this._storagesInfo)
					.forEach(storage => {
						this
							._uploaderPromises
							.push(...screenshots.map(screeshotname => {
								const screenshotData = {
									name: screeshotname,
									filePath: `${this._screenshotFolder}/${screeshotname}`
								};
								return this[storage](screenshotData);
							}));
					});
				process
					.stdout
					.write('\nuploading ');
				return Promise
					.all(this._uploaderPromises)
					.then(results => {
						console.log('\n\nStorage\t\tURL');
						console.log('-------\t\t---');
						results.forEach(data => {
							console.log(chalk`{bgGreen {black ${data.uploader} }}\t{cyan ${data.Location}} `);
						});
					});
			}
		}
	}
}

module.exports = Uploaders;
