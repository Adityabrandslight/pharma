'use client';

import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Building2, Users, Award } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulated API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      // You can add a toast/snackbar here
    }, 1200);
  };

  const offices = [
    {
      title: 'Corporate Headquarters',
      address: 'PharmaCare Plaza, Sector 18, Gurugram, Haryana 122015, India',
      phone: '+91 124 4567890',
      email: 'corporate@pharmacare.com',
      type: 'headquarters',
    },
    {
      title: 'Manufacturing Unit',
      address: 'Industrial Area Phase-II, Baddi, Himachal Pradesh 173205, India',
      phone: '+91 1795 245678',
      email: 'manufacturing@pharmacare.com',
      type: 'manufacturing',
    },
    {
      title: 'Research & Development',
      address: 'Biotech Park, Knowledge City, Hyderabad, Telangana 500081, India',
      phone: '+91 40 67890123',
      email: 'research@pharmacare.com',
      type: 'research',
    },
  ];

  const inquiryTypes = [
    'General Inquiry',
    'Product Information',
    'Business Partnership',
    'Career Opportunities',
    'Media & Press',
    'Regulatory Affairs',
    'Quality Assurance',
    'Technical Support',
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                24/7 emergency support
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Contact PharmaCare
              </h1>
              <p className="mt-3 max-w-xl text-slate-600">
                For product questions, partnerships, or careers, our team responds quickly and clearly.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoPill icon={<Phone className="h-4 w-4" />} label="+91 1800 123 4567" />
                <InfoPill icon={<Mail className="h-4 w-4" />} label="info@pharmacare.com" />
                <InfoPill icon={<Clock className="h-4 w-4" />} label="Reply within 24 hours" />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <MiniStats />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* FORM */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill the form and we’ll get back within a business day.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      required
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <Field
                      label="Email address"
                      required
                      name="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Company / Organization"
                      name="company"
                      type="text"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                    <Field
                      label="Phone number"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Inquiry type <span className="text-rose-600">*</span></Label>
                    <select
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type, i) => (
                        <option key={i} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="Subject"
                    required
                    name="subject"
                    type="text"
                    placeholder="Brief subject of your inquiry"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <div>
                    <Label>Message <span className="text-rose-600">*</span></Label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input id="privacy" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
                    <label htmlFor="privacy" className="text-sm text-slate-600">
                      I agree to the <span className="text-blue-700 underline underline-offset-2">Privacy Policy</span> and consent to
                      PharmaCare processing my personal data for this inquiry.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner /> Sending…
                      </span>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </form>
              </div>

              {/* MAP */}
              <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Visit our headquarters</h3>
                  <p className="mt-1 text-sm text-slate-600">Gurugram business district</p>
                </div>
                <div className="overflow-hidden rounded-xl">
                  <iframe
                    className="h-80 w-full"
                    src="https://maps.google.com/maps?q=Gurugram%20Sector%2018&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PharmaCare Headquarters Location"
                  />
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-8">
              {/* Offices */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="h-5 w-5" /> Our locations
                </h3>
                <div className="space-y-5">
                  {offices.map((office, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-5 transition hover:shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                          {office.type === 'headquarters' && <Building2 className="h-5 w-5" />}
                          {office.type === 'manufacturing' && <Users className="h-5 w-5" />}
                          {office.type === 'research' && <Award className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{office.title}</div>
                          <p className="mt-1 text-sm text-slate-600">{office.address}</p>
                          <div className="mt-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-700" />
                              <a className="text-blue-700 hover:underline" href={`tel:${office.phone.replace(/\s/g, '')}`}>
                                {office.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-700" />
                              <a className="truncate text-blue-700 hover:underline" href={`mailto:${office.email}`}>
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

              {/* Hours */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" /> Business hours
                </h3>
                <div className="divide-y divide-slate-200 text-sm">
                  <Row left="Monday – Friday" right="9:00 AM – 6:00 PM" />
                  <Row left="Saturday" right="9:00 AM – 2:00 PM" />
                  <Row left="Sunday" right={<span className="font-semibold text-rose-600">Closed</span>} />
                </div>
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold">24/7 emergency support available</span>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Connect with us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <SocialButton Icon={FaLinkedin} label="LinkedIn" href="#" />
                  <SocialButton Icon={FaTwitter} label="Twitter" href="#" />
                  <SocialButton Icon={FaFacebook} label="Facebook" href="#" />
                  <SocialButton Icon={FaYoutube} label="YouTube" href="#" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- UI Primitives ---------------------------- */

function Label({ children }) {
  return <label className="block text-sm font-medium text-slate-800">{children}</label>;
}

function Field({ label, name, type = 'text', placeholder, required, value, onChange }) {
  return (
    <div>
      <Label>
        {label} {required && <span className="text-rose-600">*</span>}
      </Label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function Row({ left, right }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-slate-700">{left}</span>
      <span className="font-medium text-slate-900">{right}</span>
    </div>
  );
}

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

function SocialButton({ Icon, label, href }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
    </svg>
  );
}

function MiniStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Stat number="25+" label="Years" />
      <Stat number="50M+" label="Patients" />
      <Stat number="200+" label="Products" />
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <div className="text-xl font-bold">{number}</div>
      <div className="mt-1 text-xs text-slate-600">{label}</div>
    </div>
  );
}
