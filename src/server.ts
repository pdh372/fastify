require('module-alias/register');

import fastify from '@utils/fastify';
import config from '@utils/config';
import { MongodbCollection } from './models';

// init models
// fastify.decorate('models', MongodbCollection);

fastify.route({
    method: 'get',
    url: '/',
    handler: async function (req, reply) {
        // @ts-ignore
        // const data = await this.models.Track.find();
        return reply.ok(['data']);
    },
});

fastify.listen({ port: config.port }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
