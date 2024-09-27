// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import CustomerDetails from './components/CustomerDetails'; // We'll create this next

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerForm />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;
