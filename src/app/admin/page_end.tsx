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
