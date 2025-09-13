import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to R8IFY
          </h1>
          <p className="text-gray-600">
            {isLoginMode ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg">
          {isLoginMode ? (
            <Login onSwitchToRegister={switchToRegister} />
          ) : (
            <Register onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;