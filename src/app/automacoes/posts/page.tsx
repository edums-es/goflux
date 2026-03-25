'use client';

import { useState } from 'react';
import { Search, List, Sparkles, Send, Edit3, Image as ImageIcon } from 'lucide-react';

export default function PostsPage() {
  const [nicho, setNicho] = useState('');
  const [cliente, setCliente] = useState('');
  const [tom, setTom] = useState('educativo e descontraído');
  const [qtd, setQtd] = useState('5');
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [pubFeedback, setPubFeedback] = useState<{type: 'success' | 'error' | 'warning', msg: string} | null>(null);

  const generateThemes = async () => {
    if (!nicho) {
      setErrorMsg('Preencha o nicho!');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTopics([]);
    
    try {
      const res = await fetch('/api/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-themes',
          payload: { cliente_id: cliente || 'dashboard', nicho, tom_de_voz: tom, quantidade_temas: parseInt(qtd) }
        })
      });
      
      const data = await res.json();
      const temas = data.temas || data.topics || (Array.isArray(data) ? data : null);
      if (temas && Array.isArray(temas)) {
        setTopics(temas);
      } else {
        setErrorMsg('Formato de resposta inesperado do n8n.');
      }
    } catch (err) {
      setErrorMsg('Erro de rede ou proxy indisponível.');
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (t: any) => {
    const leg = t.legenda_instagram || t.caption || t.conteudo_final?.legenda_final || t.titulo || '';
    setCaption(leg);
    alert('Legenda copiada para o campo de post!');
  };

  const publishPost = async () => {
    if (!imageUrl || !caption) {
      setPubFeedback({ type: 'warning', msg: 'URL da imagem e Legenda são obrigatórios.' });
      return;
    }
    
    setPublishing(true);
    setPubFeedback(null);
    
    try {
      const res = await fetch('/api/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish-post',
          payload: { image_url: imageUrl, caption }
        })
      });
      
      if (res.ok) {
        setPubFeedback({ type: 'success', msg: '✓ Post enviado para publicação!' });
        setImageUrl('');
        setCaption('');
      } else {
        setPubFeedback({ type: 'error', msg: `Erro ${res.status} ao publicar.` });
      }
    } catch (err) {
      setPubFeedback({ type: 'error', msg: 'Erro de rede ou proxy.' });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="page active" id="page-posts">
      <div className="toolbar">
        <div>
          <h3 className="mb-0 flex items-center gap-2"><ImageIcon size={24} /> Posts — Redes Sociais</h3>
          <div className="text-secondary small">Geração automática de conteúdo via agentes n8n (Webhooks ocultos)</div>
        </div>
      </div>

      <div className="posts-page mt-4">
        {/* Webhooks config removed from frontend for security */}
        <div className="alert alert-info small" style={{background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#bae6fd'}}>
          A visualização das URLs de webhook foi removida. Configure-as no backend Next.js `process.env`.
        </div>

        <div className="row g-3">
          <div className="col-lg-5">
            <div className="post-form-card h-100">
              <h6><Search size={18} /> Gerar Temas para Carrosséis</h6>
              <div className="row g-2">
                <div className="col-12">
                  <label className="form-label small mb-1">Cliente / ID</label>
                  <input value={cliente} onChange={e => setCliente(e.target.value)} type="text" className="form-control form-control-sm" placeholder="Ex: Clínica Silva..." />
                </div>
                <div className="col-12">
                  <label className="form-label small mb-1">Nicho</label>
                  <input value={nicho} onChange={e => setNicho(e.target.value)} type="text" className="form-control form-control-sm" placeholder="Ex: nutrição esportiva..." />
                </div>
                <div className="col-md-7">
                  <label className="form-label small mb-1">Tom de Voz</label>
                  <select value={tom} onChange={e => setTom(e.target.value)} className="form-select form-select-sm">
                    <option value="educativo e descontraído">Educativo e Descontraído</option>
                    <option value="profissional e sério">Profissional e Sério</option>
                    <option value="inspiracional">Inspiracional</option>
                    <option value="divertido e informal">Divertido e Informal</option>
                    <option value="técnico e informativo">Técnico e Informativo</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label small mb-1">Qtd. de Temas</label>
                  <select value={qtd} onChange={e => setQtd(e.target.value)} className="form-select form-select-sm">
                    <option value="3">3 temas</option>
                    <option value="5">5 temas</option>
                    <option value="7">7 temas</option>
                    <option value="10">10 temas</option>
                  </select>
                </div>
                {errorMsg && <div className="col-12 text-danger small mt-2">{errorMsg}</div>}
                <div className="col-12 mt-3">
                  <button onClick={generateThemes} disabled={loading} className="btn btn-accent w-100">
                    <Sparkles size={16} /> <span>{loading ? 'Processando...' : 'Gerar Temas com IA'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="post-form-card h-100">
              <h6><List size={18} /> Temas Sugeridos pelos Agentes</h6>
              <div>
                {topics.length === 0 ? (
                  <div className="post-result-area empty">
                    {loading ? '⏳ Agentes pesquisando temas...' : 'Os temas gerados pelos agentes aparecerão aqui.'}
                  </div>
                ) : (
                  <div className="post-topics-list">
                    {topics.map((t, idx) => (
                      <div key={idx} className="topic-item" onClick={() => copyCaption(t)}>
                        <div>
                          <div className="font-semibold text-sm">{t.titulo || t.title || t.tema || `Tema ${idx + 1}`}</div>
                          <div className="text-secondary" style={{ fontSize: '11px' }}>{t.formato || t.format || ''}</div>
                        </div>
                        <span className="topic-score">{t.score_engajamento || t.score || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        {/* Citar Post Manual */}
        <div className="post-form-card">
          <h6><Edit3 size={18} /> Criar Post Manual para Instagram</h6>
          <div className="row g-2">
            <div className="col-md-5">
              <label className="form-label small mb-1">URL da Imagem / Arte</label>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} type="text" className="form-control form-control-sm" placeholder="https://..." />
            </div>
            <div className="col-md-5">
              <label className="form-label small mb-1">Legenda</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} className="form-control form-control-sm" rows={2} placeholder="Legenda do post..."></textarea>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button onClick={publishPost} disabled={publishing} className="btn btn-accent w-100 h-full flex items-center justify-center py-2 h-[42px]">
                <Send size={16} /> <span>{publishing ? 'Enviando...' : 'Publicar'}</span>
              </button>
            </div>
            {pubFeedback && (
              <div className={`col-12 mt-2 p-2 rounded text-sm ${pubFeedback.type === 'success' ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                {pubFeedback.msg}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
