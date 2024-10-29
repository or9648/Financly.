import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import Header from './Header';
import Dash from '../component/Dash';
import TableInfo from '../component/TableInfo';
import Charts from '../component/Charts';
import NoTrans from '../component/NoTrans';

function Dashboard() {
  const { uid } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState(""); // for filtering by search term
  const [sortType, setSortType] = useState("none"); // for sorting type

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
          return new Date(b.date) - new Date(a.date);
        } else if (sortType === "amount") {
          return b.amount - a.amount;
        }
        return 0;
      });
  };

  const sortedTransactions = sortTransactions();
console.log(sortedTransactions);
  return (
    <div>
      <Header />
      <Dash uid={uid} />

      {/* Conditionally render Charts if there are transactions; otherwise render NoTrans */}
      {sortedTransactions.length > 0 ? <Charts transactions={sortedTransactions} /> : <NoTrans />}

      <TableInfo
        transactions={sortedTransactions}
        search={search}
        setSearch={setSearch}
        sortType={sortType}
        setSortType={setSortType}
      />
    </div>
  );
}

export default Dashboard;
