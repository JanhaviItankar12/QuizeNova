import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginMutation, useSignupMutation } from '@/store/authApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';


const AuthForm = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});

    // FIXED: Use consistent mutation names
    const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
    const [signup, { isLoading: isSignupLoading, error: signupError }] = useSignupMutation();

    // FIXED: Use correct variable names
    const isLoading = isLogin ? isLoginLoading : isSignupLoading;
    const apiError = isLogin ? loginError : signupError;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!isLogin) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (!formData.role) {
                newErrors.role = 'Role is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // Inside handleSubmit in AuthForm
            if (isLogin) {
                const result = await login({
                    email: formData.email,
                    password: formData.password,
                }).unwrap();

                // ✅ store both user + token
                dispatch(
                    setCredentials({
                        user: result.user,
                        token: result.token,
                    })
                );

                localStorage.setItem("token", result.token);
                toast.success("Login successful!");
                navigate("/");
            } else {
                const result = await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }).unwrap();

              

                dispatch(
                    setCredentials({
                        user: result.user,
                        token: result.token,
                    })
                );

                localStorage.setItem("token", result.token);
                toast.success("Account created successfully!");
                navigate("/");
                setIsLogin(true);
            }

        } catch (error) {
            console.error('Auth error:', error);

            // Handle API errors
            if (error.data && error.data.message) {
                alert(`Error: ${error.data.message}`);
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student'
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Enter your information to create your account'
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Display API errors */}
                    {apiError && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-base">
                            {apiError.data?.message || 'An error occurred. Please try again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <>
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-base font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`pl-11 text-base py-3 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-base text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Role selection */}
                                <div className="space-y-3">
                                    <Label htmlFor="role" className="text-base font-medium">
                                        Role
                                    </Label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded-md py-3 px-3 text-base ${errors.role ? 'border-red-500 focus:border-red-500' : ''}`}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                    {errors.role && (
                                        <p className="text-base text-red-600">{errors.role}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-base font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`pl-11 text-base py-3 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-base text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-base font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`pl-11 pr-11 text-base py-3 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-base text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {!isLogin && (
                            <div className="space-y-3">
                                <Label htmlFor="confirmPassword" className="text-base font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`pl-11 pr-11 text-base py-3 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-base text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base py-3.5"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </div>
                            ) : (
                                isLogin ? 'Sign in' : 'Create account'
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-base text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Button
                            variant="link"
                            onClick={toggleMode}
                            className="p-0 h-auto text-base text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AuthForm;