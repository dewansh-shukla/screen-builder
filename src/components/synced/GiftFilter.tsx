// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GiftFilter.tsx
// Last synced: 2026-03-17T11:05:34.408Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterProps {
  onFilterChange: (filters: {
    budget: string;
    age: string;
    gender: string;
  }) => void;
  initialFilters?: {
    budget: string;
    age: string;
    gender: string;
  };
  bgColor?: string;
  borderColor?: string;
}

export function GiftFilter({
  onFilterChange,
  initialFilters,
  bgColor,
  borderColor,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    budget: initialFilters?.budget || '',
    age: initialFilters?.age || '',
    gender: initialFilters?.gender || '',
  });
  const filterRef = useRef<HTMLDivElement>(null);

  // Update selected filters when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setSelectedFilters({
        budget: initialFilters.budget || '',
        age: initialFilters.age || '',
        gender: initialFilters.gender || '',
      });
    }
  }, [initialFilters]);

  const budgetOptions = [
    '500',
    '750',
    '1000',
    '1500',
    '2000',
    '3000',
    '4000',
    '5000',
  ];
  const ageOptions = [
    '0-2',
    '3-5',
    '6-8',
    '9-12',
    '13-17',
    '18-25',
    '26-35',
    '36-45',
    '46-55',
    '56-65',
    '65+',
  ];
  const genderOptions = ['FEMALE', 'MALE'];

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add event listener when filter is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFilterSelect = (
    type: 'budget' | 'age' | 'gender',
    value: string,
  ) => {
    const newFilters = {
      ...selectedFilters,
      [type]: selectedFilters[type] === value ? '' : value,
    };
    setSelectedFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(selectedFilters);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-grow" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-md w-full ${bgColor ? `bg-[${bgColor}]` : 'bg-accent-light'} ${borderColor ? `border-[${borderColor}]` : 'border-primary'} font-dm-sans text-font-primary flex h-[52px] items-center justify-center gap-2 rounded-xl border-[2px] px-4 py-3`}
      >
        Filter by budget, age & more
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 space-y-6 rounded-t-2xl bg-[#F3B664] p-6">
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center gap-2 space-y-3">
              <div className="w-[30px] border-t-[2px] border-black"></div>
              <div className="flex w-full items-center justify-center text-sm font-medium uppercase">
                FILTER GIFTS BY BUDGET, AGE & MORE
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase">Budget</h3>
              <div className="flex flex-wrap gap-3">
                {budgetOptions.map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleFilterSelect('budget', amount)}
                    className={`rounded-full border border-black px-4 py-2 text-sm ${
                      selectedFilters.budget === amount
                        ? 'bg-black text-white'
                        : 'bg-transparent'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase">Age (Years)</h3>
              <div className="flex flex-wrap gap-3">
                {ageOptions.map(age => (
                  <button
                    key={age}
                    onClick={() => handleFilterSelect('age', age)}
                    className={`rounded-full border border-black px-4 py-2 text-sm ${
                      selectedFilters.age === age
                        ? 'bg-black text-white'
                        : 'bg-transparent'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase">Gender</h3>
              <div className="flex flex-wrap gap-3">
                {genderOptions.map(gender => (
                  <button
                    key={gender}
                    onClick={() => handleFilterSelect('gender', gender)}
                    className={`rounded-full border border-black px-4 py-2 text-sm ${
                      selectedFilters.gender === gender
                        ? 'bg-black text-white'
                        : 'bg-transparent'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full rounded-md bg-transparent py-3 font-medium text-black"
          >
            APPLY SELECTED FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
