import React from "react";

/**
 * Hand-drawn envelope outline icon
 */
export function SketchMailIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </svg>
    );
}

/**
 * Hand-drawn user silhouette outline icon
 */
export function SketchUserIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

/**
 * Hand-drawn @ symbol outline icon
 */
export function SketchAtIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
        </svg>
    );
}

/**
 * Hand-sketched Google "G" logo matching the reference drawing
 */
export function SketchGoogleG({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M21 12.3c0-.8-.07-1.5-.2-2.3H12v4.3h5.1c-.22 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.1 2.8-7.3z"
                fill="#2e2d2a"
            />
            <path
                d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4H3.4v2.5C5 19.7 8.2 21.5 12 21.5z"
                fill="#2e2d2a"
            />
            <path
                d="M6.6 13.6c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1V6.9H3.4C2.7 8.4 2.3 10.1 2.3 12s.4 3.6 1.1 5.1l3.2-2.5v-1z"
                fill="#2e2d2a"
            />
            <path
                d="M12 6.5c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 3.5 14.6 2.5 12 2.5 8.2 2.5 5 4.3 3.4 7.4l3.2 2.5c.8-2.3 2.9-3.4 5.4-3.4z"
                fill="#2e2d2a"
            />
        </svg>
    );
}

/**
 * Hand-drawn horizontal line divider with centered "or"
 */
export function SketchOrDivider() {
    return (
        <div className="flex items-center justify-center my-4 w-full">
            <div className="flex-1 h-[1px] bg-[#3a3834] opacity-40" />
            <span className="px-3 text-sm font-patrick text-[#52504b]">
                or
            </span>
            <div className="flex-1 h-[1px] bg-[#3a3834] opacity-40" />
        </div>
    );
}
