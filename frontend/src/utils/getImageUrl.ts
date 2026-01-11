// strip /api from the root url
const apiRoot = import.meta.env.VITE_API_ROOT || '';
const root = apiRoot.includes('/api') ? apiRoot.replace('/api', '') : apiRoot;
const urlPath = (url: string) => `${root}${url}`;

export const getImageUrl = (url: string) => urlPath(url);
