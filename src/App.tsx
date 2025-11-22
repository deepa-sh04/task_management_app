import React from "react";
import "./App.css";
import { TaxTable } from "./components/TaxTable/TaxTable";
import { useTaxData } from "./hooks/useTaxData";

function App() {
const { taxes, countries, updateTax, loading, error } = useTaxData();

  return (
    <div className="App">

      <div className="page-container">

        <h1 className="page-title">Tax Management</h1>
        <p className="page-subtitle">Manage customer tax records</p>

        <div className="content-card">
          <TaxTable
            taxes={taxes}
            countries={countries}
            onUpdateTax={updateTax} 
            loading={loading}
          />
        </div>

      </div>

    </div>
  );
}

export default App;
