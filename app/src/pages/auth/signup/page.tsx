import ThemeSwitcher from '@/components/custom/theme-switcher.component';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@rest/api';
import { UserRoleEnum } from '@rest/models';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Loader2,
  UserPlus,
} from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SignupStep = 'role' | 'details';

export default function SignupPage(): React.ReactNode {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('role');
  const [name, setName] = useState('Marcus Dwaight');
  const [email, setEmail] = useState('marcusdwaight@gmail.com');
  const [password, setPassword] = useState('test@password');
  const [confirmPassword, setConfirmPassword] = useState('test@password');
  const [role, setRole] = useState<UserRoleEnum | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: signupAttempt } = useCreateUser();
  const formRef = useRef<HTMLFormElement>(null);

  const roleOptions = [
    {
      label: 'Student',
      value: UserRoleEnum.student,
      description: 'Access courses, submit assignments, and track your progress',
    },
    {
      label: 'Faculty',
      value: UserRoleEnum.faculty,
      description: 'Teach courses, grade assignments, and manage student progress',
    },
    {
      label: 'Program Chair',
      value: UserRoleEnum.program_chair,
      description: 'Oversee program curriculum and coordinate with faculty',
    },
    {
      label: 'College Dean',
      value: UserRoleEnum.college_dean,
      description: 'Manage college operations and academic policies',
    },
    {
      label: 'Specialization Chair',
      value: UserRoleEnum.specialization_chair,
      description: 'Lead specialized academic programs and initiatives',
    },
    {
      label: 'Campus Scheduler',
      value: UserRoleEnum.campus_scheduler,
      description: 'Coordinate class schedules and room assignments',
    },
    {
      label: 'Campus Registrar',
      value: UserRoleEnum.campus_registrar,
      description: 'Manage student records and enrollment processes',
    },
    // {
    //   label: 'Admin',
    //   value: UserRoleEnum.ADMIN,
    //   description: 'Full system access and administrative privileges',
    // },
    {
      label: 'Guest',
      value: UserRoleEnum.guest,
      description: 'Limited access to explore the platform',
    },
  ];

  const handleRoleSelect = (selectedRole: UserRoleEnum): void => {
    setRole(selectedRole);
    setError(null);
  };

  const handleContinue = (): void => {
    if (!role) {
      setError('Please select a role to continue');
      return;
    }
    setStep('details');
    setError(null);
  };

  const handleBack = (): void => {
    setStep('role');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      //   TODO: Implement signup API call
      const response = await signupAttempt({
        data: {
          name,
          email,
          password,
          confirm_password: confirmPassword,
          role: role as UserRoleEnum,
        } as any,
      });

      if (response.data) {
        toast.success('Account created successfully');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
    navigate('/auth/login');
  };

  const selectedRoleInfo = roleOptions.find((opt) => opt.value === role);

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">EduPortal</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {step === 'role' ? (
              <>
                Choose Your
                <br />
                Role & Begin
              </>
            ) : (
              <>
                Complete Your
                <br />
                Registration
              </>
            )}
          </h2>
          <p className="text-blue-100 text-lg">
            {step === 'role'
              ? 'Select the role that best describes your position in the educational ecosystem.'
              : "Just a few more details and you'll be ready to start your journey with us."}
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'role' ? 'bg-white text-blue-600' : 'bg-white/30 text-white'}`}
            >
              {step === 'details' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div className="flex-1 h-0.5 bg-white/30">
              <div
                className={`h-full bg-white transition-all duration-300 ${step === 'details' ? 'w-full' : 'w-0'}`}
              />
            </div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'details' ? 'bg-white text-blue-600' : 'bg-white/30 text-white'}`}
            >
              2
            </div>
          </div>
          <div className="text-white/80 text-sm">© 2024 EduPortal. All rights reserved.</div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>

          <Card className="border-2">
            {step === 'role' ? (
              <>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-3xl font-bold">Select Your Role</CardTitle>
                  <CardDescription>Choose the role that best describes you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleRoleSelect(option.value as UserRoleEnum)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                          role === option.value
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-foreground mb-1">{option.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                          {role === option.value && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    onClick={handleContinue}
                    className="w-full h-11 font-medium"
                    disabled={!role}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                  <CardDescription>
                    Registering as{' '}
                    <span className="font-semibold text-foreground">{selectedRoleInfo?.label}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isLoading}
                        className="w-full h-11"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="w-full h-11 font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
