const config = {
  server: {
    port: 23000,
  },
  db: {
    uri: 'postgres://nbdovkzivnaphw:e9fb68e129f4542787f8490238c612cc101bc9cb2b3a1882bc3cdd96ebad1720@ec2-34-254-69-72.eu-west-1.compute.amazonaws.com:5432/d8rhrot5t10jpf', 
  },
  jwt: {
    secret: '8cef913a02f79a2dac8bc75925332cb0de113d5d59b88547eb41413b63e5488b',
  },
  storage: {
    bucketName: 'bucketeer-f6929cdb-29e1-4510-8650-08c4c02c8a2d',
    accesKeyId: 'AKIARVGPJVYVG4B6VYY6',
    secretAccessKey: '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',
    publicUrl: 'https://bucketeer-f6929cdb-29e1-4510-8650-08c4c02c8a2d.s3.amazonaws.com/public/',
    region: 'eu-west-1',
  },
};
export default config;