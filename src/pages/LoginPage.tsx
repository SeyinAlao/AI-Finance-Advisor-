import { useNavigate } from 'react-router-dom';
import { useLoginAction } from '../hooks/useloginaction';


const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, status, showPassword, rememberMe, handleChange, handleSubmit, setShowPassword, setRememberMe, mutation } = useLoginAction();

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
          <div className="flex-1 py-2 text-center text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm cursor-default">
            Sign In
          </div>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="flex-1 py-2 text-center text-sm font-medium text-gray-500 rounded-md hover:text-gray-700 focus:outline-none transition-colors"
          >
            Sign Up
          </button>
        </div>
        {status.message && (
          <div className={`mb-6 p-3 rounded-lg text-sm text-center ${
             status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;