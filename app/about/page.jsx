import React from 'react';

const AboutUs = () => {
  const stats = [
    { number: "25+", label: "Years of Excellence", icon: "🏆" },
    { number: "50M+", label: "Patients Served", icon: "👨‍👩‍👧‍👧" },
    { number: "200+", label: "Pharmaceutical Products", icon: "💊" },
    { number: "15", label: "Countries Served", icon: "🌍" }
  ];

  const certifications = [
    { name: "WHO-GMP", description: "World Health Organization Good Manufacturing Practice" },
    { name: "ISO 9001:2015", description: "Quality Management Systems" },
    { name: "ISO 14001", description: "Environmental Management" },
    { name: "FDA Approved", description: "Food and Drug Administration Compliance" }
  ];

  const leadership = [
    {
      name: "Dr. Rajesh Sharma",
      role: "Chief Executive Officer",
      credentials: "MD, MBA, 20+ Years Experience",
      image: "/images/ceo.jpg"
    },
    {
      name: "Dr. Priya Patel",
      role: "Chief Scientific Officer",
      credentials: "PhD in Pharmaceutical Sciences",
      image: "/images/cso.jpg"
    },
    {
      name: "Mr. Amit Kumar",
      role: "Chief Operating Officer",
      credentials: "M.Pharm, Operations Excellence",
      image: "/images/coo.jpg"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-700/30 backdrop-blur-sm border border-blue-400/20 rounded-full px-6 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium">Leading Pharmaceutical Innovation Since 1999</span>
          </div>
          
          <h1 className="text-2xl lg:text-4xl font-black mb-8 leading-tight">
            Empowering Health Through 
            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent"> Science & Innovation</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            At PharmaCare, we transform lives through breakthrough pharmaceutical solutions, 
            combining cutting-edge research with unwavering commitment to patient care.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-black text-blue-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Enhanced Textual Content */}
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6 font-semibold text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              About PharmaCare
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-blue-900 mb-8 leading-tight">
              Pioneering Excellence in 
              <span className="text-indigo-600"> Pharmaceutical Care</span>
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                At <span className="font-bold text-blue-700">PharmaCare</span>, we are more than a pharmaceutical company—we are a movement committed to transforming lives. Since our inception in 1999, we have been driven by a relentless pursuit of quality, precision, and integrity in every solution we provide.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to deliver life-enhancing healthcare products with global standards, tailored to meet the diverse needs of modern medicine. We operate with the understanding that behind every prescription is a person seeking healing, hope, and a better quality of life.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                With a team of top-tier scientists, dedicated researchers, and industry veterans, we innovate with purpose. From drug discovery to formulation and delivery, we harness cutting-edge technology and rigorous research methodologies to offer breakthrough therapies that improve patient outcomes worldwide.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Global Standards</h4>
                  <p className="text-sm text-gray-600">WHO-GMP & FDA Compliance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">R&D Excellence</h4>
                  <p className="text-sm text-gray-600">Cutting-edge Research</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Enhanced Image Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img
                src="/images/pharma-team.jpg"
                alt="PharmaCare Research Team"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-2">World-Class Research Facility</h3>
                <p className="text-blue-100 text-sm">State-of-the-art laboratories and manufacturing units</p>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-blue-900 mb-6">
              Our Foundation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on principles that guide every decision and innovation we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be a global leader in pharmaceutical excellence, pioneering innovations that redefine health outcomes and set new standards for patient care worldwide.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To enhance human health by delivering high-quality, affordable, and accessible pharmaceutical solutions that improve lives and create lasting positive impact across the globe.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Core Values</h3>
                <div className="space-y-2">
                  {["Innovation", "Compassion", "Quality", "Integrity", "Collaboration", "Sustainability"].map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-blue-900 mb-6">
              Certifications & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality is validated by international standards and regulatory approvals
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-blue-900 mb-6">
              Leadership Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders driving PharmaCare's mission forward
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                  <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
                    {/* Placeholder for leader image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-4xl font-bold text-white">
                          {leader.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{leader.name}</h3>
                    <p className="text-indigo-600 font-semibold mb-2">{leader.role}</p>
                    <p className="text-gray-600 text-sm">{leader.credentials}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            Partner With Excellence
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Discover how PharmaCare can support your healthcare needs with our comprehensive pharmaceutical solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl">
              Explore Products
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;