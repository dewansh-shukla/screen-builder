// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useGiftFinder.ts
// Last synced: 2026-03-17T11:17:27.034Z
// API integrations stripped. Use props for data and callbacks.
import { useState } from 'react';

interface GiftFinderState {
  budget: string;
  gender: string;
  age: string;
}

export const useGiftFinder = () => {
  const [state, setState] = useState<GiftFinderState>({
    budget: '',
    gender: '',
    age: '',
  });

  const updateField = (field: keyof GiftFinderState, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isComplete = () => {
    return Object.values(state).every(value => value !== '');
  };

  const resetForm = () => {
    setState({
      budget: '',
      gender: '',
      age: '',
    });
  };

  return {
    ...state,
    updateField,
    isComplete,
    resetForm,
  };
};

export type { GiftFinderState };
