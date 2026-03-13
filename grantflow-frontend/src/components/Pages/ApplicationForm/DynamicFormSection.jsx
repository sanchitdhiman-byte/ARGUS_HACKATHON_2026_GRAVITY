import React, { useEffect, useMemo } from 'react';

/**
 * Renders a form section dynamically from grant metadata.
 * Each field in `section.fields` is rendered based on its `type`.
 * Budget auto-sum and overhead cap warnings are handled inline.
 */
const DynamicFormSection = ({ section, data, onChange, grantType }) => {
  const fields = section.fields || [];
  const rules = section.rules || {};

  // Auto-calculate totalRequested from budget lines
  const budgetLineKeys = useMemo(
    () => fields.filter(f => f.budget_line).map(f => f.key),
    [fields]
  );
  const hasAutoSum = fields.some(f => f.auto_sum);

  useEffect(() => {
    if (!hasAutoSum || budgetLineKeys.length === 0) return;
    const total = budgetLineKeys.reduce(
      (sum, k) => sum + (parseFloat(data[k]) || 0),
      0
    );
    if (total.toString() !== data.totalRequested && (total > 0 || data.totalRequested)) {
      onChange('totalRequested', total.toString());
    }
  }, budgetLineKeys.map(k => data[k]));

  // Overhead warning
  const overheadWarning = useMemo(() => {
    if (!rules.overhead_cap_pct) return null;
    const total = parseFloat(data.totalRequested) || 0;
    const overheads = parseFloat(data.overheads) || 0;
    if (total > 0 && overheads > 0) {
      const pct = (overheads / total) * 100;
      if (pct > rules.overhead_cap_pct) {
        return `Overhead costs (${pct.toFixed(1)}%) exceed the ${rules.overhead_cap_pct}% cap. Please reduce overhead or increase other line items.`;
      }
    }
    return null;
  }, [data.totalRequested, data.overheads, rules.overhead_cap_pct]);

  // Funding range warning
  const fundingWarning = useMemo(() => {
    if (!rules.funding_min && !rules.funding_max) return null;
    const total = parseFloat(data.totalRequested) || 0;
    if (total > 0) {
      if (total < (rules.funding_min || 0)) {
        return `Total requested (INR ${total.toLocaleString('en-IN')}) is below the minimum of INR ${(rules.funding_min || 0).toLocaleString('en-IN')}.`;
      }
      if (total > (rules.funding_max || Infinity)) {
        return `Total requested (INR ${total.toLocaleString('en-IN')}) exceeds the maximum of INR ${(rules.funding_max || 0).toLocaleString('en-IN')}.`;
      }
    }
    return null;
  }, [data.totalRequested, rules.funding_min, rules.funding_max]);

  const inputClass = "w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 transition-all font-medium";
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2";

  const renderField = (field) => {
    const value = data[field.key] ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="col-span-full">
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.rubric_hint && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined !text-sm">stars</span>
                {field.rubric_hint}
              </p>
            )}
            <textarea
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || ''}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            <div className="relative">
              <select
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`${inputClass} appearance-none text-sm`}
              >
                <option value="">Select an option</option>
                {(field.options || []).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="col-span-full">
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-primary border-primary rounded focus:ring-primary"
                id={`field-${field.key}`}
                checked={!!data[field.key]}
                onChange={(e) => onChange(field.key, e.target.checked)}
              />
              <label htmlFor={`field-${field.key}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
                {field.label} {field.required && <span className="text-primary">*</span>}
              </label>
            </div>
          </div>
        );

      case 'number':
        if (field.auto_sum) {
          // Read-only auto-calculated total
          return (
            <div key={field.key} className="col-span-full">
              <label className={labelClass}>
                {field.label} {field.required && <span className="text-primary">*</span>}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">&#8377;</span>
                <input
                  readOnly
                  value={value}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 pl-8 pr-4 py-4 text-xl font-black text-slate-900 dark:text-white cursor-not-allowed"
                  placeholder="0.00 (Auto-calculated)"
                  type="text"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Auto-calculated from line items above.</p>
            </div>
          );
        }
        return (
          <div key={field.key}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.rubric_hint && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined !text-sm">stars</span>
                {field.rubric_hint}
              </p>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || '0'}
              min={field.min}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.key}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
            />
          </div>
        );

      case 'email':
        return (
          <div key={field.key}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            <input
              type="email"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || ''}
            />
          </div>
        );

      case 'tel':
        return (
          <div key={field.key}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            <input
              type="tel"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || ''}
            />
          </div>
        );

      default: // text
        return (
          <div key={field.key} className={field.key === 'orgName' ? 'col-span-full' : ''}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-primary">*</span>}
            </label>
            {field.rubric_hint && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined !text-sm">stars</span>
                {field.rubric_hint}
              </p>
            )}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClass}
              placeholder={field.placeholder || ''}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="material-symbols-outlined">{section.icon || 'description'}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">{section.title}</h3>
            {section.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
            )}
          </div>
        </div>
      </div>

      <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Budget warnings */}
        {overheadWarning && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg">warning</span>
            {overheadWarning}
          </div>
        )}
        {fundingWarning && (
          <div className="bg-amber-500/10 border border-amber-500/50 text-amber-600 dark:text-amber-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined !text-lg">info</span>
            {fundingWarning}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(renderField)}
        </div>
      </form>
    </div>
  );
};

export default DynamicFormSection;
