import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../store/authContext';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['CANDIDATE', 'RECRUITER']),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /[0-9]/ },
  { label: 'One special character', regex: /[^A-Za-z0-9]/ },
];

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CANDIDATE' },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">RX</span>
            </div>
            <span className="text-2xl font-bold text-secondary-900">RecruitmentX</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900">Create your account</h1>
          <p className="mt-2 text-secondary-600">Join thousands of professionals on RecruitmentX</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">First name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                    <input
                      {...register('firstName')}
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={clsx('input pl-10', errors.firstName && 'input-error')}
                      placeholder="John"
                      aria-invalid={errors.firstName ? 'true' : 'false'}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="label">Last name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                    <input
                      {...register('lastName')}
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={clsx('input pl-10', errors.lastName && 'input-error')}
                      placeholder="Doe"
                      aria-invalid={errors.lastName ? 'true' : 'false'}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={clsx('input pl-10', errors.email && 'input-error')}
                    placeholder="you@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={clsx('input pl-10 pr-10', errors.password && 'input-error')}
                    placeholder="••••••••"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.password.message}</p>
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
                          password.match(req.regex) ? 'border-success-500 bg-success-50 text-success-600' : 'border-secondary-300 text-transparent'
                        )}
                      >
                        {password.match(req.regex) && <ShieldCheckIcon className="w-3 h-3" />}
                      </span>
                      <span className={clsx(password.match(req.regex) ? 'text-success-600' : 'text-secondary-400')}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">Confirm password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" aria-hidden="true" />
                  <input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={clsx('input pl-10 pr-10', errors.confirmPassword && 'input-error')}
                    placeholder="••••••••"
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
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
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="label">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {['CANDIDATE', 'RECRUITER'].map((role) => (
                    <label
                      key={role}
                      className={clsx(
                        'relative cursor-pointer',
                        `peer`
                      )}
                    >
                      <input
                        {...register('role')}
                        type="radio"
                        value={role}
                        className="sr-only peer"
                      />
                      <div
                        className={clsx(
                          'p-4 rounded-lg border-2 text-center transition-all',
                          'peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700',
                          'border-secondary-200 hover:border-primary-300'
                        )}
                      >
                        <div className="text-lg font-medium capitalize">{role.toLowerCase()}</div>
                        <div className="text-xs text-secondary-500 mt-1">
                          {role === 'CANDIDATE' ? 'Looking for jobs' : 'Hiring talent'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <div className="text-sm text-secondary-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                      Privacy Policy
                    </Link>
                  </div>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 text-sm text-error-600" role="alert">{errors.terms.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </div>

          <div className="card-footer text-center">
            <p className="text-sm text-secondary-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};