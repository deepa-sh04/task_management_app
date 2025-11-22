import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Tax, Country, EditTaxData } from "../../types/types";
import { EditModal } from "../EditModal/EditModal";
import "./TaxTable.css";

interface TaxTableProps {
  taxes: Tax[];
  countries: Country[];
  onUpdateTax: (id: string, data: EditTaxData) => Promise<boolean>;
  loading?: boolean;
}

export const TaxTable: React.FC<TaxTableProps> = ({
  taxes,
  countries,
  onUpdateTax,
  loading = false,
}) => {
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTax(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: EditTaxData): Promise<boolean> => {
    if (!editingTax) return false;
    return await onUpdateTax(editingTax.id, data);
  };

  const getEditInitialData = (): EditTaxData => {
    if (!editingTax) return { name: "", country: "" };
    return {
      name: editingTax.name || "",
      country: editingTax.country || "",
    };
  };

  const toggleCountryFilter = () => {
    setShowCountryFilter((prev) => !prev);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  };

  const applyCountryFilter = () => {
    table.getColumn("country")?.setFilterValue(selectedCountry);
    setShowCountryFilter(false);
  };

  const clearCountryFilter = () => {
    setSelectedCountry("");
    table.getColumn("country")?.setFilterValue("");
    setShowCountryFilter(false);
  };

  
  const uniqueCountries = Array.from(new Set(taxes.map(t => t.country))).sort();
  
  const filteredCountries = uniqueCountries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const columns = useMemo<ColumnDef<Tax>[]>(
    () => [
      {
        header: "Entity",
        accessorKey: "name",
        cell: (info) => (
          <span className="entity-cell">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Gender",
        accessorKey: "gender",
        cell: (info) => {
          const gender = info.getValue() as string;
          const genderLower = gender.toLowerCase();
          let genderClass = 'gender-other';
          
          if (genderLower.includes('male')) {
            genderClass = 'gender-male';
          } else if (genderLower.includes('female')) {
            genderClass = 'gender-female';
          }
          
          const displayGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
          
          return (
            <span className={genderClass}>
              {displayGender}
            </span>
          );
        },
      },
      {
        header: "Request date",
        accessorKey: "createdAt",
        cell: (info) => {
          const dateString = info.getValue() as string;
          try {
            return new Date(dateString).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch {
            return "Invalid Date";
          }
        },
      },
      {
        header: "Country",
        accessorKey: "country",
        cell: (info) => (
          <span className="country-cell">
            {info.getValue() as string}
          </span>
        ),
      },
      {
       
        header: () => (
          <div className="filter-header-column">
            <button
              onClick={toggleCountryFilter}
              className="filter-header-btn"
              title="Filter by country"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
            </button>
          </div>
        ),
        accessorKey: "id",
        cell: (info) => (
          <button
            onClick={() => handleEdit(info.row.original)}
            className="edit-btn"
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: taxes,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <div className="table-loading">Loading taxes...</div>;

  return (
    <div className="tax-table-container">
      
      <div className="table-main-header">
        <h3>Tax Records</h3>
      </div>

      
      {showCountryFilter && (
        <div className="modal-overlay" onClick={() => setShowCountryFilter(false)}>
          <div className="country-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Filter by Country</h3>
              <button 
                onClick={() => setShowCountryFilter(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>

            <div className="filter-controls">
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="countries-list">
              <label className="country-option">
                <input
                  type="radio"
                  name="country"
                  value=""
                  checked={selectedCountry === ""}
                  onChange={() => handleCountrySelect("")}
                />
                <span className="radiomark"></span>
                <span className="country-name">All Countries</span>
              </label>

              {filteredCountries.map((country) => (
                <label key={country} className="country-option">
                  <input
                    type="radio"
                    name="country"
                    value={country}
                    checked={selectedCountry === country}
                    onChange={() => handleCountrySelect(country)}
                  />
                  <span className="radiomark"></span>
                  <span className="country-name">{country}</span>
                </label>
              ))}
              {filteredCountries.length === 0 && (
                <div className="no-results">No countries found</div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={clearCountryFilter} className="cancel-btn">
                Clear
              </button>
              <button onClick={applyCountryFilter} className="apply-btn">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      
      <table className="tax-table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && !loading && (
        <div className="no-data">
          No records found
          {selectedCountry && (
            <span> for {selectedCountry}</span>
          )}
        </div>
      )}

      
      {isModalOpen && (
        <EditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={getEditInitialData()}
          countries={countries}
        />
      )}
    </div>
  );
};