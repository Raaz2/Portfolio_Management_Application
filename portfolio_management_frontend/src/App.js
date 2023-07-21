import React from 'react';
import PortfolioManagerList from './components/PortfolioManagerList'; // Correct the component name here
import AddPortfolioManagerForm from './components/AddPortfolioManagerForm';
import './App.css';
import './components/PortfolioManagerList.css';
import UpdatePortfolioManagerForm from './components/UpdatePortfolioManagerForm';

function App() {
  return (
    <div className="App">
    <PortfolioManagerList />
    <AddPortfolioManagerForm />
  </div>
  );
}

export default App;

