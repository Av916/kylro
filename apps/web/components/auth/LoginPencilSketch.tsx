"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SketchMailIcon, SketchGoogleG } from "./SketchIcons";
import s from "./LoginPencilSketch.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Hand-drawn SVG icons for the bottom features ── */

function UsersIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="10" r="4" />
            <path d="M3 26v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
            <circle cx="22" cy="10" r="3.5" />
            <path d="M24 18a5.5 5.5 0 0 1 5 5.5V26" />
        </svg>
    );
}

function LightningIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="18 3 5 18 15 18 14 29 27 14 17 14 18 3" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="20" width="5" height="8" rx="1" />
            <rect x="13.5" y="14" width="5" height="14" rx="1" />
            <rect x="23" y="8" width="5" height="20" rx="1" />
            <path d="M6 16l8-8 5 4 7-7" />
        </svg>
    );
}

/* ================================================================ */
/* LoginPencilSketch                                                */
/* ================================================================ */

export function LoginPencilSketch() {
    const [loginEmail, setLoginEmail] = useState("");
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoginSuccess(null);

        const email = loginEmail.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setLoginError("Please enter a valid email address.");
            return;
        }

        setIsLoadingLogin(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/magic-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setLoginError(data.message || "Failed to send magic link. Please try again.");
                return;
            }

            setLoginSuccess("A secure magic link has been sent to your email.");
        } catch {
            setLoginError("Unable to connect to the authentication server.");
        } finally {
            setIsLoadingLogin(false);
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
                            Same<br />People.<br />Bigger<br />Ideas.
                        </div>

                        {/* Heading */}
                        <h2 className={s.heading}>Welcome back</h2>

                        {/* Hand-drawn underline */}
                        <svg className={s.underlineSvg} viewBox="0 0 200 6" fill="none">
                            <path d="M1 4.5C40 1.5 100 0.5 199 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>

                        {/* Subtitle */}
                        <p className={s.subtitle}>
                            Sign in to your workspace and<br />keep building.
                        </p>

                        {/* ── Auth Card ── */}
                        <div className={s.card}>

                            {loginError && <div className={s.errorMsg} role="alert">{loginError}</div>}
                            {loginSuccess && <div className={s.successMsg} role="status">{loginSuccess}</div>}

                            {/* Google button */}
                            <button type="button" onClick={handleGoogleLogin} className={s.googleBtn} id="google-login-btn">
                                <SketchGoogleG className="w-5 h-5" />
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className={s.divider}>
                                <div className={s.dividerLine} />
                                <span className={s.dividerText}>or</span>
                                <div className={s.dividerLine} />
                            </div>

                            {/* Email form */}
                            <form onSubmit={handleLoginSubmit} className={s.form} noValidate>
                                <div>
                                    <label htmlFor="login-email" className={s.fieldLabel}>Email</label>
                                    <div className={s.inputWrap}>
                                        <span className={s.inputIcon}>
                                            <SketchMailIcon className="w-[18px] h-[18px]" />
                                        </span>
                                        <input
                                            id="login-email"
                                            type="email"
                                            required
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            disabled={isLoadingLogin}
                                            className={s.emailInput}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoadingLogin}
                                    className={s.submitBtn}
                                    id="email-submit-btn"
                                >
                                    {isLoadingLogin ? "Sending link…" : "Continue with email →"}
                                </button>

                                <p className={s.helperText}>
                                    We&apos;ll send you a secure magic link.
                                </p>
                            </form>

                            {/* Sign-up link */}
                            <div className={s.signupRow}>
                                <span className={s.signupLabel}>New to Klyro?&nbsp;</span>
                                <Link href="/signup" className={s.signupLink}>Create an account</Link>
                            </div>
                        </div>

                        {/* Bottom features */}
                        <div className={s.features}>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><UsersIcon /></span>
                                <span className={s.featureLabel}>{"Build\nTogether"}</span>
                            </div>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><LightningIcon /></span>
                                <span className={s.featureLabel}>{"Ship\nFaster"}</span>
                            </div>
                            <div className={s.featureItem}>
                                <span className={s.featureIcon}><ChartIcon /></span>
                                <span className={s.featureLabel}>{"Make\nAn Impact"}</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* RIGHT COLUMN — illustration */}
                <section className={s.rightCol}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/sketch/hero_workspace.jpg"
                        alt="Pencil sketch of a cozy creative workspace beside a mountain window"
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
