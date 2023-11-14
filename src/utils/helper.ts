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

const dynamicImport = async (dir: string) => {
    try {
        return await import(dir);
    } catch (error: any) {
        console.error(`Error dynamicImport:: ${dir} :: ${error.message}`);
        return null;
    }
};

function padEnd(param: { base: string; prefix: string; size: number }) {
    const { base, size, prefix } = param;
    return base.padEnd(size, prefix);
}

export const helper = { formatRes, dynamicImport, padEnd };
