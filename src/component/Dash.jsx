import React, { useState, useEffect } from 'react';
import Box from './Box';
import Modal from '@mui/material/Modal';
import { Box as BoxMUI, Typography, Button } from '@mui/material';
import Totalexpense from './Totalexpense';
import Totalincome from './Totalincome';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #007bff',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  p: 4,
};

function Dash() {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', onReset: null });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Calculate balance as the difference between total income and total expenses
  const balance = totalIncome - totalExpenses;

  // Fetch Income from Firestore and calculate total income
  const fetchAndCalculateIncome = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const transactionCollection = collection(db, `users/${currentUser.uid}/Transaction`);
        const transactionSnapshot = await getDocs(transactionCollection);
        const incomeList = transactionSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(transaction => transaction.transactionType === "income");

        const incomeSum = incomeList.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        setTotalIncome(incomeSum);
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error fetching income transactions:", error);
    }
  };

  // Fetch Expenses from Firestore and calculate total expenses
  const fetchAndCalculateExpenses = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const transactionCollection = collection(db, `users/${currentUser.uid}/Transaction`);
        const transactionSnapshot = await getDocs(transactionCollection);
        const expenseList = transactionSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(transaction => transaction.transactionType === "expense");

        const expenseSum = expenseList.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        setTotalExpenses(expenseSum);
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error fetching expense transactions:", error);
    }
  };

  // Insert new income transaction and update total income
  const addIncomeTransaction = async (amount, description) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const transactionData = {
          amount,
          description,
          transactionType: "income",
          date: new Date()
        };
        await addDoc(collection(db, `users/${currentUser.uid}/Transaction`), transactionData);
        fetchAndCalculateIncome();
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error adding income transaction:", error);
    }
  };

  // Insert new expense transaction and update total expenses
  const addExpenseTransaction = async (amount, description) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const transactionData = {
          amount,
          description,
          transactionType: "expense",
          date: new Date()
        };
        await addDoc(collection(db, `users/${currentUser.uid}/Transaction`), transactionData);
        fetchAndCalculateExpenses();
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error adding expense transaction:", error);
    }
  };

  // Initial fetch of income and expenses
  useEffect(() => {
    fetchAndCalculateIncome();
    fetchAndCalculateExpenses();
  }, []);

  const handleOpenModal = (title, description, onReset = null) => {
    setModalContent({ title, description, onReset });
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  return (
    <div className="flex mt-6 w-full flex-col items-center">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="flex justify-between gap-20 sm:flex-row items-center">
          <div className="w-full sm:w-[540px] lg:w-[600px]">
            <Box
              children="Reset Balance"
              text="Current Balance"
              amount={
                <span style={{ color: balance < 0 ? 'red' : 'inherit' }}>
                  {balance}
                </span>
              }
              buttonLabel="View Balance"
              onButtonClick={() => handleOpenModal(
                "Current Balance", 
                `Your current balance is RS.${balance}.`
              )}
            />
          </div>
          <div className="w-full sm:w-[340px] lg:w-[600px]">
            <Box
              children="Add Income"
              text="Total Income"
              amount={totalIncome} 
              buttonLabel="View Income"
              onButtonClick={() => handleOpenModal("Total Income", <Totalincome onAddIncome={addIncomeTransaction} />)}
            />
          </div>
        </div>

        <div className="lg:w-full p-6">
          <Box
            children="Add Expense"
            text="Total Expenses"
            amount={totalExpenses} 
            buttonLabel="View Expenses"
            onButtonClick={() => handleOpenModal("Total Expenses", <Totalexpense onAddExpense={addExpenseTransaction} />)}
          />
        </div>
      </div>

      <Modal open={open} onClose={handleCloseModal}>
        <BoxMUI sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {modalContent.title}
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalContent.description}</Typography>
          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={handleCloseModal} variant="outlined">
              Close
            </Button>
          </div>
        </BoxMUI>
      </Modal>
    </div>
  );
}

export default Dash;
