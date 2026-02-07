"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, MonitorPlay, Gift } from "lucide-react";

export default function Process() {
    const steps = [
        {
            icon: <ClipboardCheck className="w-10 h-10 text-gold" />,
            title: "Apply & Confirm Eligibility",
            description: "Quickly fill out our eligibility form to see if you qualify for this exclusive invitation.",
        },
        {
            icon: <MonitorPlay className="w-10 h-10 text-gold" />,
            title: "Attend Live Online Cruise Tour",
            description: "Join a 90-minute professionally guided virtual walkthrough of our newest luxury cruise itineraries.",
        },
        {
            icon: <Gift className="w-10 h-10 text-gold" />,
            title: "Receive Cruise Incentive",
            description: "As a thank-you for your time, you'll receive a complimentary cruise travel voucher after the session.",
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-navy relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                        A Journey in <span className="text-gold italic">Three Simple Steps</span>
                    </h2>
                    <div className="w-24 h-1 bg-gold/30 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 30 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/30 transition-all duration-500"
                        >
                            <div className="mb-6 inline-flex p-4 rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-white/60 font-body leading-relaxed">{step.description}</p>

                            <div className="mt-8 flex items-center gap-4">
                                <span className="text-4xl font-heading font-black text-white/5 group-hover:text-gold/20 transition-colors">
                                    0{idx + 1}
                                </span>
                                <div className="flex-1 h-[1px] bg-white/10" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
