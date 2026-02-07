"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function VisualProof() {
    const images = [
        {
            src: "/pics/luxury_cabin_interior_1770286690243.png",
            alt: "Luxury Cabin",
            title: "State-of-the-Art Suites",
        },
        {
            src: "/pics/pool_deck_lounge_1770286714698.png",
            alt: "Pool Deck",
            title: "Pristine Pool Decks",
        },
        {
            src: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800",
            alt: "Fine Dining",
            title: "World-Class Dining",
        },
        {
            src: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&q=80&w=800",
            alt: "Lounge View",
            title: "Panoramic Lounges",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy mb-4">
                        A Glimpse of the <span className="text-gold italic">Extraordinary</span>
                    </h2>
                    <p className="text-navy/60 font-body max-w-2xl mx-auto">
                        Explore world-class cruise destinations and premium onboard experiences — all from the comfort of your home.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                    {/* Main Large Image */}
                    <motion.div
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -30 }}
                        viewport={{ once: true }}
                        className="relative group overflow-hidden rounded-2xl shadow-2xl h-full lg:h-auto"
                    >
                        <Image
                            src="/pics/luxury_cruise_ship_hero_1770286669203.png"
                            alt="Luxury Cruise Ship"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-8 left-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-gold font-bold uppercase tracking-widest text-xs mb-2">Signature Experience</p>
                            <h3 className="text-2xl font-heading font-bold">Unmatched Ocean Horizons</h3>
                        </div>
                    </motion.div>

                    {/* Grid of smaller images */}
                    <div className="grid grid-cols-2 gap-6">
                        {images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                whileInView={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group overflow-hidden rounded-xl shadow-lg aspect-square"
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                    <span className="text-white font-heading font-semibold text-center leading-tight">
                                        {img.title}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
