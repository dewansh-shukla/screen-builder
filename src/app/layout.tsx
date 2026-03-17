import type { Metadata, Viewport } from "next";
import { Lexend, DM_Sans } from "next/font/google";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { cx } from "@/utils/cx";

const lexend = Lexend({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-lexend",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
    variable: "--font-dm-sans",
});

export const metadata: Metadata = {
    title: "Zapigo — Screen Builder",
    description: "Screen builder for Zapigo mockups",
};

export const viewport: Viewport = {
    themeColor: "#ffcc1d",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(lexend.variable, dmSans.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>
                        <LoginModalProvider>{children}</LoginModalProvider>
                    </Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
