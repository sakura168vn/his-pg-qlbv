'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Import SwaggerUI dynamically để tránh SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
});

interface SwaggerUIWrapperProps {
  spec: any;
  [key: string]: any;
}

const SwaggerUIWrapper: React.FC<SwaggerUIWrapperProps> = (props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="swagger-wrapper">
      <SwaggerUI {...props} />
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-wrapper {
          margin: 2rem;
        }
        .swagger-ui {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SwaggerUIWrapper; 