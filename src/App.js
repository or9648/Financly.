// App.js
import { Route, Routes } from 'react-router-dom';
import Loginpage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';

function App() {
  return (
    <div className=' overflow-y-hidden'>
   <Routes>
      <Route path="/" element={<Loginpage />} />
       <Route path="/signup" element={<Signup/>} />
      <Route path="/dashboard/:uid" element={<Dashboard />} /> 
    </Routes>
    </div>
 
  );
}

export default App;
