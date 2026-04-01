'use client';
import { useState } from 'react';
import { createClient } from '../../../lib/supabase-browser';

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/';
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
          <h1 className="text-3xl font-black mb-3">Welcome back</h1>
          <p className="text-gray-400">Sign in to your QuoteVault account</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-[#162238] border border-gray-700 focus:border-[#4cc458] rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4cc458] hover:bg-[#34a840] disabled:opacity-50 text-[#162238] font-black text-sm py-3 rounded-lg uppercase tracking-widest transition-all mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-[#4cc458] hover:underline font-bold">Create one free</a>
          </p>
        </div>
      </div>
    </main>
  );
}
