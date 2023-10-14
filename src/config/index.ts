const config = {
  PORT: process.env.PORT ?? 3000,
  API_KEY: process.env.API_KEY,
  AWS: {
    BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    PUBLIC_KEY: process.env.AWS_PUBLIC_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY
  }
}

export default config
