import axios, {AxiosError, AxiosRequestConfig} from "axios";

// axios.interceptors.response.use(function (response) {
//     return response
// }, async function (error) {
//     if (!(error instanceof AxiosError)) {
//         throw error;
//     }
//     if (error.code !== "ECONNREFUSED") {
//         throw error
//     }
//     const config: AxiosRequestConfig = error.config ?? {};
//     const url = error.request._currentRequest._redirectable._currentUrl;
//     if (typeof url !== 'string') {
//         throw new Error("No URL.");
//     }
//     const patched_url = new URL(url);
//     patched_url.protocol = "http:";
//     config.url = patched_url.toString();
//     return axios(config);
// })