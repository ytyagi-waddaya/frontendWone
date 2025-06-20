import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true,
});


// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });


// apiClient.interceptors.response.use(undefined, async (error) => {
//   if (error.response?.status === 401) {
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//         {},
//         { withCredentials: true }
//       );
//       const newToken = response.data.accessToken;
//       localStorage.setItem("accessToken", newToken);
//       error.config.headers.Authorization = `Bearer ${newToken}`;
//       return apiClient(error.config);
//     } catch (refreshError) {
//       // logout user
//       localStorage.clear();
//       window.location.href = "/";
//       return Promise.reject(refreshError);
//     }
//   }
//   return Promise.reject(error);
// });
