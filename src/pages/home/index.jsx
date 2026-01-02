import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Head from 'next/head';

// Verifique se a porta é exatamente a mesma do seu Backend
const API_URL = "http://localhost:8000";

const XPrive = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sitesList, setSitesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);

  // Função de busca encapsulada para evitar loops
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sites`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error("Erro na resposta do servidor");
      const data = await response.json();
      setSitesList(data);
    } catch (error) {
      console.error("Erro ao carregar sites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Animação GSAP refinada
  useEffect(() => {
    if (!loading && sitesList.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.site-card', 
          { opacity: 0, scale: 0.9, y: 30 },
          { 
            duration: 0.6, 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            stagger: 0.05, 
            ease: "back.out(1.7)" 
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [sitesList, loading]);

  const handleAddSite = async (e) => {
    e.preventDefault();
    if (!newSiteName || !newSiteUrl) return;

    let formattedUrl = newSiteUrl.includes('://') ? newSiteUrl : `https://${newSiteUrl}`;
    
    try {
      const response = await fetch(`${API_URL}/sites`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: newSiteName, url: formattedUrl }),
      });
      
      if (response.ok) {
        const addedSite = await response.json();
        setSitesList(prev => [addedSite, ...prev]);
        setNewSiteName('');
        setNewSiteUrl('');
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.detail || "Falha ao salvar"}`);
      }
    } catch (error) {
      alert("Não foi possível conectar ao servidor. O Backend está ligado?");
    }
  };

  const removeSite = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sites/${id}`, { 
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        gsap.to(`#card-${id}`, {
          duration: 0.4,
          opacity: 0,
          scale: 0.8,
          y: -20,
          onComplete: () => setSitesList(prev => prev.filter(s => s.id !== id))
        });
      }
    } catch (error) {
      alert("Erro ao deletar do banco");
    }
  };

  const filteredSites = sitesList.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08090a] text-slate-200 selection:bg-indigo-500/40">
      <Head>
        <title>X-Prive | Premium Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&family=Outfit:wght@400;600;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .main-gradient { background: radial-gradient(circle at 50% -20%, #1e1b4b 0%, #08090a 65%); }
        .card-blur {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-blur:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
        }
      `}</style>

      <div className="main-gradient min-h-screen pb-20">
        <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto">
          <div className="font-outfit text-3xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
            X-PRIVE
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <span>Novo Link</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </button>
        </nav>

        <main className="max-w-6xl mx-auto px-6 mt-16">
          <section className="text-center mb-16">
            <h2 className="font-outfit text-5xl md:text-7xl font-black mb-10 tracking-tight">
              Sua Web <span className="text-indigo-500">Privada</span>
            </h2>
            
            <div className="max-w-2xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Pesquisar atalhos ou buscar no Google..." 
                className="w-full bg-[#0f1115] border border-white/10 rounded-2xl py-5 px-14 outline-none text-lg focus:border-indigo-500/50 transition-all shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && window.open(`https://google.com/search?q=${searchQuery}`, '_blank')}
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
            </div>
          ) : (
            <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredSites.map((site) => (
                <div key={site.id} id={`card-${site.id}`} className="site-card group relative">
                  <a 
                    href={site.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-blur h-40 rounded-[2rem] flex flex-col items-center justify-center p-4 text-center"
                  >
                    <img 
                      src={`https://www.google.com/s2/favicons?sz=128&domain=${site.url}`} 
                      alt="" 
                      className="w-12 h-12 mb-3 rounded-xl shadow-lg transition-transform group-hover:scale-110"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${site.name}&background=6366f1&color=fff`}
                    />
                    <h3 className="font-medium text-sm tracking-wide truncate w-full px-2">{site.name}</h3>
                  </a>
                  
                  <button 
                    onClick={() => removeSite(site.id)}
                    className="absolute -top-2 -right-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setModalOpen(false)} />
            <div className="relative bg-[#0f1115] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl scale-in-center">
              <h2 className="font-outfit text-2xl font-bold mb-6">Adicionar Atalho</h2>
              <form onSubmit={handleAddSite} className="space-y-5">
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-indigo-500"
                  placeholder="Nome do Site"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-indigo-500"
                  placeholder="URL (ex: github.com)"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                  Salvar Portal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XPrive;