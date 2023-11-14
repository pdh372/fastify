require('module-alias/register');

import { fastify, config, init } from '@utils';

const main = async () => {
    init.document();
    await init.routes();

    fastify.register(async (instance, opts) => {
        fastify.route({
            url: '/huy',
            method: 'GET',
            handler: (req, reply) => {
                reply.ok('a');
            },
            schema: {},
            preHandler: undefined,
            preSerialization: (request, reply, payload, done) => {
                const newPayload = payload as any;
                done(null, { ...newPayload, data: newPayload.data.toUpperCase() });
            },
        });
    });

    fastify.listen({ port: config.port }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
};

main();
