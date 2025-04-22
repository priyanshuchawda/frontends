import React from 'react';
import { Toaster, ToasterProps } from 'sonner';

interface CustomToasterProps extends Partial<ToasterProps> {
  className?: string;
}

const toastStyle = {
  background: '#059669', // Green background
  color: '#ffffff', // White text
  border: '1px solid #047857', // Darker green border
  fontSize: '0.875rem',
  borderRadius: '0.5rem',
  boxShadow: 'var(--shadow-sm)',
};

export const ToastProvider: React.FC<CustomToasterProps> = ({ className, ...props }) => {
  return (    
    <Toaster
      position="bottom-right"
      expand
      duration={2000}
      theme="light"
      {...props}
      toastOptions={{
        ...props.toastOptions,
        style: {
          ...toastStyle,
          ...props.toastOptions?.style,
        },
        className: `group rounded-lg ${className || ''}`,
      }}
    />
  );
};