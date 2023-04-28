declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string,
            SESSION_SECRET: string,
            TWITTER_CONSUMER_KEY: string,
            TWITTER_CONSUMER_SECRET: string,
            GOOGLE_CLIENT_ID: string,
            GOOGLE_CLIENT_SECRET: string,
            FRONTEND_URL: string,
            PORT: string,
            CLOUDINARY_CLOUD_NAME: string,
            CLOUDINARY_API_KEY: string,
            CLOUDINARY_API_SECRET: string,
            EMAIL_HOST: string,
            EMAIL_ACCOUNT: string,
            EMAIL_PASSWORD: string,
            EMAIL_NOREPLY_SENDER: string,
        }
    }
}

export {};