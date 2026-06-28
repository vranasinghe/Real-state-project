import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Target, Eye, ShieldCheck, Compass, CheckCircle } from 'lucide-react';
import AgentCard from '../components/agent/AgentCard';
import { agents } from '../data/mockData';

export const About = () => {
  return (
    <div className="pt-24 pb-20 font-body space-y-20">
      
      {/* Header breadcrumb */}
      <section className="bg-cardBg py-10 border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight mb-2">About Casa Mare</h1>
          <div className="flex items-center space-x-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-textDark font-bold">About Us</span>
          </div>
        </div>
      </section>

      {/* Hero Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-textDark leading-tight">
              Pioneering Luxury Real Estate For Over 15 Years
            </h2>
            <p className="text-textMuted text-sm leading-relaxed">
              Casa Mare was founded with the sole mission of delivering premium brokerage services that emphasize customer satisfaction. We connect high-profile buyers, rental seekers, and portfolio investors with premium property assets across the country.
            </p>
            <p className="text-textMuted text-sm leading-relaxed">
              Our team consists of highly experienced local analysts, skilled negotiators, and dedicated customer success coordinators, providing a fully guided path from initial viewing to finalized contract signing.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-card translate-x-4 translate-y-4 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Mansion Interior"
              className="w-full h-80 object-cover rounded-card shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-cardBg rounded-card py-16 border border-borderLight">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="bg-white border border-borderLight p-8 rounded-card hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-textDark">Our Mission</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              To simplify premium real estate acquisitions through transparent communication, absolute reliability, and a personalized approach that matches our clients' lifestyle goals.
            </p>
          </div>

          <div className="bg-white border border-borderLight p-8 rounded-card hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-textDark">Our Vision</h3>
            <p className="text-textMuted text-xs leading-relaxed">
              To be recognized as the premier destination for luxury properties, setting new standards of service, tech integrations, and broker integrity worldwide.
            </p>
          </div>

        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-darkGreen text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-primary">15+</p>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Years of Service</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-primary">500+</p>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Properties Listed</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-primary">1200+</p>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Happy Clients</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-primary">50+</p>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Active Agents</p>
            </div>

          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest font-semibold">Milestones</span>
          <h2 className="text-3xl font-heading font-extrabold text-textDark">Company History Timeline</h2>
          <p className="text-textMuted text-sm">
            How we evolved from a small local agency into a nation-wide brand.
          </p>
        </div>

        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-32 space-y-10">
          
          <div className="relative pl-8">
            {/* Dot */}
            <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 bg-primary rounded-full shadow-sm"></div>
            <div>
              <h4 className="font-heading font-bold text-lg text-textDark">2011 — The Foundation</h4>
              <p className="text-textMuted text-xs mt-1 max-w-xl leading-relaxed">
                Casa Mare was established in Miami, Florida as a boutique brokerage agency focusing on seaside luxury properties.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 bg-primary rounded-full shadow-sm"></div>
            <div>
              <h4 className="font-heading font-bold text-lg text-textDark">2016 — Regional Expansion</h4>
              <p className="text-textMuted text-xs mt-1 max-w-xl leading-relaxed">
                Expanded offices to Texas and California, increasing active listings count to over 250 premium residences.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 bg-primary rounded-full shadow-sm"></div>
            <div>
              <h4 className="font-heading font-bold text-lg text-textDark">2021 — Going Digital & Smart</h4>
              <p className="text-textMuted text-xs mt-1 max-w-xl leading-relaxed">
                Launched our cloud valuation tools, mobile search app, and online tour scheduling integrations.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Team Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-primary font-heading font-extrabold text-xs uppercase tracking-widest font-semibold">Leadership</span>
          <h2 className="text-3xl font-heading font-extrabold text-textDark">Meet Our Expert Team</h2>
          <p className="text-textMuted text-sm">
            Meet the senior property advisors and consultants driving Casa Mare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.slice(0, 3).map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
