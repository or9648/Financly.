import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import Button from './Button';
import Button1 from './Button1';
import Papa from 'papaparse';

function TableInfo() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("none");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const transactionCollection = collection(db, `users/${currentUser.uid}/Transaction`);
          const transactionSnapshot = await getDocs(transactionCollection);
          const transactionList = transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTransactions(transactionList);
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions
    .filter(transaction => transaction.name && transaction.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortType === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortType === "amount") {
        return b.amount - a.amount;
      } else {
        return 0;
      }
    });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Transaction Type', dataIndex: 'transactionType', key: 'transactionType' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
  ];

  // Function to handle file import
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      parseCSV(file);
    }
  };

  // Function to parse the CSV file
  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedTransactions = results.data.map(item => ({
          name: item.Name,
          amount: parseFloat(item.Amount),
          transactionType: item['Transaction Type'],
          date: new Date(item.Date).toISOString(),
        }));

        importedTransactions.forEach(async (transaction) => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await addDoc(collection(db, `users/${currentUser.uid}/Transaction`), transaction);
          }
        });

        setTransactions(prev => [...prev, ...importedTransactions]);
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      }
    });
  };

  return (
    <div className='p-8 bg-gray-50 rounded-lg shadow-md'>
      <h1 className='text-4xl text-center p-4 m-2 font-bold text-gray-800'>My Transactions</h1>
      <div className='mb-4 flex justify-between gap-3 items-center'>
        <input
          type="text"
          placeholder="Search here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 w-[300px] rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className='flex w-[400px] gap-2'>
          <label className="flex items-center border  text-white p-3 bg-blue-600 border-gray-300  w-full rounded cursor-pointer">
            <span className="mr-2">Choose CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <Button1 children={"Export CV"} onClick={() => {/* Export function here */}} />
        </div>
      </div>
      <div className='flex justify-center align-middle flex-row w-full gap-4 mt-4'>
        <Button children="No Sort" onClick={() => setSortType("none")} className="px-4 py-2 bg-gray-200 rounded shadow" />
        <Button children="Sort By Date" onClick={() => setSortType("date")} className="px-4 py-2 bg-blue-400 text-white rounded shadow hover:bg-blue-500 transition duration-200" />
        <Button children="Sort By Amount" onClick={() => setSortType("amount")} className="px-4 py-2 bg-green-400 text-white rounded shadow hover:bg-green-500 transition duration-200" />
      </div>
      <Table 
        dataSource={filteredTransactions} 
        columns={columns} 
        rowKey="id" 
        className="mt-6" 
        pagination={{ pageSize: 5 }} 
      />
    </div>
  );
}

export default TableInfo;
