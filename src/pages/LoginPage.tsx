import { useNavigate } from "react-router-dom";
import { useLoginAction } from "../hooks/useLoginAction";
import { InputField } from "../components/ui/inputField";
import { CustomButton } from "../components/ui/CustomButton";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    status,
    showPassword,
    rememberMe,
    handleChange,
    handleSubmit,
    setShowPassword,
    setRememberMe,
    mutation,
  } = useLoginAction();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Welcome to Finance Advisor
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Sign in or create an account to continue
        </p>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
          <div className="flex-1 py-2 text-center text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm">
            Sign In
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Sign Up
          </button>
        </div>
        {status.message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm text-center ${
              status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-green-600 hover:text-green-500 font-medium"
            >
              Forgot Password?
            </button>
          </div>
 
          <CustomButton isLoading={mutation.isPending}>Sign In</CustomButton>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
