import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import type { LoginRequest } from "../types";

export const useLoginAction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // so that if the person wants to store on like a local device

  // the Mutation handles the api call for login
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login Successful! Response Data:", data);
      const token = data.token; // doesnt duplicate token

      if (token) {
        // To Store in Local storage if its like a personal device the session if you dont want to save the info for security
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

  // Make an async function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // This prevents the page from reloading
    setStatus({ type: "", message: "" });
    await mutation.mutateAsync(formData); // This triggers the API call
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
