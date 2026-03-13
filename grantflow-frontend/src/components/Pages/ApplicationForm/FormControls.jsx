import React from 'react';

const FormControls = ({ currentStep, totalSteps = 6, onPrevious, onNext, onSave }) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 rounded-2xl">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <button 
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-all shadow-sm w-full sm:w-auto active:scale-95"
        >
          <span className="material-symbols-outlined !text-lg">save</span>
          Save Draft
        </button>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <button 
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto active:scale-95 ${
            isFirstStep 
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed" 
              : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm"
          }`}
        >
          <span className="material-symbols-outlined !text-lg">arrow_back</span>
          Previous
        </button>
        <button 
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary font-bold text-slate-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto active:scale-95"
        >
          {isLastStep ? 'Submit Application' : 'Next Step'}
          <span className="material-symbols-outlined !text-lg">{isLastStep ? 'send' : 'arrow_forward'}</span>
        </button>
      </div>
    </div>
  );
};

export default FormControls;
