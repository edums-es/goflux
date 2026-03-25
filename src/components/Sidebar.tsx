'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Blocks, Image, UserPlus, MessageCircle, Settings, Edit3 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand mb-3">
        <div className="logo">⚡</div>
        <div className="text">n8nDash v2</div>
      </div>

      <div className="side-section-label">Principal</div>
      <div className="side-nav vstack gap-1">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>
          <Layout size={18} /> <span>Dashboards</span>
        </Link>
        <Link href="/widgets" className={pathname === '/widgets' ? 'active' : ''}>
          <Blocks size={18} /> <span>Widget Library</span>
        </Link>
      </div>

      <div className="side-section-label">Automações</div>
      <div className="side-nav vstack gap-1">
        <Link href="/automacoes/posts" className={pathname === '/automacoes/posts' ? 'active' : ''}>
          <Image size={18} /> <span>Posts Redes Sociais</span>
        </Link>
        <Link href="/automacoes/cadastro" className={pathname === '/automacoes/cadastro' ? 'active' : ''}>
          <UserPlus size={18} /> <span>Cadastro de Cliente</span>
        </Link>
        <Link href="/automacoes/whatsapp" className={pathname === '/automacoes/whatsapp' ? 'active' : ''}>
          <MessageCircle size={18} /> <span>WhatsApp</span>
        </Link>
      </div>

      <div className="side-section-label">Sistema</div>
      <div className="side-nav vstack gap-1">
        <Link href="/settings" className={pathname === '/settings' ? 'active' : ''}>
          <Settings size={18} /> <span>Settings</span>
        </Link>
      </div>

      <div className="mt-auto pt-3 small text-secondary">
        Drag in <b>Edit Mode</b>. Layout &amp; widget configs saved to localStorage.
      </div>
    </aside>
  );
}
