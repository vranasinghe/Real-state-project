import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../components/agent/ContactForm';

export const Contact = () => {
  return (
    <div className="pt-24 pb-20 font-body">
      
      {/* Page Header breadcrumb */}
      <section className="bg-cardBg py-10 border-b border-borderLight mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight mb-2">Contact Us</h1>
          <div className="flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-textDark font-bold">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Contents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white border border-borderLight p-6 md:p-8 rounded-card shadow-md space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl text-textDark">Send Us A Message</h2>
              <p className="text-textMuted text-xs mt-1 leading-relaxed">
                Got a question about a listing? Fill out the form below and one of our local advisors will contact you shortly.
              </p>
            </div>
            <ContactForm type="general" />
          </div>

          {/* Right Info Panels */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Info Card */}
            <div className="bg-cardBg border border-borderLight rounded-card p-6 md:p-8 space-y-6 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-textDark pb-4 border-b border-borderLight">Office Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white border border-borderLight rounded-full text-primary shadow-sm shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-textDark">Our Address</h4>
                    <p className="text-xs text-textMuted mt-1 leading-relaxed">
                      123 Ocean View Drive, Miami, FL 33139
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white border border-borderLight rounded-full text-primary shadow-sm shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-textDark font-semibold">Phone Support</h4>
                    <p className="text-xs text-textMuted mt-1">
                      +1 (555) 123-4567 (Toll Free)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white border border-borderLight rounded-full text-primary shadow-sm shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-textDark font-semibold">Email Inquiry</h4>
                    <p className="text-xs text-textMuted mt-1">
                      info@casamare.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white border border-borderLight rounded-full text-primary shadow-sm shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-textDark font-semibold">Office Hours</h4>
                    <p className="text-xs text-textMuted mt-1">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-xs text-textMuted">
                      Saturday: 10:00 AM - 4:00 PM (Sunday Closed)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maps Embed */}
            <div className="w-full h-64 rounded-card overflow-hidden border border-borderLight shadow-sm">
              <iframe
                title="Office Map Location"
                src="https://maps.google.com/maps?q=123%20Ocean%20View%20Drive,%20Miami,%20FL%2033139&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale opacity-90"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
