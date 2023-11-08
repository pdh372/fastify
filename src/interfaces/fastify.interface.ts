import { FastifyReply } from 'fastify';
import 'fastify';

interface IError {
    field_name?: string;
    type?: string;
    description?: string;
}

export interface IResponseOptional {
    message?: string;
    errors?: IError[];
}

export interface IFormatResponse {
    success?: boolean;
    code: number;
    instance: FastifyReply;
    data?: any;
    option?: IResponseOptional;
    error_message: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user: any;
    }

    interface FastifyReply {
        // HTTP RESPONSE
        ok(data?: any, option?: IResponseOptional): FastifyReply;
        created(data?: any, option?: IResponseOptional): FastifyReply;

        badRequest(data?: any, option?: IResponseOptional): FastifyReply;
        unauthorized(data?: any, option?: IResponseOptional): FastifyReply;
        forbidden(data?: any, option?: IResponseOptional): FastifyReply;
        notFound(data?: any, option?: IResponseOptional): FastifyReply;
        tooManyRequests(data?: any, option?: IResponseOptional): FastifyReply;

        internalServerError(data?: any, option?: IResponseOptional): FastifyReply;
    }

    interface FastifyInstance {
        // models: ConstValue<typeof MongodbCollection>;
    }
}
