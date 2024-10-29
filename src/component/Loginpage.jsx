import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signpage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const saveUserToFirestore = async (user, name = "") => {
    try {
      console.log("Saving user to Firestore with UID:", user.uid);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name || user.displayName || "Anonymous",
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      console.log('User data successfully saved to Firestore');
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      toast.error("Failed to save user data: " + error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome ${user.displayName}`);
      await saveUserToFirestore(user);
      navigate(`/dashboard/${user.uid}`);
    } catch (error) {
      toast.error("Google sign-up failed: " + error.message);
      console.error("Google sign-up error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success("Successfully signed up!");
      console.log("User signed up:", user);
      await saveUserToFirestore(user, name);
      navigate(`/dashboard/${user.uid}`);
    } catch (error) {
      toast.error("Sign-up failed: " + error.message);
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign up to <span className="text-blue-500">Finacyy</span>
        </h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            setstate={setName}
          />
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
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            value={confirmPassword}
            setstate={setConfirmPassword}
          />

          <Button type="submit">Sign Up with Email and Password</Button>
          
          <p className="text-center font-bold text-lg my-4">OR</p>
          
          <Button type="button" onClick={handleGoogleSignUp}>
            Sign up with Google
          </Button>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Click here
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Signpage;
