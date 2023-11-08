import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export interface IMiddleware {
    (req: FastifyRequest, reply?: FastifyReply, done?: HookHandlerDoneFunction): void;
}

export interface ICustomRoute {
    method: 'put' | 'post' | 'get' | 'delete' | 'patch';
    path: string;
    handler: IMiddleware;
    middlewares: IMiddleware[];
}

export interface IRouters {
    authRoute: ICustomRoute[];
    publicRoute: ICustomRoute[];
}
