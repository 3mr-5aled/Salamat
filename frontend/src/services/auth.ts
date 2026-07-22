import api from "./api";

export const forgotPassword = async (email: string): Promise<unknown> => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyResetCode = async (resetCode: string): Promise<unknown> => {
  const response = await api.post("/auth/verifyResetCode", { resetCode });
  return response.data;
};

export const resetPassword = async (
  email: string,
  password: string,
  confirmPassword: string
): Promise<unknown> => {
  const response = await api.post("/auth/reset-password", {
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

export const verifyEmail = async (code: string, email?: string): Promise<unknown> => {
  const response = await api.post("/auth/verify-email", { code, email });
  return response.data;
};

export const resendVerification = async (): Promise<unknown> => {
  const response = await api.post("/auth/resend-verification");
  return response.data;
};

export const contactAdmin = async (message: string): Promise<unknown> => {
  const response = await api.post("/auth/contact-admin", { message });
  return response.data;
};
