import Fastify, { FastifyReply } from 'fastify';
import { logger } from '@utils/logger';
import { helper } from '@src/utils/helper';

export const fastify = Fastify({
    logger: logger['development'] ?? true,
});

// HTTP REQUEST
{
    fastify.decorateReply('ok', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            success: true,
            code: 200,
            instance: this,
            data,
            option,
            error_message: '',
        });
    });
    fastify.decorateReply('created', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            success: true,
            code: 201,
            instance: this,
            data,
            option,
            error_message: '',
        });
    });
    fastify.decorateReply('unauthorized', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            code: 401,
            instance: this,
            data,
            option,
            error_message: 'Unauthorized.',
        });
    });
    fastify.decorateReply('forbidden', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            code: 403,
            instance: this,
            data,
            option,
            error_message: 'Forbidden.',
        });
    });
    fastify.decorateReply('notFound', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            code: 404,
            instance: this,
            data,
            option,
            error_message: 'Not Found.',
        });
    });
    fastify.decorateReply('tooManyRequests', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            code: 429,
            instance: this,
            data,
            option,
            error_message: 'Too Many Requests.',
        });
    });
    fastify.decorateReply('internalServerError', function (this: FastifyReply, data, option) {
        return helper.formatRes({
            code: 500,
            instance: this,
            data,
            option,
            error_message: 'Internal Server Error.',
        });
    });
}

// HOOK
{
    fastify.addHook('onResponse', (req, reply, done) => {
        done();
    });
}

// CATCH GLOBAL ERROR
{
    fastify.setErrorHandler(function (error, req, reply) {
        this.log.error('handler_error::' + error.message);
        reply.internalServerError();
    });
}
