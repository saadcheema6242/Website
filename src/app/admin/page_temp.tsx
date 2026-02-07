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

