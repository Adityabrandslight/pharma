'use client';

import { MapPin, Mail, Phone, Clock, Building2, Users, Award } from "lucide-react";
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      // Reset form or show success message
    }, 2000);
  };

  const offices = [
    {
      title: "Corporate Headquarters",
      address: "PharmaCare Plaza, Sector 18, Gurugram, Haryana 122015, India",
      phone: "+91 124 4567890",
      email: "corporate@pharmacare.com",
      type: "headquarters"
    },
    {
      title: "Manufacturing Unit",
      address: "Industrial Area Phase-II, Baddi, Himachal Pradesh 173205, India", 
      phone: "+91 1795 245678",
      email: "manufacturing@pharmacare.com",
      type: "manufacturing"
    },
    {
      title: "Research & Development",
      address: "Biotech Park, Knowledge City, Hyderabad, Telangana 500081, India",
      phone: "+91 40 67890123",
      email: "research@pharmacare.com",
      type: "research"
    }
  ];

  const inquiryTypes = [
    "General Inquiry",
    "Product Information",
    "Business Partnership",
    "Career Opportunities",
    "Media & Press",
    "Regulatory Affairs",
    "Quality Assurance",
    "Technical Support"
  ];

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-blue-700/30 backdrop-blur-sm border border-blue-400/20 rounded-full px-6 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium">Available 24/7 for Emergency Support</span>
          </div>
          
          <h1 className="text-2xl lg:text-4xl font-black mb-8 leading-tight">
            Connect With 
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent"> PharmaCare</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            Whether you're seeking pharmaceutical solutions, partnership opportunities, or career guidance—
            our expert team is here to assist you with personalized support.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Phone className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">24/7 Hotline</h3>
              <p className="text-blue-100 text-sm">+91 1800 123 4567</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Mail className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">Quick Response</h3>
              <p className="text-blue-100 text-sm">info@pharmacare.com</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Clock className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="font-bold mb-2">Response Time</h3>
              <p className="text-blue-100 text-sm">Within 24 Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Form - Enhanced */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-blue-900 mb-4">Send Us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        type="text"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        type="email"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company/Organization</label>
                      <input
                        name="company"
                        onChange={handleChange}
                        value={formData.company}
                        type="text"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        name="phone"
                        onChange={handleChange}
                        value={formData.phone}
                        type="tel"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiry Type *</label>
                    <select
                      name="inquiryType"
                      onChange={handleChange}
                      value={formData.inquiryType}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                      required
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input
                      name="subject"
                      onChange={handleChange}
                      value={formData.subject}
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300"
                      placeholder="Brief subject of your inquiry"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      onChange={handleChange}
                      value={formData.message}
                      rows="6"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-gray-300 resize-none"
                      placeholder="Please provide detailed information about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="privacy" className="mt-1" required />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span> and 
                      consent to PharmaCare processing my personal data for this inquiry.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
               <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-blue-900 mb-4">Visit Our Headquarters</h2>
            <p className="text-xl text-gray-600">Located in the heart of Gurugram's business district</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <iframe
              className="w-full h-96"
              src="https://maps.google.com/maps?q=Gurugram%20Sector%2018&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PharmaCare Headquarters Location"
            ></iframe>
          </div>
        </div>
      </section>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-8">
              {/* Office Locations */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-900 mb-8 flex items-center">
                  <Building2 className="w-7 h-7 mr-3 text-blue-600" />
                  Our Locations
                </h3>
                
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                      <div className="flex items-start space-x-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {office.type === 'headquarters' && <Building2 className="w-7 h-7 text-white" />}
                          {office.type === 'manufacturing' && <Users className="w-7 h-7 text-white" />}
                          {office.type === 'research' && <Award className="w-7 h-7 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-blue-900 mb-3 text-lg">{office.title}</h4>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{office.address}</p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm group/phone">
                              <Phone className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                              <a 
                                href={`tel:${office.phone.replace(/\s/g, '')}`} 
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                              >
                                {office.phone}
                              </a>
                            </div>
                            <div className="flex items-center text-sm group/email">
                              <Mail className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                              <a 
                                href={`mailto:${office.email}`} 
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200 truncate"
                              >
                                {office.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3" />
                  Business Hours
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="font-semibold text-blue-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Saturday</span>
                    <span className="font-semibold text-blue-900">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Sunday</span>
                    <span className="font-semibold text-red-600">Closed</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-green-700 font-semibold">24/7 Emergency Support Available</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Connect With Us</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FaLinkedin, name: "LinkedIn", bg: "from-blue-600 to-blue-700", link: "#" },
                    { icon: FaTwitter, name: "Twitter", bg: "from-sky-500 to-sky-600", link: "#" },
                    { icon: FaFacebook, name: "Facebook", bg: "from-blue-700 to-blue-800", link: "#" },
                    { icon: FaYoutube, name: "YouTube", bg: "from-red-600 to-red-700", link: "#" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className={`bg-gradient-to-r ${social.bg} p-4 rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                    >
                      <div className="flex items-center space-x-3">
                        <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">{social.name}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Map Section */}
     

    
    </div>
  );
}