import React, { useState } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import Hero from '../../Core/shared/Hero';
import Filters from './Filters';
import GrantCard from './GrantCard';
import GrantModal from './GrantModal';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import MobileBottomNav from '../../Core/shared/MobileBottomNav';

const GRANTS_DATA = [
  {
    id: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_mvoZaxEqUaG2o1-l7jUV_1AkpeWszwRscGG_6Lt4GilbNZHvoT9Sn-OToaa6vD6lCQ9G2pJKY6_k7b2CIkTsAttUG11DmZWtd_hD2tTJ0jmRtPVDAcnokyt2dy-asAWPXk-rpO7Hg5mUmn212cCoJKDQ7qgbtL8fyJTIGOouV-SjbrDa6LMxFq0FkU0v0e6-obtW3pozASxK6WmPbuYeGvWkn_KuDtJheE-dXF4dPwuO5A9h1-LjtZu0mbezZcbrV40hMmd854",
    imageAlt: "Community Development",
    category: "Community",
    categoryColor: "bg-primary text-slate-900",
    mobileIcon: "groups",
    title: "Community Development Grant (CDG)",
    description: "Supporting neighborhood transformation through infrastructure improvements and local leadership initiatives. Ideal for grassroots organizations looking for scaling support.",
    meta: [
      { label: "Funding Range", value: "$10k - $50k", highlight: true },
      { label: "Duration", value: "12-24 Months" },
      { label: "Deadline", value: "Oct 30, 2024", danger: true },
      { label: "Eligibility", value: "NGOs/NPOs" },
    ],
  },
  {
    id: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIb3ZVL3KSR6B1950t0U2IzABRssRCKyPE616P3k8hnVtbXzX1Lir5wre5z3_S48pHrdT_ifgZpI7HKHDgadJnoyBGp24WFw8iwJHKGorFvz7oNenzV8kdFmX4J3pkKgs5gkF3hKc_a21PfOL6V2mxMsSnKEwqy0kt7QP4YMA252YKhsZADbBlB0SxUMa-D3Ena7DHUF1G85q-QKlzjfyv_cpB4_CmfIlgL1oTQfjVGYE-K6e6t0AiLB7DM2bbLiqHHTXgI33JI4o",
    imageAlt: "Education Innovation",
    category: "Education",
    categoryColor: "bg-blue-600 text-white",
    mobileIcon: "school",
    title: "Education Innovation Grant (EIG)",
    description: "Funding for projects that leverage technology to bridge educational gaps in underserved regions. Support for hybrid learning models and teacher training.",
    meta: [
      { label: "Funding Range", value: "$25k - $100k", highlight: true },
      { label: "Duration", value: "18-36 Months" },
      { label: "Deadline", value: "Nov 15, 2024", danger: true },
      { label: "Eligibility", value: "Schools/Labs" },
    ],
  },
  {
    id: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc-DGLOJ49OIxv_AGnA8myVZz4-tBbKW_r2XPsYIt_aWH5Nb4j6xBLEV3tB3Ackq2CBhsIGU-aRhpYhwf89M32_LSOrUWHDM02L5cc6U3PZVEUYr9-qnvy9EBKqMO0_C720M0xCRHw509F03yC9z752wQHBOvGdswAWJVr-xxljJqXKvFquoWySL5vHvBVFowObrFiUKd8hFGcrGB9zstWB-rD8QDM4UNnYh2KUAhyMCRYl_wqFa13lDNCgg2Wb6VPoQCyIwT-TEY",
    imageAlt: "Eco Action",
    category: "Environment",
    categoryColor: "bg-green-600 text-white",
    mobileIcon: "eco",
    title: "Eco-Action Grant (ECAG)",
    description: "Empowering grassroots movements to combat climate change through direct action, reforestation, and sustainable energy education programs.",
    meta: [
      { label: "Funding Range", value: "$5k - $20k", highlight: true },
      { label: "Duration", value: "6-12 Months" },
      { label: "Deadline", value: "Dec 01, 2024", danger: true },
      { label: "Eligibility", value: "Youth Groups" },
    ],
  },
  {
    id: 4,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_5qaZZEVrcMgCWxCTvccmZdjZhtXj4LUcXPuiP6dMx10XNtFaJX-sWp5rvflvOdZy1tXlYRINMLmAJDBj7pu17pl0a1CN0kyA1lLrtuB5YKWyOfUNXlKPvyCNtPib-NXOVyo7zkwKZEmt7ZNNLcWK8xz7BmwzdCJBTuOU4zMN7OO8UA8tHSKTB11OAnc41raOZsqocV3yizWfJ_0d4_l4G5IJtOjzSQ8f0uBvm5tIwQVI_ua92TFE8X6Rp7qwKfkbF-f_kOf78wQ",
    imageAlt: "Tech Acceleration",
    category: "Innovation",
    categoryColor: "bg-purple-600 text-white",
    mobileIcon: "rocket",
    title: "Tech Acceleration Fund (TAF)",
    description: "Bridging the gap between prototype and production for deep-tech startups addressing global societal challenges.",
    meta: [
      { label: "Funding Range", value: "Up to $150k", highlight: true },
      { label: "Duration", value: "12 Months" },
      { label: "Deadline", value: "Jan 10, 2025", danger: false },
      { label: "Eligibility", value: "Startups" },
    ],
  },
];

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
        <Hero />
        
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
