import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import toast from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      toast.error('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Signup successful! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('User not registered. Please sign up first.');
        toast.error('User not registered. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Try again.');
        toast.error('Incorrect password. Try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login instead.');
        toast.error('Email already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your input.');
        toast.error('Invalid credentials. Try again.');
      } else {
        setError(err.message);
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Popup closed. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        toast.error('Unauthorized domain. Add your site in Firebase settings.');
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-4 text-center text-indigo-600">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition-all ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full mt-3 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 py-2 rounded transition-all shadow-sm"
      >
        <FcGoogle className="text-xl" /> Continue with Google
      </button>
      <p className="text-center text-sm mt-4">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button className="text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;