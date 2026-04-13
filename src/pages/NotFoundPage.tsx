import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-all"
          >
            <Home className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;