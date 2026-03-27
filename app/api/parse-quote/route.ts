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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Send to Claude for parsing
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
              text: `You are parsing a supplier quote PDF. Extract the following information and return it as JSON only, no other text:

{
  "quoteNumber": "the quote/order number",
  "quoteDate": "date of the quote formatted as Month DD, YYYY",
  "expiryDate": "expiry date formatted as Month DD, YYYY",
  "salesRep": "sales rep name",
  "contact": "customer contact name",
  "contactPhone": "contact phone number",
  "customer": "customer/company name",
  "invoiceAddress": "full invoice address on one line",
  "deliveryAddress": "full delivery address on one line",
  "projectName": "project name or job site name if present",
  "sections": [
    {"name": "section name", "amount": "$X,XXX.XX"}
  ],
  "subtotal": "$XXX,XXX.XX",
  "salesTax": "$X,XXX.XX", 
  "total": "$XXX,XXX.XX",
  "exclusions": ["list", "of", "excluded", "items"],
  "supplierName": "name of the supplier/company issuing the quote",
  "supplierPhone": "supplier phone number",
  "supplierAddress": "supplier address"
}

For sections, look for section subtotals or category totals. Include all sections with their dollar amounts. If a section has no dollar amount, use "—".
For exclusions, look for any items explicitly listed as not included.
Return ONLY valid JSON, nothing else.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the JSON response
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