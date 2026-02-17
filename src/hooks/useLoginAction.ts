import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import type { LoginRequest } from "../types";
import * as Yup from "yup";
import { loginSchema } from "../utils/validation";

export const useLoginAction = () => {     // remember useform is for form handling and validation, useLoginAction is for login logic and state management.
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login Successful! Response Data:", data);
      const token = data.token;

      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("email", formData.email);
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("email", formData.email);
        }
        setStatus({
          type: "success",
          message: "Login successful! Redirecting...",
        });
        navigate("/dashboard");
      } else {
        setStatus({
          type: "error",
          message: "Login succeeded but no token was received.",
        });
      }
    },
    onError: (error: Error) => {
      setStatus({ type: "error", message: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Modified handleSubmit to include the Yup check
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      await mutation.mutateAsync(formData);

    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        setStatus({ type: "error", message: err.inner[0].message });
      } else {
        setStatus({ type: "error", message: "An unexpected error occurred" });
      }
    }
  };

  return {
    formData,
    status,
    showPassword,
    rememberMe,
    handleChange,
    handleSubmit,
    setShowPassword,
    setRememberMe,
    mutation,
  };
};