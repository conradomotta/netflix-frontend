// 1. Importamos o React e os hooks para controle de estado e efeito
import React, { useState, useEffect } from 'react';

// 2. Importamos os ícones do lucide-react para botões e detalhes
import { Search, Plus, Star, Pencil, Trash2, LogOut } from 'lucide-react';

// 3. Importamos as funções de busca da nossa API (src/api.js)
import { getTrending, searchMovies, getCatalog, createMovie, updateMovie, deleteMovie, poster } from '../api';

export default function Dashboard({ user, onLogout }) {
  // Estados para armazenar os filmes em alta do TMDB e o catálogo local do SQLite
  const [trending, setTrending] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para o formulário de cadastro/edição no SQLite local
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({ titulo: '', categoria: '', ano: new Date().getFullYear() });

  // Função para buscar os filmes locais gravados no SQLite
  async function loadCatalogData() {
    try {
      const data = await getCatalog();
      setCatalog(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar catálogo local do SQLite.');
    }
  }

  // Effect para buscar os filmes em alta do TMDB assim que a tela abre
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        // Chama a rota /tmdb/em-alta do nosso backend Node.js
        const trendingData = await getTrending();
        setTrending(trendingData.results || []);
        await loadCatalogData();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Effect para busca em tempo real quando o usuário digita na caixa de pesquisa
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(query.trim());
        setSearchResults(res.results || []);
      } catch (err) {
        setError(err.message);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Função para cadastrar ou editar filme no SQLite local
  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, ano: Number(form.ano) };
      if (editingMovie) {
        await updateMovie(editingMovie.id, payload);
      } else {
        await createMovie(payload);
      }
      setShowForm(false);
      setEditingMovie(null);
      setForm({ titulo: '', categoria: '', ano: new Date().getFullYear() });
      await loadCatalogData();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  }

  // Função para excluir filme do banco SQLite
  async function handleDelete(id, titulo) {
    if (!window.confirm(`Deseja realmente excluir "${titulo}" do SQLite?`)) return;
    try {
      await deleteMovie(id);
      await loadCatalogData();
    } catch (err) {
      alert(`Erro ao excluir: ${err.message}`);
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414', color: '#FFF' }}>
      {/* 1. Header com identificação do usuário e ID */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: '#000' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#E50914' }}>
          STREAM<span style={{ color: '#FFF' }}>BOX</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>
            Olá, <strong>{user?.nome || 'Usuário'}</strong> (ID: <code style={{ color: '#E50914' }}>{user?.id}</code>)
          </span>
          <button onClick={onLogout} style={{ backgroundColor: '#333', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '30px 50px' }}>
        {/* 2. Campo de busca por nome */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', backgroundColor: '#222', padding: '12px 20px', borderRadius: '6px', maxWidth: '500px' }}>
          <Search size={20} color="#AAA" style={{ marginRight: '10px' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes no TMDB..."
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#FFF', outline: 'none', fontSize: '1rem' }}
          />
        </div>

        {error && <div style={{ backgroundColor: '#E50914', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

        {/* 3. Mosaico de Resultados da Busca */}
        {query.trim() && (
          <section style={{ marginBottom: '50px' }}>
            <h2>Resultados para "{query}"</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {searchResults.map((m) => (
                <div key={m.id} style={{ backgroundColor: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                  <img src={poster(m.poster_path) || 'https://via.placeholder.com/500x750?text=Sem+Capa'} alt={m.title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                  <div style={{ padding: '10px' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{m.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#AAA' }}>{m.release_date?.slice(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Grade dos Filmes em Alta (TMDB API) */}
        {!query.trim() && (
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🔥 Filmes em Alta na Semana (TMDB API)</h2>
            {loading ? (
              <p>Carregando filmes em alta do TMDB...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {trending.map((m) => (
                  <div key={m.id} style={{ backgroundColor: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                    <img src={poster(m.poster_path) || 'https://via.placeholder.com/500x750?text=Sem+Capa'} alt={m.title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                    <div style={{ padding: '12px' }}>
                      <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>{m.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#FFD700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#FFD700" /> {m.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 5. Tabela do Catálogo Local em SQLite */}
        <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>📦 Seu Catálogo Local (SQLite)</h2>
              <p style={{ color: '#AAA', fontSize: '0.9rem' }}>Gerencie os filmes salvos no banco de dados do seu servidor Node.js.</p>
            </div>
            <button
              onClick={() => {
                setEditingMovie(null);
                setForm({ titulo: '', categoria: '', ano: new Date().getFullYear() });
                setShowForm(!showForm);
              }}
              style={{ backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Novo Filme
            </button>
          </div>

          {/* Form de Inclusão/Edição SQLite */}
          {showForm && (
            <form onSubmit={handleFormSubmit} style={{ backgroundColor: '#2A2A2A', padding: '20px', borderRadius: '6px', marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px' }}>{editingMovie ? 'Editar Filme' : 'Adicionar Filme ao SQLite'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Título do Filme"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  style={{ padding: '10px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#FFF' }}
                />
                <input
                  type="text"
                  placeholder="Categoria (ex: Ação)"
                  required
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  style={{ padding: '10px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#FFF' }}
                />
                <input
                  type="number"
                  placeholder="Ano"
                  required
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                  style={{ padding: '10px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: '#FFF' }}
                />
              </div>
              <button type="submit" style={{ backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {editingMovie ? 'Salvar Alterações' : 'Cadastrar no Banco'}
              </button>
            </form>
          )}

          {/* Tabela de Filmes SQLite */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333', color: '#AAA' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>TÍTULO</th>
                  <th style={{ padding: '12px' }}>CATEGORIA</th>
                  <th style={{ padding: '12px' }}>ANO</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <td style={{ padding: '12px', color: '#E50914', fontWeight: 'bold' }}>#{item.id}</td>
                    <td style={{ padding: '12px' }}>{item.titulo}</td>
                    <td style={{ padding: '12px' }}>{item.categoria}</td>
                    <td style={{ padding: '12px' }}>{item.ano}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setEditingMovie(item);
                          setForm({ titulo: item.titulo, categoria: item.categoria, ano: item.ano });
                          setShowForm(true);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#AAA', cursor: 'pointer', marginRight: '12px' }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.titulo)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#E50914', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {catalog.length === 0 && <p style={{ padding: '20px', color: '#AAA', textAlign: 'center' }}>Nenhum filme cadastrado no banco SQLite local.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}