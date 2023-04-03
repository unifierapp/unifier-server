declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string,
            SESSION_SECRET: string,
            TWITTER_CONSUMER_KEY: string,
            TWITTER_CONSUMER_SECRET: string,
            FRONTEND_URL: string,
        }
    }
}

export {};