import { useState, useEffect } from 'react';
import { Tax, Country, EditTaxData } from '../types/types';
import { taxesAPI, countriesAPI } from '../services/api';

export const useTaxData = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 ADD THIS HERE
  const [loadingCountries, setLoadingCountries] = useState(true);

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

  // 👇 UPDATED FETCH COUNTRIES FUNCTION (Replace your old one)
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true); // start loading
      const response = await countriesAPI.getAll();
      setCountries(response.data);
    } catch (err) {
      setError("Failed to fetch countries");
    } finally {
      setLoadingCountries(false); // stop loading
    }
  };

  const updateTax = async (id: string, data: EditTaxData) => {
    try {
      const currentTax = taxes.find(tax => tax.id === id);
      if (!currentTax) return false;

      const updateData = {
        ...currentTax,
        name: data.name,
        country: data.country,
      };

      await taxesAPI.update(id, updateData);
      await fetchTaxes();
      return true;
    } catch (err) {
      setError('Failed to update tax');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // run both calls in parallel
      await Promise.all([fetchTaxes(), fetchCountries()]);
    };
    loadData();
  }, []);

  return {
    taxes,
    countries,
    loading,
    loadingCountries,   
    error,
    updateTax,
    refetchTaxes: fetchTaxes,
  };
};
