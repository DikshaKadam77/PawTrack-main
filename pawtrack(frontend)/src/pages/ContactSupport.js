"use client"

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Phone, HelpCircle, Send, Loader2, ChevronDown, User, Tag } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import './ContactSupport.css'; // We'll create this CSS file next

const faqs = [
  {
    question: "How do I report an animal in need?",
    answer: "On the homepage, click the 'Report Animal' button and fill out the form with as much detail as possible, including the location and a photo if you can."
  },
  {
    question: "How can I update the status of my report?",
    answer: "You can view and manage all your reports from your Citizen Dashboard. You will also receive email notifications when a rescue team is assigned."
  },
  {
    question: "I made a mistake in my report. How can I correct it?",
    answer: "Please contact us directly using the form on this page or by emailing support@pawtrack.com with your report ID, and we will assist you."
  },
  {
    question: "How can my organization join Paw Track as a rescue partner?",
    answer: "We're thrilled you want to join! Please email our partnership team at partners@pawtrack.com, and we'll guide you through the onboarding process."
  }
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{faq.question}</span>
        <ChevronDown className={`faq-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && <div className="faq-answer">{faq.answer}</div>}
    </div>
  );
};

const ContactSupportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Your message has been sent! Our team will get back to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="contact-page-container">
        <div className="contact-page-header">
          <h1>Get in Touch</h1>
          <p>We're here to help. Whether you have a question, a problem, or feedback, let us know!</p>
        </div>

        <div className="contact-content-area">
          {/* Left Side: Contact Form & Info */}
          <div className="contact-card">
            <h2 className="contact-card-title">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="input-wrapper"><User className="input-icon" /><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Diya Sharma" className="form-input" required /></div>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-wrapper"><Mail className="input-icon" /><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="form-input" required /></div>
              </div>
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <div className="input-wrapper"><Tag className="input-icon" /><input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., Issue with Report #123" className="form-input" required /></div>
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows="5" placeholder="Please describe your issue in detail..." className="form-textarea" required></textarea>
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
              </button>
            </form>

            <div className="contact-divider"><span>OR</span></div>

            <div className="contact-channels">
              <div className="contact-channel">
                <Mail className="contact-icon" />
                <div>
                  <h3 className="channel-title">Email Us</h3>
                  <a href="mailto:support@pawtrack.com" className="channel-link">support@pawtrack.com</a>
                </div>
              </div>
              <div className="contact-channel">
                <Phone className="contact-icon" />
                <div>
                  <h3 className="channel-title">Call Us</h3>
                  <a href="tel:+910000000000" className="channel-link">+91 (000) 000-0000</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: FAQ */}
          <div className="faq-section">
            <div className="faq-header">
              <HelpCircle className="faq-icon" />
              <h2 className="faq-title">Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => <FAQItem key={index} faq={faq} />)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactSupportPage;