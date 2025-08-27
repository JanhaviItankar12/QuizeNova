import { Brain } from 'lucide-react';
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">QuizNova</span>
                        </div>
                        <p className="text-gray-400 max-w-md leading-relaxed">
                            The most powerful and intuitive quiz platform for educators, businesses, and knowledge enthusiasts worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 QuizPlatform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;