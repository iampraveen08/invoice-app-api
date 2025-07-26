import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Mini ERP API',
        version: '1.0.0',
        description: 'Multi-tenant Invoice Management System'
    },
    servers: [{ url: '/v1' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
    },
    security: [{ bearerAuth: [] }]
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'] // add jsdoc comments in routes if you want full docs
};

export const setupSwagger = (app) => {
    const specs = swaggerJsdoc(options);
    const router = Router();
    router.use('/', swaggerUi.serve, swaggerUi.setup(specs));
    app.use('/docs', router);
};
