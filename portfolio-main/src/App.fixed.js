import React, { useState, useEffect, useRef } from 'react';
import {
  Code, Cloud, Github, Linkedin, Mail, ExternalLink, Award, Plus, Edit2,
  Moon, Sun, Trash2, FileText, Database, Server, Settings,
  ChevronLeft, ChevronRight, X, Menu, ArrowUp, Zap, Terminal, CheckCircle,
} from 'lucide-react';
import {
  FaHtml5, FaJs, FaReact, FaPython, FaGitAlt, FaGoogle, FaJava, FaNodeJs,
} from 'react-icons/fa';
import { SiTailwindcss, SiMongodb, SiLeetcode, SiPostman } from 'react-icons/si';

/* ─────────────────────────────────────────────
   Typewriter Hook
───────────────────────────────────────────── */
function useTypewriter(words, speed = 80, del = 40, pause = 2200) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;
    const word = words[wordIdx % words.length];
    const t = setTimeout(() => {
      if (!deleting) {
        if (text.length < word.length) setText(word.slice(0, text.length + 1));
        else { setWaiting(true); setTimeout(() => { setWaiting(false); setDeleting(true); }, pause); }
      } else {
        if (text.length > 0) setText(word.slice(0, text.length - 1));
        else { setDeleting(false); setWordIdx(p => (p + 1) % words.length); }
      }
    }, deleting ? del : speed);
    return () => clearTimeout(t);
  }, [text, wordIdx, deleting, waiting, words, speed, del, pause]);

  return text;
}

/* ─────────────────────────────────────────────
   Scroll Reveal Hook
───────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────────── */
function useCounter(end, duration = 1800) {
  const [val, setVal] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!active) return;
    let start;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setVal(Math.round(ease * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, end, duration]);
  return [val, setActive];
}

