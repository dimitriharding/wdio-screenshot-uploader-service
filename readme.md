WDIO Screenshot Uploader Service
=================================

> A WebdriverIO service for uploading screenshots to online storages

## Installation
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdimitriharding%2Fwdio-screenshot-uploader-service.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdimitriharding%2Fwdio-screenshot-uploader-service?ref=badge_shield)

```console
npm install wdio-screenshot-uploader-service --save-dev
```
Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

In order to use the service you need to set `screenshotUploaderOptions` in your `wdio.conf.js` file. It will automatically upload all screenshots to each storage has the correct options.

```js
// wdio.conf.js
export.config = {
  // ...
  services: ['screenshot-uploader'],
  screenshotUploaderOptions: {
      storages: ["amazon-s3"]
      storagesInfo: {
          "amazon-s3": {
              accessKeyId: 'topSeCretMa738',
              secretAccessKey: 'ThisAsWell&eeieyern',
              bucket: 'screenshot',
              ACL: 'public-read', //optional
              path: 'errorshots' , //optional
          }
      }
  }
  // ...
};
```

## Options
<a name="Uploaders"></a>

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| screenshotUploaderOptions | <code>Object</code> |  | wdio.config.screenshotUploaderOptions |
| [screenshotUploaderOptions.screenshotPath] | <code>String</code> | <code>wdio.config.screenshotPath</code> | Path of screenshots |
| screenshotUploaderOptions.storages | <code>Array</code> |  | List of storage services to use e.g. ["amazon-s3","google-cloud"] |
| screenshotUploaderOptions.storagesInfo | <code>Object</code> |  | Credentials and additional information for each service |
| [screenshotUploaderOptions.clean] | <code>Boolean</code> | <code>true</code> | Whether or not to remove files from dir on initialization |

## Tests
`npm test`

## Additional Info

For more information on WebdriverIO see the [homepage](http://webdriver.io).

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdimitriharding%2Fwdio-screenshot-uploader-service.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdimitriharding%2Fwdio-screenshot-uploader-service?ref=badge_large)