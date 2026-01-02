import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import Head from 'next/head';


const API_URL = "http://localhost:8000";

const XPrive = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sitesList, setSitesList] = useState([]);
  
  const containerRef = useRef(null);

 
  const fetchSites = async () => {
    try {
      const response = await fetch(`${API_URL}/sites`);
      const data = await response.json();
      setSitesList(data);
    } catch (error) {
      console.error("Erro ao carregar sites do banco:", error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.site-card', 
        { opacity: 0, scale: 0.8, y: 20 },
        { duration: 0.5, opacity: 1, scale: 1, y: 0, stagger: 0.08, ease: "elastic.out(1, 0.75)" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [sitesList]);

  const handleAddSite = async (e) => {
    e.preventDefault();
    if (newSiteName && newSiteUrl) {
      let formattedUrl = newSiteUrl.includes('://') ? newSiteUrl : `https://${newSiteUrl}`;
      
      try {
        const response = await fetch(`${API_URL}/sites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSiteName, url: formattedUrl }),
        });
        
        if (response.ok) {
          const addedSite = await response.json();
          setSitesList([addedSite, ...sitesList]);
          setNewSiteName('');
          setNewSiteUrl('');
          setModalOpen(false);
        }
      } catch (error) {
        alert("Erro ao conectar com a API");
      }
    }
  };

  
  const removeSite = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sites/${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        gsap.to(`#card-${id}`, {
          duration: 0.3,
          opacity: 0,
          scale: 0.5,
          onComplete: () => setSitesList(sitesList.filter(s => s.id !== id))
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
        .main-gradient { background: radial-gradient(circle at 50% -20%, #221a4d 0%, #08090a 60%); }
        .card-blur {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-blur:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .search-glow:focus-within {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.5);
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #08090a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>

      <div className="main-gradient min-h-screen pb-20">
        <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          <div className="font-outfit text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
            X-PRIVE.
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="group relative flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300 active:scale-95"
          >
            <span>Publicar</span>
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          </button>
        </nav>

        <main className="max-w-6xl mx-auto px-6 mt-12">
          <section className="text-center mb-20">
            <h2 className="font-outfit text-4xl md:text-6xl font-black mb-8 leading-tight">
              Onde vamos <span className="text-indigo-500 text-glow">explorar</span> hoje?
            </h2>
            
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden search-glow">
                <div className="pl-6 text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Pesquise seus atalhos..." 
                  className="w-full bg-transparent py-5 px-4 outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && window.open(`https://google.com/search?q=${searchQuery}`, '_blank')}
                />
              </div>
            </div>
          </section>

          <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSites.map((site) => (
              <div key={site.id} id={`card-${site.id}`} className="site-card group relative">
                <a 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="card-blur h-48 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <img 
                      src={`https://www.google.com/s2/favicons?sz=128&domain=${site.url}`} 
                      alt="" 
                      className="w-full h-full object-contain relative z-10 grayscale-[0.5] group-hover:grayscale-0 transition-all"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${site.name}&background=random`}
                    />
                  </div>
                  <h3 className="font-outfit font-semibold text-lg tracking-tight truncate w-full">{site.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Acessar Link</p>
                </a>
                
                <button 
                  onClick={() => removeSite(site.id)}
                  className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </main>

        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setModalOpen(false)} />
            <div className="relative bg-[#12141c] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
              <h2 className="font-outfit text-3xl font-bold mb-2">Novo Portal</h2>
              <form onSubmit={handleAddSite} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-indigo-400 ml-2">Título do Site</label>
                  <input
                    autoFocus
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ex: Minha Dashboard"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-indigo-400 ml-2">Endereço URL</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="dominio.com"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95">
                    Confirmar Adição
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XPrive;