import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';

const App = () => {
  return (
    <div>
      <Header />
      <Home />
      <Register /> 
    </div>
  );
};

export default App;