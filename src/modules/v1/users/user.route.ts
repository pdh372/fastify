import { ICustomRoute } from '@src/interfaces/route.interface';
import { init } from '@utils';

const publicRoutes: ICustomRoute[] = [
    {
        path: '/dsa',
        method: 'get',
        middlewares: [],
        handler: () => {},
    },
    {
        path: '/:id/12',
        method: 'get',
        middlewares: [],
        handler: () => {},
    },
];

const authRoutes: ICustomRoute[] = [
    {
        path: '/fas',
        method: 'get',
        middlewares: [],
        handler: () => {},
    },
    {
        path: '/:id',
        method: 'delete',
        middlewares: [],
        handler: () => {},
    },
];

export = { routes: init.pathRoutes({ authRoutes, publicRoutes }) };
