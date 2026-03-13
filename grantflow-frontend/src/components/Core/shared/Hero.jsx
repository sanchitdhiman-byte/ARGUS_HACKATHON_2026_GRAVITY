import React from 'react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden mb-8 sm:mb-12 bg-slate-900 group">
      {/* Background with parallax-like effect on hover */}
      <div className="absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-105">
        <img
          alt="Grant collaboration"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFNX7lStm6375hWHYRlE8boFjVyrOhV1OJ3QcOud8QZlAuAz_CqCWgZ4KQghTpMmg8zYRfntLseM_7PmWI-gozb5TkSzxAq-4O88TMSn_eN0bYE6KBHoEX5J2wDg-5rnOPhQelFclNxUuZW1zOzmf14jxoeXMY2_gVp9WmZluAPBmOlfXFo4Skq12RjU--VwiJB0Oac2R9FNfcfwh-jzKTSOGT1lO7ybCbgUuSHXa33VgdDYC2SPk6hFtm2N6oOyb710sQnRf2D8w"
        />
      </div>
      
      {/* Gradient overlay for mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent md:hidden" />

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-12 md:p-16 lg:p-24 max-w-4xl">
        <div className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 mb-6 group-hover:translate-x-1 transition-transform">
          <span className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            New Funding Cycle 2026
          </span>
        </div>
        
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] mb-6 drop-shadow-lg">
          Explore Our <span className="text-primary">Grant</span> Programmes
        </h1>
        
        <p className="text-slate-200 text-sm sm:text-base md:text-xl mb-8 leading-relaxed max-w-2xl font-medium">
          Find funding opportunities for community development, education innovation, and environmental projects. Empowering local initiatives since 2010.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-primary px-8 py-4 rounded-xl font-black text-slate-900 text-base sm:text-lg hover:bg-primary/90 transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-primary/20">
            View Grant Catalog
          </button>
          <button 
            onClick={() => onNavigate('eligibility-check')}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all active:scale-[0.98]"
          >
            Check Eligibility First
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
