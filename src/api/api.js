import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refresh_token');
            const rememberMe = Cookies.get('rememberMe');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/refresh`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    });
                    const newAccessToken = res.data.access_token;
                    const newRefreshToken = res.data.refresh_token;
                    if (rememberMe) {
                        Cookies.set('access_token', newAccessToken, { expires: 30 });
                        Cookies.set('refresh_token', newRefreshToken, { expires: 30 });
                    } else {
                        Cookies.set('access_token', newAccessToken);
                        Cookies.set('refresh_token', newRefreshToken);
                    }
                    api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    Cookies.remove('rememberMe');
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            } else {
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                Cookies.remove('rememberMe');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;