import { ICustomRoute } from '@src/interfaces/route.interface';
import { helper } from '@utils';
import * as schemas from './user.schema';

const publicRoutes: ICustomRoute[] = [
    {
        path: '/dsa',
        method: 'get',
        schema: schemas.listUser,
        handler: (req, reply) => {
            reply.ok([{ _id: '', name: '' }]);
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
