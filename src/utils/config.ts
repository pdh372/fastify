import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '../../', `.env`) });

const ENV = {
    DEV: 'development',
    PROD: 'production',
    STAGING: 'staging',
    UAT: 'uat',
};

const env = process.env.NODE_ENV || ENV.DEV;

export const config = {
    port: +(process.env.PORT || 3000),

    env: {
        isDev: ENV.DEV === env,
        isProd: ENV.PROD === env,
    },

    isBuilded: process.env.IS_BUILDED === 'true',

    log: {
        route: process.env.IS_LOG_ROUTE === 'true',
    },
};
