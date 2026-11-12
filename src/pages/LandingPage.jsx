// 1. Importamos o React e os ícones necessários do lucide-react
import React from 'react';
import { ArrowRight } from 'lucide-react';

// 2. EXPORT DEFAULT: Essa palavra "default" é OBRIGATÓRIA para permitir que
// o main.jsx importe o componente como "import LandingPage from './pages/LandingPage'"
export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414', color: '#FFF' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', backgroundColor: '#000' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#E50914', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          STREAM<span style={{ color: '#FFF' }}>BOX</span>
        </div>
        <button onClick={() => onNavigate('login')} style={{ backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Entrar
        </button>
      </header>

      <main style={{ textAlign: 'center', padding: '120px 20px 60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '20px 0', fontWeight: '800' }}>
          Filmes, séries e muito mais, sem limites.
        </h1>
        <p style={{ fontSize: '1.4rem', color: '#AAA', marginBottom: '40px' }}>
          Assista onde quiser. Cancele quando quiser.
        </p>
        <button onClick={() => onNavigate('login')} style={{ backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '16px 32px', fontSize: '1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          Começar agora <ArrowRight size={22} />
        </button>
      </main>
    </div>
  );
}