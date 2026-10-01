import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Compass, 
  Cpu, 
  Send, 
  X, 
  Zap, 
  PhoneCall, 
  Layers,
  ChevronRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const manifestoRef = useRef(null);
  const protocolContainerRef = useRef(null);

  // Modal State for "Demander un devis"
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteOrigin, setQuoteOrigin] = useState('Plateau');
  const [quoteDestination, setQuoteDestination] = useState('Almadies');
  const [quotePackageType, setQuotePackageType] = useState('Document / Pli Confidentiel');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // --- CARTE 1 : MÉLANGEUR DIAGNOSTIQUE STATE ---
  const [diagnosticSteps, setDiagnosticSteps] = useState([
    {
      id: 1,
      badge: "PHASE 01 • COLLECTE",
      title: "Prise en charge sous 15 min",
      zone: "Plateau / Zone Industrielle",
      status: "Scellé inviolable actif",
      time: "T+15m"
    },
    {
      id: 2,
      badge: "PHASE 02 • DISPATCH VDN",
      title: "Couloir express fluide",
      zone: "Corniche Ouest / Voie Rapide",
      status: "Capteurs télémétrie OK",
      time: "T+48m"
    },
    {
      id: 3,
      badge: "PHASE 03 • DÉNOUEMENT",
      title: "Remise certifiée en mains propres",
      zone: "Almadies / Ngor / Fann",
      status: "Signature biométrique",
      time: "T+112m"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDiagnosticSteps(prev => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // --- CARTE 2 : MACHINE À ÉCRIRE TÉLÉMÉTRIE STATE ---
  const telemetryLogs = [
    "[08:42:01] Capteur #DK-802 : Balise GPS verrouillée sur VDN Nord (14.7392° N, 17.5134° W)",
    "[08:42:09] Télémétrie : Température caisson stabilisée à 21.2°C • Vitesse constante 48 km/h",
    "[08:42:18] Algorithme : Contournement embouteillage détecté via échangeur Patte d'Oie (-14 min)",
    "[08:42:27] Sécurité : Scellé numérique intact • Arrivée confirmée dans 18 minutes chrono"
  ];
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let charIndex = 0;
    const currentFull = telemetryLogs[currentLogIndex];
    setTypedText("");

    const typingInterval = setInterval(() => {
      if (charIndex < currentFull.length) {
        setTypedText(currentFull.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentLogIndex((prev) => (prev + 1) % telemetryLogs.length);
        }, 2200);
      }
    }, 32);

    return () => clearInterval(typingInterval);
  }, [currentLogIndex]);

  // --- CARTE 3 : PLANIFICATEUR PROTOCOLE CURSEUR ---
  const [activeDay, setActiveDay] = useState('M');
  const [plannerSaved, setPlannerSaved] = useState(false);
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveDay(prev => {
        const idx = days.indexOf(prev);
        return days[(idx + 1) % days.length];
      });
      setPlannerSaved(true);
      setTimeout(() => setPlannerSaved(false), 900);
    }, 2800);
    return () => clearInterval(cycle);
  }, []);

  // --- GSAP CONTEXT LIFECYCLE ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Morphing Navbar on scroll
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
          className: 'nav-scrolled',
          targets: navRef.current
        }
      });

      // 2. Hero entrance fade-up staggered
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2
      });

      // 3. Manifesto Reveal animation
      gsap.from('.manifesto-text', {
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: 'top 75%',
        },
        y: 35,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 4. Stacking Sticky Cards for Protocol
      const cards = gsap.utils.toArray('.protocol-card');
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            endTrigger: protocolContainerRef.current,
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false,
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(card, {
                scale: 1 - progress * 0.08,
                filter: `blur(${progress * 16}px)`,
                opacity: 1 - progress * 0.45,
                duration: 0.1,
                ease: 'power2.inOut'
              });
            }
          });
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Price estimate calculation
  const calculatePrice = () => {
    let base = 2500;
    if (quoteOrigin !== quoteDestination) base += 1000;
    if (quotePackageType.includes('Médical')) base += 1500;
    return base.toLocaleString('fr-FR');
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-creme text-charbon overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* A. NAVBAR — "L'Île Flottante"                                  */}
      {/* ============================================================== */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          ref={navRef}
          className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-5 sm:px-8 py-3.5 rounded-full transition-all duration-500 bg-charbon/30 backdrop-blur-md border border-creme/20 text-creme shadow-lg [&.nav-scrolled]:bg-creme/85 [&.nav-scrolled]:text-charbon [&.nav-scrolled]:border-mousse/20 [&.nav-scrolled]:shadow-organic"
        >
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-argile animate-pulse"></span>
            <span className="font-bold tracking-tight text-lg sm:text-xl font-display">
              Livr<span className="text-argile">Express</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-mono">
            <a href="#fonctionnalites" className="interactive-lift hover:text-argile">Fonctionnalités</a>
            <a href="#manifeste" className="interactive-lift hover:text-argile">Manifeste</a>
            <a href="#protocole" className="interactive-lift hover:text-argile">Protocole</a>
            <a href="#tarifs" className="interactive-lift hover:text-argile">Tarifs</a>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="btn-magnetic bg-argile text-creme px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-accent-glow"
          >
            <span className="btn-slide-bg bg-mousse"></span>
            <span className="btn-content flex items-center gap-1.5">
              <span>Devis 2H</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </nav>
      </header>

      {/* ============================================================== */}
      {/* B. SECTION HERO — "Le Plan d'Ouverture"                        */}
      {/* ============================================================== */}
      <section
        ref={heroRef}
        className="relative h-[100dvh] w-full flex flex-col justify-end pb-16 sm:pb-24 px-6 md:px-16 lg:px-24 overflow-hidden"
      >
        {/* Full frame background image with heavy primary-to-black gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=80"
            alt="Ambiance Tech Organique - Forêt sombre et textures vivantes"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charbon-deep via-mousse-deep/85 to-mousse-dark/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-charbon-deep/90 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content pushed to bottom-left */}
        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Telemetry pill */}
          <div className="hero-anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-creme/10 backdrop-blur-md border border-creme/20 text-creme text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-argile animate-ping"></span>
            <span>DAKAR MÉTROPOLE • DISPATCH ACTIF EN 120 MIN</span>
          </div>

          {/* Preset Hero Title Pattern: "[Nom concept] est le" (Sans Gras) / "[Mot puissant]." (Serif Italique Massif) */}
          <div className="hero-anim">
            <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-creme font-sans">
              LivrExpress est le
            </p>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-editorial italic font-normal text-argile-light leading-none -mt-1 sm:-mt-3">
              Flux vital.
            </h1>
          </div>

          {/* Subtitle / Objective */}
          <p className="hero-anim text-creme/80 text-base sm:text-xl max-w-2xl font-normal leading-relaxed">
            L'infrastructure de livraison chirurgicale à Dakar. Vos plis critiques, colis stratégiques et commandes haute priorité remis en main propre en 2 heures chrono.
          </p>

          {/* CTA & Guarantees */}
          <div className="hero-anim flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="btn-magnetic bg-argile hover:bg-argile-hover text-creme px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase shadow-accent-glow"
            >
              <span className="btn-slide-bg bg-mousse-light"></span>
              <span className="btn-content flex items-center gap-3">
                <span>Demander un devis instantané</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            <a
              href="#fonctionnalites"
              className="btn-magnetic px-6 py-4 rounded-full text-creme text-sm font-medium border border-creme/30 backdrop-blur-sm hover:border-creme transition-colors"
            >
              <span className="btn-content">Explorer le système</span>
            </a>
          </div>

          {/* Micro Telemetry Bar */}
          <div className="hero-anim grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-creme/15 max-w-xl text-creme/70 font-mono text-xs">
            <div>
              <span className="block text-creme font-bold text-sm sm:text-base">120 MIN</span>
              Plafond temps garanti
            </div>
            <div>
              <span className="block text-creme font-bold text-sm sm:text-base">100% GPS</span>
              Monitoring en direct
            </div>
            <div>
              <span className="block text-creme font-bold text-sm sm:text-base">0 SURCOÛT</span>
              Transparence totale
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* C. FONCTIONNALITÉS — "Artefacts Fonctionnels Interactifs"       */}
      {/* ============================================================== */}
      <section id="fonctionnalites" className="py-28 px-6 md:px-16 lg:px-24 bg-creme relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="flex items-center gap-2 text-mousse font-mono text-xs uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-argile" />
              <span>Artefacts de Télémétrie Logistique</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-mousse font-sans">
              Trois piliers d'ingénierie opérationnelle.
            </h2>
            <p className="text-charbon/75 text-base sm:text-lg">
              Une technologie sur mesure pour dompter la congestion dakaroise et délivrer vos colis sans faille.
            </p>
          </div>

          {/* Three Functional Artifact Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CARTE 1 — "Mélangeur Diagnostique" (Argument 1: Livraison express 2h) */}
            <div className="bg-creme-card rounded-[2.5rem] p-7 border border-creme-border shadow-organic flex flex-col justify-between hover:shadow-organic-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-mousse/10 text-mousse text-xs font-mono">
                    CYCLE ACTIF • 3.2S
                  </span>
                  <Clock className="w-5 h-5 text-argile" />
                </div>
                <h3 className="text-xl font-bold text-mousse mb-2 font-sans">
                  Livraison Express en 2h Chrono
                </h3>
                <p className="text-sm text-charbon/70 mb-6">
                  Mécanisme d'ordonnancement séquentiel optimisant chaque segment urbain entre le départ et l'arrivée.
                </p>

                {/* Vertical stacked bouncing diagnostic cards */}
                <div className="relative h-56 w-full flex items-center justify-center overflow-hidden rounded-[1.75rem] bg-creme-subtle p-3">
                  {diagnosticSteps.map((step, idx) => {
                    // Elastic vertical bounce simulation
                    const offset = idx * 16;
                    const scale = 1 - idx * 0.05;
                    const opacity = 1 - idx * 0.25;
                    const zIndex = 30 - idx * 10;
                    return (
                      <div
                        key={step.id}
                        className="absolute inset-x-3 p-4 rounded-[1.5rem] bg-creme-card border border-mousse/15 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                          transform: `translateY(${offset}px) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex
                        }}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-argile font-bold mb-1">
                          <span>{step.badge}</span>
                          <span className="text-mousse">{step.time}</span>
                        </div>
                        <h4 className="font-bold text-mousse text-sm">{step.title}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-charbon/75 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-argile shrink-0" />
                          <span className="truncate">{step.zone}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-creme-border flex items-center justify-between text-[10px] text-charbon/60 font-mono">
                          <span>{step.status}</span>
                          <span className="text-emerald-700 font-bold">● VÉLITÉ MAX</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-creme-border flex items-center justify-between text-xs font-mono text-mousse">
                <span>Régulation : Plateau → Almadies</span>
                <span className="text-argile font-bold">120 MIN MAX</span>
              </div>
            </div>

            {/* CARTE 2 — "Machine à Écrire Télémétrie" (Argument 2: Suivi GPS en direct) */}
            <div className="bg-creme-card rounded-[2.5rem] p-7 border border-creme-border shadow-organic flex flex-col justify-between hover:shadow-organic-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                      Flux en Direct
                    </span>
                  </div>
                  <Radio className="w-5 h-5 text-argile animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-mousse mb-2 font-sans">
                  Suivi GPS en Direct & Sécurisé
                </h3>
                <p className="text-sm text-charbon/70 mb-6">
                  Télémétrie cinématique continue avec journalisation caractère par caractère du trajet de votre coursier.
                </p>

                {/* Monospace Live Telemetry Terminal */}
                <div className="h-56 w-full rounded-[1.75rem] bg-charbon-deep text-creme p-5 font-mono text-xs flex flex-col justify-between border border-mousse/40 shadow-inner">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-charbon-muted border-b border-charbon-surface pb-1.5">
                      <span>RADAR DAKAR_CORE v2.4</span>
                      <span className="text-argile">CRYPTÉ AES-256</span>
                    </div>
                    <div className="text-emerald-400 font-medium leading-relaxed min-h-[4rem]">
                      {typedText}
                      <span className="inline-block w-2 h-4 bg-argile ml-1 animate-pulse align-middle"></span>
                    </div>
                  </div>

                  <div className="bg-charbon-surface/80 p-2.5 rounded-xl border border-charbon/50 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-argile"></span>
                      <span>Coordonnées live</span>
                    </div>
                    <span className="text-creme font-bold">14.7167° N, 17.4677° W</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-creme-border flex items-center justify-between text-xs font-mono text-mousse">
                <span>Latence flux : 24ms</span>
                <span className="text-emerald-700 font-bold">SIGNAL OPTIMAL</span>
              </div>
            </div>

            {/* CARTE 3 — "Planificateur Protocole Curseur" (Argument 3: Tarification transparente) */}
            <div className="bg-creme-card rounded-[2.5rem] p-7 border border-creme-border shadow-organic flex flex-col justify-between hover:shadow-organic-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-argile/10 text-argile text-xs font-mono font-bold">
                    ZÉRO FRAIS CACHÉ
                  </span>
                  <Sparkles className="w-5 h-5 text-argile" />
                </div>
                <h3 className="text-xl font-bold text-mousse mb-2 font-sans">
                  Tarification Transparente
                </h3>
                <p className="text-sm text-charbon/70 mb-6">
                  Barème kilométrique prédictif sans supplément intempérie, trafic ou heure de pointe.
                </p>

                {/* Animated Weekly Grid with Automated Cursor */}
                <div className="relative h-56 w-full rounded-[1.75rem] bg-creme-subtle p-4 border border-mousse/10 flex flex-col justify-between overflow-hidden">
                  <div className="text-xs font-mono text-mousse font-bold flex items-center justify-between">
                    <span>DISPONIBILITÉ 7J/7</span>
                    <span className="text-argile">FORFAIT FIXE</span>
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1.5 my-auto">
                    {days.map((d, i) => {
                      const isSelected = d === activeDay;
                      return (
                        <div
                          key={i}
                          className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                            isSelected
                              ? 'bg-argile text-creme scale-105 shadow-md'
                              : 'bg-creme-card text-charbon border border-creme-border'
                          }`}
                        >
                          <span className="text-[10px] font-mono">{d}</span>
                          <span className="text-[8px] opacity-75">{dayNames[i].slice(0, 3)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Button that clicks */}
                  <div className="flex items-center justify-between bg-creme-card p-2.5 rounded-xl border border-mousse/15 text-xs">
                    <span className="text-charbon/80 font-medium">Course Urbaine Simple</span>
                    <span className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${plannerSaved ? 'bg-mousse text-creme scale-95' : 'bg-argile text-creme'}`}>
                      2 500 FCFA
                    </span>
                  </div>

                  {/* Simulated Animated Cursor */}
                  <div className="absolute top-1/2 left-1/2 pointer-events-none transition-all duration-700 -translate-x-4 -translate-y-1">
                    <svg className="w-6 h-6 text-charbon drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.259z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-creme-border flex items-center justify-between text-xs font-mono text-mousse">
                <span>Devis contractuel</span>
                <span className="text-argile font-bold">PRIX FIXÉ AVANT DÉPART</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* D. PHILOSOPHIE — "Le Manifeste"                                */}
      {/* ============================================================== */}
      <section
        id="manifeste"
        ref={manifestoRef}
        className="relative py-32 px-6 md:px-16 lg:px-24 bg-charbon-deep text-creme overflow-hidden"
      >
        {/* Parallax organic texture Unsplash image at low opacity */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=80"
            alt="Texture organique végétale de précision"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          {/* Label */}
          <div className="manifesto-text flex items-center gap-2 text-argile font-mono text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Le Manifeste Logistique</span>
          </div>

          {/* Contrasting Statement 1: Neutral / smaller */}
          <div className="manifesto-text max-w-2xl border-l-2 border-creme/25 pl-6">
            <p className="text-lg sm:text-xl text-creme/60 font-sans leading-relaxed">
              La plupart des services de livraison se concentrent sur : l'accumulation de volumes disparates, des tournées différées et des promesses d'horaires jamais respectées.
            </p>
          </div>

          {/* Contrasting Statement 2: Massive dramatic serif italic */}
          <div className="manifesto-text">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial italic font-normal text-creme leading-tight">
              Nous nous concentrons sur : la pulsation vitale de vos échanges, livrés en deux heures avec une{' '}
              <span className="text-argile underline decoration-argile/40 decoration-wavy underline-offset-8">
                précision chirurgicale
              </span>.
            </h2>
          </div>

          {/* Subtext signature */}
          <div className="manifesto-text grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-creme/10 text-xs font-mono text-creme/60">
            <div>
              <strong className="text-creme block text-sm font-sans mb-1">01. Équité de Temps</strong>
              Chaque minute épargnée est une valeur ajoutée réinjectée dans votre journée.
            </div>
            <div>
              <strong className="text-creme block text-sm font-sans mb-1">02. Sceau de Traçabilité</strong>
              Rien n'est laissé au hasard : preuve photographique, GPS et signature certifiée.
            </div>
            <div>
              <strong className="text-creme block text-sm font-sans mb-1">03. Ancrage Dakarois</strong>
              Une connaissance intime de chaque ruelle, rond-point et artère de la presqu'île.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* E. PROTOCOLE — "Archive Empilée Sticky"                        */}
      {/* ============================================================== */}
      <section id="protocole" ref={protocolContainerRef} className="relative bg-creme py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center gap-2 text-mousse font-mono text-xs uppercase tracking-widest mb-3">
            <Layers className="w-4 h-4 text-argile" />
            <span>Architecture Opérationnelle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-mousse font-sans">
            Le Protocole en 3 Actes.
          </h2>
          <p className="text-charbon/70 text-base sm:text-lg max-w-2xl mt-2">
            Faites défiler pour explorer la mécanique millimétrée qui propulse chaque colis vers sa destination.
          </p>
        </div>

        {/* Stacked Sticky Fullscreen Cards */}
        <div className="space-y-20 max-w-5xl mx-auto">
          
          {/* CARTE PROTOCOLE 1 : Motifs concentriques en rotation lente */}
          <div className="protocol-card min-h-[70vh] rounded-[3rem] bg-mousse text-creme p-8 sm:p-14 border border-mousse-light shadow-organic flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between border-b border-creme/15 pb-6">
              <span className="font-mono text-2xl font-bold text-argile">PROTOCOLE_01</span>
              <span className="font-mono text-xs tracking-widest uppercase bg-creme/10 px-3.5 py-1.5 rounded-full">
                INITIALISATION & ENLÈVEMENT
              </span>
            </div>

            <div className="relative z-10 my-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold font-sans mb-4">
                  Transmission Immédiate & Assignation Algorithmique
                </h3>
                <p className="text-creme/80 text-base leading-relaxed">
                  Dès la validation de votre demande, le coursier le plus proche est dérouté en moins de 90 secondes. Votre colis est scellé avec un identifiant unique infalsifiable.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-argile-light">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Délai d'enlèvement : 15 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Scellé numérique sécurisé</span>
                  </div>
                </div>
              </div>

              {/* Unique SVG Animation 1: Nested Concentric Circles Rotating */}
              <div className="flex items-center justify-center p-6">
                <svg className="w-64 h-64 animate-[spin_24s_linear_infinite]" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#CC5833" strokeWidth="1" strokeDasharray="6 6" opacity="0.6" />
                  <circle cx="100" cy="100" r="65" fill="none" stroke="#F2F0E9" strokeWidth="1.5" strokeDasharray="12 4" opacity="0.8" />
                  <circle cx="100" cy="100" r="45" fill="none" stroke="#CC5833" strokeWidth="2" opacity="0.9" />
                  <circle cx="100" cy="100" r="25" fill="none" stroke="#F2F0E9" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="8" fill="#CC5833" />
                  {/* Radials */}
                  <line x1="100" y1="15" x2="100" y2="185" stroke="#F2F0E9" strokeWidth="0.5" opacity="0.4" />
                  <line x1="15" y1="100" x2="185" y2="100" stroke="#F2F0E9" strokeWidth="0.5" opacity="0.4" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-creme/60 border-t border-creme/15 pt-4">
              <span>POINT D'ORIGINE : CENTRE COMMERCIAL / ENTREPRISE</span>
              <span className="text-argile font-bold">STATUT : EN COURS DE COLLECTE</span>
            </div>
          </div>

          {/* CARTE PROTOCOLE 2 : Balayage laser sur grille */}
          <div className="protocol-card min-h-[70vh] rounded-[3rem] bg-charbon-deep text-creme p-8 sm:p-14 border border-mousse/30 shadow-organic flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between border-b border-creme/15 pb-6">
              <span className="font-mono text-2xl font-bold text-argile">PROTOCOLE_02</span>
              <span className="font-mono text-xs tracking-widest uppercase bg-creme/10 px-3.5 py-1.5 rounded-full">
                MAILLAGE URBAIN & VÉLOCITÉ
              </span>
            </div>

            <div className="relative z-10 my-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold font-sans mb-4">
                  Trajectoire Active & Évitement des Ralentissements
                </h3>
                <p className="text-creme/80 text-base leading-relaxed">
                  Notre système de dispatch recalcule l'itinéraire en continu grâce aux données de trafic en temps réel sur la VDN, l'Autoroute de l'Avenir et les boulevards côtiers.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-argile-light">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Correction de route en continu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Zéro arrêt intermédiaire</span>
                  </div>
                </div>
              </div>

              {/* Unique SVG Animation 2: Laser Sweeping Line across Matrix Grid */}
              <div className="relative w-full h-56 rounded-2xl bg-charbon border border-mousse/30 overflow-hidden flex items-center justify-center p-4">
                {/* Dots Grid */}
                <div className="grid grid-cols-8 gap-4 opacity-35">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-creme"></span>
                  ))}
                </div>
                {/* Horizontal Sweeping Laser Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-argile to-transparent shadow-[0_0_15px_#CC5833] animate-[bounce_3s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-3 right-4 font-mono text-[10px] text-argile">
                  SCAN RADAR • 60 FPS
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-creme/60 border-t border-creme/15 pt-4">
              <span>AXE : CORNICHE OUEST / ROCADE FANN</span>
              <span className="text-emerald-400 font-bold">BALISE ACTIVE • 14.71° N</span>
            </div>
          </div>

          {/* CARTE PROTOCOLE 3 : Forme d'onde pulsante ECG */}
          <div className="protocol-card min-h-[70vh] rounded-[3rem] bg-mousse-deep text-creme p-8 sm:p-14 border border-mousse/40 shadow-organic flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between border-b border-creme/15 pb-6">
              <span className="font-mono text-2xl font-bold text-argile">PROTOCOLE_03</span>
              <span className="font-mono text-xs tracking-widest uppercase bg-creme/10 px-3.5 py-1.5 rounded-full">
                REMISE CERTIFIÉE EN 120 MIN
              </span>
            </div>

            <div className="relative z-10 my-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold font-sans mb-4">
                  Dénouement & Signature Biométrique Horodatée
                </h3>
                <p className="text-creme/80 text-base leading-relaxed">
                  Le destinataire signe sur le terminal sécurisé du coursier. Vous recevez instantanément la preuve d'authenticité, le récépissé géolocalisé et la clôture du protocole.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-argile-light">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Notification SMS & WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-argile" />
                    <span>Récépissé PDF instantané</span>
                  </div>
                </div>
              </div>

              {/* Unique SVG Animation 3: ECG Pulsing Waveform with stroke-dashoffset */}
              <div className="w-full flex items-center justify-center p-4">
                <svg className="w-full max-w-sm h-32" viewBox="0 0 400 120">
                  <path
                    d="M 10,60 L 90,60 L 110,20 L 130,100 L 150,40 L 170,80 L 190,60 L 390,60"
                    fill="none"
                    stroke="#CC5833"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="[stroke-dasharray:600] [stroke-dashoffset:600] animate-[pulse_2.2s_ease-in-out_infinite]"
                  />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#F2F0E9" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-creme/60 border-t border-creme/15 pt-4">
              <span>DESTINATION FINALE VALIDÉE</span>
              <span className="text-argile font-bold">120 MIN MAX : OBJECTIF ATTEINT</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* F. ADHÉSION / TARIFICATION                                     */}
      {/* ============================================================== */}
      <section id="tarifs" className="py-28 px-6 md:px-16 lg:px-24 bg-creme relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-mousse/10 text-mousse font-mono text-xs uppercase tracking-widest">
              Grille Contractuelle Sans Frais Cachés
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-mousse font-sans">
              Des tarifs clairs, adaptés à vos cadences.
            </h2>
            <p className="text-charbon/75 text-base sm:text-lg">
              Aucune mauvaise surprise : le montant convenu est le montant payé.
            </p>
          </div>

          {/* 3-Tier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Niveau 1 : Essentiel (Course Urbaine) */}
            <div className="bg-creme-card rounded-[2.5rem] p-8 border border-creme-border shadow-organic flex flex-col justify-between hover:shadow-organic-lg transition-all">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-mousse font-bold mb-2">
                  COURSE URBAINE • ESSENTIEL
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-charbon font-sans">2 500</span>
                  <span className="text-sm font-mono text-charbon/60">FCFA / course</span>
                </div>
                <p className="text-sm text-charbon/70 mb-6">
                  Pour les professionnels et particuliers ayant un besoin ponctuel urgent dans le centre de Dakar.
                </p>

                <ul className="space-y-3 text-sm text-charbon/80 mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Livraison en 2h chrono</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Rayon Plateau, Médina, Fann</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Lien de suivi GPS en direct</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Preuve par signature digitale</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setQuotePackageType('Document / Pli Confidentiel');
                  setIsQuoteOpen(true);
                }}
                className="w-full btn-magnetic py-3.5 rounded-full border border-mousse/30 text-mousse text-xs font-bold uppercase tracking-wider hover:bg-mousse hover:text-creme transition-colors"
              >
                <span className="btn-content">Commander cette course</span>
              </button>
            </div>

            {/* Niveau 2 : Performance (Flotte Entreprise) - CARTE CENTRALE MISE EN AVANT */}
            <div className="bg-mousse text-creme rounded-[2.5rem] p-8 border-2 border-argile shadow-xl flex flex-col justify-between relative transform lg:-translate-y-4">
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-argile text-creme font-mono text-[11px] font-bold tracking-widest uppercase shadow-md">
                RECOMMANDÉ POUR ENTREPRISES
              </div>

              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-argile-light font-bold mb-2">
                  FLOTTE PRO • PERFORMANCE
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-creme font-sans">49 000</span>
                  <span className="text-sm font-mono text-creme/70">FCFA / mois</span>
                </div>
                <p className="text-sm text-creme/80 mb-6">
                  Le carnet de 25 courses prioritaires pour cabinets d'avocats, banques, e-commerces et cliniques.
                </p>

                <ul className="space-y-3 text-sm text-creme/90 mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>25 courses express garanties / mois</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Zone étendue : Grand Dakar & Almadies</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Dispatcher dédié & ligne prioritaire</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Facturation mensuelle consolidée</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Assurance colis valeur déclarée</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setQuotePackageType('Abonnement Entreprise 25 courses');
                  setIsQuoteOpen(true);
                }}
                className="w-full btn-magnetic bg-argile hover:bg-argile-hover text-creme py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-accent-glow"
              >
                <span className="btn-slide-bg bg-charbon"></span>
                <span className="btn-content flex items-center justify-center gap-2">
                  <span>Demander un devis flotte</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Niveau 3 : Entreprise (Sur-Mesure Dédié) */}
            <div className="bg-creme-card rounded-[2.5rem] p-8 border border-creme-border shadow-organic flex flex-col justify-between hover:shadow-organic-lg transition-all">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-mousse font-bold mb-2">
                  SUR-MESURE • ENTREPRISE
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-charbon font-sans">Sur Devis</span>
                  <span className="text-sm font-mono text-charbon/60">Contrat cadre</span>
                </div>
                <p className="text-sm text-charbon/70 mb-6">
                  Intégration API personnalisée, coursiers dédiés à plein temps et logistique médicale ou bancaire certifiée.
                </p>

                <ul className="space-y-3 text-sm text-charbon/80 mb-8 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Coursiers dédiés exclusifs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Intégration API e-commerce / ERP</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>SLA contractuel : 90 min max</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-argile shrink-0" />
                    <span>Gestion des retours et contre-remboursement</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setQuotePackageType('Contrat Cadre / Volume Dédié');
                  setIsQuoteOpen(true);
                }}
                className="w-full btn-magnetic py-3.5 rounded-full border border-mousse/30 text-mousse text-xs font-bold uppercase tracking-wider hover:bg-mousse hover:text-creme transition-colors"
              >
                <span className="btn-content">Contacter un ingénieur d'affaires</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* G. PIED DE PAGE                                                */}
      {/* ============================================================== */}
      <footer className="bg-charbon-deep text-creme rounded-t-[4rem] pt-20 pb-12 px-6 md:px-16 lg:px-24 border-t border-mousse/20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <a href="#" className="flex items-center gap-2 text-2xl font-bold tracking-tight font-display">
                <span className="w-3 h-3 rounded-full bg-argile animate-pulse"></span>
                <span>Livr<span className="text-argile">Express</span></span>
              </a>
              <p className="text-creme/70 text-sm max-w-md font-normal leading-relaxed">
                Le réseau logistique autonome de Dakar conçu pour les échanges vitaux. Rapidité absolue en 2 heures chrono, transparence tarifaire et supervision satellite permanente.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-creme/60">
                <MapPin className="w-4 h-4 text-argile" />
                <span>Plateau / Almadies / VDN — Dakar, Sénégal</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-3 font-mono text-xs">
              <h4 className="font-bold text-creme uppercase tracking-wider text-sm font-sans">Navigation</h4>
              <ul className="space-y-2 text-creme/70">
                <li><a href="#fonctionnalites" className="interactive-lift hover:text-argile block">Fonctionnalités</a></li>
                <li><a href="#manifeste" className="interactive-lift hover:text-argile block">Le Manifeste</a></li>
                <li><a href="#protocole" className="interactive-lift hover:text-argile block">Protocole d'Enlèvement</a></li>
                <li><a href="#tarifs" className="interactive-lift hover:text-argile block">Grille Tarifaire</a></li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div className="space-y-3 font-mono text-xs">
              <h4 className="font-bold text-creme uppercase tracking-wider text-sm font-sans">Dispatch Direct</h4>
              <ul className="space-y-2 text-creme/70">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-argile" />
                  <span>+221 33 800 00 00</span>
                </li>
                <li className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-argile" />
                  <span>dispatch@livrexpress.sn</span>
                </li>
                <li className="pt-2 text-[11px] text-creme/50">
                  Disponible du Lundi au Dimanche 24h/24
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Operational System Status */}
          <div className="pt-8 border-t border-creme/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-creme/60">
            {/* Pulsing Green Status Indicator */}
            <div className="flex items-center gap-2.5 bg-charbon-surface px-4 py-2 rounded-full border border-creme/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold tracking-wider text-emerald-400">
                SYSTÈME OPÉRATIONNEL — LATENCE 24MS • DISPATCH ACTIF
              </span>
            </div>

            <p>© {new Date().getFullYear()} LivrExpress Dakar. Tous droits réservés.</p>
          </div>

        </div>
      </footer>

      {/* ============================================================== */}
      {/* MODAL : DEMANDER UN DEVIS INSTANTANÉ                           */}
      {/* ============================================================== */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charbon/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-creme-card rounded-[2.5rem] p-8 border border-mousse/20 shadow-2xl text-charbon animate-[fadeIn_0.3s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsQuoteOpen(false);
                setQuoteSubmitted(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-mousse/10 transition-colors"
            >
              <X className="w-5 h-5 text-charbon/60" />
            </button>

            {!quoteSubmitted ? (
              <div className="space-y-6">
                <div>
                  <span className="text-argile font-mono text-xs font-bold uppercase tracking-widest">
                    DEVIS EXPRESS • CALCULATEUR
                  </span>
                  <h3 className="text-2xl font-bold font-sans text-mousse mt-1">
                    Calculer votre course en 2H
                  </h3>
                  <p className="text-xs text-charbon/70 mt-1">
                    Sélectionnez vos zones à Dakar pour une estimation immédiate.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Origin */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-mousse mb-1.5 uppercase">
                      Lieu de Collecte (Départ)
                    </label>
                    <select
                      value={quoteOrigin}
                      onChange={(e) => setQuoteOrigin(e.target.value)}
                      className="w-full bg-creme-subtle border border-mousse/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-argile"
                    >
                      <option value="Plateau">Dakar Plateau / Centre Ville</option>
                      <option value="Médina">Médina / Colobane</option>
                      <option value="Fann">Fann Résidence / Point E</option>
                      <option value="VDN">VDN / Mermoz / Sacré-Cœur</option>
                      <option value="Almadies">Les Almadies / Ngor</option>
                      <option value="Yoff">Yoff / Ouest Foire</option>
                    </select>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-mousse mb-1.5 uppercase">
                      Lieu de Livraison (Arrivée)
                    </label>
                    <select
                      value={quoteDestination}
                      onChange={(e) => setQuoteDestination(e.target.value)}
                      className="w-full bg-creme-subtle border border-mousse/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-argile"
                    >
                      <option value="Almadies">Les Almadies / Ngor</option>
                      <option value="Plateau">Dakar Plateau / Centre Ville</option>
                      <option value="VDN">VDN / Mermoz / Sacré-Cœur</option>
                      <option value="Fann">Fann Résidence / Point E</option>
                      <option value="Yoff">Yoff / Ouest Foire</option>
                      <option value="Guédiawaye">Banlieue / Guédiawaye</option>
                    </select>
                  </div>

                  {/* Package Type */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-mousse mb-1.5 uppercase">
                      Type de Colis
                    </label>
                    <select
                      value={quotePackageType}
                      onChange={(e) => setQuotePackageType(e.target.value)}
                      className="w-full bg-creme-subtle border border-mousse/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-argile"
                    >
                      <option value="Document / Pli Confidentiel">Document / Pli Confidentiel</option>
                      <option value="Matériel High-Tech & Pièces">Matériel High-Tech & Pièces</option>
                      <option value="Échantillon Médical / Clinique">Échantillon Médical / Clinique</option>
                      <option value="Abonnement Entreprise 25 courses">Abonnement Entreprise (25 courses)</option>
                      <option value="Contrat Cadre / Volume Dédié">Contrat Cadre Grand Compte</option>
                    </select>
                  </div>

                  {/* Price breakdown preview */}
                  <div className="p-4 rounded-2xl bg-mousse text-creme flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-mono text-argile-light uppercase">
                        Tarif Garanti Sans Surprise
                      </span>
                      <span className="text-2xl font-bold font-sans">{calculatePrice()} FCFA</span>
                    </div>
                    <div className="text-right font-mono text-xs text-creme/80">
                      <span>Délai garanti :</span>
                      <div className="font-bold text-argile-light">&lt; 120 minutes</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setQuoteSubmitted(true)}
                  className="w-full btn-magnetic bg-argile hover:bg-argile-hover text-creme py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-accent-glow"
                >
                  <span className="btn-content">Confirmer la demande de devis</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-sans text-mousse">
                  Demande Transmise au Dispatch
                </h3>
                <p className="text-sm text-charbon/75 max-w-sm mx-auto">
                  Votre estimation de <strong className="text-mousse font-bold">{calculatePrice()} FCFA</strong> pour le trajet {quoteOrigin} → {quoteDestination} a été prise en compte. Un régulateur vous contacte dans les 3 minutes.
                </p>
                <button
                  onClick={() => setIsQuoteOpen(false)}
                  className="btn-magnetic bg-mousse text-creme px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider mt-2"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
