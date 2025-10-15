import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';

const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'DocsUniverse API',
    version: '1.0.0',
  },
  paths: {},
};

export function setupSwagger(app: any) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}

export default setupSwagger;
