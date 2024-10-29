// handleSubmitFunction.js
import { auth, db } from '../Firebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const handleSubmit = async (expenseData, resetForm) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await addDoc(collection(db, `users/${currentUser.uid}/Transaction`), expenseData);
      toast.success(' added successfully!', { position: "top-center" });
       console.log(expenseData)
      resetForm();
    } else {
      toast.error("User not authenticated", { position: "top-center" });
    }
  } catch (error) {
    console.error("Error adding document:", error);
    toast.error("Failed to add . Please try again.", { position: "top-center" });
  }
};
