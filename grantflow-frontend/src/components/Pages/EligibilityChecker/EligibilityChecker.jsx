import React, { useState } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { GRANTS_DATA, ORG_TYPES, checkEligibility } from '../../../data/grants';

const EligibilityChecker = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [orgType, setOrgType] = useState('');
  const [yearsOfOperation, setYearsOfOperation] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [results, setResults] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = () => {
    if (!orgType || !fundingAmount) return;
    setChecking(true);
    setTimeout(() => {
      const allResults = GRANTS_DATA.map(grant => 
        checkEligibility(grant.id, orgType, Number(fundingAmount), Number(yearsOfOperation) || 0)
      );
      setResults(allResults);
      setChecking(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col">
      <GlobalHeader currentView="eligibility-check" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="material-symbols-outlined text-primary">fact_check</span>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Pre-Application Check</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Check Your <span className="text-primary">Eligibility</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            No account required. Answer three quick questions to see which grant programmes you may qualify for.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-12">
          <div className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary !text-lg">business</span>
                    Organisation Type <span className="text-primary">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select 
                    value={orgType} 
                    onChange={e => setOrgType(e.target.value)}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 appearance-none font-medium"
                  >
                    <option value="">Select type...</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary !text-lg">schedule</span>
                    Years of Operation
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={yearsOfOperation}
                  onChange={e => setYearsOfOperation(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary !text-lg">currency_rupee</span>
                    Funding Amount (₹) <span className="text-primary">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={fundingAmount}
                  onChange={e => setFundingAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={!orgType || !fundingAmount || checking}
              className="w-full md:w-auto px-10 py-4 bg-primary text-slate-900 font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
            >
              {checking ? (
                <>
                  <span className="animate-spin material-symbols-outlined !text-lg">progress_activity</span>
                  Checking Eligibility...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined !text-lg">search</span>
                  Check All Programmes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Eligibility Results
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {results.map((result, idx) => {
                const grant = GRANTS_DATA[idx];
                return (
                  <div key={grant.id} className={`bg-white dark:bg-slate-900 rounded-2xl border-2 overflow-hidden transition-all ${
                    result.eligible 
                      ? 'border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-none' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className={`px-8 py-5 flex items-center justify-between ${
                      result.eligible ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-50 dark:bg-slate-800/50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          result.eligible ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}>
                          <span className="material-symbols-outlined">{result.eligible ? 'check' : 'close'}</span>
                        </div>
                        <div>
                          <h3 className="font-black text-lg">{grant.title}</h3>
                          <p className="text-sm text-slate-500">{grant.fundingRange} · {grant.duration}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        result.eligible 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {result.eligible ? 'Likely Eligible' : 'Likely Not Eligible'}
                      </span>
                    </div>

                    <div className="p-8 space-y-3">
                      {result.results.map((check, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`material-symbols-outlined !text-lg mt-0.5 ${check.pass ? 'text-emerald-500' : 'text-red-500'}`}>
                            {check.pass ? 'check_circle' : 'cancel'}
                          </span>
                          <div>
                            <p className="text-sm font-bold">{check.criterion}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{check.reason}</p>
                          </div>
                        </div>
                      ))}
                      {result.eligible && (
                        <button 
                          onClick={() => onNavigate('form', { grantType: grant.id })}
                          className="mt-4 px-6 py-3 bg-primary text-slate-900 font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] text-sm"
                        >
                          Start Application →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
};

export default EligibilityChecker;
