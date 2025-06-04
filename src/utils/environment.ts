
/**
 * Environment utility functions for handling URLs across different deployment environments
 */

/**
 * Get the appropriate redirect URL based on the current environment
 */
export const getRedirectUrl = (path: string = ''): string => {
  // Check if we're in development
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    
    // Development environment detection
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('lovable.app')) {
      return `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
    }
    
    // Production environment - use current origin
    return `${window.location.origin}${path}`;
  }
  
  // Fallback for SSR or when window is not available
  return `https://yourapp.com${path}`;
};

/**
 * Get the base URL for the current environment
 */
export const getBaseUrl = (): string => {
  return getRedirectUrl();
};

/**
 * Check if we're in development environment
 */
export const isDevelopment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('lovable.app');
};

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  return !isDevelopment();
};
