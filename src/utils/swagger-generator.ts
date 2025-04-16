import { OpenAPIV3 } from 'openapi-types';

export class SwaggerGenerator {
  private static instance: SwaggerGenerator;
  private paths: OpenAPIV3.PathsObject = {};

  private constructor() {}

  static getInstance(): SwaggerGenerator {
    if (!SwaggerGenerator.instance) {
      SwaggerGenerator.instance = new SwaggerGenerator();
    }
    return SwaggerGenerator.instance;
  }

  addEndpoint(
    path: string,
    method: 'get' | 'post' | 'put' | 'delete',
    config: {
      tags?: string[];
      summary?: string;
      requestBody?: OpenAPIV3.RequestBodyObject;
      responses?: OpenAPIV3.ResponsesObject;
    }
  ) {
    if (!this.paths[path]) {
      this.paths[path] = {};
    }

    this.paths[path][method] = {
      tags: config.tags || [],
      summary: config.summary || '',
      requestBody: config.requestBody,
      responses: config.responses || {
        '200': {
          description: 'Successful operation'
        }
      }
    };

    return this;
  }

  getSwaggerConfig(): OpenAPIV3.Document {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Project API TEST',
        version: '1.0.0',
        description: 'Log Swagger API docs'
      },
      paths: this.paths,
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'user'
          }
        }
      }
    };
  }
} 