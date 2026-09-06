import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../store/authContext';
import { api } from '../services/api';
import { UserIcon, EnvelopeIcon, CameraIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url().nullable().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string().min(1, 'Please confirm'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const passwordRequirements = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /[0-9]/ },
  { label: 'One special character', regex: /[^A-Za-z0-9]/ },
];

export const ProfilePage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch('newPassword', '');

  const onSubmitProfile = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await api.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar || null,
      });
      await refreshAuth();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      await api.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed. Please log in again.');
      resetPasswordForm();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Profile Settings</h1>
        <p className="mt-1 text-secondary-600">Manage your account settings and preferences</p>
      </div>

      <div className="card">
        <div className="border-b border-secondary-200">
          <nav className="flex gap-8 px-6" aria-label="Profile tabs">
            {[
              { id: 'profile', label: 'Profile', icon: UserIcon },
              { id: 'password', label: 'Password', icon: ShieldCheckIcon },
              { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                )}
              >
                <tab.icon className="w-5 h-5" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="card-body">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6" noValidate>
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="label">First name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                      <input
                        {...registerProfile('firstName')}
                        id="firstName"
                        type="text"
                        className={clsx('input pl-10', profileErrors.firstName && 'input-error')}
                        disabled={isLoading}
                      />
                    </div>
                    {profileErrors.firstName && (
                      <p className="mt-1.5 text-sm text-error-600">{profileErrors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="label">Last name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                      <input
                        {...registerProfile('lastName')}
                        id="lastName"
                        type="text"
                        className={clsx('input pl-10', profileErrors.lastName && 'input-error')}
                        disabled={isLoading}
                      />
                    </div>
                    {profileErrors.lastName && (
                      <p className="mt-1.5 text-sm text-error-600">{profileErrors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...registerProfile('email')}
                    id="email"
                    type="email"
                    className={clsx('input pl-10', profileErrors.email && 'input-error')}
                    disabled={isLoading}
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1.5 text-sm text-error-600">{profileErrors.email.message}</p>
                )}
                {!user?.isEmailVerified && (
                  <p className="mt-1.5 text-sm text-warning-600 flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Email not verified. <button className="text-primary-600 hover:underline">Resend verification</button>
                  </p>
                )}
              </div>

              <div>
                <label className="label">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10 text-primary-600" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                      <CameraIcon className="w-4 h-4" />
                      <input type="file" accept="image/*" className="sr-only" />
                    </label>
                  </div>
                  <div>
                    <input
                      {...registerProfile('avatar')}
                      type="text"
                      className="input"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="mt-1 text-sm text-secondary-500">Or enter an image URL</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6 max-w-md" noValidate>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Change Password</h2>

              <div>
                <label htmlFor="currentPassword" className="label">Current password</label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...registerPassword('currentPassword')}
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={clsx('input pl-10 pr-10', passwordErrors.currentPassword && 'input-error')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1.5 text-sm text-error-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="label">New password</label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...registerPassword('newPassword')}
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={clsx('input pl-10 pr-10', passwordErrors.newPassword && 'input-error')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1.5 text-sm text-error-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="mt-2">
                <p className="text-xs text-secondary-500 mb-2">Password must contain:</p>
                <ul className="space-y-1" role="list">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <span
                        className={clsx(
                          'w-4 h-4 rounded border-2 flex items-center justify-center',
                          newPassword.match(req.regex) ? 'border-success-500 bg-success-50 text-success-600' : 'border-secondary-300 text-transparent'
                        )}
                      >
                        {newPassword.match(req.regex) && <ShieldCheckIcon className="w-3 h-3" />}
                      </span>
                      <span className={clsx(newPassword.match(req.regex) ? 'text-success-600' : 'text-secondary-400')}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">Confirm new password</label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...registerPassword('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={clsx('input pl-10 pr-10', passwordErrors.confirmPassword && 'input-error')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-error-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change password'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Security Settings</h2>

              <div className="p-4 rounded-lg border border-secondary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-secondary-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-secondary-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-outline">Enable</button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-secondary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-secondary-900">Active Sessions</h3>
                    <p className="text-sm text-secondary-500">Manage your logged-in devices</p>
                  </div>
                  <button className="btn-outline">View sessions</button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-error-200 bg-error-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-error-700">Delete Account</h3>
                    <p className="text-sm text-error-600">Permanently delete your account and all data</p>
                  </div>
                  <button className="btn-danger">Delete account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};