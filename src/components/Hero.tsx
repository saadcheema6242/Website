"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/pics/luxury_cruise_ship_hero_1770286669203.png"
                    alt="Luxury Cruise Ship at Sunset"
                    fill
                    className="object-cover scale-105"
                    priority
                />
                {/* Navy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/80" />
            </div>

            <div className="relative z-10 max-w-5xl px-6 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold-light">
                        Exclusive Virtual Presentation
                    </span>
                    <h1 className="text-4xl md:text-7xl font-heading font-bold mb-6 leading-[1.1]">
                        Trade 90 Minutes for a <br />
                        <span className="text-gold italic">Complimentary Cruise</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
                        Join our live online luxury cruise destination tour and receive a complimentary cruise incentive as our thank-you for attending.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#check-eligibility"
                            className="group relative w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-cta-red to-[#d32f2f] rounded-lg font-bold text-lg shadow-xl hover:scale-105 hover:shadow-cta-red/20 transition-all flex items-center justify-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10">CHECK ELIGIBILITY</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </a>
                        <Link
                            href="/apply"
                            className="group w-full sm:w-auto px-8 py-5 border-2 border-white/30 rounded-lg font-bold text-lg backdrop-blur-sm hover:bg-white hover:text-navy hover:border-white transition-all flex items-center justify-center gap-2"
                        >
                            APPLY NOW
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
                <span className="text-[10px] uppercase tracking-widest text-white">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gold via-transparent to-transparent" />
            </div>
        </section>
    );
}