/* ─────────────────────────────────────────────
   Floating Particles
───────────────────────────────────────────── */
const particleData = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
  opacity: Math.random() * 0.45 + 0.15,
}));

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particleData.map(p => (
        <div key={p.id} className="particle-dot" style={{
          width: p.size, height: p.size, left: `${p.left}%`, bottom: '-10px',
          opacity: p.opacity, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge Image / Fallback Component
───────────────────────────────────────────── */
function BadgeIcon({ image, category, alt }) {
  const [err, setErr] = useState(false);
  const catClass = { cloud: 'badge-cloud', ai: 'badge-ai', dsa: 'badge-dsa', google: 'badge-google' };
  const catEmoji = { cloud: '☁️', ai: '🤖', dsa: '💡', google: '🎯' };

  if (image && !err) {
    return (
      <img
        src={image} alt={alt}
        className="badge-img w-[60px] h-[60px] object-contain flex-shrink-0"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className={`badge-fallback ${catClass[category] || 'badge-google'}`}>
      {catEmoji[category] || '🏅'}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PORTFOLIO COMPONENT
════════════════════════════════════════════════════════ */
export default function Portfolio() {

  /* ── UI State ── */
  const [isScrolled, setIsScrolled]   = useState(false);
  const [scrollPct,  setScrollPct]    = useState(0);
  const [darkMode,   setDarkMode]     = useState(true);
  const [showTop,    setShowTop]      = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [cursorPos,  setCursorPos]    = useState({ x: -100, y: -100 });
  const [ringPos,    setRingPos]      = useState({ x: -100, y: -100 });
  const [cursorBig,  setCursorBig]    = useState(false);
  const [projectPage, setProjectPage] = useState(0);
  const [paused,      setPaused]      = useState(false);

  /* ── Admin State ── */
  const [isAdmin,            setIsAdmin]            = useState(false);
  const [adminPassword,      setAdminPassword]      = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAddProject,     setShowAddProject]     = useState(false);
  const [showAddCert,        setShowAddCert]        = useState(false);
  const [newProject,         setNewProject]         = useState({ title:'',description:'',tech:'',github:'',demo:'' });
  const [newCert,            setNewCert]            = useState({ name:'',issuer:'',link:'',date:'',category:'cloud' });

  /* ── Typewriter ── */
  const typedText = useTypewriter(
    ['Full-Stack Developer','AI/ML Enthusiast','Cloud Engineer','Problem Solver','MCA Student'],
    22, 38, 2200
  );

  /* ── Reveal refs ── */
  const [heroRef,    heroVis]    = useReveal(0.1);
  const [statsRef,   statsVis]   = useReveal(0.3);
  const [aboutRef,   aboutVis]   = useReveal(0.1);
  const [skillsRef,  skillsVis]  = useReveal(0.1);
  const [projRef,    projVis]    = useReveal(0.08);
  const [certRef,    certVis]    = useReveal(0.1);
  const [contactRef, contactVis] = useReveal(0.15);

  /* ── Counters ── */
  const [cnt1, setCnt1] = useCounter(8);
  const [cnt2, setCnt2] = useCounter(17);
  const [cnt3, setCnt3] = useCounter(6);
  const [cnt4, setCnt4] = useCounter(500);
  useEffect(() => {
    if (statsVis) { setCnt1(true); setCnt2(true); setCnt3(true); setCnt4(true); }
  }, [statsVis, setCnt1, setCnt2, setCnt3, setCnt4]);

  /* ── DATA ── */
  const [projects, setProjects] = useState([
    { id:1, title:'AI-Powered EdTech Ecosystem',
      description:'Developing a platform integrating Generative & Agentic AI to analyze student performance and recommend career paths. Architecting a Hybrid Cloud Solution utilizing MongoDB and Cloud SQL, plus an internal ATS Resume Builder.',
      tech:['MERN','Python','Cloud SQL','GenAI'],
      github:'https://github.com/Anirban-coder/nextstepper' },
    { id:2, title:'Agentic AI Document Assistant',
      description:'Built a Context-Aware AI Agent using Groq API capable of retaining conversation history with 98% accuracy. Integrated RAG to process 200 MB+ PDF uploads for deep document analysis.',
      tech:['Groq API','RAG','Agentic AI'],
      github:'https://github.com/Anirban-coder/agenticaiprjct1st',
      demo:'https://theanirbanrouthai.streamlit.app/' },
    { id:3, title:'SkillBridge – Freelance Marketplace',
      description:'Engineered a Full-Stack Marketplace with role-based dashboards and secure JWT Authentication. Implemented Real-Time Messaging (Socket.io) and integrated a mock Razorpay Payment Gateway.',
      tech:['MERN','Socket.io','JWT','Razorpay'],
      github:'https://github.com/Anirban-coder/skillbridge' },
    { id:4, title:'DSA Visualizer Platform',
      description:'Developed an interactive platform categorising Data Structures & Algorithms problems with live visualisations. Implemented optimised search and Mobile-First layout, utilised by 50+ students.',
      tech:['React','Node.js','MongoDB'],
      github:'https://github.com/Anirban-coder/DSAVisualizer',
      demo:'https://dsa-visualizer-hwmd-git-main-anirban-coders-projects.vercel.app' },
    { id:5, title:'YoChoice',
      description:'Decision-making platform built to help users make better choices interactively with an elegant UI and smart recommendation engine.',
      tech:['React','Node.js','MongoDB'],
      github:'https://github.com/Anirban-coder/yochoice.git',
      demo:'https://yochoice-zopf-git-main-anirban-coders-projects.vercel.app' },
    { id:6, title:'Travel Geek',
      description:'Interactive travel planning platform with smooth user interface and API integrations for real-time destination data and itinerary building.',
      tech:['React','API Integration'],
      github:'https://github.com/Anirban-coder/travelgeek.git' },
    { id:7, title:'Cafe Everyday',
      description:'Daily task tracker with a clean, responsive, and smooth UI designed for maximum productivity with a delightful experience.',
      tech:['React','CSS'],
      github:'https://github.com/Anirban-coder/CafeEverday.git' },
    { id:8, title:'Portfolio Website',
      description:'Modern responsive personal portfolio featuring interactive carousels, scroll-reveal animations, admin dashboard, dark/light mode and glassmorphism design.',
      tech:['React','Tailwind','JavaScript'],
      github:'https://github.com/Anirban-coder/portfolio.git' },
  ]);

  const [certificates, setCertificates] = useState([
    { id:1,
      name:'Introduction to Data Analytics on Google Cloud',
      issuer:'Google Cloud', date:'Jun 2025', category:'cloud',
      image:'https://cdn.qwiklabs.com/URJ0BFWgzlLBkCO6kSOyXGd3Idd44d6tC4Dqn6SKeiw%3D',
      link:'https://www.skills.google/public_profiles/b131287b-f220-4aa3-8b4e-116c192d8b5b/badges/16364840' },
    { id:2,
      name:'Develop Gen AI Apps with Gemini and Streamlit',
      issuer:'Google', date:'Nov 2025', category:'ai',
      image:'https://cdn.qwiklabs.com/R%2BYhbP40DQcgaBNwV5nSLyIehXVx2j9KZslV6rCb9K4%3D',
      link:'https://www.skills.google/public_profiles/2183bd9e-6bb3-4ff5-8013-f244b8d87519/badges/20023735' },
    { id:3,
      name:'Preparing for Professional Cloud Architect Journey',
      issuer:'Google Cloud', date:'2024', category:'cloud',
      image: null,
      link:'https://www.cloudskillsboost.google/public_profiles/b131287b-f220-4aa3-8b4e-116c192d8b5b/badges/14006295' },
    { id:4,
      name:'Google Cloud Fundamentals: Core Infrastructure',
      issuer:'Google Cloud', date:'2024', category:'cloud',
      image: null,
      link:'https://www.cloudskillsboost.google/public_profiles/b131287b-f220-4aa3-8b4e-116c192d8b5b/badges/12044636' },
    { id:5,
      name:'Prompt Design in Agent Platform',
      issuer:'Google', date:'2025', category:'ai',
      image: null,
      link:'https://www.skills.google/public_profiles/2183bd9e-6bb3-4ff5-8013-f244b8d87519/badges/19997037' },
    { id:6,
      name:'DSA Certification',
      issuer:'Udemy', date:'2023', category:'dsa',
      image: null,
      link: '#' },
  ]);

  const skills = [
    { name:'JavaScript (ES6+)',   icon:<FaJs        className="text-yellow-400" /> },
    { name:'Python',              icon:<FaPython    className="text-blue-400"   /> },
    { name:'React.js',            icon:<FaReact     className="text-cyan-400"   /> },
    { name:'Node.js',             icon:<FaNodeJs    className="text-green-400"  /> },
    { name:'Express.js',          icon:<Server      className="text-gray-400"   size={18}/> },
    { name:'MongoDB',             icon:<SiMongodb   className="text-green-500"  /> },
    { name:'Google Cloud (GCP)',  icon:<FaGoogle    className="text-blue-500"   /> },
    { name:'Cloud SQL',           icon:<Database    className="text-blue-400"   size={18}/> },
    { name:'Generative AI & RAG', icon:<Cloud       className="text-purple-400" size={18}/> },
    { name:'Machine Learning',    icon:<Settings    className="text-pink-400"   size={18}/> },
    { name:'REST APIs',           icon:<Code        className="text-cyan-500"   size={18}/> },
    { name:'Tailwind CSS',        icon:<SiTailwindcss className="text-cyan-400" /> },
    { name:'HTML5 & CSS3',        icon:<FaHtml5     className="text-orange-500" /> },
    { name:'DSA',                 icon:<SiLeetcode  className="text-orange-500" /> },
    { name:'Git & GitHub',        icon:<FaGitAlt    className="text-red-500"    /> },
    { name:'Postman',             icon:<SiPostman   className="text-orange-400" /> },
    { name:'Java',                icon:<FaJava      className="text-red-600"    /> },
  ];

  /* ── Dark/Light Mode → apply to <html> ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ── Cursor Tracking with lerp ── */
  useEffect(() => {
    let rafId;
    let target = { x: -100, y: -100 };
    let current = { x: -100, y: -100 };
    const onMove = e => { setCursorPos({ x: e.clientX, y: e.clientY }); target = { x: e.clientX, y: e.clientY }; };
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      current.x = lerp(current.x, target.x, 0.15);
      current.y = lerp(current.y, target.y, 0.15);
      setRingPos({ ...current });
      rafId = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId); };
  }, []);

  /* ── Scroll Tracking ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(y > 60);
      setScrollPct((y / total) * 100);
      setShowTop(y > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Carousel Auto-advance ── */
  const totalPages = Math.ceil(projects.length / 2);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setProjectPage(p => (p + 1) % totalPages), 4500);
    return () => clearInterval(id);
  }, [paused, totalPages]);

  /* ── Helpers ── */
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); };
  const handleLogin = () => {
    if (adminPassword === 'Argon18@20_11_2001') { setIsAdmin(true); setShowPasswordPrompt(false); setAdminPassword(''); }
    else alert('Incorrect password!');
  };
  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([...projects, { ...newProject, id: Date.now(), tech: newProject.tech.split(',').map(t=>t.trim()) }]);
      setNewProject({ title:'',description:'',tech:'',github:'',demo:'' });
      setShowAddProject(false);
    }
  };
  const addCert = () => {
    if (newCert.name && newCert.issuer) {
      setCertificates([...certificates, { ...newCert, id: Date.now() }]);
      setNewCert({ name:'',issuer:'',link:'',date:'',category:'cloud' });
      setShowAddCert(false);
    }
  };

  const navItems = ['home','about','skills','projects','certificates','contact'];
  const visibleProjects = projects.slice(projectPage * 2, projectPage * 2 + 2);

  /* ════════════════════════════════════════════════
     JSX
  ════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Cursor */}
      <div className={`cursor-dot ${cursorBig?'expanded':''}`} style={{left:cursorPos.x,top:cursorPos.y}}/>
      <div className={`cursor-ring ${cursorBig?'expanded':''}`} style={{left:ringPos.x,top:ringPos.y}}/>

      {/* Scroll Progress */}
      <div className="scroll-progress-bar" style={{width:`${scrollPct}%`}}/>

      {/* ── MODALS ── */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold font-display">🔐 Admin Access</h3>
              <button onClick={()=>setShowPasswordPrompt(false)} className="tx-3 hover:tx-1 transition-colors"><X size={22}/></button>
            </div>
            <input type="password" value={adminPassword}
              onChange={e=>setAdminPassword(e.target.value)}
              placeholder="Enter password"
              className="form-input w-full p-3 rounded-xl mb-5"
              onKeyPress={e=>e.key==='Enter'&&handleLogin()}/>
            <div className="flex gap-3">
              <button onClick={handleLogin} className="btn-glow flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Login</button>
              <button onClick={()=>setShowPasswordPrompt(false)} className="flex-1 glass py-3 rounded-xl font-semibold tx-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddProject && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold font-display">Add Project</h3>
              <button onClick={()=>setShowAddProject(false)} className="tx-3"><X size={22}/></button>
            </div>
            {[['text','Project Title','title'],['text','Technologies (comma separated)','tech'],['url','GitHub Link','github'],['url','Demo Link','demo']].map(([t,ph,k])=>(
              <input key={k} type={t} placeholder={ph} value={newProject[k]}
                onChange={e=>setNewProject({...newProject,[k]:e.target.value})}
                className="form-input w-full p-3 rounded-xl mb-4"/>
            ))}
            <textarea placeholder="Description" value={newProject.description}
              onChange={e=>setNewProject({...newProject,description:e.target.value})}
              className="form-input w-full p-3 rounded-xl mb-5 h-28 resize-none"/>
            <div className="flex gap-3">
              <button onClick={addProject} className="btn-glow flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Add Project</button>
              <button onClick={()=>setShowAddProject(false)} className="flex-1 glass py-3 rounded-xl font-semibold tx-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddCert && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 max-w-xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold font-display">Add Certificate</h3>
              <button onClick={()=>setShowAddCert(false)} className="tx-3"><X size={22}/></button>
            </div>
            {[['text','Certificate Name','name'],['text','Issuer','issuer'],['text','Date (e.g. Jun 2025)','date'],['url','Badge Image URL','image'],['url','Certificate Link','link']].map(([t,ph,k])=>(
              <input key={k} type={t} placeholder={ph} value={newCert[k]||''}
                onChange={e=>setNewCert({...newCert,[k]:e.target.value})}
                className="form-input w-full p-3 rounded-xl mb-4"/>
            ))}
            <div className="flex gap-3">
              <button onClick={addCert} className="btn-glow flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Add</button>
              <button onClick={()=>setShowAddCert(false)} className="flex-1 glass py-3 rounded-xl font-semibold tx-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {mobileOpen && <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>}
      <div className={`mobile-menu-panel fixed top-0 left-0 h-full w-72 glass z-50 flex flex-col p-8 gap-5 ${mobileOpen?'open':''}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold font-display gradient-text-anim">Anirban Routh</span>
          <button onClick={()=>setMobileOpen(false)} className="tx-3 hover:tx-1"><X size={22}/></button>
        </div>
        {navItems.map(s=>(
          <button key={s} onClick={()=>scrollTo(s)}
            className="capitalize text-left text-lg tx-2 hover:text-white hover:pl-2 transition-all duration-300 border-b pb-4"
            style={{borderColor:'var(--border)'}}>
            {s}
          </button>
        ))}
        <div className="mt-auto flex gap-3">
          {[['https://github.com/Anirban-coder',<Github size={18}/>],
            ['https://www.linkedin.com/in/anirban-routh20/',<Linkedin size={18}/>],
            ['mailto:anirbanrouth22@gmail.com',<Mail size={18}/>]].map(([h,i])=>(
            <a key={h} href={h} target="_blank" rel="noreferrer" className="social-icon glass p-3 rounded-full">{i}</a>
          ))}
        </div>
      </div>

      {/* ════════ NAVIGATION ════════ */}
      <nav className="fixed top-0 w-full z-30 transition-all duration-500"
           style={{ background: isScrolled ? 'var(--nav-bg)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(24px)' : 'none',
                    boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={()=>scrollTo('home')}
            className="text-xl font-bold font-display gradient-text-anim"
            onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
            Anirban Routh
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(s=>(
              <button key={s} onClick={()=>scrollTo(s)}
                className="nav-link capitalize text-sm font-medium tx-2 hover:text-white transition-colors"
                onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={()=>setDarkMode(d=>!d)}
              onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
              className="glass p-2.5 rounded-full transition-all hover:scale-110"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode
                ? <Sun size={18} className="text-yellow-400"/>
                : <Moon size={18} className="text-purple-600"/>}
            </button>
            {!isAdmin
              ? <button onClick={()=>setShowPasswordPrompt(true)}
                  onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
                  className="glass p-2.5 rounded-full transition-all hover:scale-110">
                  <Edit2 size={18} className="text-purple-400"/>
                </button>
              : <button onClick={()=>setIsAdmin(false)}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold rounded-full transition-all">
                  Logout
                </button>}
            <button onClick={()=>setMobileOpen(true)} className="md:hidden glass p-2.5 rounded-full">
              <Menu size={18}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] top-[-10%] left-[-10%] float-anim"/>
        <div className="orb orb-cyan   w-[400px] h-[400px] bottom-[-5%] right-[-8%] float-anim-2"/>
        <div className="orb orb-pink   w-[300px] h-[300px] top-[40%] left-[40%] opacity-40 float-anim-3"/>
        <Particles/>

        <div ref={heroRef} className={`relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-16 reveal ${heroVis?'visible':''}`}>

          {/* Profile Image */}
          <div className="relative flex-shrink-0 float-anim"
               onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
            <svg className="profile-ring absolute inset-0 w-full h-full" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4"/>
                  <stop offset="50%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r="150" fill="none" stroke="url(#rg)"
                strokeWidth="2" strokeDasharray="8 16" strokeLinecap="round" opacity="0.8"/>
            </svg>
            <svg className="profile-ring-rev absolute" style={{inset:'12px',width:'calc(100% - 24px)',height:'calc(100% - 24px)'}} viewBox="0 0 296 296">
              <circle cx="148" cy="148" r="138" fill="none" stroke="rgba(139,92,246,0.35)"
                strokeWidth="1.5" strokeDasharray="4 20" strokeLinecap="round"/>
            </svg>
            <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.3)] m-6">
              <img src="/profile_new.jpeg" alt="Anirban Routh" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"/>
            </div>
            <div className="absolute -bottom-2 -right-2 glass-light px-4 py-2 rounded-full flex items-center gap-2 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-xs font-semibold text-cyan-300">Open to Work</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-4 flex items-center gap-2 justify-center md:justify-start">
              <Terminal size={14}/> Hello World · Diamond League 🏆
            </p>
            <h1 className="text-5xl md:text-7xl font-black font-display mb-4 leading-tight">
              <span className="block" style={{color:'var(--text)'}}>Hi, I'm</span>
              <span className="block gradient-text-anim">Anirban 👋</span>
            </h1>

            <p className="text-xl md:text-2xl font-semibold mb-6 h-9" style={{color:'var(--text-2)'}}>
              <span style={{color:'var(--text)'}}>{typedText}</span>
              <span className="type-cursor h-6 rounded-sm"/>
            </p>

            <p className="text-lg mb-8 max-w-xl leading-relaxed" style={{color:'var(--text-2)'}}>
              Architecting scalable AI-driven solutions & building optimised,
              user-centric applications that make a real impact.
            </p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mb-8">
              {[
                { icon:<Github size={22}/>,   href:'https://github.com/Anirban-coder' },
                { icon:<Linkedin size={22}/>,  href:'https://www.linkedin.com/in/anirban-routh20/' },
                { icon:<SiLeetcode size={20}/>,href:'https://leetcode.com/u/Anirban_Routh/' },
                { icon:<Mail size={22}/>,      href:'mailto:anirbanrouth22@gmail.com' },
              ].map(({icon,href},i)=>(
                <a key={i} href={href} target="_blank" rel="noreferrer"
                   className="social-icon glass p-3.5 rounded-full border hover:border-cyan-400/50"
                   style={{borderColor:'var(--border)'}}
                   onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
                  {icon}
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={()=>scrollTo('projects')}
                onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
                className="btn-glow px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white flex items-center justify-center gap-2">
                View Projects <ExternalLink size={16}/>
              </button>
              <a href="/Anirban_Routh_Resume.pdf" download
                onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
                className="btn-glow px-8 py-4 glass rounded-full font-semibold flex items-center justify-center gap-2 border"
                style={{borderColor:'var(--border)',color:'var(--text-2)'}}>
                Download CV <FileText size={16}/>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{color:'var(--text-3)'}}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-current to-transparent"/>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section ref={statsRef} className="py-16 px-6 relative overflow-hidden">
        <div className="orb orb-purple w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"/>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val:cnt1, suf:'+', label:'Projects Built',     icon:<Zap size={22} className="text-cyan-400"/> },
            { val:cnt2, suf:'+', label:'Technologies',        icon:<Code size={22} className="text-purple-400"/> },
            { val:cnt3, suf:'+', label:'Certifications',      icon:<Award size={22} className="text-pink-400"/> },
            { val:cnt4, suf:'+', label:'DSA Problems Solved', icon:<Terminal size={22} className="text-green-400"/> },
          ].map((s,i)=>(
            <div key={i} className={`stat-card glass rounded-2xl p-6 text-center border reveal delay-${(i+1)*100} ${statsVis?'visible':''}`} style={{borderColor:'var(--border)'}}>
              <div className="flex justify-center mb-3">{s.icon}</div>
              <div className="text-4xl font-black font-display gradient-text-anim">{s.val}{s.suf}</div>
              <div className="text-sm mt-1" style={{color:'var(--text-3)'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="orb orb-cyan w-96 h-96 right-[-10%] top-0 opacity-25"/>
        <div className="max-w-5xl mx-auto">
          <div ref={aboutRef} className={`reveal ${aboutVis?'visible':''}`}>
            <p className="text-center text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Get to know me</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-center gradient-text-anim mb-16">About Me</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-10 items-start">
            <div className={`md:col-span-3 reveal-left ${aboutVis?'visible':''} delay-200`}>
              <div className="glass rounded-3xl p-8 border" style={{borderColor:'var(--border)'}}>
                <p className="text-lg leading-relaxed mb-5" style={{color:'var(--text-2)'}}>
                  I'm an aspiring Software Engineer pursuing my
                  <span className="text-cyan-400 font-semibold"> Master of Computer Applications (MCA)</span> at
                  Netaji Subhash Engineering College. I'm a
                  <span className="text-yellow-400 font-semibold"> Google Cloud Diamond League</span> achiever
                  highly proficient in the <span className="text-purple-400 font-semibold">MERN Stack</span>, Python,
                  and the <span className="text-pink-400 font-semibold">Google Cloud Platform</span>.
                </p>
                <p className="text-lg leading-relaxed" style={{color:'var(--text-2)'}}>
                  My passion lies in architecting scalable AI-driven solutions using Generative AI, Groq API,
                  and Cloud SQL. I thrive on building optimised, user-centric applications and leveraging
                  data analytics to drive strategic business growth.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['MCA Student','MERN Stack','Generative AI','Google Cloud ☁️','Diamond League 🏆','Problem Solver'].map(tag=>(
                    <span key={tag} className="glass-light px-4 py-1.5 rounded-full text-sm font-medium border" style={{borderColor:'var(--border)',color:'var(--text-2)'}}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`md:col-span-2 reveal-right ${aboutVis?'visible':''} delay-400`}>
              <h3 className="text-xl font-bold font-display mb-6" style={{color:'var(--text)'}}>🎓 Education</h3>
              <div className="space-y-6">
                {[
                  { full:'Master of Computer Applications', college:'Netaji Subhash Engineering College', period:'Sept 2024 – Present', color:'text-cyan-400' },
                  { full:'Bachelor of Computer Applications', college:'Netaji Subhash Engineering College', period:'2020 – 2023 | GPA 8.7/10', color:'text-purple-400' },
                ].map((e,i)=>(
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"/>
                    <div className="glass rounded-2xl p-5 border ml-2" style={{borderColor:'var(--border)'}}>
                      <p className={`font-bold text-sm ${e.color}`}>{e.full}</p>
                      <p className="font-semibold mt-1" style={{color:'var(--text)'}}>{e.college}</p>
                      <p className="text-xs mt-1" style={{color:'var(--text-3)'}}>{e.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SKILLS ════════ */}
      <section id="skills" className="py-24 relative overflow-hidden">
        <div className="orb orb-purple w-96 h-96 left-[-8%] bottom-0 opacity-20"/>
        <div className="max-w-6xl mx-auto px-6">
          <div ref={skillsRef} className={`reveal ${skillsVis?'visible':''}`}>
            <p className="text-center text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">What I work with</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-center gradient-text-anim mb-16">Technical Skills</h2>
          </div>
        </div>

        <div className={`marquee-wrapper mb-5 reveal ${skillsVis?'visible':''} delay-200`}>
          <div className="marquee-track" style={{gap:'20px'}}>
            {[...skills,...skills].map((sk,i)=>(
              <div key={i} className="skill-pill glass-light flex items-center gap-3 px-5 py-3 rounded-full border mx-2.5" style={{borderColor:'var(--border)'}}>
                <span className="text-xl">{sk.icon}</span>
                <span className="text-sm font-medium" style={{color:'var(--text-2)'}}>{sk.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`marquee-wrapper reveal ${skillsVis?'visible':''} delay-400`}>
          <div className="marquee-track-rev" style={{gap:'20px'}}>
            {[...skills.slice().reverse(),...skills.slice().reverse()].map((sk,i)=>(
              <div key={i} className="skill-pill glass-light flex items-center gap-3 px-5 py-3 rounded-full border mx-2.5" style={{borderColor:'var(--border)'}}>
                <span className="text-xl">{sk.icon}</span>
                <span className="text-sm font-medium" style={{color:'var(--text-2)'}}>{sk.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROJECTS ════════ */}
      <section id="projects" className="py-24 px-6 relative overflow-hidden">
        <div className="orb orb-cyan w-96 h-96 right-[-6%] top-[20%] opacity-20"/>
        <div className="max-w-6xl mx-auto">
          <div ref={projRef} className={`reveal ${projVis?'visible':''}`}>
            <p className="text-center text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">What I've built</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-center gradient-text-anim mb-4">Projects</h2>
            <p className="text-center text-sm mb-14" style={{color:'var(--text-3)'}}>Hover to pause · Arrows or dots to navigate</p>
          </div>

          {isAdmin && (
            <div className="flex justify-end mb-6">
              <button onClick={()=>setShowAddProject(true)}
                className="btn-glow bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2">
                <Plus size={18}/> Add Project
              </button>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-7 reveal ${projVis?'visible':''} delay-200`}
               onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
            {visibleProjects.map((p,i)=>(
              <div key={`${p.id}-${projectPage}`}
                className={`project-card glass rounded-3xl p-7 border flex flex-col reveal delay-${(i+1)*200} ${projVis?'visible':''}`}
                style={{borderColor:'var(--border)'}}>
                {isAdmin && (
                  <button onClick={()=>setProjects(projects.filter(pr=>pr.id!==p.id))}
                    className="absolute top-5 right-5 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full z-10">
                    <Trash2 size={15}/>
                  </button>
                )}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold font-display pr-4" style={{color:'var(--text)'}}>{p.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    {p.github && p.github!=='#' && (
                      <a href={p.github} target="_blank" rel="noreferrer"
                        className="glass p-2 rounded-full border hover:border-purple-400/50 transition-all" style={{borderColor:'var(--border)'}}
                        onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
                        <Github size={16}/>
                      </a>
                    )}
                    {p.demo && p.demo!=='#' && (
                      <a href={p.demo} target="_blank" rel="noreferrer"
                        className="glass p-2 rounded-full border hover:border-cyan-400/50 transition-all" style={{borderColor:'var(--border)'}}
                        onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
                        <ExternalLink size={16}/>
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6 flex-grow" style={{color:'var(--text-2)'}}>{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t,ti)=>(
                    <span key={ti} className="tech-tag glass-light px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 border border-cyan-400/20">{t}</span>
                  ))}
                </div>
              </div>
            ))}
            {visibleProjects.length===1 && (
              <div className="hidden md:flex items-center justify-center glass rounded-3xl border opacity-30" style={{borderColor:'var(--border)'}}>
                <span className="text-sm" style={{color:'var(--text-3)'}}>More coming soon…</span>
              </div>
            )}
          </div>

          {/* Carousel Controls */}
          <div className={`flex items-center justify-center gap-6 mt-10 reveal delay-400 ${projVis?'visible':''}`}>
            <button onClick={()=>setProjectPage(p=>(p-1+totalPages)%totalPages)}
              className="glass p-3 rounded-full border hover:border-cyan-400/50 transition-all" style={{borderColor:'var(--border)'}}
              onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
              <ChevronLeft size={20}/>
            </button>
            <div className="flex gap-2">
              {Array.from({length:totalPages}).map((_,i)=>(
                <button key={i} onClick={()=>setProjectPage(i)}
                  className={`rounded-full transition-all duration-300 ${i===projectPage?'w-8 h-3 bg-gradient-to-r from-cyan-500 to-purple-600':'w-3 h-3 hover:opacity-70'}`}
                  style={{background: i===projectPage?undefined:'var(--text-3)'}}
                  onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}/>
              ))}
            </div>
            <button onClick={()=>setProjectPage(p=>(p+1)%totalPages)}
              className="glass p-3 rounded-full border hover:border-cyan-400/50 transition-all" style={{borderColor:'var(--border)'}}
              onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
              <ChevronRight size={20}/>
            </button>
          </div>
          <p className="text-center text-sm mt-4" style={{color:'var(--text-3)'}}>
            {projectPage*2+1}–{Math.min(projectPage*2+2,projects.length)} of {projects.length} projects
          </p>
        </div>
      </section>

      {/* ════════ CERTIFICATES ════════ */}
      <section id="certificates" className="py-24 px-6 relative overflow-hidden">
        <div className="orb orb-pink w-80 h-80 left-[-5%] bottom-10 opacity-20"/>
        <div className="max-w-5xl mx-auto">
          <div ref={certRef} className={`reveal ${certVis?'visible':''}`}>
            <p className="text-center text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">My Credentials</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-center gradient-text-anim mb-4">Certifications</h2>
            <p className="text-center text-sm mb-14" style={{color:'var(--text-3)'}}>
              Google Cloud Diamond League · Member since 2024
            </p>
          </div>

          {isAdmin && (
            <div className="flex justify-end mb-8">
              <button onClick={()=>setShowAddCert(true)}
                className="btn-glow bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2">
                <Plus size={18}/> Add Certificate
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {certificates.map((c,i)=>(
              <div key={c.id}
                className={`cert-card glass rounded-2xl p-5 border flex items-center gap-4 reveal delay-${Math.min((i+1)*100,600)} ${certVis?'visible':''}`}
                style={{borderColor:'var(--border)'}}
                onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>

                {/* Badge Image or Fallback */}
                <BadgeIcon image={c.image} category={c.category} alt={c.name}/>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {c.link!=='#' ? (
                    <a href={c.link} target="_blank" rel="noreferrer"
                      className="font-semibold text-sm leading-snug block mb-1 hover:text-cyan-400 transition-colors"
                      style={{color:'var(--text)'}}>
                      {c.name}
                      <ExternalLink size={11} className="inline ml-1 opacity-50"/>
                    </a>
                  ) : (
                    <span className="font-semibold text-sm leading-snug block mb-1" style={{color:'var(--text)'}}>{c.name}</span>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-purple-400 font-medium">{c.issuer}</span>
                    {c.date && <span className="text-xs" style={{color:'var(--text-3)'}}>· {c.date}</span>}
                    {c.link!=='#' && <CheckCircle size={12} className="text-green-400"/>}
                  </div>
                </div>

                {isAdmin && (
                  <button onClick={()=>setCertificates(certificates.filter(cc=>cc.id!==c.id))}
                    className="p-1.5 bg-red-500/70 hover:bg-red-500 text-white rounded-full transition-all flex-shrink-0">
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Google Cloud profile links */}
          <div className={`mt-10 flex flex-wrap justify-center gap-4 reveal delay-600 ${certVis?'visible':''}`}>
            <a href="https://www.cloudskillsboost.google/public_profiles/b131287b-f220-4aa3-8b4e-116c192d8b5b"
               target="_blank" rel="noreferrer"
               className="btn-glow glass-light px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 border hover:border-blue-400/50 transition-all text-blue-400"
               style={{borderColor:'var(--border)'}}
               onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
              ☁️ Google Cloud Skills Boost Profile
            </a>
            <a href="https://www.skills.google/public_profiles/2183bd9e-6bb3-4ff5-8013-f244b8d87519"
               target="_blank" rel="noreferrer"
               className="btn-glow glass-light px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 border hover:border-purple-400/50 transition-all text-purple-400"
               style={{borderColor:'var(--border)'}}
               onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
              🤖 Google AI Skills Profile
            </a>
          </div>
        </div>
      </section>

      {/* ════════ CONTACT ════════ */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="orb orb-purple w-80 h-80 right-[-6%] bottom-[-5%] opacity-25"/>
        <div className="orb orb-cyan   w-60 h-60 left-[10%] top-[20%] opacity-20"/>
        <div className="max-w-2xl mx-auto">
          <div ref={contactRef} className={`reveal ${contactVis?'visible':''}`}>
            <p className="text-center text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Let's talk</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-center gradient-text-anim mb-6">Get In Touch</h2>
            <p className="text-center text-lg mb-14 leading-relaxed" style={{color:'var(--text-2)'}}>
              I'm currently looking for new opportunities. Whether you have a question or want to say hi,
              my inbox is always open!
            </p>
          </div>

          <div className={`glass rounded-3xl p-8 md:p-10 border reveal delay-200 ${contactVis?'visible':''}`} style={{borderColor:'var(--border)'}}>
            <form action="https://formspree.io/f/manjogkz" method="POST" className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--text-3)'}}>Name</label>
                  <input type="text" name="name" placeholder="Your name" required className="form-input w-full px-4 py-3.5 rounded-xl text-sm"
                    onFocus={()=>setCursorBig(true)} onBlur={()=>setCursorBig(false)}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--text-3)'}}>Email</label>
                  <input type="email" name="email" placeholder="your@email.com" required className="form-input w-full px-4 py-3.5 rounded-xl text-sm"
                    onFocus={()=>setCursorBig(true)} onBlur={()=>setCursorBig(false)}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--text-3)'}}>Message</label>
                <textarea name="message" placeholder="Tell me about your project or opportunity…" required rows={5}
                  className="form-input w-full px-4 py-3.5 rounded-xl text-sm resize-none"
                  onFocus={()=>setCursorBig(true)} onBlur={()=>setCursorBig(false)}/>
              </div>
              <button type="submit"
                onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
                className="btn-glow w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-xl font-bold text-base">
                Send Message ✉️
              </button>
            </form>

            <div className="mt-10 pt-8 border-t" style={{borderColor:'var(--border)'}}>
              <p className="text-center text-xs uppercase tracking-widest mb-6" style={{color:'var(--text-3)'}}>Find me elsewhere</p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { label:'GitHub',    icon:<Github size={16}/>,    href:'https://github.com/Anirban-coder' },
                  { label:'LinkedIn',  icon:<Linkedin size={16}/>,  href:'https://www.linkedin.com/in/anirban-routh20/' },
                  { label:'LeetCode',  icon:<SiLeetcode size={15}/>,href:'https://leetcode.com/u/Anirban_Routh/' },
                  { label:'Email',     icon:<Mail size={16}/>,      href:'mailto:anirbanrouth22@gmail.com' },
                ].map(({label,icon,href})=>(
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                    style={{color:'var(--text-2)'}}
                    onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}>
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-10 px-6 text-center border-t" style={{borderColor:'var(--border)'}}>
        <p className="font-display font-bold text-lg gradient-text-anim mb-2">Anirban Routh</p>
        <p className="text-sm" style={{color:'var(--text-3)'}}>© 2026 · Built with React & Tailwind CSS · Architected with 💻 and ☕</p>
      </footer>

      {/* ════════ BACK TO TOP ════════ */}
      {showTop && (
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          onMouseEnter={()=>setCursorBig(true)} onMouseLeave={()=>setCursorBig(false)}
          className="back-top-btn fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)]">
          <ArrowUp size={20}/>
        </button>
      )}
    </div>
  );
}