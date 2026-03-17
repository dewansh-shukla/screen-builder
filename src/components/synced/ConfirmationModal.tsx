// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ConfirmationModal.tsx
// Last synced: 2026-03-17T11:05:34.399Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import { ModalOverlay, Modal, Dialog } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) => {
  // Prevent closing modal during loading
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={handleOpenChange} isDismissable={!isLoading}>
      <Modal>
        <Dialog className="mx-auto w-full max-w-[425px] bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-lexend text-lg font-semibold leading-6 text-primary">
                {title}
              </h2>
              <p className="font-lexend text-sm font-normal leading-5 text-tertiary">
                {description}
              </p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                color="secondary"
                onClick={onCancel}
                isDisabled={isLoading}
                className="flex-1"
              >
            {cancelText}
          </Button>
          <Button
                size="sm"
                color={isDanger ? 'primary-destructive' : 'primary'}
            onClick={onConfirm}
                isDisabled={isLoading}
                isLoading={isLoading}
            className="flex-1"
          >
                {isLoading ? 'Deleting...' : confirmText}
          </Button>
            </div>
          </div>
    </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default ConfirmationModal;
