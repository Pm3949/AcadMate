import React from "react";
import { Instagram, Linkedin, Mail, Phone, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 py-8 px-4 md:px-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AcadMate
            </h3>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            {[
              {
                icon: <Instagram size={20} />,
                href: "https://www.instagram.com/manav_6759?igsh=MTdzdzNubXh1aXd2NQ==",
                tooltip: "Follow us on Instagram"
              },
              {
                icon: <Linkedin size={20} />,
                href: "https://www.linkedin.com/in/manav-patel-958776335?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                tooltip: "Connect on LinkedIn"
              },
              {
                icon: <Github size={20} />,
                href: "https://github.com/Pm3949",
                tooltip: "Contribute on GitHub"
              },
              {
                icon: <Mail size={20} />,
                href: "mailto:manavpatel0767@gmail.com",
                tooltip: "Email us"
              },
              {
                icon: <Phone size={20} />,
                href: "tel:+917623949059",
                tooltip: "Call support"
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 group relative"
                aria-label={item.tooltip}
              >
                {item.icon}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.tooltip}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Tagline & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400 text-center md:text-left">
            Empowering education through <span className="text-blue-400">technology</span> and <span className="text-purple-400">innovation</span>
          </p>
          
          <div className="flex space-x-4 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;