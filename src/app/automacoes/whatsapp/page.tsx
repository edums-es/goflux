'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, PowerOff } from 'lucide-react';
import Image from 'next/image';

export default function WhatsAppPage() {
  const [status, setStatus] = useState<string>('DISCONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp?action=status');
      const data = await res.json();
      setStatus(data.status);
      setQrCode(data.qrCode);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 3 seconds for updates
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    await fetch('/api/whatsapp?action=start');
    await fetchStatus();
    setLoading(false);
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await fetch('/api/whatsapp?action=disconnect');
    await fetchStatus();
    setLoading(false);
  };

  return (
    <div className="page active" id="page-whatsapp">
      <div className="toolbar">
        <div>
          <h3 className="mb-0 flex items-center gap-2"><MessageCircle size={24} /> WhatsApp Connection</h3>
          <div className="text-secondary small">Conecte seu WhatsApp para habilitar integrações usando whatsapp-web.js</div>
        </div>
      </div>

      <div className="mt-4" style={{ maxWidth: '600px' }}>
        <div className="post-form-card">
          <div className="flex items-center justify-between mb-4">
            <h6 className="mb-0"><MessageCircle size={18} /> Status da Conexão</h6>
            <div className="d-flex items-center gap-2">
              {status === 'READY' && <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Conectado</span>}
              {status === 'INITIALIZING' && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">Inicializando...</span>}
              {status === 'QR_READY' && <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">Aguardando Leitura</span>}
              {status === 'DISCONNECTED' && <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">Desconectado</span>}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5 min-h-[300px]">
            {status === 'DISCONNECTED' && (
              <div className="text-center">
                <p className="text-secondary mb-4 text-sm">Nenhuma sessão ativa encontrada. Clique abaixo para iniciar uma nova sessão e gerar o QR Code.</p>
                <button onClick={handleStart} disabled={loading} className="btn btn-accent btn-pill">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Iniciando...' : 'Gerar QR Code'}
                </button>
              </div>
            )}

            {status === 'INITIALIZING' && (
              <div className="text-center">
                <div className="spinner-border text-accent mb-3" style={{ width: '2rem', height: '2rem' }}></div>
                <p className="text-secondary text-sm">O navegador invisível está sendo iniciado...</p>
                <p className="text-muted text-xs">Pode demorar alguns segundos.</p>
              </div>
            )}

            {status === 'QR_READY' && qrCode && (
              <div className="text-center">
                <p className="text-sm mb-3">Escaneie o QR Code abaixo com o seu WhatsApp (Aparelhos Conectados):</p>
                <div className="p-3 bg-white rounded-xl inline-block mb-4 shadow-xl">
                  <Image src={qrCode} alt="WhatsApp QR Code" width={240} height={240} />
                </div>
                <div>
                  <button onClick={handleDisconnect} className="btn btn-soft text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {status === 'READY' && (
              <div className="text-center">
                <div className="bg-green-500/10 p-4 rounded-full inline-block mb-3">
                  <MessageCircle size={48} className="text-green-500" />
                </div>
                <h5 className="text-white">WhatsApp Pronto!</h5>
                <p className="text-secondary text-sm mb-4">Sua conta está conectada e pronta para automações.</p>
                <button onClick={handleDisconnect} disabled={loading} className="btn btn-soft text-danger hover:bg-red-500/10 hover:border-red-500/30">
                  <PowerOff size={16} /> Desconectar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
