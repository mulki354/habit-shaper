const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface RequestOptions extends RequestInit {
    body?: any;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('accessToken');

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_URL}${path}`, config);

    if (response.status === 204) {
        return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
    }

    return data as T;
}

export const api = {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: any, options?: RequestOptions) => request<T>(path, { ...options, method: 'POST', body }),
    patch: <T>(path: string, body?: any, options?: RequestOptions) => request<T>(path, { ...options, method: 'PATCH', body }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
