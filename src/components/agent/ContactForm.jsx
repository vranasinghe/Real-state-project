import React, { useState } from 'react';
import { Calendar, Phone, Mail, User, Clock, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { submitEnquiry } from '../../lib/api';

export const ContactForm = ({ type = 'general', agentName = '', propertyId = null, agentId = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    date: '',
    time: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (type === 'general' && !formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (type === 'tour' && !formData.date) {
      newErrors.date = 'Tour Date is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await submitEnquiry({
          propertyId,
          agentId,
          userId: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          date: formData.date,
          time: formData.time,
          message: formData.message
        });
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          date: '',
          time: '',
          message: ''
        });
        setErrors({});
        setTimeout(() => setIsSubmitted(false), 5000);
      } catch (err) {
        console.error('Error submitting enquiry:', err.message);
        setErrors(prev => ({ ...prev, submit: err.message || 'Failed to submit enquiry. Please try again.' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-card text-center space-y-3 animate-fade-in shadow-sm">
        <CheckCircle className="w-12 h-12 text-primary mx-auto animate-bounce" />
        <h3 className="font-heading font-bold text-lg">Inquiry Received Successfully!</h3>
        <p className="text-sm text-emerald-700/90 leading-relaxed">
          {type === 'tour' 
            ? "Your schedule tour request has been sent. An agent will contact you shortly to confirm the appointment."
            : `Thank you for contacting ${agentName ? agentName : 'Casa Mare'}. We will review your message and reply within 24 hours.`
          }
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-btn text-center">
          {errors.submit}
        </div>
      )}
      {/* Name Input */}
      <div>
        <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
          <User className="w-3.5 h-3.5 text-primary" /> Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
            errors.name ? 'border-red-500 bg-red-50/10' : 'border-borderLight bg-white'
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
      </div>

      {/* Grid for Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" /> Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="johndoe@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.email ? 'border-red-500 bg-red-50/10' : 'border-borderLight bg-white'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" /> Phone
          </label>
          <input
            type="text"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.phone ? 'border-red-500 bg-red-50/10' : 'border-borderLight bg-white'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Date & Time (only for Tour scheduling) */}
      {type === 'tour' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.date ? 'border-red-500' : 'border-borderLight'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs font-semibold mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-borderLight rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>
        </div>
      )}

      {/* Subject (only for general contact) */}
      {type === 'general' && (
        <div>
          <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center gap-1 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            placeholder="Property Inquiry / Cooperation"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.subject ? 'border-red-500 bg-red-50/10' : 'border-borderLight bg-white'
            }`}
          />
          {errors.subject && <p className="text-red-500 text-xs font-semibold mt-1">{errors.subject}</p>}
        </div>
      )}

      {/* Message textarea */}
      <div>
        <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-textMuted flex items-center mb-1.5">
          Your Message
        </label>
        <textarea
          name="message"
          rows="4"
          placeholder={type === 'tour' ? "I'd like to schedule a tour to view this property..." : "Enter your message here..."}
          value={formData.message}
          onChange={handleChange}
          className={`w-full border rounded-btn px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${
            errors.message ? 'border-red-500 bg-red-50/10' : 'border-borderLight bg-white'
          }`}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs font-semibold mt-1">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full py-3"
      >
        {type === 'tour' ? 'Schedule Tour' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
