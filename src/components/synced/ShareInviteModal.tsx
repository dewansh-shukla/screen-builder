// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ShareInviteModal.tsx
// Last synced: 2026-03-17T11:17:27.010Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Data from useQuery — pass as prop
 * shareLinkData?: any;
 * // Loading state from useQuery
 * isShareLinkLoading?: boolean;
 * ============================================================
 */


import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { CloseButton } from '@/components/base/buttons/close-button';
import { Share02, Loading01 } from '@untitledui/icons';
// [STRIPPED] import { useQuery } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareInviteModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
  eventTitleDisplay?: string;
  inviteLink?: string;
  event?: {
    title?: string;
    meta_data?: {
      host_names?: string;
      [key: string]: unknown;
    } | null;
    content_block?: {
      header_text?: string;
      subtitle?: string;
      [key: string]: unknown;
    } | null;
    [key: string]: unknown;
  } | null;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
  eventTitleDisplay,
  inviteLink,
  event,
}) => {
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  const isMobile = useIsMobile();
  const shareMessageTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect iOS device
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  // Detect Android device
  const isAndroid = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  }, []);

  // Fetch share link
  // [STRIPPED] useQuery — data now comes from props

  const shareInviteLink = useMemo(() => {
    return shareLinkData?.data?.shortUrl || inviteLink || '';
  }, [shareLinkData, inviteLink]);

  const shareInviteMessage = useMemo(() => {
    const link = shareInviteLink || 'https://zapigo.co/oqEJ1';
    const title = event?.title || eventTitle || eventTitleDisplay || "Viraj's 13th birthday";
    const hostName = event?.meta_data?.host_names || 'Viraj';
    const headerText = event?.content_block?.header_text || 'We are getting together for';
    const subtitle = event?.content_block?.subtitle || 'and you are invited!';
    return [
      headerText,
      title,
      subtitle,
      `~ ${hostName}`,
      'Hope you can join us!',
      'Please view the details and confirm (RSVP)',
      'via this link:',
      link,
    ].join('\n');
  }, [shareInviteLink, event?.title, eventTitle, eventTitleDisplay, event?.meta_data?.host_names, event?.content_block?.header_text, event?.content_block?.subtitle]);

  const [shareMessage, setShareMessage] = useState('');

  // Initialize editable share message when modal opens or link is ready
  useEffect(() => {
    if (open && shareInviteLink) {
      const title = event?.title || eventTitle || eventTitleDisplay || "";
      const hostName = event?.meta_data?.host_names || '';
      const headerText = event?.content_block?.header_text || 'We are getting together for';
      const subtitle = event?.content_block?.subtitle || 'and you are invited!';
      setShareMessage(
        `${headerText}\n${title}\n${subtitle}\n~ ${hostName}\nHope you can join us!\nPlease view the details and confirm (RSVP)\nvia this link:\n${shareInviteLink}`,
      );
    }
  }, [open, shareInviteLink, event?.title, eventTitle, eventTitleDisplay, event?.meta_data?.host_names, event?.content_block?.header_text, event?.content_block?.subtitle]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = shareMessageTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [shareMessage, shareInviteMessage, open]);

  const handleCopyShareMessage = useCallback(async () => {
    const messageToCopy = shareMessage.trim() || shareInviteMessage.trim();
    if (!messageToCopy) {
      toast({
        title: 'Error',
        description: 'Message not available yet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(messageToCopy);
      toast({
        title: 'Copied!',
        description: 'Invitation message copied to clipboard',
        duration: 1500,
      });
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = messageToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast({
          title: 'Copied!',
          description: 'Invitation message copied to clipboard',
          duration: 1500,
        });
      } catch (err) {
        console.error('Copy failed:', err);
        toast({
          title: 'Copy failed',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    }
  }, [shareInviteMessage, shareMessage, toast]);

  const handleShareInviteMessage = useCallback(async () => {
    const messageToShare = shareMessage.trim() || shareInviteMessage;
    if (!messageToShare) {
      toast({
        title: 'Error',
        description: 'Message not available yet',
        variant: 'destructive',
      });
      return;
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ text: messageToShare });
        toast({
          title: 'Shared!',
          description: 'Invite message shared successfully',
          duration: 1500,
        });
        return;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Share failed:', error);
      }
    }

    await handleCopyShareMessage();
  }, [handleCopyShareMessage, shareInviteMessage, shareMessage, toast]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Handle browser back button
  const closedViaPopstate = useRef(false);

  useEffect(() => {
    if (!open) return;

    closedViaPopstate.current = false;
    window.history.pushState({ modal: 'share-invite-modal' }, '');

    const handlePopState = () => {
      closedViaPopstate.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (!closedViaPopstate.current) {
        window.history.back();
      }
      closedViaPopstate.current = false;
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={(e) => {
        // Only close if clicking directly on the backdrop, not on child elements
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative z-10 mx-2 sm:mx-4 w-full max-w-[95vw] sm:max-w-[400px] md:max-w-[450px] max-h-[90vh] sm:max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Close button at top right */}
        <div className="absolute top-0 right-0 z-20 p-2 sm:p-3">
          <CloseButton
            onPress={onClose}
            size="lg"
            theme="light"
            className="!size-10 sm:!size-8 [&>svg]:!size-6 sm:[&>svg]:!size-5 bg-white/80 hover:bg-white rounded-full shadow-md"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 pr-12 sm:pr-14">
          <h2 className="font-lexend text-text-primary text-lg font-semibold sm:text-xl pr-2">
            Share Your Invite
          </h2>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-80px)] overflow-y-auto px-4 pt-4 pb-4">
          <div className="flex flex-col gap-4 sm:gap-6 pb-2">
            {isShareLinkLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading01 className="size-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading share options...</span>
              </div>
            ) : (
              <>
                {/* Preview & Edit Message */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold text-gray-900 font-lexend">
                    Preview & Edit Message
                  </h3>
                  <textarea
                    ref={shareMessageTextareaRef}
                    value={shareMessage || shareInviteMessage}
                    onChange={(e) => {
                      setShareMessage(e.target.value);
                      // Auto-resize on change
                      const textarea = e.target;
                      textarea.style.height = 'auto';
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none overflow-hidden"
                    placeholder="You are invited!!"
                    style={{ fontFamily: 'Lexend', whiteSpace: 'pre-wrap' }}
                    rows={1}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  <p className="text-xs text-gray-500 font-lexend">
                    You can edit this message before sharing
                  </p>
                </div>

                {/* How to share on Android Instructions */}
                {isAndroid && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-sm font-semibold text-blue-900 font-lexend">
                        How to share on Android:
                      </h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-blue-800 font-lexend">
                      <li>Tap &quot;Share Invite&quot; and select WhatsApp/Messages</li>
                      <li>Send the message!</li>
                    </ol>
                  </div>
                )}

                {/* How to share on iOS Instructions */}
                {isMobile && isIOS && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-sm font-semibold text-blue-900 font-lexend">
                        How to share on iOS:
                      </h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-blue-800 font-lexend">
                      <li>Tap &quot;Share Invite&quot; and select WhatsApp/Messages</li>
                      <li>Send the message!</li>
                    </ol>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex flex-col gap-3 pb-2">
                  <button
                    onClick={handleShareInviteMessage}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors font-lexend"
                  >
                    <Share02 className="size-5" />
                    Share Invite
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
