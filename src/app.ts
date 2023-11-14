require('module-alias/register');

import { fastify, config, init } from '@utils';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const main = async () => {
    const swaggerOptions = {
        swagger: {
            info: {
                title: 'My Title',
                description: 'My Description.',
                version: '1.0.0',
            },
            host: 'localhost',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [{ name: 'Default', description: 'Default' }],
        },
    };

    const swaggerUiOptions = {
        routePrefix: '/docs',
        exposeRoute: true,
    };

    fastify.register(fastifySwagger, swaggerOptions);
    fastify.register(fastifySwaggerUi, swaggerUiOptions);
    await init.handleRoutes();

    fastify.register(
        async (instance, opts) => {
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
        },
        { prefix: '/v1' },
    );

    fastify.listen({ port: config.port }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });

    // await fastify.ready();
    // @ts-ignore
    // fastify.swagger();
};

main();
