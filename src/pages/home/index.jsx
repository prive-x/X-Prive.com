import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import gsap from 'gsap';
import Head from 'next/head';

const firebaseConfig = {
  apiKey: 'AIzaSyCHMuTsq6KHAG6zJfw01LBHbwluSGJMMvM',
  authDomain: 'unifyhub-2fedc.firebaseapp.com',
  projectId: 'unifyhub-2fedc',
  storageBucket: 'unifyhub-2fedc.firebasestorage.app',
  messagingSenderId: '70946410932',
  appId: '1:70946410932:web:61e66db07eb273c4fc62e1',
  measurementId: 'G-220W75C40Z',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const XPrive = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sitesList, setSitesList] = useState([]);

  useEffect(() => {
    async function loadSitesFromFirebase() {
      const container = document.getElementById('button-container');
      container.innerHTML = ''; // limpa antes de adicionar
      const querySnapshot = await getDocs(collection(db, 'sites'));
      const sitesArr = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sitesArr.push({ name: data.name, url: data.url });
      });
      sitesArr.reverse(); // mais recentes primeiro
      setSitesList(sitesArr);
      sitesArr.forEach((site) => createButton(site.name, site.url));
      animateButtons();
    }

    function createButton(name, url) {
      const container = document.getElementById('button-container');
      const linkButton = document.createElement('a');
      linkButton.className = 'button-link';
      linkButton.href = url;
      linkButton.target = '_blank';
      linkButton.textContent = name;
      container.appendChild(linkButton);
    }

    function animateButtons() {
      gsap.from('.button-link', {
        duration: 1,
        opacity: 0,
        y: 30,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }

    loadSitesFromFirebase();
  }, []);

  const handleAddSite = () => {
    if (newSiteName && newSiteUrl) {
      const newSite = { name: newSiteName, url: newSiteUrl };
      setSitesList([newSite, ...sitesList]);
      createButton(newSiteName, newSiteUrl);
      setNewSiteName('');
      setNewSiteUrl('');
      setModalOpen(false);
    }
  };

  const createButton = (name, url) => {
    const container = document.getElementById('button-container');
    const linkButton = document.createElement('a');
    linkButton.className = 'button-link';
    linkButton.href = url;
    linkButton.target = '_blank';
    linkButton.textContent = name;
    container.prepend(linkButton); // adiciona no topo
    gsap.from(linkButton, { duration: 0.8, opacity: 0, y: 20 });
  };

  const handleGoogleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6a11cb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </Head>

      <div style={{ width: '100%', maxWidth: '900px' }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #fff; padding: 1rem; display: flex; justify-content: center; min-height: 100vh; }

          .header {
            text-align: center;
            font-size: clamp(2rem, 6vw, 3rem);
            font-weight: bold;
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(45deg, #ff7e5f, #feb47b, #6a11cb, #2575fc);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 5s ease infinite;
            letter-spacing: 0.2rem;
            margin-bottom: 0.5rem;
          }

          .divider {
            width: 120px;
            height: 5px;
            margin: 0 auto 2rem auto;
            border-radius: 50px;
            background: linear-gradient(90deg, #ff7e5f, #feb47b, #6a11cb, #2575fc);
            background-size: 300% 300%;
            animation: gradient 5s ease infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .carousel-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            width: 100%;
            max-width: 900px;
            padding: 0.5rem;
          }

          .button-link {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 120px;
            text-align: center;
            border: none;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: none;
            background: linear-gradient(135deg, #ff7e5f, #feb47b);
            color: #fff;
            box-shadow: 0 6px 14px rgba(0,0,0,0.4);
            transition: transform 0.25s ease, background 0.25s ease;
            font-size: clamp(1rem, 2.5vw, 1.2rem);
            letter-spacing: 0.05rem;
          }

          .button-link:hover {
            transform: translateY(-5px) scale(1.03);
            background: linear-gradient(135deg, #feb47b, #ff7e5f);
          }

          @media (max-width: 600px) {
            .carousel-container { grid-template-columns: 1fr; }
            .button-link { min-height: 100px; font-size: 1.1rem; }
          }

          .modal-bg {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .modal-content {
            background: #1f1f1f;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            z-index: 10000;
          }

          .modal-content input {
            width: 100%;
            padding: 0.8rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            border: 1px solid #333;
            background: #121212;
            color: #fff;
          }

          .modal-content button {
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            background: #2575fc;
            color: #fff;
            font-weight: bold;
          }

          .top-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .top-bar form {
            display: flex;
            gap: 0.5rem;
            flex: 1;
          }

          .top-bar form input {
            flex: 1;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: 1px solid #333;
            background: #121212;
            color: #fff;
          }

          .top-bar form button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            background: #ff7e5f;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
          }

          .top-bar button.publish-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            background: #6a11cb;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            margin-left: auto;
          }
        `}</style>

        <div className="header">X-Prive</div>
        <div className="divider"></div>

        <div className="top-bar">
          <form onSubmit={handleGoogleSearch}>
            <input
              type="text"
              placeholder="Pesquisar no Google..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Pesquisar</button>
          </form>

          <button className="publish-btn" onClick={() => setModalOpen(true)}>
            Publicar Site
          </button>
        </div>

        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Adicionar Novo Site</h3>
              <input
                type="text"
                placeholder="Nome do site"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL do site"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
              />
              <button onClick={handleAddSite}>Adicionar</button>
            </div>
          </div>
        )}

        <div className="carousel-container" id="button-container">
          {/* Botões carregados pelo JS */}
        </div>
      </div>
    </>
  );
};

export default XPrive;
