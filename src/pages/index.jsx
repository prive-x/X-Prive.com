import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Head from 'next/head';

const SECRET = '24250@Ln';

export default function PasswordGate() {
  const [value, setValue] = useState('');
  const [matched, setMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    gsap.fromTo(cardRef.current, 
      { opacity: 0, scale: 0.9, y: 40 },
      { duration: 1.2, opacity: 1, scale: 1, y: 0, ease: 'expo.out' }
    );
  }, []);

  useEffect(() => {
    if (value === SECRET) {
      setMatched(true);
      setLoading(true);
      
      gsap.to(cardRef.current, { 
        duration: 0.4, 
        borderColor: 'rgba(74, 222, 128, 0.5)',
        boxShadow: '0 0 50px rgba(74, 222, 128, 0.15)' 
      });

      setTimeout(() => {
        window.location.href = `/home`;
      }, 700);
    } else if (value.length >= SECRET.length && value !== SECRET) {
      gsap.to(cardRef.current, {
        duration: 0.1,
        x: 8,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
        onComplete: () => gsap.to(cardRef.current, { x: 0 })
      });
    }
  }, [value]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden relative font-['Outfit']">
      <Head>
        <title>X-Prive | Secure Access</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
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

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={cardRef}
        className="relative w-full max-w-[420px] px-8 py-12 mx-4 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl text-center z-10"
      >
        <div className={`mx-auto w-16 h-16 mb-8 flex items-center justify-center rounded-2xl border transition-all duration-500 ${
          matched 
          ? 'bg-green-500/20 border-green-500/40 text-green-400' 
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
        }`}>
          {matched ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">X-PRIVE</h1>
        <p className="text-slate-400 text-sm mb-10 tracking-wide uppercase">Terminal de Acesso Seguro</p>

        <div className="relative">
          <input
            ref={inputRef}
            type="password"
            placeholder="••••••••"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full bg-black/40 border ${
              matched ? 'border-green-500/50 text-green-400' : 'border-white/10 text-white'
            } rounded-2xl py-4 px-6 text-center text-2xl tracking-[0.5em] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-white/10`}
          />
        </div>

        <div className="mt-8 h-6 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-green-400 text-sm font-medium">Autenticado</span>
            </div>
          ) : (
            value.length > 0 && (
              <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] animate-pulse">Verificando</span>
            )
          )}
        </div>
      </div>

      <div className="absolute bottom-8 text-white/10 text-[10px] tracking-[0.4em] uppercase">Encrypted Session v2.0</div>
    </div>
  );
}