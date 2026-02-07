"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Ship, CheckCircle2, Loader2, User, Phone, Mail } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type ApplicationData = {
    fullName: string;
    email: string;
    phone: string;
    ageRange: string;
    incomeRange: string;
    country: string;
    city: string;
    maritalStatus: string;
};

export default function ApplyPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login?redirect=/apply");
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationData>();

    const onSubmit = async (data: ApplicationData) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "cruise_leads"), {
                ...data,
                uid: user?.uid,
                qualificationStatus: "qualified", // Since they applied after check
                submittedAt: serverTimestamp(),
            });
            setIsDone(true);
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <Ship className="w-12 h-12 text-gold animate-bounce" />
            </div>
        );
    }

    if (isDone) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl p-12 shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-8">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-navy mb-4">Application Received</h1>
                    <p className="text-navy/60 font-body mb-8">
                        Thank you for applying! Our enrollment specialist will contact you by phone within 2 hours to finalize your registration for the virtual tour.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-4 bg-navy text-white rounded-xl font-bold"
                    >
                        RETURN HOME
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4 italic">Complete Your Application</h1>
                    <p className="text-navy/60">Welcome, {user?.displayName}. Please provide your contact details to reserve your incentive.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-navy/5">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    {...register("fullName", { required: true })}
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email Address
                                </label>
                                <input
                                    {...register("email", { required: true })}
                                    defaultValue={user?.email || ""}
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Phone Number / WhatsApp
                                </label>
                                <input
                                    {...register("phone", { required: true })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest">Household Income</label>
                                <select {...register("incomeRange", { required: true })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white">
                                    <option value="">Select Income</option>
                                    <option value="$60k–$80k">$60k–$80k</option>
                                    <option value="$80k–$100k">$80k–$100k</option>
                                    <option value="$100k+">$100k+</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest">Age Range</label>
                                <select {...register("ageRange", { required: true })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white">
                                    <option value="">Select Age</option>
                                    <option value="45-54">45–54</option>
                                    <option value="55-64">55–64</option>
                                    <option value="65+">65+</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest">Marital Status</label>
                                <select {...register("maritalStatus", { required: true })} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none bg-white">
                                    <option value="">Select Status</option>
                                    <option value="Married">Married</option>
                                    <option value="Couple">Living Together</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest">Country</label>
                                <input
                                    type="text"
                                    {...register("country", { required: true })}
                                    placeholder="e.g. United States"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-navy uppercase tracking-widest">City</label>
                                <input
                                    type="text"
                                    {...register("city", { required: true })}
                                    placeholder="e.g. New York"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-gold outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-navy text-white rounded-2xl font-bold tracking-[0.2em] shadow-2xl hover:bg-navy/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "SUBMIT & RESERVE CRUISE"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
