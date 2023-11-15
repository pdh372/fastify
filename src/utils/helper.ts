import { IFormatResponse } from '@interfaces/fastify.interface';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ICustomRoute } from '@src/interfaces/route.interface';
import { config } from '@utils';

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

const dynamicImportFile = async (dir: string) => {
    try {
        return await import(dir);
    } catch (error: any) {
        console.error(`Error dynamicImport:: ${dir} :: ${error.message}`);
        return null;
    }
};

const dynamicImportRouter = ({
    authRoutes = [],
    publicRoutes = [],
}: {
    authRoutes: ICustomRoute[];
    publicRoutes: ICustomRoute[];
}) => {
    return ({ rootPath, version }: { rootPath: string; version: string }) => {
        return (fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error | undefined) => void) => {
            authRoutes.forEach(item => {
                if (config.log.route) {
                    fastify.log.info(
                        `AUTH:: [${helper.padEnd({
                            base: item.method,
                            size: 6,
                            prefix: ' ',
                        })}] - /api/${version}/${rootPath}${item.path}`,
                    );
                }

                fastify.route({
                    url: `/api/${version}/${rootPath}${item.path}` as string,
                    method: item.method,
                    handler: item.handler,
                    preSerialization: item.preSerialization,
                    preHandler: item.preHandler,
                    schema: item.schema,
                });
            });

            publicRoutes.forEach(item => {
                if (config.log.route) {
                    fastify.log.info(
                        `PUBL:: [${helper.padEnd({
                            base: item.method,
                            size: 6,
                            prefix: ' ',
                        })}] - /api/${version}/${rootPath}${item.path}`,
                    );
                }

                fastify.route({
                    url: `/api/${version}/${rootPath}${item.path}`,
                    method: item.method,
                    handler: item.handler,
                    preSerialization: item.preSerialization,
                    preHandler: item.preHandler,
                    schema: item.schema,
                });
            });

            done();
        };
    };
};

function padEnd(param: { base: string; prefix: string; size: number }) {
    const { base, size, prefix } = param;
    return base.padEnd(size, prefix);
}

export const helper = {
    formatRes,
    dynamicImportFile,
    padEnd,
    dynamicImportRouter,
};
