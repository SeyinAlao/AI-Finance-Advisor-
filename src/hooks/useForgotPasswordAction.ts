import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../api/auth";

interface ResetResponse {
  message: string; // this carries the hash token when the api provides it
  token?: string; // The '?' means the token might be there or might not
}

export const useForgotPasswordAction = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const mutation = useMutation({
    mutationFn: (emailVal: string) => requestPasswordReset({ email: emailVal }), // emailVal is like a placeholder for the email argument email value
    onSuccess: (data: ResetResponse) => {
      console.log("API Data received:", data);
      if (data.message) {
        alert("Message received: ");
        navigate("/reset-password-now", { state: { token: data.message } });
      } else {
        setStatus({
          type: "success",
          message: "If an account exists, a reset link has been sent.",
        });
      }
    },
    onError: (error: Error) => {
      setStatus({
        type: "error",
        message: error.message || "Failed to send request.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    await mutation.mutateAsync(email);
  };

  return {
    email,
    setEmail,
    status,
    handleSubmit,
    mutation,
  };
};
