import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';

// We store the instances in a global object so they survive HMR during Next.js local dev
declare global {
  var waClient: Client | undefined;
  var waStatus: 'DISCONNECTED' | 'QR_READY' | 'AUTHENTICATED' | 'READY' | 'INITIALIZING';
  var waQrCodeDataUrl: string | null;
}

if (typeof global.waStatus === 'undefined') {
  global.waStatus = 'DISCONNECTED';
  global.waQrCodeDataUrl = null;
}

export const getWAClient = () => {
  if (!global.waClient) {
    global.waStatus = 'INITIALIZING';
    
    global.waClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      }
    });

    global.waClient.on('qr', async (qr) => {
      console.log('QR Code Refreshed');
      global.waStatus = 'QR_READY';
      global.waQrCodeDataUrl = await qrcode.toDataURL(qr, { margin: 2, scaße: 8 } as any);
    });

    global.waClient.on('ready', () => {
      console.log('WhatsApp is ready!');
      global.waStatus = 'READY';
      global.waQrCodeDataUrl = null;
    });

    global.waClient.on('authenticated', () => {
      console.log('WhatsApp Authenticated!');
      global.waStatus = 'AUTHENTICATED';
    });

    global.waClient.on('disconnected', (reason) => {
      console.log('WhatsApp Disconnected', reason);
      global.waStatus = 'DISCONNECTED';
      global.waQrCodeDataUrl = null;
      global.waClient?.destroy();
      global.waClient = undefined;
    });

    // Start it
    global.waClient.initialize().catch(err => {
      console.error('Failed to initialize WhatsApp Client', err);
      global.waStatus = 'DISCONNECTED';
    });
  }

  return global.waClient;
};

export const getWAStatus = () => {
  return {
    status: global.waStatus,
    qrCode: global.waQrCodeDataUrl
  };
};

export const disconnectWA = async () => {
  if (global.waClient) {
    await global.waClient.destroy();
    global.waClient = undefined;
    global.waStatus = 'DISCONNECTED';
    global.waQrCodeDataUrl = null;
  }
};
