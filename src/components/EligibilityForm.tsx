"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Ship, Loader2, Globe, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckData = {
    ageRange: string;
    maritalStatus: string;
    incomeRange: string;
};

export default function EligibilityCheck() {
    const [result, setResult] = useState<"qualified" | "unqualified" | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
    } = useForm<CheckData>();

    const onCheck = (data: CheckData) => {
        setIsChecking(true);
        setRejectionReasons([]);

        setTimeout(() => {
            const reasons: string[] = [];

            // Age Check: Must be 45+
            const isAgeQualified = ["45-54", "55-64", "65+"].includes(data.ageRange);
            if (!isAgeQualified) reasons.push("Participation requires a minimum age of 45 years.");

            // Income Check: Must be 60k+
            const isIncomeQualified = ["$60k–$80k", "$80k–$100k", "$100k+"].includes(data.incomeRange);
            if (!isIncomeQualified) reasons.push("Annual household income must meet the $60,000+ requirement.");

            // Status Check: Married or Couple
            const isStatusQualified = data.maritalStatus === "Married" || data.maritalStatus === "Couple";
            if (!isStatusQualified) reasons.push("This incentive is specifically designed for married couples or partners traveling together.");

            if (reasons.length === 0) {
                setResult("qualified");
            } else {
                setRejectionReasons(reasons);
                setResult("unqualified");
            }
            setIsChecking(false);
        }, 1200);
    };

    return (
        <section id="check-eligibility" className="py-24 bg-slate-50 relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy mb-4">
                        Instant <span className="text-gold italic">Eligibility Check</span>
                    </h2>
                    <p className="text-navy/60 font-body">Find out if you qualify for the complimentary cruise incentive in 30 seconds.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-navy/5">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onCheck)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Age Range</label>
                                    <select {...register("ageRange", { required: true })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white font-semibold">
                                        <option value="">Select Age</option>
                                        <option value="35-44">Under 45</option>
                                        <option value="45-54">45–54</option>
                                        <option value="55-64">55–64</option>
                                        <option value="65+">65+</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Marital Status</label>
                                    <select {...register("maritalStatus", { required: true })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white font-semibold">
                                        <option value="">Select Status</option>
                                        <option value="Married">Married</option>
                                        <option value="Couple">Living Together (Couple)</option>
                                        <option value="Single">Single</option>
                                    </select>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-bold text-navy uppercase tracking-widest">Household Income</label>
                                    <select {...register("incomeRange", { required: true })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white font-semibold">
                                        <option value="">Select Income</option>
                                        <option value="<$60k">Under $60,000</option>
                                        <option value="$60k–$80k">$60,000–$80,000</option>
                                        <option value="$80k–$100k">$80,000–$100,000</option>
                                        <option value="$100k+">$100,000+</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isChecking}
                                        className="w-full py-5 bg-navy text-white rounded-xl font-bold tracking-widest hover:bg-navy/90 transition-all flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        {isChecking ? <Loader2 className="w-6 h-6 animate-spin" /> : "VERIFY ELIGIBILITY"}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                {result === "qualified" ? (
                                    <div className="space-y-6">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold text-navy">You Qualify!</h3>
                                        <p className="text-navy/60 font-body max-w-sm mx-auto">
                                            Congratulations! You meet our criteria for a complimentary cruise incentive. Complete your application now to reserve your slot.
                                        </p>
                                        <a
                                            href="/apply"
                                            className="inline-block px-12 py-5 bg-gradient-to-r from-cta-red to-[#d32f2f] text-white rounded-xl font-bold tracking-widest shadow-xl hover:scale-105 transition-all"
                                        >
                                            CONTINUE TO APPLICATION
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full mx-auto flex items-center justify-center">
                                            <AlertCircle className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold text-navy">Not Eligible Yet</h3>
                                        <p className="text-navy/60 font-body max-w-sm mx-auto">
                                            Thank you for your interest. Unfortunately, you do not meet the current participation requirements for this promotion.
                                        </p>
                                        <button
                                            onClick={() => setResult(null)}
                                            className="text-gold font-bold underline"
                                        >
                                            Check again with different details
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
