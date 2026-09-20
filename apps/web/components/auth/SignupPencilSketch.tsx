"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    SketchMailIcon,
    SketchUserIcon,
    SketchGoogleG,
} from "./SketchIcons";
import s from "./LoginPencilSketch.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Hand-drawn SVG icons for the bottom features ── */

function RocketIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 28s-4-4-4-10c0-6 4-14 4-14s4 8 4 14c0 6-4 10-4 10z" />
            <path d="M12 18l-4 4 2 4" />
            <path d="M20 18l4 4-2 4" />
            <circle cx="16" cy="15" r="2" />
        </svg>
    );
}

function MapIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="4 6 12 4 20 6 28 4 28 26 20 28 12 26 4 28" />
            <line x1="12" y1="4" x2="12" y2="26" />
            <line x1="20" y1="6" x2="20" y2="28" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="16 3 19.5 12.5 29 12.5 21.5 18.5 24 28 16 22.5 8 28 10.5 18.5 3 12.5 12.5 12.5" />
        </svg>
    );
}

/* ================================================================ */
/* SignupPencilSketch                                               */
/* ================================================================ */

export function SignupPencilSketch() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleGoogleSignup = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/magic-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to send magic link. Please try again.");
                return;
            }

            setSuccess("A secure signup link has been sent to your email. Check your inbox to finish setting up your account.");
        } catch {
            setError("Unable to connect to the authentication server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.page}>

            {/* ───── HEADER ───── */}
            <header className={s.header}>
                <div className={s.logoGroup}>
                    <span className={s.logoText}>Klyro</span>
                    <span className={s.tagline}>Build Together</span>
                </div>

                <div className={s.headerRight}>
                    <nav className={s.nav}>
                        <Link href="/product" className={s.navLink}>Product</Link>
                        <Link href="/pricing" className={s.navLink}>Pricing</Link>
                        <Link href="/about" className={s.navLink}>About</Link>
                    </nav>
                    <Link href="/login" className={s.signInBtn}>Sign in</Link>
                </div>
            </header>

            {/* ───── MAIN ───── */}
            <main className={s.main}>

                {/* LEFT COLUMN */}
                <section className={s.leftCol}>
                    <div className={s.leftInner}>

                        {/* Handwritten annotation */}
                        <div className={s.annotation}>
                            Ideas<br />To<br />Impact.
                        </div>

                        {/* Heading */}
                        <h2 className={s.heading}>Create your account</h2>

                        {/* Hand-drawn underline */}
                        <svg className={s.underlineSvg} viewBox="0 0 200 6" fill="none">
                            <path d="M1 4.5C40 1.5 100 0.5 199 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>

                        {/* Subtitle */}
                        <p className={s.subtitle}>
                            Join a workspace built for builders.
                        </p>

                        {/* ── Auth Card ── */}
                        <div className={s.card}>

                            {error && <div className={s.errorMsg} role="alert">{error}</div>}
                            {success && <div className={s.successMsg} role="status">{success}</div>}

                            {/* Signup form */}
                            <form onSubmit={handleSignupSubmit} className={s.form} noValidate>

                                {/* Name */}
                                <div>
                                    <label htmlFor="signup-name" className={s.fieldLabel}>Name</label>
                                    <div className={s.inputWrap}>
                                        <span className={s.inputIcon}>
                                            <SketchUserIcon className="w-[18px] h-[18px]" />
                                        </span>
                                        <input
                                            id="signup-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            disabled={isLoading}
                                            className={s.emailInput}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="signup-email" className={s.fieldLabel}>Email</label>
                                    <div className={s.inputWrap}>
                                        <span className={s.inputIcon}>
                                            <SketchMailIcon className="w-[18px] h-[18px]" />
                                        </span>
                                        <input
                                            id="signup-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            disabled={isLoading}
                                            className={s.emailInput}
                                        />
                                    </div>
                                </div>



                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={s.submitBtn}
                                    id="signup-submit-btn"
                                >
                                    {isLoading ? "Sending link…" : "Send magic link →"}
                                </button>

                                <p className={s.helperText}>
                                    We&apos;ll send a secure login link to your email.
                                </p>
                            </form>

                            {/* Divider */}
                            <div className={s.divider}>
                                <div className={s.dividerLine} />
                                <span className={s.dividerText}>or</span>
                                <div className={s.dividerLine} />
                            </div>

                            {/* Google button */}
                            <button type="button" onClick={handleGoogleSignup} className={s.googleBtn} id="google-signup-btn">
                                <SketchGoogleG className="w-5 h-5" />
                                Continue with Google
                            </button>

                            {/* Sign-in link */}
                            <div className={s.signupRow}>
                                <span className={s.signupLabel}>Already have an account?&nbsp;</span>
                                <Link href="/login" className={s.signupLink}>Sign in</Link>
                            </div>
                        </div>

                        {/* Bottom features */}
                        <div className={s.features}>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><RocketIcon /></span>
                                <span className={s.featureLabel}>{"Launch\nYour Idea"}</span>
                            </div>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><MapIcon /></span>
                                <span className={s.featureLabel}>{"Chart\nYour Path"}</span>
                            </div>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><StarIcon /></span>
                                <span className={s.featureLabel}>{"Make\nAn Impact"}</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* RIGHT COLUMN — illustration */}
                <section className={s.rightCol}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/sketch/hero_signup.jpg"
                        alt="Pencil sketch of a mountain trail with signpost pointing to Build, Learn, Grow"
                        className={s.heroImg}
                    />
                    <div className={s.fadeLeft} />
                    <div className={s.fadeTop} />
                    <div className={s.fadeBottom} />
                    <div className={s.fadeRight} />
                </section>

            </main>
        </div>
    );
}
