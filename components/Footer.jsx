'use client';
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <h2 className="text-3xl font-extrabold text-blue-800 mb-4">PharmaCare</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            We deliver safe, reliable, and innovative healthcare solutions. Our mission is to make a difference in people's lives with trusted pharma expertise.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/about" className="hover:text-blue-600 transition">About Us</a></li>
            <li><a href="/team" className="hover:text-blue-600 transition">Our Team</a></li>
            <li><a href="/careers" className="hover:text-blue-600 transition">Careers</a></li>
            <li><a href="/news" className="hover:text-blue-600 transition">News & Media</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Solutions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/manufacturing" className="hover:text-blue-600 transition">Pharma Manufacturing</a></li>
            <li><a href="/research" className="hover:text-blue-600 transition">Clinical Research</a></li>
            <li><a href="/regulatory" className="hover:text-blue-600 transition">Regulatory Consulting</a></li>
            <li><a href="/distribution" className="hover:text-blue-600 transition">Global Distribution</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Contact Us</h3>
          <p className="text-sm text-gray-700 mb-2">📍 123 Health Street, Pharma City, India</p>
          <p className="text-sm text-gray-700 mb-2">📞 +91 98765 43210</p>
          <p className="text-sm text-gray-700 mb-4">✉️ contact@pharmacare.com</p>

          <div className="flex space-x-3 mt-3">
            <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-blue-600 transition"><Facebook size={18} /></a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-500 transition"><Twitter size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-700 transition"><Linkedin size={18} /></a>
            <a href="mailto:contact@pharmacare.com" className="text-gray-500 hover:text-red-600 transition"><Mail size={18} /></a>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Stay Informed</h4>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to our newsletter for the latest in pharmaceutical innovations and healthcare updates.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-2/3 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PharmaCare. All rights reserved.
      </div>
    </footer>
  );
};
