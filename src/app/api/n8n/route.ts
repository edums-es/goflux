import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    let targetUrl = '';
    
    // Instead of passing webhooks via frontend, we hide them in Environment Variables.
    // For local dev, you can set these in a .env.local file.
    switch (action) {
      case 'generate-themes':
        targetUrl = process.env.N8N_WEBHOOK_THEMES || 'http://localhost:5678/webhook/gerar-carrossel';
        break;
      case 'publish-post':
        targetUrl = process.env.N8N_WEBHOOK_PUBLISH || 'http://localhost:5678/webhook/publicar';
        break;
      case 'create-client':
        targetUrl = process.env.N8N_WEBHOOK_CADASTRO || 'http://localhost:5678/webhook/cadastro';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action provided' }, { status: 400 });
    }

    const n8nResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.N8N_API_KEY}` // You can add auth here securely
      },
      body: JSON.stringify(payload),
    });

    const dataText = await n8nResponse.text();
    let data;
    try {
      data = JSON.parse(dataText);
    } catch {
      data = dataText;
    }

    return NextResponse.json(data, { status: n8nResponse.status });
  } catch (error: any) {
    console.error('N8N Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with n8n backend' }, { status: 500 });
  }
}
