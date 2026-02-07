"use client";

import { useEffect, useState, Suspense } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Ship, Lock, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ADMIN_EMAILS } from "@/lib/constants";

function LoginContent() {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const isAdmin = user.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());
                if (isAdmin) {
                    router.push("/admin");
                } else if (redirectPath) {
                    router.push(redirectPath);
                } else {
                    router.push("/dashboard");
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router, redirectPath]);

    const handleLogin = async () => {
        setIsSubmitting(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const isAdmin = user.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

            if (isAdmin) {
                router.push("/admin");
            } else if (redirectPath) {
                router.push(redirectPath);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Sign in failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <img src="/pics/luxury_icon.png" className="w-16 h-16 object-contain animate-bounce" alt="Loading..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-body">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/pics/luxury_cruise_ship_hero_1770286669203.png"
                    alt="Luxury Interior"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-navy/80 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-[500px] px-6">
                <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3 group hover:rotate-0 transition-transform duration-500 p-3">
                            <img src="/pics/luxury_icon.png" className="w-full h-full object-contain" alt="Logo" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-4 tracking-tight">
                            Gateway to <span className="text-gold italic font-medium">Luxury</span>
                        </h1>
                        <p className="text-navy/50 text-sm font-medium uppercase tracking-[0.2em]">
                            Exclusively for Invited Members
                        </p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleLogin}
                            disabled={isSubmitting}
                            className="w-full group py-5 bg-navy text-white rounded-2xl font-bold tracking-[0.15em] shadow-2xl hover:bg-navy/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 border border-navy/10"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    SIGN IN WITH GOOGLE
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </>
                            )}
                        </button>

                        <div className="pt-10 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 py-2 px-4 bg-slate-50 rounded-full border border-slate-100">
                                <Lock className="w-3 h-3 text-gold" />
                                <p className="text-[10px] text-navy/40 uppercase tracking-[0.2em] font-bold">Encrypted Connection</p>
                            </div>
                            <button
                                onClick={() => router.push('/')}
                                className="text-xs font-bold text-navy/40 hover:text-navy transition-colors tracking-widest uppercase hover:underline underline-offset-8"
                            >
                                Back to Main Deck
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium">
                    &copy; 2026 Luxury Cruises. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <img src="/pics/luxury_icon.png" className="w-16 h-16 object-contain animate-bounce" alt="Loading..." />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

