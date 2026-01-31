
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              idx + 1 <= currentStep ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}>
              {idx + 1}
            </div>
            <span className={`text-xs mt-2 font-medium ${idx + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
              Step {idx + 1}
            </span>
          </div>
          {idx < totalSteps - 1 && (
            <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
              idx + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
