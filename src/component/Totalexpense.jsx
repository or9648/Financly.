import React, { useState, useEffect } from 'react';
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import Button1 from './Button1';
import { db, auth } from '../Firebase';
import { getDocs, collection } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleSubmit as addExpense } from '../Function/Transaction';

function Totalexpense() {
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
            .filter(transaction => transaction.transactionType === "expense"); // Filter for expenses only
            
          setTransactions(transactionList);
          console.log("Fetched Expense Transactions:", transactionList);
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

    const expenseData = { name, amount, date, tag: sel, transactionType: "expense" };

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await addExpense(expenseData);
        toast.success('Expense added successfully!', { position: "top-center" });
        resetForm();
      } else {
        toast.error("User not authenticated", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Failed to add expense. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-8 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Add Expense</h2>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Input
          label="Name"
          icon={<span className="text-blue-500 font-semibold">₹</span>}
          placeholder="Enter expense name"
          type="text"
          value={name}
          setstate={setName}
          required
        />
        <Input
          label="Amount"
          icon={<span className="text-blue-500 font-semibold">₹</span>}
          placeholder="Enter amount"
          type="number"
          value={amount}
          setstate={setAmount}
          required
        />
        <Input
          label="Date"
          icon={<FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />}
          placeholder="Select date"
          type="date"
          value={date}
          setstate={setDate}
          required
        />
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faTag} className="text-blue-500" />
          <label className="block text-gray-600 font-semibold">Tag</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring focus:ring-blue-200 transition duration-200"
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            required
          >
            <option value="">Select tag</option>
            <option value="office">Office</option>
            <option value="food">Food</option>
            <option value="books">Books</option>
          </select>
        </div>

        <Button1
          children={"Add Expense"}
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        />
      </form>
      <ToastContainer />
    </div>
  );
}

export default Totalexpense;
