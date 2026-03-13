import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import FormStepper from './FormStepper';
import DynamicFormSection from './DynamicFormSection';
import DocumentStep from './DocumentStep';
import ReviewStep from './ReviewStep';
import FormControls from './FormControls';
import GuidanceCards from './GuidanceCards';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { GRANTS_DATA } from '../../../data/grants';
import { applicationsAPI, publicAPI } from '../../../services/api';

const ApplicationForm = ({ onNavigate, isLoggedIn, onLogout, selectedGrantType, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const currentGrant = selectedGrantType || 'CDG';

  // Dynamic sections from metadata (or fallback count)
  const metaSections = metadata?.sections || [];
  // Steps: metadata sections + Documents + Review
  const totalSteps = metaSections.length + 2;

  const [formData, setFormData] = useState({
    // Org
    orgName: '', regNumber: '', entityType: '', establishedYear: '',
    budget: '', contactName: '', contactRole: '', email: '', phone: '',
    address: '', city: '', stateRegion: '', postalCode: '',
    // Project
    projectTitle: '', projectLocation: '', projectType: '', problemStatement: '',
    proposedSolution: '', targetBeneficiaries: '', demographics: '',
    startDate: '', endDate: '', keyActivities: '', expectedOutcomes: '',
    schoolsTargeted: '', gradeCoverage: '',
    // CDG-specific
    communityNeed: '', impactOutcomes: '',
    // EIG-specific
    innovationDescription: '', learningOutcomes: '', scalabilityPlan: '', teamCapacity: '',
    // ECAG-specific
    environmentalImpact: '', communityOwnership: '', technicalMethodology: '', climateMetrics: '', orgCapacity: '',
    // Budget
    personnel: '', equipment: '', travel: '', overheads: '', other: '', totalRequested: '', justification: '',
    // Experience
    hasPreviousGrants: false, priorProjects: '', trackRecord: '',
    priorFunder: '', priorAmount: '', signatoryName: '', designation: '',
    submissionDate: new Date().toISOString().split('T')[0],
    declared: false,
    // Docs
    uploadedDocs: {}
  });

  // Fetch grant metadata on mount or grant type change
  useEffect(() => {
    setMetaLoading(true);
    publicAPI.programmeMetadataByType(currentGrant)
      .then(res => {
        setMetadata(res.data);
        setMetaLoading(false);
      })
      .catch(() => {
        // Fallback: no metadata available, will use static steps
        setMetadata(null);
        setMetaLoading(false);
      });
  }, [currentGrant]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Allow chatbot to push validated data into form state
  const handleChatDataPush = (fieldUpdates) => {
    setFormData(prev => ({ ...prev, ...fieldUpdates }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit application via API
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await applicationsAPI.create(currentGrant, formData);
        const refId = res.data.reference_id;
        alert(`Application submitted successfully!\nReference: ${refId}\nAI Score: ${res.data.ai_score}`);
        onNavigate('my-applications');
      } catch (err) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          // Validation errors from grant metadata validation
          setSubmitError(detail.join('\n'));
        } else {
          setSubmitError(typeof detail === 'string' ? detail : 'Submission failed. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    localStorage.setItem(`draft_${currentGrant}`, JSON.stringify(formData));
    alert("Draft saved locally!");
  };

  const renderStep = () => {
    // If metadata is loaded and we're in a metadata section step
    if (metadata && currentStep <= metaSections.length) {
      const section = metaSections[currentStep - 1];
      return (
        <DynamicFormSection
          section={section}
          data={formData}
          onChange={handleChange}
          grantType={currentGrant}
        />
      );
    }

    // Documents step (second-to-last)
    if (currentStep === totalSteps - 1) {
      return <DocumentStep data={formData} onChange={handleChange} grantType={currentGrant} />;
    }

    // Review step (last)
    if (currentStep === totalSteps) {
      return <ReviewStep data={formData} onEditSection={setCurrentStep} grantType={currentGrant} />;
    }

    return null;
  };

  // Loading state while fetching metadata
  if (metaLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col">
        <GlobalHeader currentView="my-applications" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined !text-4xl text-primary animate-spin">progress_activity</span>
            <p className="mt-4 text-sm font-bold text-slate-500">Loading form for {currentGrant}...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary/30 flex flex-col">
      <GlobalHeader
        currentView="my-applications"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        user={user}
      />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <button
          onClick={() => onNavigate('landing')}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-bold text-sm uppercase tracking-wider"
        >
          <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Grants
        </button>

        {/* Programme name badge */}
        {metadata && (
          <div className="mb-6 flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary font-black text-xs uppercase tracking-widest rounded-full">
              {metadata.code}
            </span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{metadata.name}</span>
          </div>
        )}

        <FormStepper currentStep={currentStep} totalSteps={totalSteps} grantType={currentGrant} />

        {submitError && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-600 dark:text-rose-400 px-6 py-4 rounded-2xl text-sm font-bold">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined">error</span>
              Validation Errors
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {submitError.split('\n').map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderStep()}

          <FormControls
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSave}
            submitting={submitting}
          />
        </div>

        <GuidanceCards grantType={currentGrant} onChatDataPush={handleChatDataPush} />

        <div className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
            Switch Application Category
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {GRANTS_DATA.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setCurrentStep(1);
                  onNavigate('form', { grantType: type.id });
                }}
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
