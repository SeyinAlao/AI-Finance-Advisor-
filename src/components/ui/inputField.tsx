import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // added this to show Yup validation errors
}

export const InputField = ({ label, error, ...props }: InputFieldProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input 
        {...props} 
        className={`w-full px-4 py-2 rounded-lg border outline-none transition-all focus:ring-2 
          ${error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-green-600 focus:border-transparent'}`}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};