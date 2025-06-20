
'use server';

import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api/client';

export const logoutUserAction = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      // Send refresh_token to backend in Cookie header
      await apiClient.post('/auth/logout', null, {
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });
    }

    // Clear cookies from browser via Next.js server action
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return {
      success: true,
      message: 'Logged out and cookies cleared.',
    };
  } catch (error: any) {
    console.error('[logoutUserAction] Logout error:', error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.message || 'Logout failed',
    };
  }
};
