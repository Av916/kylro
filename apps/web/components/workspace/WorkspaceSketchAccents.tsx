import React from "react";

/**
 * Hand-drawn wavy underline beneath headings, exactly matching login/signup aesthetic.
 */
export function SketchUnderline({ className = "w-44 h-2 text-[#8e887a]" }: { className?: string }) {
    return (
        <svg
            className={`block ${className}`}
            viewBox="0 0 200 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M2 5C45 1.8 115 1.2 198 4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Hand-drawn sparkle / graphite star for highlighting features or active items.
 */
export function SketchSparkle({ className = "w-4 h-4 text-[#b0782e]" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13" opacity="0.6" strokeDasharray="1 2" />
            <polygon points="12 4 14 10 20 12 14 14 12 20 10 14 4 12 10 10 12 4" fill="currentColor" fillOpacity="0.15" />
        </svg>
    );
}

/**
 * Architect's drafting compass icon for new project creation.
 */
export function DraftingCompassSketch({ className = "w-6 h-6 text-currentColor" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7l-7 14" />
            <path d="M12 7l7 14" />
            <path d="M8 15c2.5-1 5.5-1 8 0" />
            <circle cx="12" cy="7" r="0.8" fill="currentColor" />
        </svg>
    );
}

/**
 * Studio Notebook / Moleskine icon
 */
export function StudioNotebookIcon({ className = "w-5 h-5 text-currentColor" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="5" y="3" width="15" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" strokeDasharray="1 1.5" />
            <line x1="12" y1="8" x2="17" y2="8" />
            <line x1="12" y1="12" x2="17" y2="12" />
            <line x1="12" y1="16" x2="15" y2="16" />
            <circle cx="3" cy="7" r="1" fill="currentColor" />
            <circle cx="3" cy="12" r="1" fill="currentColor" />
            <circle cx="3" cy="17" r="1" fill="currentColor" />
        </svg>
    );
}

/**
 * Hand-drawn organic sparkline curve for workspace pulse
 */
export function HandDrawnSparkline({ className = "w-20 h-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 90 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M2 24 C 14 26, 20 12, 30 18 C 40 24, 48 8, 58 14 C 68 20, 74 6, 88 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
            />
            {/* Soft shade under curve */}
            <path
                d="M2 24 C 14 26, 20 12, 30 18 C 40 24, 48 8, 58 14 C 68 20, 74 6, 88 4 L 88 30 L 2 30 Z"
                fill="currentColor"
                opacity="0.08"
            />
            <circle cx="88" cy="4" r="2.5" fill="currentColor" />
        </svg>
    );
}

/**
 * Hand-drawn pencil bar chart with graphite crosshatching
 */
export function HandDrawnBarChart({ className = "w-20 h-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 80 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Bar 1 */}
            <rect x="4" y="16" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
            {/* Bar 2 */}
            <rect x="18" y="10" width="7" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.25" />
            {/* Bar 3 */}
            <rect x="32" y="14" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.18" />
            {/* Bar 4 */}
            <rect x="46" y="6" width="7" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.4" />
            {/* Bar 5 */}
            <rect x="60" y="2" width="7" height="28" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.55" />
        </svg>
    );
}

/**
 * Hand-drawn coffee mug sketch doodle for the warm studio touch
 */
export function StudioCoffeeSketch({ className = "w-5 h-5 text-currentColor" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
            <path d="M16 10h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
            {/* Steam lines */}
            <path d="M7 4c.5.8.5 1.4 0 2.2" opacity="0.6" strokeWidth="1.1" />
            <path d="M10 3c.6.9.6 1.7 0 2.6" opacity="0.8" strokeWidth="1.1" />
            <path d="M13 4c.5.8.5 1.4 0 2.2" opacity="0.6" strokeWidth="1.1" />
            <line x1="2" y1="21" x2="18" y2="21" strokeWidth="1.2" />
        </svg>
    );
}
