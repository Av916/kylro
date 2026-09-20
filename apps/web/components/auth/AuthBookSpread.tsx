"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    SketchAtIcon,
    SketchGoogleG,
    SketchMailIcon,
    SketchOrDivider,
    SketchUserIcon,
} from "./SketchIcons";

interface AuthBookSpreadProps {
    initialMode?: "login" | "signup";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthBookSpread({ initialMode = "login" }: AuthBookSpreadProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState("");
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

    // Signup Form State
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [isLoadingSignup, setIsLoadingSignup] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);
    const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

    // Initiates Google OAuth via backend redirect
    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    // Submits login magic link request
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

            setLoginSuccess(
                "A secure magic link has been sent to your email. Please check your inbox.",
            );
        } catch {
            setLoginError("Unable to connect to the authentication server. Please verify the backend is running.");
        } finally {
            setIsLoadingLogin(false);
        }
    };

    // Submits signup magic link request
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError(null);
        setSignupSuccess(null);

        const email = signupEmail.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setSignupError("Please enter a valid email address.");
            return;
        }

        setIsLoadingSignup(true);

        try {
            // Backend accepts email for passwordless provisioning
            const res = await fetch(`${API_URL}/api/auth/magic-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setSignupError(data.message || "Failed to send magic link. Please try again.");
                return;
            }

            setSignupSuccess(
                "A secure signup magic link has been sent to your email. Check your inbox to finish setting up your account.",
            );
        } catch {
            setSignupError("Unable to connect to the authentication server. Please verify the backend is running.");
        } finally {
            setIsLoadingSignup(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f3eb] text-[#1f1f1e] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative selection:bg-[#eae5d8] overflow-x-hidden">
            {/* Mobile Mode Switcher (< lg screens) */}
            <div className="flex lg:hidden items-center justify-center gap-4 mb-6 bg-[#eae6dc] p-1 rounded-lg border border-[#3a3834] border-dashed">
                <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`px-5 py-1.5 rounded-md font-patrick text-base transition-all ${
                        mode === "login"
                            ? "bg-[#2b2a28] text-white shadow-sm"
                            : "text-[#52504b] hover:text-black"
                    }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`px-5 py-1.5 rounded-md font-patrick text-base transition-all ${
                        mode === "signup"
                            ? "bg-[#2b2a28] text-white shadow-sm"
                            : "text-[#52504b] hover:text-black"
                    }`}
                >
                    Create Account
                </button>
            </div>

            {/* Desktop Two-Page Open Sketchbook Container */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 relative items-start">
                {/* Subtle central fold crease in sketchbook (desktop only) */}
                <div
                    className="hidden lg:block absolute left-1/2 top-0 bottom-0 -ml-[1px] w-[2px] opacity-15 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent, rgba(46, 45, 42, 0.4) 15%, rgba(46, 45, 42, 0.4) 85%, transparent)",
                    }}
                />

                {/* ========================================================= */}
                {/* LEFT PANEL: LOGIN CARD & MOUNTAIN BACKPACKER SKETCH */}
                {/* ========================================================= */}
                <div
                    className={`relative flex flex-col ${
                        mode === "login" ? "block" : "hidden lg:flex"
                    }`}
                >
                    {/* Top-Left Handwritten Margin Annotation */}
                    <div className="mb-2.5 ml-2 select-none">
                        <div className="font-patrick text-xl leading-tight text-[#2e2d2a] -rotate-2 inline-block">
                            <span>Same</span>
                            <br />
                            <span>People.</span>
                            <br />
                            <span>Bigger</span>
                            <br />
                            <span>Ideas.</span>
                            <div className="w-10 h-[1.5px] bg-[#2e2d2a] mt-0.5 opacity-60" />
                        </div>
                    </div>

                    {/* Sketched Card Frame */}
                    <div className="sketch-card p-6 sm:p-8 md:p-9 relative z-10">
                        {/* Inside Top-Right Corner Annotation */}
                        <div className="absolute top-4 right-5 select-none text-right">
                            <div className="font-caveat text-lg leading-tight text-[#3d3b37] rotate-6">
                                <span>Build</span>
                                <br />
                                <span>Ship</span>
                                <br />
                                <span>Repeat</span>
                                <div className="w-8 h-[1px] bg-[#3d3b37] ml-auto mt-0.5 opacity-50" />
                            </div>
                        </div>

                        {/* Title Header */}
                        <div className="text-center mt-1 mb-5">
                            <h1 className="font-kalam text-5xl font-bold tracking-tight text-[#1f1f1e]">
                                Klyro
                            </h1>
                            <p className="font-patrick text-lg text-[#52504b] mt-0.5">
                                Your team&apos;s developer workspace
                            </p>
                        </div>

                        {/* Error & Success Feedback */}
                        {loginError && (
                            <div
                                role="alert"
                                className="mb-4 p-2.5 bg-[#fcf0ee] border border-[#a8483b] text-[#842317] rounded-md font-patrick text-sm shadow-[1px_1px_0px_#a8483b]"
                            >
                                {loginError}
                            </div>
                        )}
                        {loginSuccess && (
                            <div
                                role="status"
                                className="mb-4 p-2.5 bg-[#f0f6ee] border border-[#3b7036] text-[#22481e] rounded-md font-patrick text-sm shadow-[1px_1px_0px_#3b7036]"
                            >
                                {loginSuccess}
                            </div>
                        )}

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="sketch-outline-button w-full py-2.5 px-4 flex items-center justify-center gap-3 font-patrick text-lg cursor-pointer"
                        >
                            <SketchGoogleG className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </button>

                        {/* Hand-Drawn "or" Divider */}
                        <SketchOrDivider />

                        {/* Email Magic-Link Form */}
                        <form onSubmit={handleLoginSubmit} className="space-y-3" noValidate>
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="font-patrick text-base text-[#383733] font-medium block mb-1"
                                >
                                    Email
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-[#636058] pointer-events-none">
                                        <SketchMailIcon className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="login-email"
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        disabled={isLoadingLogin}
                                        className="sketch-input-field w-full pl-10 pr-3.5 py-2 font-patrick text-base placeholder-[#9e9a8f]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoadingLogin}
                                className="sketch-hatch-button w-full py-2.5 px-4 font-patrick text-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isLoadingLogin ? "Sending magic link..." : "Continue with email →"}
                            </button>

                            <p className="font-patrick text-sm text-[#66635a] text-center pt-0.5">
                                We&apos;ll send you a secure magic link.
                            </p>
                        </form>

                        {/* Card Bottom Divider & Link */}
                        <div className="pt-4 mt-5 border-t border-[#3a3834] opacity-30" />
                        <div className="text-center font-patrick text-base text-[#383733]">
                            <span>New to Klyro? </span>
                            <Link
                                href="/signup"
                                onClick={() => setMode("signup")}
                                className="underline underline-offset-4 hover:text-black font-semibold"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>

                    {/* Bottom-Left Mountain Backpacker Illustration */}
                    <div className="relative mt-[-20px] -ml-4 z-0 pointer-events-none select-none max-w-[340px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/sketch/mountains_backpacker.png"
                            alt="Mountain landscape with hiker sketch"
                            className="w-full h-auto mix-blend-multiply opacity-90 block"
                        />
                        <p className="font-caveat text-xl text-[#3d3b37] italic -rotate-2 ml-4 -mt-2">
                            &quot;Better tools for bigger dreams.&quot;
                        </p>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT PANEL: SIGNUP CARD & PINE SIGNPOST SKETCH */}
                {/* ========================================================= */}
                <div
                    className={`relative flex flex-col ${
                        mode === "signup" ? "block" : "hidden lg:flex"
                    }`}
                >
                    {/* Top-Right Handwritten Margin Annotation */}
                    <div className="mb-2.5 mr-4 text-right select-none ml-auto">
                        <div className="font-patrick text-xl leading-tight text-[#2e2d2a] rotate-2 inline-block text-right">
                            <span>Ideas</span>
                            <br />
                            <span>To Impact</span>
                            <div className="w-12 h-[1.5px] bg-[#2e2d2a] mt-0.5 ml-auto opacity-60" />
                        </div>
                    </div>

                    {/* Sketched Card Frame */}
                    <div className="sketch-card p-6 sm:p-8 md:p-9 relative z-10">
                        {/* Title Header */}
                        <div className="text-center mt-1 mb-4">
                            <h2 className="font-kalam text-5xl font-bold tracking-tight text-[#1f1f1e]">
                                Klyro
                            </h2>
                            <h3 className="font-patrick text-2xl font-bold text-[#1f1f1e] mt-1">
                                Create your account
                            </h3>
                            <p className="font-patrick text-base text-[#52504b]">
                                Join a workspace built for builders.
                            </p>
                        </div>

                        {/* Error & Success Feedback */}
                        {signupError && (
                            <div
                                role="alert"
                                className="mb-4 p-2.5 bg-[#fcf0ee] border border-[#a8483b] text-[#842317] rounded-md font-patrick text-sm shadow-[1px_1px_0px_#a8483b]"
                            >
                                {signupError}
                            </div>
                        )}
                        {signupSuccess && (
                            <div
                                role="status"
                                className="mb-4 p-2.5 bg-[#f0f6ee] border border-[#3b7036] text-[#22481e] rounded-md font-patrick text-sm shadow-[1px_1px_0px_#3b7036]"
                            >
                                {signupSuccess}
                            </div>
                        )}

                        {/* Signup Form */}
                        <form onSubmit={handleSignupSubmit} className="space-y-2.5" noValidate>
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="signup-name"
                                    className="font-patrick text-base text-[#383733] font-medium block mb-0.5"
                                >
                                    Name
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-[#636058] pointer-events-none">
                                        <SketchUserIcon className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="signup-name"
                                        type="text"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        placeholder="Your name"
                                        disabled={isLoadingSignup}
                                        className="sketch-input-field w-full pl-10 pr-3.5 py-1.5 font-patrick text-base placeholder-[#9e9a8f]"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="signup-email"
                                    className="font-patrick text-base text-[#383733] font-medium block mb-0.5"
                                >
                                    Email
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-[#636058] pointer-events-none">
                                        <SketchMailIcon className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        required
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        disabled={isLoadingSignup}
                                        className="sketch-input-field w-full pl-10 pr-3.5 py-1.5 font-patrick text-base placeholder-[#9e9a8f]"
                                    />
                                </div>
                            </div>

                            {/* Username Field */}
                            <div>
                                <label
                                    htmlFor="signup-username"
                                    className="font-patrick text-base text-[#383733] font-medium block mb-0.5"
                                >
                                    Username
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-[#636058] pointer-events-none">
                                        <SketchAtIcon className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="signup-username"
                                        type="text"
                                        value={signupUsername}
                                        onChange={(e) => setSignupUsername(e.target.value)}
                                        placeholder="yourusername"
                                        disabled={isLoadingSignup}
                                        className="sketch-input-field w-full pl-10 pr-3.5 py-1.5 font-patrick text-base placeholder-[#9e9a8f]"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoadingSignup}
                                className="sketch-hatch-button w-full py-2.5 px-4 font-patrick text-lg flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
                            >
                                {isLoadingSignup ? "Sending magic link..." : "Send magic link →"}
                            </button>

                            <p className="font-patrick text-sm text-[#66635a] text-center pt-0.5">
                                We&apos;ll send a secure login link to your email.
                            </p>
                        </form>

                        {/* Hand-Drawn "or" Divider */}
                        <SketchOrDivider />

                        {/* Google OAuth Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="sketch-outline-button w-full py-2 px-4 flex items-center justify-center gap-3 font-patrick text-base cursor-pointer"
                        >
                            <SketchGoogleG className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </button>

                        {/* Bottom link to Sign In */}
                        <div className="text-center font-patrick text-base text-[#383733] mt-3.5">
                            <span>Already have an account? </span>
                            <Link
                                href="/login"
                                onClick={() => setMode("login")}
                                className="underline underline-offset-4 hover:text-black font-semibold"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* Right-Side Pine Tree & Signpost Illustration */}
                    <div className="relative mt-[-30px] -mr-4 self-end z-0 pointer-events-none select-none max-w-[240px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/sketch/signpost_tree.png"
                            alt="Pine tree and wooden signpost sketch"
                            className="w-full h-auto mix-blend-multiply opacity-90 block"
                        />
                        <p className="font-caveat text-xl text-[#3d3b37] italic rotate-2 text-right mr-3 -mt-2">
                            A calmer way to build.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
