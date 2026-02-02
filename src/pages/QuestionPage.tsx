import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { FormQuestionsData } from '../data/question';
import { generateAIPlan } from '../api/ai';
import type { Option, AIRequestPayload } from '../types';

const QuestionPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Record<string, string>>(() => { //html input returns strings
    const saved = sessionStorage.getItem('questionnaire_progress');
    return saved ? JSON.parse(saved) : {
        age: '',
        investmentPurpose: '',
        investmentHorizon: '',
        investmentKnowledge: '',
        riskTolerance: '',
        amount: '',
        currency: '',
        location: '',
    };
  });

  useEffect(() => {
    sessionStorage.setItem('questionnaire_progress', JSON.stringify(formData));
  }, [formData]);

  const mutation = useMutation({
    mutationFn: generateAIPlan,
    onSuccess: (data) => {
      sessionStorage.removeItem('questionnaire_progress'); 
      sessionStorage.setItem('ai_result', JSON.stringify(data)); 
      navigate('/dashboard/plan', { state: { plan: data } }); 
    },
    onError: (err: Error) => {
      console.error("Plan Generation Error:", err);
      setError(err.message || 'Failed to generate plan. Please checks your inputs.');
    }
  });

  const currentQuestion = FormQuestionsData[currentStep];
  const isLastStep = currentStep === FormQuestionsData.length - 1;
  const progressPercentage = ((currentStep + 1) / FormQuestionsData.length) * 100;

  const handleOptionSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, [currentQuestion.name]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [currentQuestion.name]: e.target.value }));
  };

  const handleNext = () => {
    if (!formData[currentQuestion.name]) {
      setError('Please answer the question to proceed.');
      return;
    }
    setError('');

    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    try {
      const payload: AIRequestPayload = {
          age: Number(formData.age),                  
          investmentPurpose: formData.investmentPurpose,
          investmentHorizon: Number(formData.investmentHorizon), 
          investmentKnowledge: formData.investmentKnowledge,
          riskTolerance: formData.riskTolerance,
          amount: Number(formData.amount),           
          currency: formData.currency,
          location: formData.location || "Lagos"    
      };
      console.log("Sending Payload to API:", payload);

      mutation.mutate(payload);
    } catch {
      setError("Please ensure all number fields (Age, Amount) are valid numbers.");
    }
  };

  const renderInput = () => {
    const isTextInput = currentQuestion.options.length === 1 && currentQuestion.options[0].value === "";

    if (isTextInput) {
      const isNumberField = ['age', 'amount', 'investmentHorizon'].includes(currentQuestion.name);

      return (
        <input
          type={isNumberField ? "number" : "text"}
          placeholder={currentQuestion.options[0].label}
          value={formData[currentQuestion.name] || ''}
          onChange={handleTextChange}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-0 outline-none transition-all"
        />
      );
    }

    return (
      <div className="space-y-3">
        {currentQuestion.options.map((option: Option) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect(option.value)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between group
              ${
                formData[currentQuestion.name] === option.value
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
          >
            <span className="font-medium">{option.label}</span>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center
              ${
                formData[currentQuestion.name] === option.value
                  ? 'border-green-600 bg-green-600'
                  : 'border-gray-300'
              }`}
            >
              {formData[currentQuestion.name] === option.value && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-4 font-sans">

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
          <span>Step {currentStep + 1} of {FormQuestionsData.length}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <div className="w-full max-w-lg">
        <div className="h-8 mb-6">
            {currentStep > 0 && (
            <button 
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-medium transition-colors"
            >
                <ChevronLeftIcon className="w-4 h-4" /> Back
            </button>
            )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="mb-10">
          {renderInput()}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={mutation.isPending}
          className="w-full py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            'Analyzing...'
          ) : isLastStep ? (
            'Generate My Plan'
          ) : (
            <>
              Next Step <ChevronRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;