import { IFormatResponse } from '@interfaces/fastify.interface';

const formatRes = (param: IFormatResponse) => {
    const { code, instance, data, error_message, success = false, option = {} } = param;
    const { message = '', errors = [] } = option;

    return instance.status(code).send({
        success,
        message,
        error_message,
        data: data || null,
        errors,
    });
};

export { formatRes };
