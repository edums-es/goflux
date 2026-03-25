'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw, Save, Undo2, Edit3, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [theme, setTheme] = useState('ocean');
  const [editMode, setEditMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('nd.theme');
    if (savedTheme) {
      document.body.classList.remove('theme-ocean', 'theme-emerald', 'theme-orchid', 'theme-citrus');
      document.body.classList.add(`theme-${savedTheme}`);
      setTheme(savedTheme);
    }
  }, []);

  const changeTheme = (t: string) => {
    document.body.classList.remove('theme-ocean', 'theme-emerald', 'theme-orchid', 'theme-citrus');
    document.body.classList.add(`theme-${t}`);
    localStorage.setItem('nd.theme', t);
    setTheme(t);
  };

  const isDash = pathname === '/';

  const pageLabels: Record<string, string> = {
    '/': 'Executive Metrics',
    '/automacoes/posts': 'Posts — Redes Sociais',
    '/automacoes/cadastro': 'Cadastro de Cliente',
    '/automacoes/whatsapp': 'WhatsApp',
    '/widgets': 'Widget Library',
    '/settings': 'Settings'
  };

  return (
    <header className="header">
      <div className="d-flex align-items-center gap-2">
        <span className="chip">Demo — Frontend-only</span>
        <span className="text-secondary small">{pageLabels[pathname] || ''}</span>
      </div>
      <div className="right">
        <div className="dropdown">
          <button className="btn btn-soft dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="theme-dot" style={{ background: 'var(--accent)' }}></span> Theme
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li><button className="dropdown-item" onClick={() => changeTheme('ocean')}><span className="theme-dot" style={{ background: '#0ea5e9' }}></span> Ocean</button></li>
            <li><button className="dropdown-item" onClick={() => changeTheme('emerald')}><span className="theme-dot" style={{ background: '#22c55e' }}></span> Emerald</button></li>
            <li><button className="dropdown-item" onClick={() => changeTheme('orchid')}><span className="theme-dot" style={{ background: '#a855f7' }}></span> Orchid</button></li>
            <li><button className="dropdown-item" onClick={() => changeTheme('citrus')}><span className="theme-dot" style={{ background: '#f59e0b' }}></span> Citrus</button></li>
          </ul>
        </div>
        
        {isDash && (
          <>
            <button className="btn btn-accent btn-pill" onClick={() => setEditMode(!editMode)}>
              {editMode ? <><Check size={16} /> Done</> : <><Edit3 size={16} /> Edit Mode</>}
            </button>
            <button className="btn btn-soft"><RefreshCcw size={16} /> Run Selected</button>
            <button className="btn btn-soft"><Save size={16} /> Save Layout</button>
            <button className="btn btn-soft"><Undo2 size={16} /> Reset</button>
          </>
        )}
      </div>
    </header>
  );
}
