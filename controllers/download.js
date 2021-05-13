const https = require('https')
const fs = require('fs')
const path = require('path')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');

module.exports = {
  downloadFile: (req, res) => {
    try {
      const url = req.body.url;

      const filename = path.basename(url)

      https.get(url, (res) => {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
        })
      })
      successResponse(res, `Download Success`);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  }
}