import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `You are an expert at reading supplier quotes from the building materials and construction industry. Your job is to extract key information and produce a clean customer-facing summary that hides all line-item details, quantities, unit prices, and product codes.

Analyze this quote PDF carefully and return ONLY a JSON object with no other text, markdown, or code fences.

INSTRUCTIONS:
1. Find the supplier/company name, address, and phone number
2. Find the quote number, quote date, expiry date
3. Find the customer name, contact name, contact phone
4. Find the invoice address and delivery address
5. Find the project/job name if present
6. Find the sales rep name
7. For the sections array: 
   - If the quote has clear sections with subtotals (like "End of FOUNDATION $2,343.73"), use those exact sections
   - If the quote has NO clear sections (flat list of line items), identify the TOP 5-6 largest dollar amount line items or allowances and list them as category names with their amounts. Group similar items together and give them a descriptive category name (e.g. "Roof Trusses Allowance", "Decking Materials", "Framing Lumber", "Hardware & Connectors", "Pressure Treated Materials", "Subfloor Materials"). Do NOT show product codes or specific item descriptions.
8. Find the subtotal (before tax), sales tax amount, and grand total
9. Find any exclusions or items explicitly noted as not included
10. For the quoteType field: use "sectioned" if the quote has clear sections, or "flat" if it's a flat line item list

Return this exact JSON structure:
{
  "supplierName": "the PRIMARY company name only - if there are two logos or company names, use just the first/main one. Keep it short and clean.",
  "supplierAddress": "supplier address on one line",
  "supplierPhone": "supplier phone number",
  "quoteNumber": "quote/order number",
  "quoteDate": "formatted as Month DD, YYYY",
  "expiryDate": "formatted as Month DD, YYYY",
  "salesRep": "sales rep name",
  "contact": "customer contact name",
  "contactPhone": "contact phone number",
  "customer": "customer or company name",
  "invoiceAddress": "full invoice/bill-to address on one line",
  "deliveryAddress": "full ship-to/delivery address on one line",
  "projectName": "project or job name if present, otherwise empty string",
  "quoteType": "sectioned or flat",
  "sections": [
    {"name": "descriptive category name", "amount": "$X,XXX.XX"}
  ],
  "subtotal": "$XX,XXX.XX",
  "salesTax": "$X,XXX.XX",
  "total": "$XX,XXX.XX",
  "exclusions": ["list", "of", "excluded", "items"],
  "terms": "any return policy, validity terms, or special conditions noted at the bottom of the quote. If none found, use: Prices for in-stock items are valid for 7 days. Special-order materials may be subject to price adjustments due to applicable tariffs at time of shipment.",
  "terms": "any return policy, validity terms, or special conditions noted at the bottom of the quote. If none found, use: Prices for in-stock items are valid for 7 days. Special-order materials may be subject to price adjustments due to applicable tariffs at time of shipment."
}

IMPORTANT: Return ONLY the JSON object. No markdown, no code fences, no explanation.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const cleaned = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error parsing quote:', error);
    return NextResponse.json(
      { error: 'Failed to parse quote: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
