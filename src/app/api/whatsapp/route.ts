import { NextResponse } from 'next/server';
import { getWAClient, getWAStatus, disconnectWA } from '@/lib/whatsapp';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'start') {
    getWAClient();
    return NextResponse.json({ message: 'Initialization triggered' });
  }

  else if (action === 'status') {
    return NextResponse.json(getWAStatus());
  }

  else if (action === 'disconnect') {
    await disconnectWA();
    return NextResponse.json({ message: 'Disconnected' });
  }

  return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
}
