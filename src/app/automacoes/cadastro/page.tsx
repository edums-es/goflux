'use client';

import { useState } from 'react';
import { UserPlus, Send, Settings } from 'lucide-react';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [billing, setBilling] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [feedback, setFeedback] = useState<{type: 'success' | 'error' | 'warning', messages: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  // Masks
  const applyCpfCnpjMask = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 11) {
      return digits.replace(/^(\d{3})(\d)/, '$1.$2')
                   .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
                   .replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})/, '$1-$2');
    }
    return digits.replace(/^(\d{2})(\d)/, '$1.$2')
                 .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
                 .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2')
                 .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d{1,2})/, '$1-$2');
  };

  const applyPhoneMask = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  const handleSubmit = async () => {
    const errors: string[] = [];
    const cleanCpf = cpfCnpj.replace(/\D/g, '');
    const cleanPhone = phone.replace(/\D/g, '');
    const numValue = parseFloat(value);

    if (!name) errors.push('Nome é obrigatório.');
    if (!cleanCpf || (cleanCpf.length !== 11 && cleanCpf.length !== 14)) errors.push('CPF ou CNPJ inválido.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido.');
    if (!billing) errors.push('Forma de pagamento é obrigatória.');
    if (isNaN(numValue) || numValue <= 0) errors.push('Valor deve ser maior que zero.');
    if (!dueDate) errors.push('Data de vencimento é obrigatória.');

    if (errors.length) {
      setFeedback({ type: 'warning', messages: errors });
      return;
    }

    setLoading(true);
    setFeedback({ type: 'warning', messages: ['Enviando...'] });

    const payload: any = { name, cpfCnpj: cleanCpf, email, billingType: billing, value: numValue, dueDate };
    if (cleanPhone) payload.mobilePhone = cleanPhone;

    try {
      const res = await fetch('/api/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-client', payload })
      });

      if (res.ok) {
        setFeedback({ type: 'success', messages: ['✓ Cliente cadastrado com sucesso!'] });
        setName(''); setCpfCnpj(''); setEmail(''); setPhone(''); setValue(''); setDueDate(''); setBilling('');
      } else {
        setFeedback({ type: 'error', messages: [`Erro ${res.status} ao comunicar com o servidor.`] });
      }
    } catch (err) {
      setFeedback({ type: 'error', messages: ['Erro de rede ao enviar o cadastro.'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="page-cadastro">
      <div className="toolbar">
        <div>
          <h3 className="mb-0 flex items-center gap-2">👤 Cadastro de Cliente</h3>
          <div className="text-secondary small">Cadastre clientes e gere cobranças via backend Next.js seguro</div>
        </div>
      </div>

      <div className="cadastro-page" style={{ maxWidth: '900px' }}>
        <div className="cadastro-standalone">
          <div className="head flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--line)', background: 'linear-gradient(180deg, rgba(255,255,255,.02),transparent)'}}>
            <div className="title flex items-center gap-2">
              <div className="icon bg-white/5 p-2 rounded"><UserPlus size={20} /></div>
              <span className="font-semibold text-lg">Novo Cadastro</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge-main text-xs px-2 py-1 rounded-full">App Seguro</span>
            </div>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div className="row g-2 mb-2">
              <div className="col-12"><div className="small text-secondary mb-1">Dados do Cliente</div></div>
              <div className="col-md-5">
                <label className="form-label small mb-1">Nome <span className="text-danger">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control form-control-sm" placeholder="Nome completo" />
              </div>
              <div className="col-md-4">
                <label className="form-label small mb-1">CPF / CNPJ <span className="text-danger">*</span></label>
                <input value={cpfCnpj} onChange={e => setCpfCnpj(applyCpfCnpjMask(e.target.value))} type="text" className="form-control form-control-sm" placeholder="000.000.000-00" maxLength={18} />
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-1">Celular</label>
                <input value={phone} onChange={e => setPhone(applyPhoneMask(e.target.value))} type="text" className="form-control form-control-sm" placeholder="(00) 00000-0000" maxLength={15} />
              </div>
              <div className="col-md-5">
                <label className="form-label small mb-1">E-mail <span className="text-danger">*</span></label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control form-control-sm" placeholder="cliente@exemplo.com" />
              </div>

              <div className="col-12 mt-4"><div className="divider"></div><div className="small text-secondary mb-1">Dados da Cobrança</div></div>
              
              <div className="col-md-4">
                <label className="form-label small mb-1">Forma de Pagamento <span className="text-danger">*</span></label>
                <select value={billing} onChange={e => setBilling(e.target.value)} className="form-select form-select-sm">
                  <option value="">Selecione…</option>
                  <option value="BOLETO">BOLETO</option>
                  <option value="PIX">PIX</option>
                  <option value="CREDIT_CARD">CREDIT_CARD</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-1">Valor (R$) <span className="text-danger">*</span></label>
                <input value={value} onChange={e => setValue(e.target.value)} type="number" className="form-control form-control-sm" placeholder="0.00" min="0.01" step="0.01" />
              </div>
              <div className="col-md-3">
                <label className="form-label small mb-1">Vencimento <span className="text-danger">*</span></label>
                <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" className="form-control form-control-sm" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button onClick={handleSubmit} disabled={loading} className="btn btn-accent btn-pill w-100 h-full flex items-center justify-center gap-2 py-2 h-[42px]">
                  <Send size={16} /> <span>{loading ? 'Enviando...' : 'Cadastrar'}</span>
                </button>
              </div>
            </div>
            
            {feedback && (
              <div className={`mt-3 p-3 rounded text-sm ${feedback.type === 'success' ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                {feedback.messages.map((ms, i) => <div key={i}>{ms}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
