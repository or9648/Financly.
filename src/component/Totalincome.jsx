import React, { useState, useEffect } from 'react';
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import Button1 from './Button1';
import { db, auth } from '../Firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTransactions } from '../Function/fetchTrasn'; 
function TotalIncome() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [sel, setSel] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const transactionCollection = collection(db, `users/${currentUser.uid}/Transaction`);
          const transactionSnapshot = await getDocs(transactionCollection);
          const transactionList = transactionSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(transaction => transaction.transactionType === "income"); // Filter for income only
  
          setTransactions(transactionList);
          console.log("Fetched Income Transactions:", transactionList);
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    fetchTransactions();
  }, []);
  
  const resetForm = () => {
    setName("");
    setAmount(0);
    setDate("");
    setSel("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!name || !amount || !date || !sel) {
      toast.warn('Please fill out all fields before submitting.', { position: "top-center" });
      return;
    }

    const incomeData = {
      name,
      amount,
      date,
      tag: sel,
      transactionType: "income"
    };

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await addDoc(collection(db, `users/${currentUser.uid}/Transaction`), incomeData);
        toast.success('Income added successfully!');
        resetForm();
      } else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Failed to add income. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br w-[600px] from-indigo-50 to-indigo-100 shadow-lg rounded-xl p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Add Income</h2>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Input
          label="Name"
          icon={<FontAwesomeIcon icon={faUser} className="text-indigo-500" />}
          placeholder="Enter income name"
          type="text"
          value={name}
          setstate={setName}
        />
        <Input
          label="Amount"
          icon={<span className="text-indigo-500 font-bold">₹</span>}
          placeholder="Enter amount"
          type="number"
          value={amount}
          setstate={setAmount}
        />
        <Input
          label="Date"
          icon={<FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" />}
          placeholder="Select date"
          type="date"
          value={date}
          setstate={setDate}
        />
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faTag} className="text-indigo-500" />
          <label className="block text-gray-600 font-semibold">Tag</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full bg-white focus:ring focus:ring-indigo-200"
            value={sel}
            onChange={(e) => setSel(e.target.value)}
          >
            <option value="">Select tag</option>
            <option value="investment">Investment</option>
            <option value="freelancing">Freelancing</option>
            <option value="salary">Salary</option>
          </select>
        </div>
        <Button1 
          type="submit" 
          children="Add Income"
          className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
        />
      </form>
      <ToastContainer />
    </div>
  );
}

export default TotalIncome;
