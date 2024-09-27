import React from 'react';
import CustomerForm from './components/CustomerForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <CustomerForm />
    </div>
  );
};

export default App;

