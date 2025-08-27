import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, BookOpen, Users, Settings, BarChart, FileText, Award, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";


export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector(store => store.auth);


    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    const getRoleDisplayName = (role) =>
        role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">QuizNova</span>
                        {isAuthenticated && (
                            <span className="text-sm text-gray-500 ml-2">
                                ({getRoleDisplayName(user.role)})
                            </span>
                        )}
                    </div>

                    {/* Desktop User Menu or Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0)}
                                        </span>
                                    </div>
                                    <span>{user?.name.split(" ")[0]}</span>
                                </button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {getRoleDisplayName(user?.role)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (user.role === "teacher") {
                                                        navigate("/teacher/dashboard");
                                                    } else if (user.role === "student") {
                                                        navigate(`/student/${user?.id}/dashboard`);
                                                    } else if (user.role === "admin") {
                                                        navigate("/admin/dashboard");
                                                    } else {
                                                        navigate("/"); // fallback
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <BarChart className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </button>
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Get Started Free
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-indigo-600 p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {isAuthenticated ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-700 font-medium">
                                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.name?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm">{user?.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {getRoleDisplayName(user?.role)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard");
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium py-2"
                                    >
                                        <BarChart className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium py-2"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium py-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left text-gray-600 hover:text-indigo-600 font-medium py-2"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/signup");
                                            setIsOpen(false);
                                        }}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                    >
                                        Get Started Free
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
