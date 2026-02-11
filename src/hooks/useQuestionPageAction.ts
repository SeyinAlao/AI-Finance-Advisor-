import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FormQuestionsData } from '../data/question';
import { generateAIPlan } from '../api/ai';
import type { AIRequestPayload } from '../types';

export const useQuestionPageAction = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Record<string, string>>(() => {
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

  // 3. API Mutation
  const mutation = useMutation({
    mutationFn: generateAIPlan,
    onSuccess: (data) => {
      sessionStorage.removeItem('questionnaire_progress'); 
      sessionStorage.setItem('ai_result', JSON.stringify(data)); 
      navigate('/dashboard/plan', { state: { plan: data } }); 
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to generate plan.');
    }
  });

  const currentQuestion = FormQuestionsData[currentStep];
  const isLastStep = currentStep === FormQuestionsData.length - 1;
  const progressPercentage = ((currentStep + 1) / FormQuestionsData.length) * 100;

  // 4. Action Handlers
  const handleOptionSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, [currentQuestion.name]: value }));
    setError(''); // Clear error when they pick an option
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [currentQuestion.name]: e.target.value }));
    setError('');
  };

  const handleNext = () => {
    if (!formData[currentQuestion.name]) {
      setError('Please answer the question to proceed.');
      return;
    }

    if (isLastStep) {
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
      mutation.mutate(payload);
    } else {
      setCurrentStep((prev) => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return {
    currentStep,
    formData,
    error,
    FormQuestionsData,
    currentQuestion,
    isLastStep,
    progressPercentage,
    handleOptionSelect,
    handleTextChange,
    handleNext,
    handleBack,
    mutation,
  };
};