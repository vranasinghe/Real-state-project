import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isConfigured } from '../../lib/supabase';
export default function ResetPassword() {
  const [ready,setReady] = useState(false);
  const [password,setPassword] = useState('');
  const [confirmation,setConfirmation] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const [success,setSuccess] = useState(false);
  useEffect(() => {
    if(!isConfigured) return;
    let live = true;
    supabase.auth.getSession().then(({data:{session}}) => { if(live && session) setReady(true); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((event) => { if(event === 'PASSWORD_RECOVERY') setReady(true); });
    return () => { live = false; subscription.unsubscribe(); };
  },[]);
  async function submit(e) {
    e.preventDefault();
    if(password.length < 8) { setError('Use at least 8 characters.'); return; }
    if(password !== confirmation) { setError('The passwords do not match.'); return; }
    setBusy(true); setError('');
    try { const {error: updateError} = await supabase.auth.updateUser({password}); if(updateError) throw updateError; setSuccess(true); setPassword(''); setConfirmation(''); }
    catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  return <div className="cm-section max-w-xl py-20"><Link to="/" className="text-link">Aura Space home</Link><h1 className="text-3xl mt-10 mb-6">Reset your password</h1>{success ? <p role="status" className="notice">Password updated. <Link to="/login" className="text-link">Return to sign in</Link>.</p> : !ready ? <p className="notice">Open the password recovery link from your email to continue. <Link to="/forgot-password" className="text-link">Request a new link</Link>.</p> : <form onSubmit={submit} className="space-y-6"><label className="form-field">New password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label><label className="form-field">Confirm new password<input type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label>{error && <p role="alert" className="error-notice">{error}</p>}<button className="cm-button" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></form>}</div>;
}
