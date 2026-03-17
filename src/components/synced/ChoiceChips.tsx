// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ChoiceChips.tsx
// Last synced: 2026-03-17T11:17:26.981Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Choice {
  id: string;
  label: string;
}

interface ChoiceChipsProps {
  choices: Choice[];
  multiple?: boolean;
  onSelect?: (selectedIds: string[]) => void;
  selectedTagId?: string;
}

export function ChoiceChips({
  choices,
  multiple = false,
  onSelect,
  selectedTagId,
}: ChoiceChipsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return selectedTagId ? [selectedTagId] : [];
  });

  // Update local state when selectedTagId prop changes
  useEffect(() => {
    if (selectedTagId) {
      // Only update if different to avoid infinite loops
      if (
        !selectedIds.includes(selectedTagId) ||
        (selectedIds.length > 1 && !multiple)
      ) {
        setSelectedIds([selectedTagId]);
      }
    } else if (selectedIds.length > 0 && choices.length > 0) {
      // If no tag is selected but we have choices, select first one
      const firstId = choices[0].id;
      setSelectedIds([firstId]);
      onSelect?.([firstId]);
    }
  }, [selectedTagId, choices, multiple, onSelect, selectedIds]);

  const handleClick = (tagId: string) => {
    let newSelectedIds: string[];

    if (multiple) {
      // If multiple selection is allowed
      if (selectedIds.includes(tagId)) {
        newSelectedIds = selectedIds.filter(selectedId => selectedId !== tagId);
      } else {
        newSelectedIds = [...selectedIds, tagId];
      }
    } else {
      // If single selection
      newSelectedIds = selectedIds.includes(tagId) ? [] : [tagId];
    }

    setSelectedIds(newSelectedIds);
    onSelect?.(newSelectedIds);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {choices.map((choice, index) => {
        const isSelected = selectedIds.includes(choice.id);
        return (
          <motion.button
            key={index}
            onClick={() => handleClick(choice.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full border-[1.5px] px-[24px] py-[10px] text-sm font-medium transition-colors ${
              isSelected
                ? 'text-title-sans-sm border-font-primary bg-primary-foreground text-background'
                : 'text-primary-font border-font-primary'
            }`}
          >
            {choice.label}
          </motion.button>
        );
      })}
    </div>
  );
}
