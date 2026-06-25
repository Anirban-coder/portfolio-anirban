import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import './CertificateBook.css';

function BadgeIcon({ image, category, alt }) {
  const [err, setErr] = useState(false);
  const catClass = { cloud: 'badge-cloud', ai: 'badge-ai', dsa: 'badge-dsa', google: 'badge-google' };
  const catEmoji = { cloud: '☁️', ai: '🤖', dsa: '💡', google: '🎯' };

  if (image && !err) {
    return (
      <img
        src={image} alt={alt}
        className="w-[80px] h-[80px] object-contain flex-shrink-0 drop-shadow-md"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center text-3xl border bg-black/5 ${catClass[category] || 'badge-google'}`}>
      {catEmoji[category] || '🏅'}
    </div>
  );
}

const Page = forwardRef((props, ref) => {
  return (
    <div className="book-page-wrapper" ref={ref} data-density={props.density || "soft"}>
      <div className={`book-page-content ${props.isCover ? 'book-cover' : 'book-paper'}`}>
        {props.children}
      </div>
    </div>
  );
});

export default function CertificateBook({ certificates }) {
  const bookRef = useRef();
  const containerRef = useRef();

  // Handle wheel scrolling over the book to turn pages instead of scrolling the window
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // We use a flag to prevent multiple flips firing from a single quick scroll
    let isFlipping = false;

    const handleWheel = (e) => {
      if (!bookRef.current) return;
      const pageFlip = bookRef.current.pageFlip();
      const current = pageFlip.getCurrentPageIndex();
      const max = pageFlip.getPageCount();

      // Only intercept if we have room to flip
      if (e.deltaY > 0) {
        // Scrolling down -> flip next
        // If we are not at the very end
        if (current < max - 2) {
          e.preventDefault();
          if (!isFlipping) {
            isFlipping = true;
            pageFlip.flipNext();
            setTimeout(() => isFlipping = false, 600); // Wait for animation
          }
        }
      } else if (e.deltaY < 0) {
        // Scrolling up -> flip prev
        if (current > 0) {
          e.preventDefault();
          if (!isFlipping) {
            isFlipping = true;
            pageFlip.flipPrev();
            setTimeout(() => isFlipping = false, 600);
          }
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const pages = [
    /* Front Cover (Red) */
    <Page key="cover-front" density="hard" isCover={true}>
       <div className="flex flex-col items-center justify-center h-full text-white px-8 text-center border-l-8 border-black/20">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
             <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-display mb-4 tracking-wide uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>My<br/>Credentials</h1>
          <div className="w-12 h-1 bg-white/30 mx-auto mt-4 rounded-full"></div>
       </div>
    </Page>,

    /* Inner Cover Page */
    <Page key="cover-inner-front" density="hard" isCover={true}>
       <div className="w-full h-full bg-slate-900 flex items-center justify-center border-r-8 border-black/20">
         <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
       </div>
    </Page>,

    /* Certificate Pages (White lined pages) */
    ...certificates.map((c, i) => (
       <Page key={c.id}>
          <div className="flex flex-col items-center text-center h-full pt-12 pb-8 px-6 relative">
             <div className="relative z-10 flex flex-col items-center h-full w-full">
                <BadgeIcon image={c.image} category={c.category} alt={c.name}/>
                
                <div className="mt-8 mb-4 w-full px-4">
                   <h3 className="font-bold text-xl md:text-2xl text-gray-800 leading-snug">{c.name}</h3>
                </div>
                
                <div className="mt-auto mb-10 w-full flex flex-col items-center">
                   <p className="text-lg font-bold text-blue-600 tracking-wide mb-1">{c.issuer}</p>
                   {c.date && <p className="text-sm text-gray-500 font-medium">{c.date}</p>}
                   
                   {c.link !== '#' && (
                     <a href={c.link} target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-full font-semibold transition-colors shadow-sm">
                       Verify <ExternalLink size={16} />
                     </a>
                   )}
                </div>
                
                <div className="absolute bottom-4 text-gray-400 font-serif text-sm">
                   - {i + 1} -
                </div>
             </div>
          </div>
       </Page>
    ))
  ];

  /* Padding pages if odd number of certificates so back cover renders correctly */
  if (certificates.length % 2 !== 0) {
    pages.push(
      <Page key="padding">
         <div className="w-full h-full flex items-center justify-center opacity-10">
            <div className="text-6xl">📝</div>
         </div>
      </Page>
    );
  }

  pages.push(
    /* Inner Back Cover */
    <Page key="cover-inner-back" density="hard" isCover={true}>
       <div className="w-full h-full bg-slate-900 flex items-center justify-center border-l-8 border-black/20">
         <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
       </div>
    </Page>
  );

  pages.push(
    /* Back Cover (Red) */
    <Page key="cover-back" density="hard" isCover={true}>
       <div className="flex items-center justify-center h-full text-white/50 px-8 text-center border-r-8 border-black/20">
          <span className="font-display font-bold tracking-widest uppercase">The End</span>
       </div>
    </Page>
  );

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full mt-10 mb-6 relative z-10" style={{ perspective: '2000px' }}>
      
      {/* Scroll Hint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs tracking-widest text-gray-400 uppercase animate-pulse">
        Scroll over book to turn pages
      </div>

      <div className="isometric-book-wrapper">
        <HTMLFlipBook 
          width={400} 
          height={550} 
          size="stretch"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={650}
          maxShadowOpacity={0.3}
          showCover={true}
          mobileScrollSupport={true}
          useMouseEvents={false} // Disable drag-to-flip because isometric 3D breaks mouse tracking
          className="real-book"
          ref={bookRef}
        >
          {pages}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
