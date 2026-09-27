const STRAPI_BASE_URL = import.meta.env?.VITE_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Format image URL according to Strapi v5 media specifications.
 * Appends VITE_STRAPI_API_URL if the URL starts with `/`.
 * @param {string|object} imageSource
 * @returns {string}
 */
export function formatStrapiImageUrl(imageSource) {
  if (!imageSource) return '/assets/product-sneakers.png';

  let url = imageSource;
  if (typeof imageSource === 'object') {
    // Handle Strapi v5 media object or nested formats
    const media = imageSource.data ? imageSource.data : imageSource;
    url = media?.formats?.medium?.url || media?.formats?.thumbnail?.url || media?.url || '';
  }

  if (!url) return '/assets/product-sneakers.png';

  if (url.startsWith('/')) {
    const baseUrl = (import.meta.env?.VITE_STRAPI_API_URL || '').replace(/\/+$/, '');
    return `${baseUrl}${url}`;
  }

  return url;
}

export function getStrapiApiUrl(endpoint) {
  const baseUrl = (import.meta.env?.VITE_STRAPI_API_URL || '').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}
