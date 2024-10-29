import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase'; // Adjust the path to your Firebase config
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out!");
      navigate('/'); // Redirect to login or home page after logout
    } catch (error) {
      toast.error("Error logging out: " + error.message);
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="bg-blue-500 flex justify-between items-center p-4 text-white h-14 shadow-md">
      <h1 className="text-3xl font-bold">Financly.</h1>
      {user && (
        <div className="flex  ml-auto  ">
          <FontAwesomeIcon icon={faUserCircle} size="2x" className="mr-2" />
          <button
            onClick={handleLogout}
            className="text-white rounded transform transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Navbar;
