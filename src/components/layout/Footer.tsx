// src/components/layout/Footer.tsx
import React from 'react';
import { Heart, Coffee, Globe, Mail, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">职</span>
              </div>
              <span className="text-xl font-bold text-gray-900">职场story</span>
            </div>
            <p className="text-gray-600 text-sm">职场人的故事社区</p>
          </div>
          
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:hello@careerlighthouse.com" className="text-gray-400 hover:text-red-500 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">隐私政策</a>
            <a href="/terms" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">服务条款</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">关于我们</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">联系我们</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p className="mb-2">© {currentYear} 职场story. 保留所有权利.</p>
          <p className="flex items-center justify-center">
            <span className="flex items-center mr-2">
              用 <Heart className="h-3 w-3 mx-1 text-red-500" /> 和 <Coffee className="h-3 w-3 mx-1 text-amber-600" /> 创造
            </span>
            <Globe className="h-3 w-3 mr-1" /> 中国
          </p>
        </div>
      </div>
    </footer>
  );
}