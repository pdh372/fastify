export const logger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname,req,res,reqId,responseTime',
            },
        },
    },
    production: true,
    test: false,
};
