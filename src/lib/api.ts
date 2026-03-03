import axios from "axios";

let accessToken = "";

export const setToken = (token: string) => {
    accessToken = token;
};

export const getToken = () => accessToken;

const api = axios.create({
    baseURL: "/",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?._retry && !prevRequest.url?.includes("/auth/refresh")) {
            prevRequest._retry = true;
            try {
                const response = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
                const { accessToken: newToken } = response.data;
                setToken(newToken);

                // Update header and retry
                prevRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(prevRequest);
            } catch (err) {
                setToken(""); // Clear on failure
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
