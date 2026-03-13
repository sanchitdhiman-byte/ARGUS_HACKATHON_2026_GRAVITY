import React, { useState } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import Hero from '../../Core/shared/Hero';
import Filters from './Filters';
import GrantCard from './GrantCard';
import GrantModal from './GrantModal';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import MobileBottomNav from '../../Core/shared/MobileBottomNav';

import { GRANTS_DATA } from '../../../data/grants';

const LandingPage = ({ onNavigate, isLoggedIn, onLogin, onLogout }) => {
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (grant) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  const handleApplyNow = () => {
    onNavigate('form');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary/30 flex flex-col">
      <GlobalHeader 
        currentView="explore-grants" 
        onNavigate={onNavigate} 
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-12 flex-1 w-full">
        {/* Responsive Hero - adapts internally */}
        <Hero onNavigate={onNavigate} />
        
        {/* Responsive Filters - adapts internally */}
        <Filters />

        {/* Grants Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Recommended <span className="text-primary italic">Grants</span>
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {GRANTS_DATA.length} Opportunities Found
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {GRANTS_DATA.map((grant) => (
              <GrantCard 
                key={grant.id} 
                grant={grant} 
                onOpenDetails={handleOpenDetails}
                onApplyNow={handleApplyNow}
              />
            ))}
          </div>
        </section>
      </main>

      <GlobalFooter />
      <MobileBottomNav onNavigate={onNavigate} currentView="landing" />

      {/* Modular Modal - handles cross-device responsiveness internally */}
      <GrantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        grant={selectedGrant}
        onApplyNow={handleApplyNow}
      />
    </div>
  );
};

export default LandingPage;
