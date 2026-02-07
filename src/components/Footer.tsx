"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-navy pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group cursor-pointer w-fit">
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/pics/luxury_icon.png"
                                    alt="Luxury Cruises Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </motion.div>
                            <span className="text-xl font-heading font-bold tracking-wider text-white">
                                LUXURY <span className="text-gold">CRUISES</span>
                            </span>
                        </Link>
                        <p className="text-white/50 font-body text-sm max-w-sm leading-relaxed">
                            We are a premium experience company dedicated to introducing the world's most breathtaking cruise destinations through immersive virtual storytelling.
                        </p>
                    </div>


                    <div>
                        <h4 className="text-white font-heading font-bold mb-6 italic">Compliance</h4>
                        <ul className="space-y-4 text-xs text-white/40 leading-relaxed font-body">
                            <li>Terms & Conditions Apply</li>
                            <li>Privacy Policy</li>
                            <li>No purchase necessary to attend virtual presentation.</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        © 2026 Luxury Cruises. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        <Link href="/admin" className="cursor-pointer hover:text-gold transition-colors">Admin Portal</Link>
                        <span className="cursor-pointer hover:text-gold transition-colors">Eligibility Disclaimer</span>
                        <span className="cursor-pointer hover:text-gold transition-colors">Incentive Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
