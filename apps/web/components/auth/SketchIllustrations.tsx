import React from "react";

/**
 * Hand-drawn pencil sketch of mountain ridges with a traveler carrying a backpack.
 * Styled with graphite line work, cross-hatching, and subtle stippling.
 */
export function MountainBackpackerSketch({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 320 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`select-none text-[#2e2d2a] ${className}`}
            aria-hidden="true"
        >
            {/* Distant mountain ridge */}
            <path
                d="M10 140 L70 70 L120 110 L190 45 L250 100 L310 140"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
            />
            {/* Distant ridge hatch shading */}
            <path
                d="M190 45 L180 80 M195 55 L188 90 M200 65 L195 100 M70 70 L65 100 M75 80 L72 110"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.3"
                strokeDasharray="2 3"
            />

            {/* Main mountain range */}
            <path
                d="M0 150 L45 95 L95 130 L155 60 L215 115 L280 80 L320 150"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
            />

            {/* Peak shading lines */}
            <path
                d="M155 60 L145 100 M160 70 L152 110 M165 80 L160 120 M170 92 L166 128 M280 80 L272 115 M285 90 L280 125"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.45"
            />

            {/* Foreground hill slope */}
            <path
                d="M0 155 Q80 135 160 145 T320 155"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
            />

            {/* Pine tree cluster on the left ridge */}
            <path
                d="M32 145 L32 120 M28 135 L32 120 L36 135 M27 140 L32 128 L37 140"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.7"
            />
            <path
                d="M44 148 L44 126 M41 138 L44 126 L47 138 M40 143 L44 132 L48 143"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Person with backpack standing on the trail looking towards mountains */}
            {/* Legs */}
            <path d="M128 145 L126 135 L129 126" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M132 145 L131 136 L129 126" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            {/* Torso & walking stick */}
            <path d="M129 126 L128 116" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M133 145 L131 122" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Backpack on their back */}
            <path
                d="M124 118 Q122 124 125 127 Q127 127 128 125"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="#eae6dc"
                opacity="0.9"
            />
            {/* Head */}
            <circle cx="128" cy="113" r="2.8" stroke="currentColor" strokeWidth="1.2" fill="#faf8f5" />

            {/* Subtle stipple / pebble dots on path */}
            <circle cx="120" cy="148" r="0.75" fill="currentColor" opacity="0.5" />
            <circle cx="123" cy="151" r="0.6" fill="currentColor" opacity="0.4" />
            <circle cx="136" cy="149" r="0.7" fill="currentColor" opacity="0.5" />
            <circle cx="142" cy="152" r="0.6" fill="currentColor" opacity="0.3" />
        </svg>
    );
}

/**
 * Hand-drawn pencil sketch of a pine tree and a rustic wooden signpost
 * with 3 directional signs: "Focus", "Build", "Grow".
 */
export function SignpostTreeSketch({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 240 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`select-none text-[#2e2d2a] ${className}`}
            aria-hidden="true"
        >
            {/* Ground contour */}
            <path
                d="M20 260 Q120 245 220 260"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Tall Sketched Pine Tree */}
            {/* Trunk */}
            <path d="M60 255 L60 80" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
            <path d="M58 255 L58 140" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Needles / Branches */}
            <path
                d="M60 70 L40 100 L55 98 L32 130 L52 127 L25 165 L50 162 L20 205 L58 200"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
            />
            <path
                d="M60 70 L80 100 L65 98 L88 130 L68 127 L95 165 L70 162 L100 205 L62 200"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
            />
            {/* Interior tree hatching */}
            <path
                d="M48 115 L72 115 M42 145 L78 145 M36 180 L84 180"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity="0.4"
            />

            {/* Wooden Signpost Post */}
            <path d="M155 255 L155 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            <path d="M153 255 L153 110" stroke="currentColor" strokeWidth="1" opacity="0.3" />

            {/* Sign 1: Focus (Pointing right) */}
            <path
                d="M130 115 L185 115 L198 127 L185 139 L130 139 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="#fdfcf9"
                strokeLinejoin="round"
            />
            <text
                x="142"
                y="131"
                fill="currentColor"
                fontSize="11"
                fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                letterSpacing="0.5"
            >
                Focus →
            </text>

            {/* Sign 2: Build (Pointing left) */}
            <path
                d="M180 150 L125 150 L112 162 L125 174 L180 174 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="#fdfcf9"
                strokeLinejoin="round"
            />
            <text
                x="126"
                y="166"
                fill="currentColor"
                fontSize="11"
                fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                letterSpacing="0.5"
            >
                ← Build
            </text>

            {/* Sign 3: Grow (Pointing right) */}
            <path
                d="M130 185 L182 185 L195 197 L182 209 L130 209 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="#fdfcf9"
                strokeLinejoin="round"
            />
            <text
                x="143"
                y="201"
                fill="currentColor"
                fontSize="11"
                fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                letterSpacing="0.5"
            >
                Grow →
            </text>

            {/* Wood nail markings */}
            <circle cx="155" cy="127" r="1.2" fill="currentColor" />
            <circle cx="155" cy="162" r="1.2" fill="currentColor" />
            <circle cx="155" cy="197" r="1.2" fill="currentColor" />
        </svg>
    );
}

/**
 * Clean monochrome sketch-style Google "G" icon.
 */
export function GoogleSketchIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
            <path
                d="M21.35 11.1H12v2.8h5.35c-.25 1.3-1.1 2.4-2.3 3.15l3.5 2.7c2.05-1.9 3.2-4.7 3.2-7.85 0-.6-.05-1.2-.15-1.8z"
                fill="#2e2d2a"
            />
            <path
                d="M12 21c2.7 0 4.95-.9 6.6-2.45l-3.5-2.7c-.9.6-2.05 1-3.1 1-2.4 0-4.4-1.6-5.15-3.8l-3.6 2.8C4.55 18.9 7.95 21 12 21z"
                fill="#2e2d2a"
            />
            <path
                d="M6.85 13.05c-.2-.6-.3-1.25-.3-1.95s.1-1.35.3-1.95l-3.6-2.8C2.45 7.8 2 9.85 2 12s.45 4.2 1.25 5.65l3.6-2.6z"
                fill="#2e2d2a"
            />
            <path
                d="M12 5.85c1.45 0 2.8.5 3.8 1.45l2.85-2.85C16.95 2.9 14.7 2 12 2 7.95 2 4.55 4.1 3.25 7.45l3.6 2.8C7.6 8.05 9.6 6.45 12 6.45z"
                fill="#2e2d2a"
            />
        </svg>
    );
}

/**
 * Hand-drawn horizontal divider with "or" label in pencil style.
 */
export function SketchDivider({ text = "or" }: { text?: string }) {
    return (
        <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-[#3a3834] opacity-35" style={{ borderStyle: "dashed" }} />
            <span className="absolute px-3 text-xs font-handwriting text-[#5a574f] bg-[#fdfcf9] text-[15px]">
                {text}
            </span>
        </div>
    );
}
