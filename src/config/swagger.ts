import { SwaggerGenerator } from '@/utils/swagger-generator';

const swaggerGen = SwaggerGenerator.getInstance();

// Thêm API login
swaggerGen.addEndpoint('/auth/login', 'post', {
  tags: ['Auth'],
  summary: 'Đăng nhập hệ thống',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'admin',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Đăng nhập thành công',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  name: { type: 'string' },
                  ma_khoa: { type: 'string' },
                  so_dien_thoai: { type: 'string' },
                  computerName: { type: 'string' },
                  clientIP: { type: 'string' },
                  defaultPath: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    '401': {
      description: 'Đăng nhập thất bại',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              errorCode: { type: 'string' },
            },
          },
        },
      },
    },
  },
});

// Thêm API kiểm tra đăng nhập
swaggerGen.addEndpoint('/auth/login-check-all', 'post', {
  tags: ['Auth'],
  summary: 'Kiểm tra trạng thái đăng nhập',
  responses: {
    '200': {
      description: 'Cập nhật trạng thái thành công',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
            },
          },
        },
      },
    },
    '401': {
      description: 'Không tìm thấy phiên đăng nhập',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
  },
});

// Thêm API dọn dẹp phiên
swaggerGen.addEndpoint('/auth/cleanup-sessions', 'post', {
  tags: ['Auth'],
  summary: 'Dọn dẹp các phiên không hoạt động',
  responses: {
    '200': {
      description: 'Dọn dẹp thành công',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              updatedSessions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    scl_userid: { type: 'string' },
                    scl_computername: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

export const swaggerConfig = swaggerGen.getSwaggerConfig(); 