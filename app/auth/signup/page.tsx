'use client';
import { useState } from 'react';
import { createClient } from '../../../lib/supabase-browser';

export default function Signup() {
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1B2A4A] text-white">
      <div className="bg-[#162238] border-b-2 border-[#4cc458] px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-black text-lg tracking-widest uppercase hover:opacity-80 transition-opacity">Quote<span className="text-[#4cc458]">Vault</span></a>
        <div className="text-xs text-gray-500 tracking-widest uppercase">Crest Sales Suite</div>
      </div>
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-[#4cc458] mb-3">Free to start</div>
          <h1 className="text-3xl font-black mb-3">Create your account</h1>
          <p className="text-gray-400">3 free quote summaries per month. Upgrade anytime.</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-red-300 text-sm">{error}</div>
        )}

        {success ? (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-xl font-black mb-3">Check your email</h2>
            <p className="text-gray-400 leading-relaxed">
              We sent a confirmation link to <span className="text-white font-bold">{email}</span>. 
              Click the link to activate your account.
            </p>
            <a href="/auth/login" className="inline-block mt-6 text-[#4cc458] hover:underline font-bold text-sm">
              Back to sign in
            </a>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-[#162238] border border-gray-700 focus:border-[#4cc458] rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#162238] border border-gray-700 focus:border-[#4cc458] rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-[#162238] border border-gray-700 focus:border-[#4cc458] rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
              />
              <p className="text-gray-600 text-xs mt-1">Minimum 6 characters</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4cc458] hover:bg-[#34a840] disabled:opacity-50 text-[#162238] font-black text-sm py-3 rounded-lg uppercase tracking-widest transition-all mt-6"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <a href="/auth/login" className="text-[#4cc458] hover:underline font-bold">Sign in</a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
