import React from 'react';
import { TaxTable } from './components/TaxTable/TaxTable';
import { Loading } from './components/Loading/Loading';
import { useTaxData } from './hooks/useTaxData';
import './App.css';

function App() {
  const { taxes, countries, loading, error, updateTax } = useTaxData();

  if (error) {
    return (
      <div className="app-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Tax Management</h1>
        <p>Manage customer tax records</p>
      </header>

      <main className="app-main">
        {loading && taxes.length === 0 ? (
          <Loading />
        ) : (
          <TaxTable
            taxes={taxes}
            countries={countries}
            onUpdateTax={updateTax}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;