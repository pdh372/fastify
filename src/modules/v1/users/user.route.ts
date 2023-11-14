import { ICustomRoute } from '@src/interfaces/route.interface';
import { helper, init } from '@utils';

const publicRoutes: ICustomRoute[] = [
    {
        path: '/dsa',
        method: 'get',
        handler: (req, reply) => {
            reply.ok({ value: '', otherValue: false });
        },
        schema: {
            querystring: {},
            // response: {
            //     200: {
            //         type: 'object',
            //     },
            // },
        },
    },
    {
        path: '/:id/12',
        method: 'get',
        handler: () => {},
    },
];

const authRoutes: ICustomRoute[] = [
    {
        path: '/fas',
        method: 'get',
        handler: function (req, reply) {
            return reply.ok([]);
        },
    },
    {
        path: '/:id',
        method: 'delete',
        handler: (req, reply) => {
            reply.ok();
        },
    },
];

export = { routes: helper.dynamicImportRouter({ authRoutes, publicRoutes }) };
