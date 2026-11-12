import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  // 1. Estados locais para armazenar o nome e o e-mail digitados
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  // 2. Função disparada ao enviar o formulário
  function handleSubmit(e) {
    e.preventDefault();

    // Validação simples dos campos
    if (!nome.trim() || !email.trim()) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    // 3. Criação do objeto de usuário com um ID exclusivo baseado na data/hora
    const usuario = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim()
    };

    // 4. Salva a sessão do usuário no localStorage do navegador
    localStorage.setItem('streambox:user', JSON.stringify(usuario));

    // 5. Notifica o componente pai sobre o sucesso do login
    onLoginSuccess(usuario);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414', color: '#FFF', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho com Logotipo */}
      <header style={{ padding: '20px 50px', backgroundColor: '#000' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#E50914' }}>
          STREAM<span style={{ color: '#FFF' }}>BOX</span>
        </div>
      </header>

      {/* Formulário de Login */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', padding: '50px', borderRadius: '8px', width: '100%', maxWidth: '420px', border: '1px solid #333' }}>
          <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Entrar no Sistema</h2>

          {/* Mensagem de Erro */}
          {erro && (
            <div style={{ backgroundColor: '#E50914', color: '#FFF', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
              {erro}
            </div>
          )}

          {/* Campo Nome */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#AAA', fontSize: '0.9rem' }}>Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              style={{ width: '100%', padding: '14px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#FFF', fontSize: '1rem' }}
            />
          </div>

          {/* Campo E-mail */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#AAA', fontSize: '0.9rem' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              style={{ width: '100%', padding: '14px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#FFF', fontSize: '1rem' }}
            />
          </div>

          {/* Botão de Envio */}
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#E50914', color: '#FFF', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            Acessar Catálogo
          </button>
        </form>
      </main>
    </div>
  );
}