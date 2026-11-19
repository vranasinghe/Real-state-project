import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../../components/agent/ContactForm';
import { isConfigured } from '../../lib/supabase';
export default function Contact() {
  const [showForm,setShowForm] = useState(true);
  return <div className="workspace-page"><header className="workspace-header cm-section"><h1>Let’s start a conversation.</h1><p>Ask about the project, or open a property listing to contact its agent and request a tour.</p></header><section className="cm-section contact-layout"><div><h2>Send an enquiry</h2><p className="demo-note mt-4">{isConfigured ? 'Messages are stored securely for review. A reply time is not guaranteed.' : 'Local demonstration: messages are saved in this browser. No email is sent.'}</p>{showForm && <ContactForm type="general" />}<button className="text-link mt-6" onClick={() => setShowForm(s => !s)}>{showForm ? 'Hide enquiry form' : 'Show enquiry form'}</button></div><aside><h2>A more direct connection.</h2><p>For property-specific questions, use the contact form on the listing. That connects your enquiry to the property and its listing contact.</p><Link className="cm-button" to="/properties">Find a property</Link><hr /><h3>Curious about the machine learning?</h3><p>The case study covers the dataset, evaluation, model architecture and limitations.</p><Link className="text-link" to="/model-report">Explore the ML project</Link></aside></section></div>;
}
