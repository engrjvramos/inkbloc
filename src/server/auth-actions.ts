'use server';

import { auth } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export const signInUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: 'Login successful!',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message,
    };
  }
};

export const signUpUser = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return {
      success: true,
      message: 'Please check your email for verification',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message,
    };
  }
};
