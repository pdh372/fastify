import { fastify, config, helper } from '@utils';
import { garbage } from '@constants';
import path from 'path';
import fs from 'fs/promises';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const routes = async () => {
    const pathModules = path.join(__dirname, '..', 'modules');
    const versions = (await fs.readdir(pathModules)).filter(garbage.filtered);

    const routes = (
        await Promise.all(
            versions.map(async version => {
                const rootRoutes = (await fs.readdir(path.join(pathModules, version))).filter(garbage.filtered);
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
                    routes: (await helper.dynamicImportFile(r.route))?.routes,
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

const document = async () => {
    const swaggerOptions = {
        swagger: {
            info: {
                title: 'My Title',
                description: 'My Description.',
                version: '1.0.0',
            },
            host: 'localhost',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [{ name: 'Default', description: 'Default' }],
        },
    };

    const swaggerUiOptions = {
        routePrefix: '/docs',
        exposeRoute: true,
    };

    fastify.register(fastifySwagger, swaggerOptions);
    fastify.register(fastifySwaggerUi, swaggerUiOptions);
};

export const init = { routes, document };
