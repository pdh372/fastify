import { preHandlerHookHandler, RouteHandlerMethod, preSerializationHookHandler, FastifySchema } from 'fastify';

export interface ICustomRoute {
    method: 'put' | 'post' | 'get' | 'delete' | 'patch';
    path: string;
    handler: RouteHandlerMethod;
    schema?: FastifySchema;
    preHandler?: preHandlerHookHandler;
    preSerialization?: preSerializationHookHandler;
}

export interface IRouters {
    authRoute: ICustomRoute[];
    publicRoute: ICustomRoute[];
}
