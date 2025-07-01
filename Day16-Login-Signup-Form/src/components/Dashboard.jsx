import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto mt-20 bg-gradient-to-r from-green-200 to-blue-300 p-8 rounded-3xl text-center shadow-xl animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-green-800 animate-bounce">Welcome, {user?.email}</h2>
      {user?.photoURL && <img src={user.photoURL} alt="avatar" className="mx-auto w-24 h-24 rounded-full mb-4 shadow-lg" />}
      <p className="text-lg text-gray-700 mb-6">You have successfully logged in 🎉</p>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
