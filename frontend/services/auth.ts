import { api } from "./api";
import { API } from "@/constants/api";
import type {
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse,
  RequestAccessRequest,
} from "@/types/auth";

/**
 * Handles the token request to authenticate the user credentials.
 */
export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>(API.AUTH.LOGIN, credentials);
  return response.data;
};

/**
 * Creates a self-service user account with the backend-assigned default role.
 */
export const register = async (payload: RegisterRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(API.AUTH.REGISTER, payload);
  return response.data;
};

/**
 * Informs the backend to invalidate the current session tokens.
 */
export const logout = async (): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(API.AUTH.LOGOUT);
  return response.data;
};

/**
 * Requests a new access and refresh token pair using the active refresh token.
 */
export const refreshToken = async (token: string): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>(API.AUTH.REFRESH, { refresh_token: token });
  return response.data;
};

/**
 * Retrieves the current session user details and role scope.
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>(API.AUTH.PROFILE);
  return response.data;
};

/**
 * Sends a password reset request link to the specified email.
 */
export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(API.AUTH.FORGOT_PASSWORD, payload);
  return response.data;
};

/**
 * Submits the token and new credentials to complete the password reset process.
 */
export const resetPassword = async (payload: ResetPasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(API.AUTH.RESET_PASSWORD, payload);
  return response.data;
};

/**
 * Updates the user's active session password credentials.
 */
export const changePassword = async (payload: ChangePasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>("/auth/change-password", payload);
  return response.data;
};

/**
 * Submits an access request for evaluation.
 */
export const requestAccess = async (payload: RequestAccessRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(API.AUTH.REQUEST_ACCESS, payload);
  return response.data;
};

/**
 * Updates the user's active session profile details.
 */
export const updateProfile = async (payload: { full_name: string; email: string; phone: string }): Promise<CurrentUser> => {
  const response = await api.put<CurrentUser>("/auth/profile", payload);
  return response.data;
};

export const authService = {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
  requestAccess,
  updateProfile,
};
