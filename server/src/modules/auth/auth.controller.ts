import { Response, NextFunction } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
} from './auth.service';
import { config } from '../../config';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string, rememberMe = false) => {
  const accessTokenMaxAge = 15 * 60 * 1000;
  const refreshTokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: accessTokenMaxAge,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: refreshTokenMaxAge,
    path: '/',
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export const authController = {
  register: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { user, tokens, emailVerificationToken } = await register(req.body);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, false);

      res.status(201).json({
        message: 'Registration successful. Please verify your email.',
        user,
        emailVerificationToken: config.env === 'development' ? emailVerificationToken : undefined,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await login(req.body);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, req.body.rememberMe);

      res.json({
        message: 'Login successful',
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  refresh: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required', code: 'REFRESH_TOKEN_REQUIRED' });
      }

      const tokens = await refreshAccessToken({ refreshToken });

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, false);

      res.json({ message: 'Token refreshed' });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  },

  logout: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await logout(refreshToken);
      }

      clearAuthCookies(res);

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  logoutAll: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await logoutAll(req.userId!);
      clearAuthCookies(res);
      res.json({ message: 'Logged out from all devices' });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const resetToken = await forgotPassword(req.body);

      res.json({
        message: 'If the email exists, a reset link will be sent',
        resetToken: config.env === 'development' ? resetToken : undefined,
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await resetPassword(req.body);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await verifyEmail(req.query.token as string);
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await getProfile(req.userId!);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await updateProfile(req.userId!, req.body);
      res.json({ message: 'Profile updated', user });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await changePassword(req.userId!, req.body);
      clearAuthCookies(res);
      res.json({ message: 'Password changed. Please log in again.' });
    } catch (error) {
      next(error);
    }
  },

  checkAuth: async (req: AuthenticatedRequest, res: Response) => {
    res.json({
      authenticated: true,
      user: req.user,
    });
  },
};