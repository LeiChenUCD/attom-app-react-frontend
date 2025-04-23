const { VITE_PUBLIC_API_PATH, VITE_WMS_API_PATH } = import.meta.env;
export const baseApiUrl = VITE_PUBLIC_API_PATH;
export const wmsApiBaseUrl = VITE_WMS_API_PATH;