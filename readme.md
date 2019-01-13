WDIO Screenshot Uploader Service
=================================

> A WebdriverIO service for uploading screenshots to online storages

## Installation
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
      storages: ["amazon-s3", "azure"]
      storagesInfo: {
          "amazon-s3": {
              accessKeyId: 'topSeCretMa738',
              secretAccessKey: 'ThisAsWell&eeieyern',
              bucket: 'screenshot',
              ACL: 'public-read', //optional
              path: 'errorshots' , //optional
          },
          "azure": {
              accountName: 'demo',
              accountKey: 'XXnkIIsNNdcdcLd',
              container: 'screenshot' //optional
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