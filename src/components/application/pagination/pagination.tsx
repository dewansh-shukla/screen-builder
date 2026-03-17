"use client";

import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/lib/utils/cx";
import type { PaginationRootProps } from "./pagination-base";
import { Pagination } from "./pagination-base";

interface PaginationProps extends Partial<Omit<PaginationRootProps, "children">> {
    /** Whether the pagination buttons are rounded. */
    rounded?: boolean;
}

const PaginationItem = ({ value, rounded, isCurrent }: { value: number; rounded?: boolean; isCurrent: boolean }) => {
    return (
        <Pagination.Item
            value={value}
            isCurrent={isCurrent}
            className={({ isSelected }) =>
                cx(
                    "flex size-10 cursor-pointer items-center justify-center p-3 text-sm font-medium text-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary focus-visible:z-10 focus-visible:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    rounded ? "rounded-full" : "rounded-lg",
                    isSelected && "bg-primary_hover text-secondary",
                )
            }
        >
            {value}
        </Pagination.Item>
    );
};

interface MobilePaginationProps {
    /** The current page. */
    page?: number;
    /** The total number of pages. */
    total?: number;
    /** The class name of the pagination component. */
    className?: string;
    /** The function to call when the page changes. */
    onPageChange?: (page: number) => void;
}

const MobilePagination = ({ page = 1, total = 10, className, onPageChange }: MobilePaginationProps) => {
    return (
        <nav aria-label="Pagination" className={cx("flex items-center justify-between md:hidden", className)}>
            <Button
                aria-label="Go to previous page"
                iconLeading={ArrowLeft}
                color="secondary"
                size="sm"
                onClick={() => onPageChange?.(Math.max(0, page - 1))}
            />

            <span className="text-sm text-fg-secondary">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{total}</span>
            </span>

            <Button
                aria-label="Go to next page"
                iconLeading={ArrowRight}
                color="secondary"
                size="sm"
                onClick={() => onPageChange?.(Math.min(total, page + 1))}
            />
        </nav>
    );
};

