import type { SignupRequest } from "../types";
import { signupUser, confirmUser } from "../api/auth"; 
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";   
import { useNavigate } from "react-router-dom";
import type React from "react";
import * as Yup from "yup";
import { signupSchema } from "../utils/validation";

export const useSignupAction = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<SignupRequest>({ 
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        userName: '',
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);

    const confirmMutation = useMutation({
        mutationFn: confirmUser,
        onSuccess: () => {
            setStatus({ type: 'success', message: 'Account verified successfully! Redirecting...' });
            setTimeout(() => navigate('/login'), 1500);
        },
        onError: (error: Error) => {
            setStatus({ type: 'error', message: `Verification failed: ${error.message}` });
        }
    });

    const signupMutation = useMutation({
        mutationFn: signupUser,
        onSuccess: (data) => {
            const token = data.token; 
            
            if (token) {
                setStatus({ type: 'success', message: 'Account created! Verifying...' });
                confirmMutation.mutate({ email: formData.email, token });
            } else {
                setStatus({ type: 'success', message: 'Account created. Please login.' });
                setTimeout(() => navigate('/login'), 2000);
            }
        },
        onError: (error: Error) => {
            setStatus({ type: 'error', message: error.message || "Signup failed" });
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        try {
            await signupSchema.validate(formData, { abortEarly: false });
            // Now you can just send formData directly because it already perfectly matches the backend!
            await signupMutation.mutateAsync(formData);
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const allErrors = error.inner.map(err => err.message).join(" | ");
                setStatus({ type: 'error', message: allErrors });
            }
        }
    };
    
    return {
        status,
        showPassword,
        setShowPassword,
        handleChange,
        handleSubmit,
        formData,
        signupMutation,
    };
}