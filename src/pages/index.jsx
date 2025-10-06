import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Head from 'next/head';

const SECRET = '24250@Ln';

export default function PasswordGate() {
  const [value, setValue] = useState('');
  const [matched, setMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (containerRef.current) {
      gsap.from(containerRef.current, { duration: 0.8, opacity: 0, y: 20, ease: 'power3.out' });
    }
  }, []);

  useEffect(() => {
    if (value === SECRET) {
      setMatched(true);
      setLoading(true);
      gsap.to(inputRef.current, { duration: 0.25, scale: 1.02, boxShadow: '0 8px 28px rgba(0,0,0,0.6)' });
      setTimeout(() => {
        window.location.href = `/home`;
      }, 500);
    } else {
      setMatched(false);
      setLoading(false);
    }
  }, [value]);

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

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212', padding: '1rem' }}>
        <style>{`
          * { box-sizing: border-box; }
          .card {
            width: 100%;
            max-width: 480px;
            background: rgba(255,255,255,0.03);
            border-radius: 14px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.04);
          }
          .title {
            text-align: center;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: clamp(1.5rem, 4vw, 2rem);
            background: linear-gradient(45deg, #ff7e5f, #feb47b, #6a11cb, #2575fc);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 5s ease infinite;
            margin-bottom: 0.6rem;
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .input-wrap {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            justify-content: center;
          }
          input.password {
            width: 100%;
            padding: 0.95rem 1rem;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.02);
            color: #fff;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease;
          }
          input.password:focus {
            border-color: rgba(255,255,255,0.18);
            box-shadow: 0 6px 18px rgba(0,0,0,0.5);
            transform: translateY(-2px);
          }
          input.password.match {
            border-color: #4ade80;
            box-shadow: 0 10px 30px rgba(34,197,94,0.12);
          }
          .loading {
            margin-top: 1rem;
            text-align: center;
            color: #fff;
          }
        `}</style>

        <div className="card" ref={containerRef}>
          <div className="title">X-Prive</div>

          <div className="input-wrap">
            <input
              ref={inputRef}
              className={`password ${matched ? 'match' : ''}`}
              type="password"
              placeholder="Digite a senha"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {loading && <div className="loading">Carregando...</div>}
        </div>
      </div>
    </>
  );
}
