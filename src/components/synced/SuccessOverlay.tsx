// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/SuccessOverlay.tsx
// Last synced: 2026-03-17T11:05:34.422Z
// API integrations stripped. Use props for data and callbacks.
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/assets/animations/success-animation.json';

export const SuccessOverlay = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        className="mx-auto h-[25rem] w-[25rem] sm:h-[70%] sm:w-[70%]"
      />
    </div>
  );
};
