import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/verify-email/${token}`, {
          method: 'POST'
        });
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now login.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link might be expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error occurred during verification.');
      }
    };
    
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {status === 'loading' && (
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold">{message}</h2>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link to="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700">
                Go to Login
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link to="/register" className="text-orange-600 hover:underline">
                Try registering again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
