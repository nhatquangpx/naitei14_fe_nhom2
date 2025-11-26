import { useState } from "react";
import { registerUser } from "../services/authAPI";
import { RegisterRequest } from "../types/auth.types";
import { MESSAGE_REGISTER_FAILED } from "@/constants/common";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createUser = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const registeredUser = await registerUser(data);
      setSuccessMessage(
        "Đăng ký thành công! Email xác nhận đã được gửi đến hộp thư của bạn."
      );
      return registeredUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGE_REGISTER_FAILED;
      setError(errorMessage);
      console.error("Registration error occurred", {
        message: errorMessage,
        error: err,
      });
    } finally {
      setLoading(false);
    }
  };
  const clearError = () => setError(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  return {
    createUser,
    loading,
    error,
    successMessage,
    clearError,
    clearSuccessMessage,
  };
};
