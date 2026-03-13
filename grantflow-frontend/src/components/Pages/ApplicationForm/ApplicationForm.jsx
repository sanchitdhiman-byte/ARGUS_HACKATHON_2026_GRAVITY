import React, { useState } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import FormStepper from './FormStepper';
import OrganisationStep from './OrganisationStep';
import ProjectStep from './ProjectStep';
import BudgetStep from './BudgetStep';
import ExperienceStep from './ExperienceStep';
import DocumentStep from './DocumentStep';
import ReviewStep from './ReviewStep';
import FormControls from './FormControls';
import GuidanceCards from './GuidanceCards';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { GRANTS_DATA } from '../../../data/grants';

const ApplicationForm = ({ onNavigate, isLoggedIn, onLogout, selectedGrantType }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const currentGrant = selectedGrantType || 'CDG';

  const [formData, setFormData] = useState({
    // Org
    orgName: '', regNumber: '', entityType: '', establishedYear: '',
    budget: '', contactName: '', contactRole: '', email: '', phone: '',
    address: '', city: '', stateRegion: '', postalCode: '',
    // Project
    projectTitle: '', projectLocation: '', projectType: '', problemStatement: '',
    proposedSolution: '', targetBeneficiaries: '', demographics: '',
    startDate: '', endDate: '', keyActivities: '', expectedOutcomes: '',
    schoolsTargeted: '', gradeCoverage: '', // EIG specific
    // Budget
    personnel: '', equipment: '', travel: '', overheads: '', other: '', totalRequested: '', justification: '',
    // Experience
    hasPreviousGrants: false, priorProjects: ['', ''],
    priorFunder: '', priorAmount: '', signatoryName: '', designation: '', submissionDate: new Date().toISOString().split('T')[0],
    declared: false,
    // Docs
    uploadedDocs: {}
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('--- SUBMITTING GRANT APPLICATION ---');
      console.log('Grant Type:', currentGrant);
      console.log('Payload:', JSON.stringify(formData, null, 2));
      console.log('------------------------------------');
      alert(`Application for ${currentGrant} submitted successfully! Check console for payload.`);
      onNavigate('landing');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    alert("Draft saved successfully!");
  };

  const stepProps = {
    data: formData,
    onChange: handleChange,
    grantType: currentGrant
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <OrganisationStep {...stepProps} />;
      case 2: return <ProjectStep {...stepProps} />;
      case 3: return <BudgetStep {...stepProps} />;
      case 4: return <ExperienceStep {...stepProps} />;
      case 5: return <DocumentStep {...stepProps} />;
      case 6: return <ReviewStep {...stepProps} onEditSection={setCurrentStep} />;
      default: return <OrganisationStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary/30 flex flex-col">
      <GlobalHeader 
        currentView="my-applications" 
        onNavigate={onNavigate} 
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
      
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <button 
          onClick={() => onNavigate('landing')}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-bold text-sm uppercase tracking-wider"
        >
          <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Grants
        </button>

        <FormStepper currentStep={currentStep} totalSteps={totalSteps} grantType={currentGrant} />
        
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderStep()}

          <FormControls 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            onNext={handleNext} 
            onPrevious={handlePrevious} 
            onSave={handleSave}
          />
        </div>

        <GuidanceCards />

        <div className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
            Switch Application Category (Demo)
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {GRANTS_DATA.map(type => (
              <button 
                key={type.id}
                onClick={() => onNavigate('form', { grantType: type.id })}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-bold text-sm active:scale-95 ${
                  currentGrant === type.id 
                    ? "border-primary bg-primary/10 text-slate-900 dark:text-white shadow-lg shadow-primary/5" 
                    : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                }`}
              >
                <span className="material-symbols-outlined !text-lg">{type.mobileIcon}</span>
                {type.shortTitle}
              </button>
            ))}
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default ApplicationForm;
