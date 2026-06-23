'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe, Shield, Loader2 } from 'lucide-react';

type OAuthProvider = 'google' | 'github';

interface OAuthProviderConfig {
  provider: OAuthProvider;
  label: string;
  icon?: React.ReactNode;
}

const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  { provider: 'google', label: 'Google' },
  { provider: 'github', label: 'GitHub' },
];

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

function mapZodFieldErrors(
  flatErrors: Record<string, unknown>
): Partial<Record<keyof SignInFormData, string>> {
  const mapped: Partial<Record<keyof SignInFormData, string>> = {};
  for (const [key, value] of Object.entries(flatErrors)) {
    if (Array.isArray(value) && value[0] && typeof value[0] === 'string') {
      mapped[key as keyof SignInFormData] = value[0];
    }
  }
  return mapped;
}

export default function SignInPage() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});

  const handleInputChange = useCallback(
    (field: keyof SignInFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError('');
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleCredentialsSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Validate form data
      const validationResult = signInSchema.safeParse(formData);
      if (!validationResult.success) {
        const flatErrors: Record<string, unknown> = validationResult.error.flatten().fieldErrors;
        setFieldErrors(mapZodFieldErrors(flatErrors));
        const firstError = Object.values(flatErrors)[0];
        setError(typeof firstError === 'string' ? firstError : 'Please check your input and try again');
        setIsLoading(false);
        return;
      }

      try {
        const result = await signIn('credentials', {
          email: validationResult.data.email,
          password: validationResult.data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          window.location.href = '/dashboard';
        }
      } catch {
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  const handleOAuthSignIn = useCallback(async (provider: OAuthProvider) => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch {
      console.error('OAuth error');
      setError('Failed to sign in. Please try again.');
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setError('');
    }
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-red-500" aria-hidden="true" />
            Admin Sign In
          </CardTitle>
            <CardDescription>
              Sign in as admin to manage your store&#39;s social selling
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {OAUTH_PROVIDERS.map(({ provider, label }) => (
              <Button
                key={provider}
                variant="outline"
                onClick={() => handleOAuthSignIn(provider)}
                className="w-full"
                type="button"
                disabled={isLoading}
                aria-label={`Sign in with ${label}`}
              >
                <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
                {label}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Credentials Login */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4" noValidate>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            {error && (
              <div
                id="error-message"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in&hellip;
                </>
              ) : (
                <>Sign In</>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <p>
              Don&#39;t have an account?{' '}
              <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}