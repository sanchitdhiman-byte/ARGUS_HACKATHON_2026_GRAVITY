import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import Hero from '../../Core/shared/Hero';
import Filters from './Filters';
import GrantCard from './GrantCard';
import GrantModal from './GrantModal';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import MobileBottomNav from '../../Core/shared/MobileBottomNav';

import { GRANTS_DATA } from '../../../data/grants';

const LandingPage = ({ onNavigate, isLoggedIn, onLogin, onLogout, user }) => {
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grants, setGrants] = useState(GRANTS_DATA);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/grants')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const merged = res.data.map(apiGrant => {
            const local = GRANTS_DATA.find(g => g.id === apiGrant.code);
            if (local) {
              return {
                ...local,
                fundingMin: apiGrant.funding_min,
                fundingMax: apiGrant.funding_max,
                fundingRange: apiGrant.funding_range || local.fundingRange,
                deadline: apiGrant.deadline || local.deadline,
                description: apiGrant.description || local.description,
              };
            }
            // New grant added by admin — basic display fallback
            return {
              id: apiGrant.code,
              title: apiGrant.title,
              shortTitle: apiGrant.short_title,
              description: apiGrant.description,
              fundingRange: apiGrant.funding_range || `₹${apiGrant.funding_min}–₹${apiGrant.funding_max}`,
              deadline: apiGrant.deadline || 'Open',
              image: '',
              imageAlt: apiGrant.title,
              category: 'Grant',
              categoryColor: 'bg-slate-500 text-white',
              mobileIcon: 'description',
              meta: [
                { label: 'Funding Range', value: apiGrant.funding_range || '', highlight: true },
                { label: 'Duration', value: `${apiGrant.duration_min}–${apiGrant.duration_max} Months` },
                { label: 'Deadline', value: apiGrant.deadline || 'Open' },
                { label: 'Eligibility', value: JSON.parse(apiGrant.eligible_types || '[]').slice(0, 2).join('/') },
              ],
            };
          });
          setGrants(merged);
        }
      })
      .catch(() => { /* fall back to static data silently */ });
  }, []);

  const handleOpenDetails = (grant) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  const handleApplyNow = (grant) => {
    if (!isLoggedIn) {
      onNavigate('login');
      return;
    }
    const grantType = grant?.id || selectedGrant?.id || 'CDG';
    onNavigate('form', { grantType });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary/30 flex flex-col">
      <GlobalHeader
        currentView="explore-grants"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
        user={user}
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
              {grants.length} Opportunities Found
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grants.map((grant) => (
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
