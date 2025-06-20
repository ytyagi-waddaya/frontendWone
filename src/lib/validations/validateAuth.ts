// import axios from "axios";

// export const validateAuth = async (accessToken: string, refreshToken: string) => {
//   try {
//     const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/tokens`;

//     const res = await axios.get(url, {
//       headers: {
//         Authorization: `access_token=${accessToken},refresh_token=${refreshToken}`,
//       },
//       withCredentials: true,
//     });

//     return res.data;
//   } catch (error) {
//     console.error("Auth validation error:", error);
//     return null;
//   }
// };


// lib/validations/validateAuth.ts

import { apiClient } from "@/lib/api/client";

// types.ts or inside validateAuth.ts
export type AuthUser = {
  id: string;
  email: string;
  name: string;   // ✅ include name
  role: string;
};

export type ValidateAuthResponse = {
  success: boolean;
  message: string;
  user: AuthUser;
};


// export const validateAuth = async (accessToken: string, refreshToken: string) => {
//   try {
//     console.log("🔐 Validating tokens...");
//     console.log("➡️ Access Token:", accessToken ? "Present" : "Missing");
//     console.log("➡️ Refresh Token:", refreshToken ? "Present" : "Missing");

//     const res = await apiClient.get("/auth/tokens", {
//       headers: {
//         Authorization: `access_token=${accessToken},refresh_token=${refreshToken}`,
//       },
//     });

//     console.log("✅ Token validation response:", res.data);
//     return res.data;
//   } catch (error: any) {
//     console.error("❌ Auth validation error:", error?.response?.data || error.message || error);
//     return null;
//   }
// };


export const validateAuth = async (
  accessToken: string,
  refreshToken: string
): Promise<ValidateAuthResponse | null> => {
  try {
    const res = await apiClient.put("/auth/tokens",{}, {
      withCredentials: true,
      headers: {
        Authorization: `access_token=${accessToken},refresh_token=${refreshToken}`,
      },
      
    });
    console.log("🔐 Validating tokens...");
    console.log("➡️ Access Token:", accessToken ? "Present" : "Missing");
    console.log("➡️ Refresh Token:", refreshToken ? "Present" : "Missing");

    return res.data;
  } catch (error: any) {
    console.error("❌ Auth validation error:", error?.response?.data || error.message || error);
    return null;
  }
};




















