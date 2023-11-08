require('dotenv').config({ path: `.env` });

const ENV = {
    DEV: 'development',
    PROD: 'production',
    STAGING: 'staging',
    UAT: 'uat',
};

const env = process.env.NODE_ENV || 'development';

export const config = {
    port: +(process.env.PORT || 3000),

    env: {
        isDev: ENV.DEV === env,
        isProd: ENV.PROD === env,
    },

    log: {
        route: process.env.IS_LOG_ROUTE === 'true',
    },
};
