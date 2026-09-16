import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { generateTokens, storeRefreshToken, revokeRefreshToken, revokeAllUserTokens, isRefreshTokenValid } from '../../utils/jwt';
import { AuthenticationError, ConflictError, NotFoundError } from '../../middleware/errorHandler';
import type { RegisterInput, LoginInput, RefreshTokenInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from './auth.validation';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const register = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await hashPassword(input.password);
  const emailVerificationToken = generateResetToken();

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      emailVerificationToken: hashToken(emailVerificationToken),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    tokens,
    emailVerificationToken,
  };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
    },
    tokens,
  };
};

export const refreshAccessToken = async (input: RefreshTokenInput) => {
  const { refreshToken } = input;

  const isValid = await isRefreshTokenValid(refreshToken);
  if (!isValid) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AuthenticationError('Invalid refresh token');
  }

  await revokeRefreshToken(refreshToken);

  const tokens = generateTokens({
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  });

  await storeRefreshToken(storedToken.user.id, tokens.refreshToken);

  return tokens;
};

export const logout = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
};

export const logoutAll = async (userId: string): Promise<void> => {
  await revokeAllUserTokens(userId);
};

export const forgotPassword = async (input: ForgotPasswordInput): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    return 'If the email exists, a reset link will be sent';
  }

  const resetToken = generateResetToken();
  const hashedToken = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: expiresAt,
    },
  });

  return resetToken;
};

export const resetPassword = async (input: ResetPasswordInput): Promise<void> => {
  const hashedToken = hashToken(input.token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  await revokeAllUserTokens(user.id);
};

export const verifyEmail = async (token: string): Promise<void> => {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: hashedToken },
  });

  if (!user) {
    throw new AuthenticationError('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
    },
  });
};

export const changePassword = async (userId: string, input: ChangePasswordInput): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  const isValid = await comparePassword(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await revokeAllUserTokens(userId);
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      candidateProfile: true,
      recruiterProfile: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

export const updateProfile = async (userId: string, data: { firstName?: string; lastName?: string; avatar?: string | null }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
    },
  });

  return user;
};