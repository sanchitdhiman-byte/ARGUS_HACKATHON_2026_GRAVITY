import React from 'react';

const FormStepper = ({ currentStep = 1, totalSteps = 6 }) => {
  const steps = [
    { icon: 'corporate_fare', label: 'Organisation' },
    { icon: 'description', label: 'Project' },
    { icon: 'payments', label: 'Budget' },
    { icon: 'stars', label: 'Experience' },
    { icon: 'upload_file', label: 'Documents' },
    { icon: 'send', label: 'Review' },
  ];

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <nav aria-label="Breadcrumb" className="flex mb-2">
            <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <li>Grant Applications</li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined !text-sm">chevron_right</span>
                <span className="text-primary">CDG-2024-0812</span>
              </li>
            </ol>
          </nav>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Community Development Grant</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Application for local infrastructure and social cohesion programs.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-primary">schedule</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Deadline: Oct 24, 2024</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-start mb-2 overflow-x-auto pb-4 no-scrollbar">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-2 group min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted || isActive 
                      ? "bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/10 text-slate-900" 
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                  }`}>
                    <span className="material-symbols-outlined !text-xl">{step.icon}</span>
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold whitespace-nowrap ${
                    isActive ? "text-primary" : "text-slate-400 dark:text-slate-600"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mt-5 bg-slate-200 dark:bg-slate-700 mx-2 min-w-[20px]">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: isCompleted ? '100%' : '0%' }}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default FormStepper;
