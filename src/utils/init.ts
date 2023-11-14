import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ICustomRoute } from '@src/interfaces/route.interface';
import { fastify, config, helper } from '@utils';
import { garbage } from '@constants';
import path from 'path';
import fs from 'fs/promises';

const pathRoutes = ({
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

const handleRoutes = async () => {
    const pathModules = path.join(__dirname, '..', 'modules');
    const versions = (await fs.readdir(pathModules)).filter(garbage.filter);

    const routes = (
        await Promise.all(
            versions.map(async version => {
                const rootRoutes = (await fs.readdir(path.join(pathModules, version))).filter(garbage.filter);
                const routesFormatted = rootRoutes.map(rootPath => {
                    if (config.isBuilded) {
                        const routeFile = `${rootPath.replace(/e?s$/, '')}.route.js`;
                        var route = path.join(__dirname, '..', 'modules', version, rootPath, routeFile);
                    } else {
                        const routeFile = `${rootPath.replace(/e?s$/, '')}.route.ts`;
                        var route = path.join('modules', version, rootPath, routeFile);
                    }

                    return {
                        route,
                        rootPath,
                    };
                });

                return routesFormatted.map(item => ({
                    route: item.route,
                    version,
                    rootPath: item.rootPath,
                }));
            }),
        )
    ).flat();

    const routeHandlers = (
        await Promise.all(
            routes.map(async r => {
                return {
                    routes: (await helper.dynamicImport(r.route))?.routes,
                    version: r.version,
                    rootPath: r.rootPath,
                };
            }),
        )
    ).filter(item => item.routes);

    routeHandlers.forEach(handler => {
        fastify.register(handler.routes({ rootPath: handler.rootPath, version: handler.version }));
    });

    fastify.get('/favicon.ico', (___, reply) => {
        reply.ok();
    });

    fastify.get('/', (___, reply) => {
        reply.ok(null, { message: 'Healthy check.' });
    });

    fastify.get('*', (___, reply) => {
        reply.notFound(null, { message: 'Api not found.' });
    });
};

export const init = { pathRoutes, handleRoutes };
