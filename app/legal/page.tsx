'use client';

export default function Legal() {
  return (
    <main className="min-h-screen bg-[#1B2A4A] text-white">
      <div className="bg-[#162238] border-b-2 border-[#4cc458] px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-black text-lg tracking-widest uppercase hover:opacity-80 transition-opacity">Quote<span className="text-[#4cc458]">Vault</span></a>
        <div className="text-xs text-gray-500 tracking-widest uppercase">Crest Sales Suite</div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-[#4cc458] mb-3">Legal</div>
          <h1 className="text-4xl font-black mb-4">Terms of Service<br/><span className="text-[#4cc458]">& Privacy Policy</span></h1>
          <p className="text-gray-400">Effective Date: March 28, 2026</p>
        </div>
        <section className="mb-12">
          <h2 className="text-2xl font-black mb-6 pb-3 border-b border-[#4cc458]/30">Terms of Service</h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div><h3 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h3><p>By accessing or using QuoteVault, operated by Crest Sales Suite, you agree to be bound by these Terms of Service.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">2. Description of Service</h3><p>QuoteVault is a web-based tool that allows users to upload supplier quote documents (PDFs) and generate clean, customer-facing summary documents using artificial intelligence.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">3. Intellectual Property</h3><p>QuoteVault, its name, logo, design, software, and all associated content are the exclusive intellectual property of Crest Sales Suite. The name "QuoteVault" and the QuoteVault logo are protected trademarks. The underlying concept, workflow, user interface design, and implementation are proprietary and protected by applicable copyright and intellectual property laws.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">4. Permitted Use</h3><p>You may use QuoteVault solely for generating customer-facing quote summaries from supplier documents. You agree not to copy, reverse engineer, replicate, resell, or use the Service for any unlawful purpose.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">5. Document Processing & AI</h3><p>QuoteVault uses Anthropic's Claude API to process uploaded documents. By uploading a document, you confirm you have the right to share and process it. Documents are not permanently stored after processing.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">6. Accuracy Disclaimer</h3><p>While we strive for accuracy, we cannot guarantee all extracted data will be 100% accurate. Users are responsible for reviewing all generated summaries before sharing with customers.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">7. Limitation of Liability</h3><p>Crest Sales Suite shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">8. Governing Law</h3><p>These Terms shall be governed by the laws of the State of Rhode Island, United States.</p></div>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-black mb-6 pb-3 border-b border-[#4cc458]/30">Privacy Policy</h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div><h3 className="text-lg font-bold text-white mb-2">1. Information We Collect</h3><p>Documents you upload are processed in real-time and are not permanently stored. We do not require account creation to use the basic Service and do not collect personal information beyond what is necessary to provide the Service.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">2. How We Use Your Information</h3><p>Any information collected is used solely to provide and improve the Service. We do not sell, trade, or transfer your information to third parties except as required to provide the Service.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">3. Document Privacy</h3><p>Uploaded documents are transmitted securely over HTTPS, processed by Anthropic's Claude AI, and are not stored on our servers after processing.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">4. Third-Party Services</h3><p>QuoteVault uses Anthropic Claude API for AI processing, Vercel for hosting, and Namecheap for domain registration.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">5. Data Security</h3><p>All data transmission is encrypted using industry-standard TLS/SSL protocols.</p></div>
            <div><h3 className="text-lg font-bold text-white mb-2">6. Contact Us</h3>
              <div className="mt-3 bg-[#162238] rounded-lg p-4 border border-[#4cc458]/20">
                <p className="font-bold text-white">Crest Sales Suite</p>
                <p>Email: <a href="mailto:shawn@crestsalessuite.com" className="text-[#4cc458] hover:underline">shawn@crestsalessuite.com</a></p>
                <p>Website: <a href="https://crestsalessuite.com" className="text-[#4cc458] hover:underline">crestsalessuite.com</a></p>
              </div>
            </div>
          </div>
        </section>
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-sm">© 2026 Crest Sales Suite. All rights reserved. QuoteVault™ is a trademark of Crest Sales Suite.</p>
          <a href="/" className="text-[#4cc458] text-sm hover:underline mt-2 inline-block">← Back to QuoteVault</a>
        </div>
      </div>
    </main>
  );
}
