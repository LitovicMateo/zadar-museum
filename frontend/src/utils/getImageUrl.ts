// strip /api from the root url
const root = import.meta.env.VITE_API_ROOT.replace('/api', '');
const urlPath = (url: string) => `${root}${url}`;

export const getImageUrl = (url: string) => urlPath(url);
