"use client";

import Link from "next/link";
import { ArrowLeft, Menu02, X as CloseIcon } from "@untitledui/icons";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger, Modal as AriaModal, ModalOverlay } from "react-aria-components";
import { cx } from "@/utils/cx";
import { useHeader } from "./header-context";
import { type PropsWithChildren } from "react";

type AppHeaderProps = PropsWithChildren<{
    /** Optional custom menu content. If not provided, a basic list is shown. */
    menuContent?: React.ReactNode;
}>;

const DefaultMenu = () => {
    return (
        <aside className="flex h-full max-w-full flex-col justify-between overflow-auto border-l border-secondary bg-primary pt-6">
            <nav className="px-4">
                <ul className="flex flex-col gap-1">
                    <li>
                        <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-fg-primary hover:bg-primary_hover">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-fg-primary hover:bg-primary_hover">
                            My Account
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-fg-primary hover:bg-primary_hover">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-fg-primary hover:bg-primary_hover">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-fg-primary hover:bg-primary_hover">
                            Terms & Conditions
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="px-4 py-6 text-center text-sm text-fg-tertiary">
                Powered by <span className="font-semibold text-fg-brand-primary">ZAPIGO</span>
            </div>
        </aside>
    );
};

export const AppHeader = ({ menuContent }: AppHeaderProps) => {
    const { title, variant, onBack } = useHeader();

    return (
        <DialogTrigger>
            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-transparent bg-brand-section px-3 text-primary_on-brand md:h-18">
                {variant === "menu" ? (
                    <>
                        <div className="flex flex-col leading-tight">
                            <div className="text-xs font-semibold md:text-xs">{title}</div>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            <AriaButton
                                aria-label="Open menu"
                                className="group flex items-center justify-center rounded-lg p-2 text-primary_on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <Menu02 className="size-5 transition-opacity duration-200 group-aria-expanded:opacity-0" />
                                <CloseIcon className="absolute size-5 opacity-0 transition-opacity duration-200 group-aria-expanded:opacity-100" />
                            </AriaButton>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center">
                            <button
                                type="button"
                                aria-label="Go back"
                                onClick={() => (onBack ? onBack() : window.history.back())}
                                className="flex items-center justify-center rounded-lg p-2 text-primary_on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <div className="text-xs font-semibold md:text-xs">{title}</div>
                        </div>

                        <div className="flex items-center gap-3" />
                    </>
                )}
            </header>

            <ModalOverlay
                isDismissable
                className={({ isEntering, isExiting }) =>
                    cx(
                        "fixed inset-0 z-50 cursor-pointer bg-overlay/70 backdrop-blur-md",
                        isEntering && "duration-300 ease-in-out animate-in fade-in",
                        isExiting && "duration-200 ease-in-out animate-out fade-out",
                    )
                }
            >
                {({ state }) => (
                    <>
                        <AriaButton
                            aria-label="Close menu"
                            onPress={() => state.close()}
                            className="fixed top-3 left-3 flex cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring hover:bg-white/10 hover:text-fg-white focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <CloseIcon className="size-6" />
                        </AriaButton>

                        <AriaModal className="ml-auto h-full w-[84%] max-w-xs cursor-auto will-change-transform sm:max-w-sm">
                            <AriaDialog className="h-dvh outline-hidden focus:outline-hidden">
                                {menuContent ?? <DefaultMenu />}
                            </AriaDialog>
                        </AriaModal>
                    </>
                )}
            </ModalOverlay>
        </DialogTrigger>
    );
};
