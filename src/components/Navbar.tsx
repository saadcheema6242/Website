"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Ship, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            unsubscribe();
        };
    }, []);

    const handleSignOut = () => signOut(auth);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                isScrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gold/20 py-3"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -4, 0],
                            rotateX: [0, 5, 0],
                            rotateY: [0, 10, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ perspective: 1000 }}
                    >
                        <Image
                            src="/pics/luxury_icon.png"
                            alt="Luxury Cruises Logo"
                            width={44}
                            height={44}
                            className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                            priority
                        />
                    </motion.div>
                    <span
                        className={cn(
                            "text-xl font-heading font-bold tracking-wider",
                            isScrolled ? "text-navy" : "text-white"
                        )}
                    >
                        LUXURY <span className="text-gold">CRUISES</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/#how-it-works"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-gold",
                            isScrolled ? "text-navy/80" : "text-white/80"
                        )}
                    >
                        How it Works
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="group/profile relative">
                                <div className="w-10 h-10 rounded-full border-2 border-gold/30 overflow-hidden transition-all group-hover/profile:scale-110 group-hover/profile:border-gold shadow-lg">
                                    <img
                                        src="https://api.dicebear.com/7.x/shapes/svg?seed=luxury&backgroundColor=1a237e&shapeColor=c5a059"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className={cn("p-2 rounded-full transition-colors hover:bg-gold/10", isScrolled ? "text-navy" : "text-white")}
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className={cn(
                                "text-sm font-bold uppercase tracking-widest",
                                isScrolled ? "text-navy hover:text-gold" : "text-white hover:text-gold"
                            )}
                        >
                            Sign In
                        </Link>
                    )}

                    <Link
                        href={user ? "/apply" : "/login?redirect=/apply"}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:scale-105 active:scale-95",
                            isScrolled
                                ? "border-navy text-navy hover:bg-navy hover:text-white"
                                : "border-white text-white hover:bg-white hover:text-navy"
                        )}
                    >
                        Apply Now
                    </Link>
                    <Link
                        href="/#check-eligibility"
                        className={cn(
                            "px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95",
                            isScrolled
                                ? "bg-navy text-white hover:bg-navy/90 shadow-md"
                                : "bg-gold text-white hover:bg-gold-light"
                        )}
                    >
                        Check Eligibility
                    </Link>
                </div>
            </div>
        </nav>
    );
}