export const PaginationPageDefault = ({ rounded, page = 1, total = 10, className, ...props }: PaginationProps) => {
    return (
        <Pagination.Root
            {...props}
            page={page}
            total={total}
            className={cx("flex w-full max-w-full min-w-0 items-center justify-between gap-2 border-t border-secondary px-4 pt-4 md:gap-3 md:px-0 md:pt-5", className)}
        >
            <div className="flex min-w-0 flex-1 justify-start overflow-hidden">
                <Pagination.PrevTrigger asChild>
                    <Button iconLeading={ArrowLeft} color="link-gray" size="sm" className="shrink-0 min-w-0" />
                </Pagination.PrevTrigger>
            </div>

            <Pagination.Context>
                {({ pages }) => (
                    <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">
                        <div className="flex shrink-0 items-center justify-center gap-0.5">
                            {pages.map((pageItem, index) =>
                                pageItem.type === "page" ? (
                                    <PaginationItem key={index} rounded={rounded} {...pageItem} />
                                ) : (
                                    <Pagination.Ellipsis key={index} className="flex size-10 shrink-0 items-center justify-center text-tertiary">
                                        &#8230;
                                    </Pagination.Ellipsis>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </Pagination.Context>

            <div className="flex min-w-0 flex-1 justify-end overflow-hidden">
                <Pagination.NextTrigger asChild>
                    <Button iconTrailing={ArrowRight} color="link-gray" size="sm" className="shrink-0 min-w-0" />
                </Pagination.NextTrigger>
            </div>
        </Pagination.Root>
    );
};

export const PaginationPageMinimalCenter = ({ rounded, page = 1, total = 10, className, ...props }: PaginationProps) => {
    return (
        <Pagination.Root
            {...props}
            page={page}
            total={total}
            className={cx("flex w-full max-w-full min-w-0 items-center justify-between gap-2 border-t border-secondary px-4 pt-4 md:gap-3 md:px-0 md:pt-5", className)}
        >
            <div className="flex min-w-0 flex-1 justify-start overflow-hidden">
                <Pagination.PrevTrigger asChild>
                    <Button iconLeading={ArrowLeft} color="secondary" size="sm" className="shrink-0 min-w-0" />
                </Pagination.PrevTrigger>
            </div>

            <Pagination.Context>
                {({ pages }) => (
                    <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">
                        <div className="flex shrink-0 items-center justify-center gap-0.5">
                            {pages.map((pageItem, index) =>
                                pageItem.type === "page" ? (
                                    <PaginationItem key={index} rounded={rounded} {...pageItem} />
                                ) : (
                                    <Pagination.Ellipsis key={index} className="flex size-10 shrink-0 items-center justify-center text-tertiary">
                                        &#8230;
                                    </Pagination.Ellipsis>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </Pagination.Context>

            <div className="flex min-w-0 flex-1 justify-end overflow-hidden">
                <Pagination.NextTrigger asChild>
                    <Button iconTrailing={ArrowRight} color="secondary" size="sm" className="shrink-0 min-w-0" />
                </Pagination.NextTrigger>
            </div>
        </Pagination.Root>
    );
};

export const PaginationCardDefault = ({ rounded, page = 1, total = 10, ...props }: PaginationProps) => {
    return (
        <Pagination.Root
            {...props}
            page={page}
            total={total}
            className="flex w-full max-w-full min-w-0 items-center justify-between gap-2 border-t border-secondary px-4 py-3 md:gap-3 md:px-0 md:pt-3 md:pb-4"
        >
            <div className="flex min-w-0 flex-1 justify-start overflow-hidden">
                <Pagination.PrevTrigger asChild>
                    <Button iconLeading={ArrowLeft} color="secondary" size="sm" className="shrink-0 min-w-0" />
                </Pagination.PrevTrigger>
            </div>

            <Pagination.Context>
                {({ pages }) => (
                    <div className="flex min-w-0 flex-1 justify-center overflow-x-auto">
                        <div className="flex shrink-0 items-center justify-center gap-0.5">
                            {pages.map((pageItem, index) =>
                                pageItem.type === "page" ? (
                                    <PaginationItem key={index} rounded={rounded} {...pageItem} />
                                ) : (
                                    <Pagination.Ellipsis key={index} className="flex size-10 shrink-0 items-center justify-center text-tertiary">
                                        &#8230;
                                    </Pagination.Ellipsis>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </Pagination.Context>

            <div className="flex min-w-0 flex-1 justify-end overflow-hidden">
                <Pagination.NextTrigger asChild>
                    <Button iconTrailing={ArrowRight} color="secondary" size="sm" className="shrink-0 min-w-0" />
                </Pagination.NextTrigger>
            </div>
        </Pagination.Root>
    );
};

interface PaginationCardMinimalProps {
    /** The current page. */
    page?: number;
    /** The total number of pages. */
    total?: number;
    /** The alignment of the pagination. */
    align?: "left" | "center" | "right";
    /** The class name of the pagination component. */
    className?: string;
    /** The function to call when the page changes. */
    onPageChange?: (page: number) => void;
}

export const PaginationCardMinimal = ({ page = 1, total = 10, align = "left", onPageChange, className }: PaginationCardMinimalProps) => {
    return (
        <div className={cx("border-t border-secondary px-4 py-3 md:px-0 md:pt-3 md:pb-4", className)}>
            <MobilePagination page={page} total={total} onPageChange={onPageChange} />

            <nav aria-label="Pagination" className={cx("hidden items-center gap-3 md:flex", align === "center" && "justify-between")}>
                <div className={cx(align === "center" && "flex flex-1 justify-start")}>
                    <Button isDisabled={page === 1} color="secondary" size="sm" onClick={() => onPageChange?.(Math.max(0, page - 1))}>
                        Previous
                    </Button>
                </div>

                <span
                    className={cx(
                        "text-sm font-medium text-fg-secondary",
                        align === "right" && "order-first mr-auto",
                        align === "left" && "order-last ml-auto",
                    )}
                >
                    Page {page} of {total}
                </span>

                <div className={cx(align === "center" && "flex flex-1 justify-end")}>
                    <Button isDisabled={page === total} color="secondary" size="sm" onClick={() => onPageChange?.(Math.min(total, page + 1))}>
                        Next
                    </Button>
                </div>
            </nav>
        </div>
    );
};

interface PaginationButtonGroupProps extends Partial<Omit<PaginationRootProps, "children">> {
    /** The alignment of the pagination. */
    align?: "left" | "center" | "right";
}

export const PaginationButtonGroup = ({ align = "left", page = 1, total = 10, ...props }: PaginationButtonGroupProps) => {
    return (
        <div
            className={cx(
                "flex border-t border-secondary px-4 py-3 md:px-0 md:pt-3 md:pb-4",
                align === "left" && "justify-start",
                align === "center" && "justify-center",
                align === "right" && "justify-end",
            )}
        >
            <Pagination.Root {...props} page={page} total={total}>
                <Pagination.Context>
                    {({ pages }) => (
                        <ButtonGroup size="md">
                            <Pagination.PrevTrigger asChild>
                                <ButtonGroupItem iconLeading={ArrowLeft} />
                            </Pagination.PrevTrigger>

                            {pages.map((page, index) =>
                                page.type === "page" ? (
                                    <Pagination.Item key={index} {...page} asChild>
                                        <ButtonGroupItem isSelected={page.isCurrent} className="size-10 items-center justify-center">
                                            {page.value}
                                        </ButtonGroupItem>
                                    </Pagination.Item>
                                ) : (
                                    <Pagination.Ellipsis key={index}>
                                        <ButtonGroupItem className="pointer-events-none size-10 items-center justify-center rounded-none!">
                                            &#8230;
                                        </ButtonGroupItem>
                                    </Pagination.Ellipsis>
                                ),
                            )}

                            <Pagination.NextTrigger asChild>
                                <ButtonGroupItem iconTrailing={ArrowRight} />
                            </Pagination.NextTrigger>
                        </ButtonGroup>
                    )}
                </Pagination.Context>
            </Pagination.Root>
        </div>
    );
};
