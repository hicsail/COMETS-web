export default () => ({
  database: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/comets'
  },
  s3: {
    accessID: process.env.S3_ACCESS_KEY_ID,
    accessSecret: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT_URL,
    bucket: process.env.S3_BUCKET
  },
  runner: {
    image: process.env.RUNNER_IMAGE || 'hicsail/comets-runner:latest',
    imagePullSecret: process.env.IMAGE_PULL_SECRET_NAME,
    namespace: process.env.KUBE_NAMESPACE
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});