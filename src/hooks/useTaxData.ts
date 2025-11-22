import { useState, useEffect } from 'react';
import { Tax, Country, EditTaxData } from '../types/types';
import { taxesAPI, countriesAPI } from '../services/api';

export const useTaxData = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await taxesAPI.getAll();
      setTaxes(response.data);
    } catch (err) {
      setError('Failed to fetch taxes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countriesAPI.getAll();
      setCountries(response.data);
    } catch (err) {
      setError('Failed to fetch countries');
    }
  };

  const updateTax = async (id: string, data: EditTaxData) => {
    try {
      // Find the current tax to preserve other fields
      const currentTax = taxes.find(tax => tax.id === id);
      if (!currentTax) return false;
      
      // Prepare update data - preserve gender and createdAt, update name and country
      const updateData = {
        ...currentTax,
        name: data.name,
        country: data.country
        // gender and createdAt remain unchanged
      };
      
      await taxesAPI.update(id, updateData);
      await fetchTaxes(); // Refresh the data
      return true;
    } catch (err) {
      setError('Failed to update tax');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTaxes(), fetchCountries()]);
    };
    loadData();
  }, []);

  return {
    taxes,
    countries,
    loading,
    error,
    updateTax,
    refetchTaxes: fetchTaxes,
  };
};