'use client';

import 'swagger-ui-react/swagger-ui.css';
import { swaggerConfig } from '@/config/swagger';
import SwaggerUIWrapper from '@/components/swagger/SwaggerUIWrapper';

const ApiDoc = () => {
  return (
    <SwaggerUIWrapper 
      spec={swaggerConfig}
      docExpansion="list"
      defaultModelsExpandDepth={-1}
    />
  );
};

export default ApiDoc; 