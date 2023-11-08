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
                    config.log.route &&
                        fastify.log.info(
                            `AUTH:: [${helper.padEnd({
                                base: item.method,
                                size: 6,
                                prefix: ' ',
                            })}] - /api/${version}/${rootPath}${item.path}`,
                        );
                }

                fastify[item.method](item.path, item.handler);
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

                fastify[item.method](item.path, item.handler);
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
                const routesFormatted = rootRoutes.map(router => {
                    const extension = config.env.isDev ? 'ts' : 'js';
                    const routeFile = `${router.replace(/s$/, '')}.route.${extension}`;
                    return {
                        route: path.join('modules', version, router, routeFile),
                        rootPath: router,
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
        fastify.register(handler.routes({ rootPath: handler.rootPath, version: handler.version }), {
            prefix: `api/${handler.version}`,
        });
    });
};

export const init = { pathRoutes, handleRoutes };
