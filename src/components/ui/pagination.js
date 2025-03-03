import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
const Pagination = ({ className, ...props }) => (_jsx("nav", { role: "navigation", "aria-label": "pagination", className: cn("mx-auto flex w-full justify-center", className), ...props }));
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (_jsx("ul", { ref: ref, className: cn("flex flex-row items-center gap-1", className), ...props })));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (_jsx("li", { ref: ref, className: cn("", className), ...props })));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (_jsx("a", { "aria-current": isActive ? "page" : undefined, className: cn(buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
    }), className), ...props }));
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({ className, ...props }) => (_jsxs(PaginationLink, { "aria-label": "Go to previous page", size: "default", className: cn("gap-1 pl-2.5", className), ...props, children: [_jsx(ChevronLeftIcon, { className: "h-4 w-4" }), _jsx("span", { children: "Anterior" })] }));
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({ className, ...props }) => (_jsxs(PaginationLink, { "aria-label": "Go to next page", size: "default", className: cn("gap-1 pr-2.5", className), ...props, children: [_jsx("span", { children: "Pr\u00F3ximo" }), _jsx(ChevronRightIcon, { className: "h-4 w-4" })] }));
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = ({ className, ...props }) => (_jsxs("span", { "aria-hidden": true, className: cn("flex h-9 w-9 items-center justify-center", className), ...props, children: [_jsx(DotsHorizontalIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "More pages" })] }));
PaginationEllipsis.displayName = "PaginationEllipsis";
export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis, };
