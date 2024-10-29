import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Firebase';

export const fetchTransactions = async (userId, transactionType = null) => {
  try {
    if (!userId) {
      console.log("User ID is required");
      return [];
    }

    const transactionCollection = collection(db, `users/${userId}/Transaction`);
    
    // Construct query based on parameters
    let transactionsQuery = transactionCollection;
    if (transactionType) {
      transactionsQuery = query(transactionCollection, where("transactionType", "==", transactionType));
    }

    const transactionSnapshot = await getDocs(transactionsQuery);
    const transactionList = transactionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return transactionList;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return []; // Return an empty array in case of error
  }
};
