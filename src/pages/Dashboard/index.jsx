import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Loader2, AlertCircle, Home, Inbox, DollarSign, ImagePlus } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { createProperty, getMyProperties, deleteProperty, getMyEnquiries, uploadPropertyImage } from '../../lib/api';
import { PROPERTY_TYPES, CITIES, AMENITIES } from '../../utils/constants';

const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const MAX_IMAGE_BYTES = 1024 * 1024;

const EMPTY = {
  title: '', description: '', status: 'For Sale', type: PROPERTY_TYPES[0], city: CITIES[0], address: '',
  price: '', beds: 3, baths: 2, sqft: '', yearBuilt: '', features: [], image: '',
};

const inputCls = 'w-full border border-borderLight rounded-btn px-3 py-2 text-sm text-textDark bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-heading font-bold text-textDark uppercase tracking-wider">{label}</span>
    {children}
  </label>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-cardBg border border-borderLight rounded-card p-5 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-white border border-borderLight rounded-full text-primary"><Icon className="w-5 h-5" /></div>
    <div>
      <p className="text-[11px] font-heading font-bold text-textMuted uppercase tracking-wider">{label}</p>
      <p className="text-xl font-heading font-extrabold text-textDark">{value}</p>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user, role } = useAuth();
  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const [mine, inbox] = await Promise.all([getMyProperties(user), getMyEnquiries(user)]);
      setListings(mine);
      setEnquiries(inbox);
    } catch (err) {
      setError(err.message || 'Could not load your dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleFeature = (name) => setForm((f) => ({
    ...f, features: f.features.includes(name) ? f.features.filter((x) => x !== name) : [...f.features, name],
  }));

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > MAX_IMAGE_BYTES) return setError('Image must be under 1 MB.');
    setError('');
    try {
      setForm((f) => ({ ...f, image: '' }));
      const url = await uploadPropertyImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message || 'Image upload failed');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await createProperty(form, user);
      setForm(EMPTY);
      setShowForm(false);
      setNotice('Listing published. It now appears on the Properties page.');
      await load();
    } catch (err) {
      setError(err.message || 'Could not publish the listing');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty(p.id, user);
      setNotice('Listing deleted.');
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete the listing');
    }
  };

  const totalValue = listings.reduce((s, p) => s + Number(p.price || 0), 0);

  return (
    <div className="pt-24 pb-20 font-body">
      <section className="bg-cardBg py-10 border-b border-borderLight mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-textDark tracking-tight mb-1 capitalize">{role} Dashboard</h1>
            <p className="text-sm text-textMuted">Welcome back, {user?.name}. Manage your listings and client enquiries.</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold text-sm px-5 py-3 rounded-btn hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> {showForm ? 'Close form' : 'Add listing'}
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {!isConfigured && <p className="notice">Local demo dashboard. Listings and enquiries are stored only in this browser.</p>}
        {error && (
          <div role="alert" className="flex gap-3 bg-red-50 border border-red-200 text-red-700 rounded-card p-4 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
          </div>
        )}
        {notice && <div role="status" className="bg-primary-light text-darkGreen border border-primary/30 rounded-card p-4 text-sm font-semibold">{notice}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat icon={Home} label="Your listings" value={listings.length} />
          <Stat icon={DollarSign} label="Sum of asking prices" value={usd(totalValue)} />
          <Stat icon={Inbox} label="Enquiries received" value={enquiries.length} />
        </div>

        {showForm && (
          <form onSubmit={submit} className="bg-white border border-borderLight p-6 md:p-8 rounded-card shadow-md space-y-6">
            <h2 className="font-heading font-bold text-xl text-textDark">New listing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><Field label="Title"><input required maxLength={120} value={form.title} onChange={set('title')} className={inputCls} placeholder="Sunny 3-bedroom family home" /></Field></div>
              <Field label="Status">
                <select value={form.status} onChange={set('status')} className={inputCls}>
                  <option>For Sale</option><option>For Rent</option><option>Sold</option>
                </select>
              </Field>
              <Field label="Property type">
                <select value={form.type} onChange={set('type')} className={inputCls}>
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="City">
                <select value={form.city} onChange={set('city')} className={inputCls}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Address"><input required value={form.address} onChange={set('address')} className={inputCls} placeholder="123 Ocean View Dr" /></Field>
              <Field label="Price (USD)"><input required type="number" min="1" value={form.price} onChange={set('price')} className={inputCls} /></Field>
              <Field label="Bedrooms"><input required type="number" min="0" max="20" value={form.beds} onChange={set('beds')} className={inputCls} /></Field>
              <Field label="Bathrooms"><input required type="number" min="0" max="20" value={form.baths} onChange={set('baths')} className={inputCls} /></Field>
              <Field label="Area (sq ft)"><input required type="number" min="100" value={form.sqft} onChange={set('sqft')} className={inputCls} /></Field>
              <Field label="Year built"><input type="number" min="1800" max={new Date().getFullYear() + 1} value={form.yearBuilt} onChange={set('yearBuilt')} className={inputCls} /></Field>
              <Field label="Photo (max 1 MB)">
                <label className={`${inputCls} flex items-center gap-2 cursor-pointer text-textMuted`}>
                  <ImagePlus className="w-4 h-4" />{form.image ? 'Photo ready ✓' : 'Choose image'}
                  <input type="file" accept="image/*" onChange={onImage} className="sr-only" />
                </label>
              </Field>
            </div>

            <Field label="Description">
              <textarea rows={4} value={form.description} onChange={set('description')} className={inputCls} placeholder="Tell buyers what makes this home special." />
            </Field>

            <fieldset>
              <legend className="text-xs font-heading font-bold text-textDark uppercase tracking-wider mb-2">Features</legend>
              <div className="flex flex-wrap gap-3">
                {AMENITIES.map((a) => (
                  <label key={a} className="inline-flex items-center gap-2 text-sm text-textDark">
                    <input type="checkbox" checked={form.features.includes(a)} onChange={() => toggleFeature(a)} className="accent-primary" />{a}
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold text-sm px-6 py-3 rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Publishing…' : 'Publish listing'}
            </button>
          </form>
        )}

        <section className="bg-white border border-borderLight rounded-card shadow-sm overflow-x-auto">
          <h2 className="font-heading font-bold text-lg text-textDark p-5 border-b border-borderLight">My listings</h2>
          {loading ? (
            <p className="p-6 text-sm text-textMuted">Loading…</p>
          ) : listings.length === 0 ? (
            <p className="p-6 text-sm text-textMuted">You haven't listed anything yet. Press “Add listing” to publish your first property.</p>
          ) : (
            <table className="w-full text-sm min-w-[620px]">
              <thead className="bg-cardBg text-xs uppercase tracking-wider text-textMuted">
                <tr><th className="text-left p-3">Property</th><th className="text-left p-3">Status</th><th className="text-right p-3">Price</th><th className="text-right p-3">Actions</th></tr>
              </thead>
              <tbody>
                {listings.map((p) => (
                  <tr key={p.id} className="border-t border-borderLight">
                    <td className="p-3">
                      <Link to={`/properties/${p.id}`} className="font-semibold text-textDark hover:text-primary">{p.title}</Link>
                      <p className="text-xs text-textMuted">{p.location}, {p.city}</p>
                    </td>
                    <td className="p-3">{p.status}</td>
                    <td className="p-3 text-right">{usd(p.price)}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-bold">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white border border-borderLight rounded-card shadow-sm">
          <h2 className="font-heading font-bold text-lg text-textDark p-5 border-b border-borderLight">Enquiries</h2>
          {enquiries.length === 0 ? (
            <p className="p-6 text-sm text-textMuted">No enquiries yet. They appear here when buyers contact you about a listing.</p>
          ) : (
            <ul className="divide-y divide-borderLight">
              {enquiries.map((e) => (
                <li key={e.id} className="p-5 space-y-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold text-textDark">{e.name || 'Anonymous'} <span className="text-textMuted font-normal">· {e.subject}</span></p>
                    <p className="text-xs text-textMuted">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-primary font-semibold">Re: {e.propertyTitle}</p>
                  <p className="text-sm text-textDark whitespace-pre-line">{e.message}</p>
                  <p className="text-xs text-textMuted">{[e.email, e.phone].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
