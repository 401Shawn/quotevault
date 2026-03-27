'use client';
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
interface QuoteSection { name: string; amount: string; }
interface ParsedQuote { quoteNumber: string; quoteDate: string; expiryDate: string; salesRep: string; contact: string; contactPhone: string; customer: string; invoiceAddress: string; deliveryAddress: string; projectName: string; sections: QuoteSection[]; subtotal: string; salesTax: string; total: string; exclusions: string[]; supplierName: string; supplierPhone: string; supplierAddress: string; }
export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [parsedQuote, setParsedQuote] = useState<ParsedQuote | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) { setError('Please upload a PDF file.'); return; }
    setError(''); setParsedQuote(null); setFileName(file.name); setIsProcessing(true); setProcessingStep('Uploading PDF...');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      setProcessingStep('Reading quote with AI...');
      const response = await fetch('/api/parse-quote', { method: 'POST', body: formData });
      setProcessingStep('Parsing quote data...');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to parse quote');
      setParsedQuote(data);
    } catch (err) { setError('Failed to parse quote: ' + (err as Error).message); }
    finally { setIsProcessing(false); }
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); };
  const generatePDF = () => {
    if (!parsedQuote) return;
    const d = parsedQuote;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const W = 612, ML = 46, MT = 40, CW = W - ML - 46;
    const RED: [number,number,number] = [178,34,34], DARK: [number,number,number] = [28,28,28], MID: [number,number,number] = [85,85,85], LIGHT: [number,number,number] = [232,228,222], CREAM: [number,number,number] = [247,244,240], WHITE: [number,number,number] = [255,255,255];
    let y = MT;
    doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(...RED);
    doc.text(d.supplierName||'Quote Summary', ML, y+24);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...MID);
    if(d.supplierAddress) doc.text(d.supplierAddress, ML, y+40);
    if(d.supplierPhone) doc.text(d.supplierPhone, ML, y+52);
    const bX=W-46-108,bY=y,bW=108,bH=72;
    doc.setFillColor(...RED); doc.roundedRect(bX,bY,bW,bH,4,4,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...WHITE);
    doc.text('QUOTATION',bX+bW/2,bY+22,{align:'center'});
    doc.setFontSize(17); doc.text('#'+d.quoteNumber,bX+bW/2,bY+50,{align:'center'});
    y+=MT+70;
    doc.setDrawColor(...RED); doc.setLineWidth(1.5); doc.line(ML,y,W-46,y); y+=14;
    const dfs=[[['Quote Date',d.quoteDate||'—'],['Expiry Date',d.expiryDate||'—'],['Sales Rep',d.salesRep||'—']],[['Customer',d.customer||'—'],['Contact',d.contact||'—'],['Phone',d.contactPhone||'—']]];
    const cw=CW/3;
    dfs.forEach((row,ri)=>{
      doc.setFillColor(...CREAM); doc.rect(ML,y,CW,38,'F');
      if(ri===0){doc.setDrawColor(...LIGHT);doc.setLineWidth(.5);doc.line(ML,y+38,ML+CW,y+38);}
      row.forEach((f,ci)=>{ const fx=ML+ci*cw+8; doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(160,160,160);doc.text(f[0].toUpperCase(),fx,y+13); doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.setTextColor(...DARK);doc.text(String(f[1]),fx,y+27); }); y+=38;
    }); y+=12;
    const hw=CW/2;
    doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(160,160,160);
    doc.text('INVOICE ADDRESS',ML+8,y);doc.text('DELIVERY ADDRESS',ML+hw+8,y);y+=11;
    doc.setFontSize(8.5);doc.setTextColor(...DARK);
    const iLines=doc.splitTextToSize(d.invoiceAddress||'—',hw-20);
    const dLines=doc.splitTextToSize((d.deliveryAddress||'—')+(d.projectName?'\n'+d.projectName:''),hw-20);
    iLines.forEach((l:string,i:number)=>doc.text(l,ML+8,y+i*12));
    dLines.forEach((l:string,i:number)=>doc.text(l,ML+hw+8,y+i*12));
    doc.setDrawColor(...LIGHT);doc.setLineWidth(.5);doc.line(ML+hw,y-4,ML+hw,y+36);
    y+=48; doc.line(ML,y,W-46,y); y+=14;
    doc.setFillColor(...DARK);doc.rect(ML,y,CW,22,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(...WHITE);
    doc.text('SCOPE OF WORK - MATERIAL CATEGORIES',ML+8,y+14.5);y+=30;
    d.sections.forEach((s,i)=>{ doc.setFillColor(i%2===0?255:247,i%2===0?255:244,i%2===0?255:240); doc.rect(ML,y,CW,20,'F'); doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...DARK);doc.text(s.name,ML+10,y+13); doc.setFont('helvetica','bold'); const isDash=s.amount==='—'; doc.setTextColor(isDash?180:RED[0],isDash?180:RED[1],isDash?180:RED[2]); doc.text(s.amount,W-46-10,y+13,{align:'right'});y+=20; });
    doc.setDrawColor(...LIGHT);doc.setLineWidth(.5);doc.line(ML,y,W-46,y);y+=14;
    if(d.exclusions&&d.exclusions.length>0){ doc.setFillColor(...DARK);doc.rect(ML,y,CW,22,'F'); doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(...WHITE); doc.text('EXCLUSIONS - NOT INCLUDED IN THIS QUOTE',ML+8,y+14.5);y+=28; const ec=[d.exclusions.slice(0,Math.ceil(d.exclusions.length/2)),d.exclusions.slice(Math.ceil(d.exclusions.length/2))]; const er=Math.max(ec[0].length,ec[1].length); doc.setFillColor(...CREAM);doc.rect(ML,y,CW,er*16+8,'F'); doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...DARK); ec.forEach((col,ci)=>col.forEach((item,ri)=>doc.text('- '+item,ML+ci*(CW/2)+14,y+14+ri*16))); y+=er*16+18; }
    doc.setFillColor(...WHITE);doc.setDrawColor(...LIGHT);doc.setLineWidth(.5); doc.rect(ML,y,CW,24,'FD'); doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...MID);doc.text('Materials Subtotal',W-46-120,y+15.5,{align:'right'}); doc.setFont('helvetica','bold');doc.setTextColor(...DARK);doc.text(d.subtotal||'—',W-46-10,y+15.5,{align:'right'});y+=24;
    doc.setFillColor(...CREAM);doc.rect(ML,y,CW,24,'FD'); doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...MID);doc.text('Sales Tax',W-46-120,y+15.5,{align:'right'}); doc.setFont('helvetica','bold');doc.setTextColor(...DARK);doc.text(d.salesTax||'—',W-46-10,y+15.5,{align:'right'});y+=24;
    doc.setFillColor(...RED);doc.roundedRect(ML,y,CW,38,4,4,'F'); doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(...WHITE);doc.text('QUOTE TOTAL',W-46-130,y+23,{align:'right'}); doc.setFontSize(20);doc.text(d.total||'—',W-46-10,y+25,{align:'right'});y+=50;
    doc.setFillColor(255,248,231);doc.setDrawColor(232,200,74);doc.setLineWidth(.5);doc.roundedRect(ML,y,CW,36,3,3,'FD');
    const notice='Pricing Notice: Prices for in-stock items are valid for 7 days. Special-order materials may be subject to price adjustments due to applicable tariffs at time of shipment.';
    const nl=doc.splitTextToSize(notice,CW-20); doc.setFont('helvetica','italic');doc.setFontSize(7.5);doc.setTextColor(...MID);doc.text(nl,ML+10,y+13);y+=46;
    doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(...MID);
    doc.text('Buyer Signature: ___________________________________',ML,y+12); doc.text('Date: _____________________',ML+330,y+12);y+=24;
    doc.setDrawColor(...RED);doc.setLineWidth(1.2);doc.line(ML,y,W-46,y);y+=10;
    doc.setFont('helvetica','normal');doc.setFontSize(6.8);doc.setTextColor(150,150,150);
    const ft=doc.splitTextToSize("This is an estimate only. The total represents only those materials listed.",CW);
    doc.text(ft,W/2,y,{align:'center'});y+=ft.length*9+4;
    doc.text((d.supplierName||'Supplier')+'  -  quotevault.app',W/2,y,{align:'center'});
    doc.save('Quote_Summary_'+(d.quoteNumber||'export')+'.pdf');
  };
  const reset = () => { setParsedQuote(null); setError(''); setFileName(''); if(fileInputRef.current) fileInputRef.current.value=''; };
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="bg-[#1A1A1A] border-b-2 border-[#B22222] px-6 py-3 flex items-center justify-between">
        <div className="font-black text-lg tracking-widest uppercase">Quote<span className="text-[#B22222]">Vault</span></div>
        <div className="text-xs text-gray-500 tracking-widest uppercase">Crest Sales Suite</div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-[#C4952A] mb-3">Protect Your Takeoff</div>
          <h1 className="text-4xl font-black mb-4 leading-tight">Upload any quote.<br/><span className="text-[#B22222]">Lock the details.</span></h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">Drop in any supplier quote PDF and get a clean summary — no line items exposed.</p>
        </div>
        {error&&<div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-red-300 text-sm">{error}</div>}
        {!isProcessing&&!parsedQuote&&(
          <label className={`block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all mb-8 ${isDragging?'border-[#B22222] bg-red-900/10':'border-gray-700 hover:border-[#B22222] hover:bg-red-900/5'}`} onDragOver={(e)=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onDrop={handleDrop}>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e)=>{const f=e.target.files?.[0];if(f)handleFile(f);}}/>
            <div className="w-14 h-14 bg-[#B22222] rounded-full flex items-center justify-center mx-auto mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/></svg></div>
            <div className="text-lg font-bold mb-2">Click to select your quote PDF</div>
            <div className="text-gray-500 text-sm mb-6">or drag and drop it here</div>
            <span className="inline-block bg-[#B22222] text-white font-bold text-sm px-6 py-3 rounded-lg uppercase tracking-widest">Browse for PDF</span>
          </label>
        )}
        {isProcessing&&(<div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-10 text-center mb-8"><div className="w-10 h-10 border-2 border-gray-700 border-t-[#B22222] rounded-full animate-spin mx-auto mb-4"/><div className="font-bold tracking-widest uppercase text-sm text-gray-400 mb-1">Processing Quote</div><div className="text-gray-600 text-sm">{processingStep}</div></div>)}
        {parsedQuote&&(
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="bg-[#1C1C1C] px-6 py-4 flex items-center gap-3 border-b border-gray-800">
              <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
              <div><div className="font-bold text-sm">Quote Parsed Successfully</div><div className="text-gray-500 text-xs">{fileName}</div></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{label:'Quote #',value:'#'+parsedQuote.quoteNumber},{label:'Quote Date',value:parsedQuote.quoteDate},{label:'Expiry Date',value:parsedQuote.expiryDate},{label:'Customer',value:parsedQuote.customer},{label:'Sales Rep',value:parsedQuote.salesRep},{label:'Contact',value:parsedQuote.contact}].map(f=>(<div key={f.label} className="bg-[#0F0F0F] rounded-lg p-3 border-l-2 border-[#B22222]"><div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{f.label}</div><div className="font-bold text-sm">{f.value||'—'}</div></div>))}
              </div>
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Scope of Work</div>
                {parsedQuote.sections.map((s,i)=>(<div key={i} className="flex justify-between py-2 border-b border-gray-800 text-sm last:border-0"><span className="text-gray-300">{s.name}</span><span className={`font-bold ${s.amount==='—'?'text-gray-600':'text-[#B22222]'}`}>{s.amount}</span></div>))}
              </div>
              <div className="bg-[#B22222] rounded-lg p-4 flex justify-between items-center mb-6"><div className="font-bold uppercase tracking-wider text-sm">Quote Total (incl. tax)</div><div className="font-black text-2xl">{parsedQuote.total||'—'}</div></div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={generatePDF} className="bg-[#B22222] hover:bg-[#8B1A1A] text-white font-bold text-sm px-6 py-3 rounded-lg uppercase tracking-widest transition-all flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/></svg>Download Summary PDF</button>
                <button onClick={reset} className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-bold text-sm px-6 py-3 rounded-lg uppercase tracking-widest transition-all">Upload Another</button>
              </div>
            </div>
          </div>
        )}
        {!parsedQuote&&!isProcessing&&(<div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-gray-800">{[{num:'01',title:'Upload Any Quote',desc:'Drop in any supplier PDF - BisTrack, CDK, or any format.'},{num:'02',title:'AI Parses It',desc:'Claude AI reads the quote and extracts all the key data.'},{num:'03',title:'Download Summary',desc:'Get a branded PDF with totals only - no line items exposed.'}].map(s=>(<div key={s.num} className="border-l-2 border-gray-800 pl-4"><div className="text-3xl font-black text-gray-800 leading-none mb-2">{s.num}</div><div className="font-bold text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>))}</div>)}
      </div>
    </main>
  );
}
