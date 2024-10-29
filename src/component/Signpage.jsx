import React, { useState } from 'react';
import Input from './Input';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { auth } from '../Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userUid, setUserUid] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserUid(user.uid);
      toast.success("Successfully signed up!");
      navigate(`/dashboard/${user.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Email is already in use, try signing in instead
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          setUserUid(user.uid);
          toast.info("Welcome back!");
          navigate(`/dashboard/${user.uid}`);
        } catch (loginError) {
          toast.error("Login failed: " + loginError.message);
        }
      } else {
        toast.error("Sign up failed: " + error.message);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign Up for <span className="text-blue-500">Finacyy</span>
        </h1>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            setstate={setEmail}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            setstate={setPassword}
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Sign Up
          </button>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>

          {userUid && (
            <p className="text-center mt-4">
              Go to your{' '}
              <Link to={`/dashboard/${userUid}`} className="text-blue-500 hover:underline">
                Dashboard
              </Link>
            </p>
          )}
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default SignUpPage;
