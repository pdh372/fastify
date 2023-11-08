require('module-alias/register');

import { fastify, config, init } from '@utils';

const main = async () => {
    await init.handleRoutes();

    fastify.get('/favicon.ico', (req, reply) => {
        reply.ok();
    });

    fastify.get('*', (req, reply) => {
        reply.notFound(null, { message: 'Api not found.' });
    });

    fastify.listen({ port: config.port }, err => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
};

main();
