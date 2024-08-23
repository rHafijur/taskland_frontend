import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            delete apiClient.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
    }
);

const ApiService = {
    get(resource, params = {}) {
        return apiClient.get(resource, { params });
    },

    post(resource, data) {
        return apiClient.post(resource, data);
    },

    put(resource, data) {
        return apiClient.put(resource, data);
    },

    delete(resource) {
        return apiClient.delete(resource);
    },

    patch(resource, data) {
        return apiClient.patch(resource, data);
    }
};

export default ApiService;
