import fs from 'fs';
import AWS from 'aws-sdk';
import config from '../config';

class Bucketeer {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: config.storage.accesKeyId,
      secretAccessKey: config.storage.secretAccessKey,
    });
    this.bucket = config.storage.bucketName;
  }

  upload({ file, id }) {
    const { s3 } = this;
    const fileContent = fs.readFileSync(file.path);
    const mediaKey = `${id}.${file.type.split('/')[1]}`;
    const params = {
      Bucket: this.bucket,
      Key: mediaKey,
      Body: fileContent,
    };
    return new Promise((fnResolve, fnReject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          fnReject(err);
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        fnResolve(mediaKey);
      });
    });
  }

  async getPresignedUrl(mediaKey) {
    const params = {
      Bucket: this.bucket,
      Key: mediaKey,
      Expires: 86400,
    };
    const url = await this.s3.getSignedUrl('getObject', params);
    return url;
  }

  download(mediaKey) {
    const params = {
      Bucket: this.bucket,
      Key: mediaKey,
    };
    this.s3.getObject(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log(data);

      console.log(data.Body.toString());
    });
  }
}

export default Bucketeer;