"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export type HeaderVariant = "menu" | "back";

type HeaderState = {
    title: string;
    variant: HeaderVariant;
    /** Optional back handler; if not provided, will call history.back(). */
    onBack?: () => void;
};

type HeaderContextValue = HeaderState & {
    setHeader: (update: Partial<HeaderState>) => void;
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

export const HeaderProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<HeaderState>({ title: "", variant: "menu" });

    const setHeader = useCallback((update: Partial<HeaderState>) => {
        setState((prev) => {
            const newState = { ...prev, ...update };
            return newState;
        });
    }, []);

    const value = useMemo<HeaderContextValue>(() => ({ ...state, setHeader }), [state, setHeader]);

    return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
};

export const useHeader = () => {
    const ctx = useContext(HeaderContext);
    if (!ctx) throw new Error("useHeader must be used within HeaderProvider");
    return ctx;
};

/**
 * Client helper to configure the header from within a page/route segment.
 * Renders nothing.
 */
export const HeaderConfig = ({ title, variant = "menu", onBack }: { title: string; variant?: HeaderVariant; onBack?: () => void }) => {
    const { setHeader } = useHeader();
    
    // Update on mount and whenever props change
    useEffect(() => {
        setHeader({ title, variant, onBack });
    }, [title, variant, onBack, setHeader]);
    
    // Temporary visible element for debugging
    return <div style={{ display: 'none' }}>HeaderConfig: {title} - {variant}</div>;
};


