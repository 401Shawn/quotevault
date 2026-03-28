'use client';

export default function Pricing() {
  return (
    <main className="min-h-screen bg-[#1B2A4A] text-white">
      <div className="bg-[#162238] border-b-2 border-[#4cc458] px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-black text-lg tracking-widest uppercase hover:opacity-80 transition-opacity">Quote<span className="text-[#4cc458]">Vault</span></a>
        <div className="text-xs text-gray-500 tracking-widest uppercase">Crest Sales Suite</div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-[#4cc458] mb-3">Pricing</div>
          <h1 className="text-4xl font-black mb-4">Simple pricing.<br/><span className="text-[#4cc458]">No surprises.</span></h1>
          <p className="text-gray-400 max-w-lg mx-auto">Start free. Upgrade when you're ready. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Free */}
          <div className="bg-[#162238] border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Free</p>
              <p className="text-4xl font-black mb-1">$0</p>
              <p className="text-gray-500 text-sm">Forever free</p>
            </div>
            <div className="border-t border-gray-700 pt-6 space-y-3">
              {['3 quote summaries / month','Any supplier PDF format','AI-powered parsing'].map(f=>(
                <div key={f} className="flex gap-3 text-sm text-gray-300"><span className="text-green-400 flex-shrink-0">✓</span>{f}</div>
              ))}
              {['No logo upload','No quote history','No saved branding'].map(f=>(
                <div key={f} className="flex gap-3 text-sm text-gray-600"><span className="flex-shrink-0">—</span>{f}</div>
              ))}
            </div>
            <a href="/" className="mt-8 block text-center border border-gray-600 hover:border-[#4cc458] text-gray-400 hover:text-white font-bold text-sm py-3 rounded-lg uppercase tracking-widest transition-all">Get Started Free</a>
          </div>

          {/* Pro */}
          <div className="bg-[#162238] border-2 border-[#4cc458] rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4cc458] text-[#162238] text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">Most Popular</div>
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Pro</p>
              <p className="text-4xl font-black mb-1">$9<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm">Per rep, billed monthly</p>
            </div>
            <div className="border-t border-gray-700 pt-6 space-y-3">
              {['Unlimited quote summaries','Any supplier PDF format','AI-powered parsing','Saved company logo','Quote history (90 days)','Priority support'].map(f=>(
                <div key={f} className="flex gap-3 text-sm text-gray-300"><span className="text-green-400 flex-shrink-0">✓</span>{f}</div>
              ))}
            </div>
            <a href="https://buy.stripe.com/aFa3cx1yzazfdO12hYf7i00" className="mt-8 block text-center bg-[#4cc458] hover:bg-[#34a840] text-[#162238] font-black text-sm py-3 rounded-lg uppercase tracking-widest transition-all">Get Pro — $9/mo</a>
          </div>

          {/* Team */}
          <div className="bg-[#162238] border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Team</p>
              <p className="text-4xl font-black mb-1">$29<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm">Up to 10 reps</p>
            </div>
            <div className="border-t border-gray-700 pt-6 space-y-3">
              {['Everything in Pro','Shared company branding','Admin dashboard','Full quote history','Usage analytics per rep','Dedicated support'].map(f=>(
                <div key={f} className="flex gap-3 text-sm text-gray-300"><span className="text-green-400 flex-shrink-0">✓</span>{f}</div>
              ))}
            </div>
            <a href="https://buy.stripe.com/28E28t0uv6iZ7pD5uaf7i01" className="mt-8 block text-center border border-gray-600 hover:border-[#4cc458] text-gray-400 hover:text-white font-bold text-sm py-3 rounded-lg uppercase tracking-widest transition-all">Contact for Team Plan</a>
          </div>

        </div>

        {/* FAQ */}
        <div className="bg-[#162238] border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-black mb-6 text-center">Common questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {q:'What counts as a quote summary?',a:'Each time you upload a supplier PDF and generate a customer-facing summary PDF, that counts as one quote summary.'},
              {q:'What supplier formats are supported?',a:'Any supplier PDF — BisTrack, CDK, Builders FirstSource, Riverhead, and more. Our AI reads any format.'},
              {q:'Is my quote data stored?',a:'No. Documents are processed in real-time and immediately discarded. We never store your supplier quote data.'},
              {q:'Can I upgrade or cancel anytime?',a:'Yes. Upgrade, downgrade, or cancel at any time. No contracts, no cancellation fees.'},
            ].map(item=>(
              <div key={item.q}>
                <p className="font-bold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">Questions? Reach out directly.</p>
          <a href="mailto:shawn@crestsalessuite.com" className="text-[#4cc458] hover:underline text-sm">shawn@crestsalessuite.com</a>
        </div>

      </div>

      <footer className="border-t border-gray-800 py-8 text-center">
        <p className="text-gray-600 text-xs mb-2">© 2026 Crest Sales Suite. All rights reserved. QuoteVault™ is a trademark of Crest Sales Suite.</p>
        <div className="flex justify-center gap-6 text-xs">
          <a href="/legal" className="text-gray-600 hover:text-[#4cc458] transition-colors">Terms of Service</a>
          <a href="/legal" className="text-gray-600 hover:text-[#4cc458] transition-colors">Privacy Policy</a>
          <a href="https://crestsalessuite.com" className="text-gray-600 hover:text-[#4cc458] transition-colors">Crest Sales Suite</a>
        </div>
      </footer>
    </main>
  );
}
