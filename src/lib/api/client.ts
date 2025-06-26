import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true,
});


// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (
//       error.response?.status === 401 &&
//       !error.config._retry &&
//       !error.config.url.includes("/auth/tokens")
//     ) {
//       error.config._retry = true;
//       try {
//         await apiClient.put("/auth/tokens", null, { withCredentials: true });
//         return apiClient(error.config);
//       } catch (err) {
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// apiClient.interceptors.response.use(
//   (response) => {
//     console.log("[Axios] Response OK:", response.config.url);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     console.error("[Axios] Error:", error.response?.status, originalRequest.url);

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/tokens")
//     ) {
//       console.warn("[Axios] 401 detected. Attempting token refresh...");

//       originalRequest._retry = true;

//       try {
//         const refreshResponse = await apiClient.put("/auth/tokens", null, {
//           withCredentials: true,
//         });
//         console.log("[Axios] Token refreshed successfully:", refreshResponse.status);

//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.error("[Axios] Token refresh failed:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// import { getAccessTokenFromCookie, getRefreshTokenFromCookie } from '@/lib/ookies'; // make sure these utils exist

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/tokens")
//     ) {
//       console.warn("[🔄 Axios Interceptor] 401 detected. Attempting token refresh...");
//       originalRequest._retry = true;

//       try {
//         const accessToken = getAccessTokenFromCookie();
//         const refreshToken = getRefreshTokenFromCookie();

//         console.log("🔐 [Interceptor] Access Token:", accessToken);
//         console.log("🔐 [Interceptor] Refresh Token:", refreshToken);

//         if (!accessToken || !refreshToken) {
//           console.warn("⚠️ Missing tokens in cookie. Cannot refresh.");
//           return Promise.reject(error);
//         }

//         const tokenHeader = `access_token=${accessToken}, refresh_token=${refreshToken}`;
//         console.log("📤 [Interceptor] Sending refresh request with header:", tokenHeader);

//         await apiClient.put("/auth/tokens", null, {
//           withCredentials: true,
//           headers: {
//             Authorization: tokenHeader,
//           },
//         });

//         console.log("✅ [Interceptor] Token refresh successful. Retrying original request...");
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.error("❌ [Interceptor] Token refresh failed:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/tokens")
//     ) {
//       console.warn("[🔄 Interceptor] 401 detected. Attempting token refresh...");
//       originalRequest._retry = true;

//       try {
//         const response = await apiClient.put("/auth/tokens", null, {
//           withCredentials: true,
//         });

//         console.log("✅ [Interceptor] Token refreshed successfully", response.data);

//         // Retry original request
//         return apiClient(originalRequest);
//       } catch (err) {
//         console.error("❌ [Interceptor] Token refresh failed", err);
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// import { getAccessTokenFromCookie, getRefreshTokenFromCookie } from "@/lib/ookies"; // adjust path

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/tokens")
//     ) {
//       console.warn("[🔄 Interceptor] 401 detected. Attempting token refresh...");
//       originalRequest._retry = true;

//       // Get tokens from cookies or local storage
//       const accessToken = getAccessTokenFromCookie();
//       const refreshToken = getRefreshTokenFromCookie();

//       console.log("[Interceptor] Access Token:", accessToken);
//       console.log("[Interceptor] Refresh Token:", refreshToken);

//       if (!accessToken || !refreshToken) {
//         console.warn("❌ [Interceptor] Missing tokens. Cannot refresh.");
//         return Promise.reject(error);
//       }

//       try {
//         const response = await apiClient.put("/auth/tokens", null, {
//           withCredentials: true,
//           headers: {
//             Authorization: `access_token=${accessToken},refresh_token=${refreshToken}`,
//           },
//         });

//         console.log("✅ [Interceptor] Token refreshed successfully:", response.data);

//         // Retry original request
//         return apiClient(originalRequest);
//       } catch (err) {
//         console.error("❌ [Interceptor] Token refresh failed", err);
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/tokens")
    ) {
      console.warn("[🔄 Interceptor] 401 detected. Attempting token refresh...");
      originalRequest._retry = true;

      try {
        // 🔁 This triggers token regeneration on server-side using cookies
        const response = await apiClient.put("/auth/tokens", null, {
          withCredentials: true,
        });

        console.log("✅ [Interceptor] Token refreshed successfully");

        // 🔁 Retry original request with new cookies now set
        return apiClient(originalRequest);
      } catch (err) {
        console.error("❌ [Interceptor] Token refresh failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
