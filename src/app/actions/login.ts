'use server';

import { cookies } from 'next/headers';
import setCookieParser, { Cookie } from 'set-cookie-parser';
import { LoginSchemaType } from '@/lib/validations/auth';
import { apiClient } from '@/lib/api/client';

export const loginUserAction = async (formData: LoginSchemaType) => {

  try {
    const response = await apiClient.post('/auth/login', formData);

    const cookieHeader = response.headers['set-cookie'];
    if (cookieHeader) {
      const parsedCookies = setCookieParser.parse(cookieHeader);

      const cookieStore = await cookies(); 
        parsedCookies.forEach((cookie: Cookie) => {
            const isExpired = cookie.expires && new Date(cookie.expires) < new Date();
            if (!cookie.value || isExpired) {
                console.log(`[loginUserAction] Skipping expired or empty cookie: ${cookie.name}`);
                return;
            }
            cookieStore.set(cookie.name, cookie.value, {
                httpOnly: cookie.httpOnly,
                secure: cookie.secure,
                path: cookie.path,
                expires: cookie.expires,
                sameSite: cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
            });
        });

} else {
      console.warn("[loginUserAction] No Set-Cookie header found in response.");
    }

    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    console.error("[loginUserAction] Login action error:", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.message || "Login failed",
    };
  }
};
