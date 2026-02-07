"use client";

import { useEffect, useState } from "react";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Ship, Users, CheckCircle, XCircle, Clock, Search, LogOut, ChevronRight, Lock, PhoneCall, Gift, MonitorPlay, FileDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/lib/constants";
import Image from "next/image";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

type Lead = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    ageRange: string;
    incomeRange: string;
    country: string;
    city?: string;
    maritalStatus: string;
    qualificationStatus: "qualified" | "unqualified";
    submittedAt: Timestamp;
    callTransferred?: boolean;
    voucherTransferred?: boolean;
    digitalTourAccepted?: boolean;
};

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser && currentUser.email && ADMIN_EMAILS.some(email => email.toLowerCase() === currentUser.email?.toLowerCase())) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
            setAuthChecking(false);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!isAuthorized || !user) return;

        const q = query(collection(db, "cruise_leads"), orderBy("submittedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lead[];
            setLeads(leadsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Listener Error:", error);
            if (error.message.includes("permissions")) {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [isAuthorized, user]);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Failed to sign in with Google.");
        }
    };

    const updateLeadStatus = async (leadId: string, updates: Partial<Lead>) => {
        try {
            const leadRef = doc(db, "cruise_leads", leadId);
            await updateDoc(leadRef, updates);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update status.");
        }
    };

    const deleteLead = async (leadId: string) => {
        if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;

        try {
            const leadRef = doc(db, "cruise_leads", leadId);
            await deleteDoc(leadRef);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete lead.");
        }
    };

    const generatePDF = (lead: Lead) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 25;
        const contentWidth = pageWidth - 2 * margin;
        let yPos = 25;

        // ============ HEADER SECTION ============
        // Top border
        doc.setLineWidth(2);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yPos, pageWidth - margin, yPos);

        yPos += 10;

        // Company name - Large and centered
        doc.setFontSize(32);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('LUXURY CRUISES', pageWidth / 2, yPos, { align: 'center' });

        yPos += 8;

        // Document title
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text('LEAD REGISTRATION REPORT', pageWidth / 2, yPos, { align: 'center' });

        yPos += 6;

        // Bottom header border
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yPos, pageWidth - margin, yPos);

        yPos += 10;

        // Document metadata box
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, contentWidth, 12, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPos, contentWidth, 12, 'S');

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`LEAD ID: ${lead.id.slice(0, 8).toUpperCase()}`, margin + 3, yPos + 5);

        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, pageWidth - margin - 3, yPos + 5, { align: 'right' });

        doc.text(`Submitted: ${lead.submittedAt.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, pageWidth - margin - 3, yPos + 9, { align: 'right' });

        yPos += 20;

        // ============ SECTION 1: PERSONAL INFORMATION ============
        doc.setFillColor(0, 0, 0);
        doc.rect(margin, yPos, contentWidth, 8, 'F');

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('PERSONAL INFORMATION', margin + 3, yPos + 5.5);

        yPos += 10;

        // Personal info box
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, contentWidth, 50, 'S');

        yPos += 5;

        const addLabelValuePair = (label: string, value: string, yPosition: number) => {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'bold');
            doc.text(label.toUpperCase(), margin + 3, yPosition);

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            const wrappedText = doc.splitTextToSize(value, contentWidth - 6);
            doc.text(wrappedText, margin + 3, yPosition + 4);
        };

        addLabelValuePair('Full Name', lead.fullName, yPos);
        yPos += 12;

        // Horizontal divider
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);

        addLabelValuePair('Email Address', lead.email, yPos);
        yPos += 12;

        doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);

        addLabelValuePair('Phone Number', lead.phone, yPos);
        yPos += 12;

        doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);

        addLabelValuePair('Location', `${lead.city || 'N/A'}, ${lead.country}`, yPos);

        yPos += 18;

        // ============ SECTION 2: QUALIFICATION DETAILS ============
        doc.setFillColor(0, 0, 0);
        doc.rect(margin, yPos, contentWidth, 8, 'F');

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('QUALIFICATION DETAILS', margin + 3, yPos + 5.5);

        yPos += 10;

        // Qualification box
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, contentWidth, 42, 'S');

        yPos += 5;

        addLabelValuePair('Annual Income Range', lead.incomeRange, yPos);
        yPos += 12;

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);

        addLabelValuePair('Age Range', lead.ageRange, yPos);
        yPos += 12;

        doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);

        addLabelValuePair('Marital Status', lead.maritalStatus, yPos);

        yPos += 18;

        // Qualification status badge
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'bold');
        doc.text('QUALIFICATION STATUS:', margin, yPos);

        const statusText = lead.qualificationStatus.toUpperCase();
        const statusX = margin + 50;

        if (lead.qualificationStatus === 'qualified') {
            doc.setFillColor(0, 0, 0);
            doc.rect(statusX - 2, yPos - 5, 35, 7, 'F');
            doc.setTextColor(255, 255, 255);
        } else {
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(1);
            doc.rect(statusX - 2, yPos - 5, 35, 7, 'S');
            doc.setTextColor(0, 0, 0);
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(statusText, statusX, yPos);

        yPos += 15;

        // ============ SECTION 3: JOURNEY MILESTONES ============
        doc.setFillColor(0, 0, 0);
        doc.rect(margin, yPos, contentWidth, 8, 'F');

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('JOURNEY MILESTONES', margin + 3, yPos + 5.5);

        yPos += 10;

        // Journey status table
        const tableHeight = 40;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, contentWidth, tableHeight, 'S');

        // Table header
        const col1X = margin + 3;
        const col2X = margin + contentWidth * 0.6;
        const col3X = margin + contentWidth * 0.8;

        yPos += 6;

        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('MILESTONE', col1X, yPos);
        doc.text('STATUS', col2X, yPos);
        doc.text('COMPLETION', col3X, yPos);

        yPos += 3;

        // Header underline
        doc.setLineWidth(0.8);
        doc.line(margin, yPos, pageWidth - margin, yPos);

        yPos += 6;

        const milestones = [
            { name: 'Specialist Call Transfer', status: !!lead.callTransferred },
            { name: 'Virtual Tour Attendance', status: !!lead.digitalTourAccepted },
            { name: 'Incentive Voucher Release', status: !!lead.voucherTransferred }
        ];

        milestones.forEach((milestone, index) => {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(milestone.name, col1X, yPos);

            // Status symbol
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(milestone.status ? '✓' : '✗', col2X + 3, yPos);

            // Completion text
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(milestone.status ? 'Completed' : 'Pending', col3X, yPos);

            yPos += 8;

            // Row separator (except for last row)
            if (index < milestones.length - 1) {
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.2);
                doc.line(margin + 3, yPos - 2, pageWidth - margin - 3, yPos - 2);
            }
        });

        // ============ FOOTER SECTION ============
        yPos = pageHeight - 20;

        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yPos, pageWidth - margin, yPos);

        yPos += 5;

        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text('Luxury Cruises CRM Dashboard', margin, yPos);

        doc.setFont('helvetica', 'bold');
        doc.text('CONFIDENTIAL DOCUMENT', pageWidth / 2, yPos, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.text('Page 1 of 1', pageWidth - margin, yPos, { align: 'right' });

        yPos += 4;

        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text('This document contains confidential information. Unauthorized distribution is prohibited.', pageWidth / 2, yPos, { align: 'center' });

        return doc;
    };

    const downloadPDF = (lead: Lead) => {
        const doc = generatePDF(lead);
        doc.save(`Lead_${lead.fullName.replace(/\s+/g, '_')}_${lead.id.slice(0, 8)}.pdf`);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    const stats = {
        total: leads.length,
        qualified: leads.filter(l => l.qualificationStatus === "qualified").length,
        unqualified: leads.filter(l => l.qualificationStatus === "unqualified").length,
    };

    if (authChecking) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotateY: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Image src="/pics/luxury_icon.png" width={70} height={70} className="object-contain" alt="Loading..." priority />
                </motion.div>
            </div>
        );
    }

    if (!user || !isAuthorized) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotateX: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 mx-auto mb-4"
                        >
                            <Image src="/pics/luxury_icon.png" width={64} height={64} className="object-contain" alt="Logo" />
                        </motion.div>
                        <h1 className="text-2xl font-heading font-bold text-navy">Admin Access</h1>
                        <p className="text-navy/50 text-sm mt-2">
                            {user && !isAuthorized
                                ? "Access Denied: This account is not an authorized administrator."
                                : "Sign in with Google to access the dashboard."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {user && !isAuthorized ? (
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-slate-100 text-navy rounded-xl font-bold tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                SIGN OUT
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="w-full py-4 bg-white border-2 border-slate-100 text-navy rounded-xl font-bold tracking-widest hover:border-gold transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                SIGN IN WITH GOOGLE
                            </button>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] text-center text-slate-400 uppercase tracking-tighter">
                                Authorized Personnel Only
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-navy text-white hidden lg:flex flex-col p-6 fixed inset-y-0 shadow-2xl z-20">
                <div className="flex items-center gap-3 mb-12">
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image src="/pics/luxury_icon.png" width={32} height={32} className="object-contain" alt="Logo" />
                    </motion.div>
                    <span className="font-heading font-bold text-lg tracking-wider">LUXURY CRUISES <span className="text-gold">CRM</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm font-semibold border border-white/10 text-left">
                        <Users className="w-4 h-4 text-gold" /> All Leads
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="relative w-8 h-8 rounded-full border border-gold/30 overflow-hidden bg-navy flex items-center justify-center">
                            <img
                                src="https://api.dicebear.com/7.x/shapes/svg?seed=luxury&backgroundColor=1a237e&shapeColor=c5a059"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate">{user.displayName}</span>
                            <span className="text-[10px] text-white/40 truncate">{user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors text-sm font-semibold"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 md:p-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-navy">Lead Management</h1>
                            <p className="text-navy/50 text-sm mt-1">Monitor and manage your cruise registrations in real-time.</p>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="pl-11 pr-6 py-3 bg-white rounded-full border border-slate-200 outline-none focus:border-gold transition-all w-full md:w-80 shadow-sm text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: "Total Submissions", value: stats.total, icon: <Users className="text-navy" />, color: "bg-blue-50" },
                            { label: "Qualified Leads", value: stats.qualified, icon: <CheckCircle className="text-green-600" />, color: "bg-green-50" },
                            { label: "Unqualified", value: stats.unqualified, icon: <XCircle className="text-red-600" />, color: "bg-red-50" },
                        ].map((stat, i) => (
                            <div key={i} className={cn("p-6 rounded-3xl shadow-sm border border-navy/5 flex items-center gap-6 bg-white transition-all hover:shadow-md")}>
                                <div className={cn("p-4 rounded-2xl", stat.color)}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-heading font-bold text-navy">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Area */}
                    <div className="bg-white rounded-3xl shadow-xl border border-navy/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-5 text-xs font-bold text-navy uppercase tracking-widest">Lead Name</th>
                                        <th className="px-6 py-5 text-xs font-bold text-navy uppercase tracking-widest">Contact</th>
                                        <th className="px-6 py-5 text-xs font-bold text-navy uppercase tracking-widest">Status / Journey</th>
                                        <th className="px-6 py-5 text-xs font-bold text-navy uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="animate-pulse flex flex-col items-center gap-3">
                                                    <Image src="/pics/luxury_icon.png" width={48} height={48} className="object-contain opacity-30" alt="Loading" />
                                                    <p className="text-slate-300 font-bold italic">Scanning horizons...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-slate-400">
                                                No leads matched your search criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-navy group-hover:text-gold transition-colors">{lead.fullName}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight flex items-center gap-1 mt-1">
                                                            <Clock className="w-2.5 h-2.5" />
                                                            {lead.submittedAt?.toDate().toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium text-navy/80">{lead.email}</span>
                                                        <span className="text-xs text-slate-400">{lead.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        {/* Specialist Call */}
                                                        <button
                                                            onClick={() => updateLeadStatus(lead.id, { callTransferred: !lead.callTransferred })}
                                                            className={cn(
                                                                "p-2 rounded-lg transition-all border",
                                                                lead.callTransferred ? "bg-green-50 border-green-200 text-green-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-300 hover:border-gold/30 hover:text-gold"
                                                            )}
                                                            title="Call Formally Transferred"
                                                        >
                                                            <PhoneCall className="w-4 h-4" />
                                                        </button>
                                                        {/* Digital Tour */}
                                                        <button
                                                            onClick={() => updateLeadStatus(lead.id, { digitalTourAccepted: !lead.digitalTourAccepted })}
                                                            className={cn(
                                                                "p-2 rounded-lg transition-all border",
                                                                lead.digitalTourAccepted ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-300 hover:border-gold/30 hover:text-gold"
                                                            )}
                                                            title="Digital Tour Accepted"
                                                        >
                                                            <MonitorPlay className="w-4 h-4" />
                                                        </button>
                                                        {/* Voucher */}
                                                        <button
                                                            onClick={() => updateLeadStatus(lead.id, { voucherTransferred: !lead.voucherTransferred })}
                                                            className={cn(
                                                                "p-2 rounded-lg transition-all border",
                                                                lead.voucherTransferred ? "bg-gold/10 border-gold/20 text-gold shadow-sm" : "bg-slate-50 border-slate-100 text-slate-300 hover:border-gold/30 hover:text-gold"
                                                            )}
                                                            title="Voucher Formally Transferred"
                                                        >
                                                            <Gift className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => downloadPDF(lead)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy/80 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <FileDown className="w-3.5 h-3.5" /> PDF
                                                        </button>
                                                        <button
                                                            onClick={() => deleteLead(lead.id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                            title="Delete Lead"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
