"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Ship, Calendar, Gift, CheckCircle, Clock, Video, User as UserIcon, LogOut, ChevronRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

type Application = {
    id: string;
    fullName: string;
    status: "pending" | "approved" | "attended" | "completed";
    vouchers: string[];
    meetingLink?: string;
    meetingTime?: string;
    submittedAt: Timestamp;
    callTransferred?: boolean;
    digitalTourAccepted?: boolean;
    voucherTransferred?: boolean;
};

import { ADMIN_EMAILS } from "@/lib/constants";

export default function UserDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login?redirect=/dashboard");
            } else if (currentUser.email && ADMIN_EMAILS.some(email => email.toLowerCase() === currentUser.email?.toLowerCase())) {
                router.push("/admin");
            } else {
                setUser(currentUser);
            }
        });
        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        // Query for application linked to this user's UID or Email
        const q = query(
            collection(db, "cruise_leads"),
            where("email", "==", user.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setApplication({ id: doc.id, ...doc.data() } as Application);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotateY: [0, 180, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Image
                        src="/pics/luxury_icon.png"
                        width={80}
                        height={80}
                        className="object-contain"
                        alt="Loading..."
                        priority
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-navy text-white p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-12">
                    <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image src="/pics/luxury_icon.png" width={40} height={40} className="object-contain" alt="Logo" />
                    </motion.div>
                    <span className="font-heading font-bold text-xl tracking-wider uppercase">Luxury Cruises</span>
                </div>

                <nav className="flex-1 space-y-4">
                    <button className="w-full flex items-center gap-4 px-6 py-4 bg-white/10 rounded-2xl text-sm font-bold border border-white/5">
                        <UserIcon className="w-5 h-5 text-gold" /> My Application
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-all text-sm font-bold opacity-50 cursor-not-allowed">
                        <Award className="w-5 h-5" /> Rewards
                    </button>
                </nav>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-gold/30 p-1 mx-auto mb-4 bg-navy overflow-hidden">
                        <img
                            src="https://api.dicebear.com/7.x/shapes/svg?seed=luxury&backgroundColor=1a237e&shapeColor=c5a059"
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <p className="font-bold text-sm">{user?.displayName}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{user?.email}</p>
                    <button
                        onClick={() => auth.signOut()}
                        className="mt-8 flex items-center gap-2 mx-auto text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
                            Welcome Aboard, <span className="text-gold italic font-medium">{user?.displayName?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-navy/50 font-body">Manage your luxury cruise application and attendance status from your dashboard.</p>
                    </header>

                    {!application ? (
                        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-navy/5 text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-8">
                                <Clock className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-navy mb-4">No Application Found</h2>
                            <p className="text-navy/60 font-body mb-10 max-w-sm mx-auto">
                                You haven't submitted your luxury cruise application yet. Complete the eligibility check to get started.
                            </p>
                            <button
                                onClick={() => router.push("/#check-eligibility")}
                                className="px-10 py-5 bg-navy text-white rounded-2xl font-bold tracking-widest shadow-xl hover:scale-105 transition-all"
                            >
                                CHECK ELIGIBILITY
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Status Card */}
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-navy/5 col-span-1 md:col-span-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <h3 className="text-xs font-bold text-navy/40 uppercase tracking-[0.2em] mb-4">Current Progress</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-heading font-bold text-navy">Application Submitted</p>
                                                <p className="text-sm text-navy/50">Your profile is currently being reviewed by our team.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                            <span className="text-[10px] font-bold text-navy/30 uppercase">Status</span>
                                            <span className="text-sm font-bold text-navy uppercase">{application.digitalTourAccepted ? 'Attended' : 'In Review'}</span>
                                        </div>
                                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                            <span className="text-[10px] font-bold text-navy/30 uppercase">Incentive</span>
                                            <span className={cn("text-sm font-bold uppercase underline decoration-gold/30 underline-offset-4", application.voucherTransferred ? "text-green-600" : "text-gold")}>
                                                {application.voucherTransferred ? 'Released' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Steps Timeline */}
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-navy/5">
                                <h3 className="text-xl font-heading font-bold text-navy mb-8">Journey Roadmap</h3>
                                <div className="space-y-8">
                                    {[
                                        { icon: <CheckCircle className="w-5 h-5" />, label: "Form Submission", completed: true, date: application.submittedAt.toDate().toLocaleDateString() },
                                        { icon: <Clock className="w-5 h-5" />, label: "Specialist Call", completed: !!application.callTransferred, date: application.callTransferred ? "Completed" : "Awaiting Call" },
                                        { icon: <Video className="w-5 h-5" />, label: "Virtual Tour", completed: !!application.digitalTourAccepted, date: application.digitalTourAccepted ? "Attended" : "TBD" },
                                        { icon: <Gift className="w-5 h-5" />, label: "Incentive Delivery", completed: !!application.voucherTransferred, date: application.voucherTransferred ? "Delivered" : "Post-Tour" },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-6 group">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", step.completed ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-300")}>
                                                {step.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn("text-sm font-bold", step.completed ? "text-navy" : "text-navy/30")}>{step.label}</p>
                                                <p className="text-[10px] text-navy/40 font-medium uppercase tracking-tighter">{step.date}</p>
                                            </div>
                                            {step.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions / Info */}
                            <div className="space-y-8">
                                <div className="bg-gold rounded-[2.5rem] p-10 shadow-xl text-navy relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <Gift className="w-12 h-12 mb-6" />
                                        <h4 className="text-2xl font-heading font-bold mb-2">Claim Status</h4>
                                        <p className="text-sm font-medium text-navy/70 leading-relaxed">
                                            Your complimentary cruise voucher will be unlocked immediately after the 90-minute virtual attendance.
                                        </p>
                                    </div>
                                    <Ship className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-navy/5">
                                    <h3 className="text-xl font-heading font-bold text-navy mb-4">Need Help?</h3>
                                    <p className="text-sm text-navy/50 mb-6 font-medium">Have questions about your presentation invite or incentive eligibility?</p>
                                    <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-navy hover:bg-navy hover:text-white transition-all">
                                        CONTACT SUPPORT
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
