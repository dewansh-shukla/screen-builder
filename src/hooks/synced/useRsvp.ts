// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useRsvp.ts
// Last synced: 2026-03-17T11:05:34.443Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
// [STRIPPED] import { rsvpService, CreateRsvpPayload } from '@/services/rsvpService';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { usePostLoginCallback } from '@/hooks/usePostLoginCallback';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Callback replacing createRsvpMutation.mutate()
 * onCreateRsvp?: (...args: any[]) => void;
 * // Pending state replacing createRsvpMutation.isPending
 * isCreateRsvpPending?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


export const useRsvp = () => {
  const router = useRouter();
  // [STRIPPED] useAuth/useAuthStore — values now come from props
  const { setPostLoginAction, redirectToLogin } = usePostLoginCallback();

  // [STRIPPED] createRsvpMutation — use onCreateRsvp prop instead

  const handleRsvp = (
    eventId: string,
    publicId: string,
    response: 'YES' | 'NO',
    note?: string,
  ) => {
    if (!userData?.uid) {
      // User is not logged in, set post-login action and redirect to login
      setPostLoginAction({
        type: 'CREATE_RSVP',
        data: {
          eventId,
          publicId,
          rsvpResponse: response,
          rsvpNotes: note,
        },
        redirectPath: `/event/${publicId}/rsvp/done`,
      });
      redirectToLogin();
      return;
    }

    // User is logged in, create RSVP directly
    onCreateRsvp?.({
      user_id: userData.uid,
      event_id: eventId,
      rsvp_response: response,
      rsvp_notes: note,
      public_id: publicId, // Pass public_id for navigation
    } as unknown as CreateRsvpPayload);
  };

  const executePostLoginRsvp = (
    eventId: string,
    publicId: string,
    rsvpResponse: 'YES' | 'NO',
    userId: string,
    rsvpNotes?: string,
  ) => {
    onCreateRsvp?.({
      user_id: userId,
      event_id: eventId,
      rsvp_response: rsvpResponse,
      rsvp_notes: rsvpNotes,
      public_id: publicId, // Pass public_id for navigation
    } as unknown as CreateRsvpPayload);
  };

  return {
    handleRsvp,
    executePostLoginRsvp,
    isCreatingRsvp: isCreateRsvpPending,
    rsvpError: /* TODO: Manual review needed — createRsvpMutation.error */ undefined,
  };
};
