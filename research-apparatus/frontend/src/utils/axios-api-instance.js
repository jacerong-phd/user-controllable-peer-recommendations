import axios from 'axios';

import { API_URL } from '@utils/constants';
import { sessionStorage } from '@utils/storage';


export const ApiClient = () => {
    /* References:
     * 1. https://stackoverflow.com/a/75082579
     */

    // Create a new axios instance
    const api = axios.create({
        baseURL: `${API_URL}`,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
        async (config) => {
            const token = sessionStorage.getString('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor to refresh the JWT token if it's expired
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            // original request
            const config = error?.config;

            if (error?.response?.status === 401 && !config._retry) {
                config._retry = true;
                /* ToDo:
                 * Implement the logic to refresh the user token via an API endpoint.
                 */
            }
            
            return Promise.reject(error);
        }
    );

    const login = async (username, password) => {
        return api
            .post("/users/tokens", { username, password }, { headers: {'Content-Type': 'multipart/form-data'} })
            .then(({ data }) => {
                return data.access_token;
            })
            .catch((err) => {
                // Return the error if the request fails
                return err;
            });
    };

    const get = async (path, query=undefined) => {
        if (query)
            return api.get(path, query).then((response) => response.data);

        return api.get(path).then((response) => response.data);
    };

    const post = async (path, data) => {
        return api.post(path, data).then((response) => response.data);
    };

    const put = async (path, data) => {
        return api.put(path, data).then((response) => response.data);
    };

    const del = async (path) => {
        return api.delete(path).then((response) => response);
    };

    return {
        login,
        get,
        post,
        put,
        del,
    };
};
