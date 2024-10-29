import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../Firebase"; 
import { Line } from '@ant-design/charts'; 

const LineChart = () => {  
  const { uid } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState(""); 
  const [sortType, setSortType] = useState("date"); // Default to "date" sorting 

  useEffect(() => {
    const fetchTransactions = async () => {
      if (uid) {
        const transactionCollection = collection(db, `users/${uid}/Transaction`);
        const transactionSnapshot = await getDocs(transactionCollection);
        const transactionList = transactionSnapshot.docs.map(doc => doc.data());
        setTransactions(transactionList);
      }
    };

    fetchTransactions();
  }, [uid]);

  const sortTransactions = () => {
    return transactions
      .filter(transaction => transaction.name && transaction.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortType === "date") {
          return new Date(a.date) - new Date(b.date); // Sort ascending by date
        } else if (sortType === "amount") {
          return a.amount - b.amount; // Sort ascending by amount
        }
        return 0;
      });
  };

  const sortedTransactions = sortTransactions();

  if (sortedTransactions.length === 0) {
    return <div>

    </div>;
  }

  // Prepare sorted data for the chart
  const chartData = sortedTransactions.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US'),
    amount: item.amount,
  }));

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'amount',
    label: {
      style: {
        fill: '#aaa',
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  if (sortedTransactions.length === 0) {
    return <div>
      
    </div>;
  }
  return (
    <div className="h-[500px] w-full">
    <h1 className=" text-3xl font-bold  p-2">My spendings</h1>
      <Line {...config} />
    </div>
  );
};

export default LineChart;
