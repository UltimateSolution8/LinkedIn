// @ts-nocheck
import React, { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    Cell
} from 'recharts';
import {
    Users, MessageSquare, Target, TrendingUp, ArrowUpRight,
    Search, Calendar, Zap, CheckCircle2, Share2, Filter, MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Input } from "../ui/input";

const leadData = [
    { name: 'Mon', leads: 45, sentiment: 75, volume: 120 },
    { name: 'Tue', leads: 52, sentiment: 82, volume: 140 },
    { name: 'Wed', leads: 38, sentiment: 68, volume: 110 },
    { name: 'Thu', leads: 65, sentiment: 91, volume: 180 },
    { name: 'Fri', leads: 48, sentiment: 78, volume: 135 },
    { name: 'Sat', leads: 32, sentiment: 85, volume: 90 },
    { name: 'Sun', leads: 28, sentiment: 88, volume: 85 },
];

const subreddits = [
    { name: 'r/SaaS', count: 142, conversion: 12.5 },
    { name: 'r/startups', count: 98, conversion: 10.2 },
    { name: 'r/marketing', count: 76, conversion: 8.4 },
    { name: 'r/entrepreneur', count: 115, conversion: 9.1 },
    { name: 'r/SideProject', count: 64, conversion: 14.8 },
];

const EMERALD_COLORS = ['#1e868d', '#28b1bb', '#3db5bd', '#66ccd4', '#a3e0e5'];

const leadsDataRaw = [
    { id: 1, user: "u/SaaS_Founder", sub: "r/startups", score: 94, status: "High Priority", time: "2m ago", sentiment: "Positive", volume: "Medium" },
    { id: 2, user: "u/MarketingPro", sub: "r/SaaS", score: 82, status: "Nurturing", time: "15m ago", sentiment: "Neutral", volume: "High" },
    { id: 3, user: "u/DevExtra", sub: "r/webdev", score: 91, status: "High Priority", time: "1h ago", sentiment: "Positive", volume: "Low" },
    { id: 4, user: "u/GrowthHacker", sub: "r/entrepreneur", score: 75, status: "New", time: "3h ago", sentiment: "Positive", volume: "Medium" },
    { id: 5, user: "u/StartupJoe", sub: "r/SideProject", score: 68, status: "New", time: "5h ago", sentiment: "Neutral", volume: "Low" },
    { id: 6, user: "u/SoloFounder", sub: "r/SaaS", score: 88, status: "Contacted", time: "8h ago", sentiment: "Positive", volume: "High" },
    { id: 7, user: "u/VentureCap", sub: "r/investing", score: 96, status: "High Priority", time: "12h ago", sentiment: "Positive", volume: "Medium" },
    { id: 8, user: "u/ProductGuy", sub: "r/ProductHunt", score: 72, status: "Nurturing", time: "1d ago", sentiment: "Neutral", volume: "Medium" },
];

const AnalyticsDashboard = ({ onBack }) => {
    const [timeRange, setTimeRange] = useState('7d');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

    const sortedLeads = React.useMemo(() => {
        let filtered = [...leadsDataRaw];
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(lead =>
                lead.user.toLowerCase().includes(query) ||
                lead.sub.toLowerCase().includes(query) ||
                lead.status.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [searchQuery, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-foreground p-4 md:p-8 font-sans transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto hover:bg-transparent text-emerald-600 dark:text-emerald-400 font-medium">
                                ← Back to Overview
                            </Button>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Reddit Lead Engine
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0 text-[10px] uppercase">Enterprise</Badge>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Autonomous lead extraction & engagement dashboard</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${timeRange === range
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <Button className="gap-2 bg-primary-gradient text-white border-none shadow-lg shadow-emerald-500/20">
                            <Zap className="w-4 h-4" />
                            Launch Agent
                        </Button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Target, label: "Qualified Leads", value: "1,284", trend: "+12.5%", color: "emerald" },
                        { icon: MessageSquare, label: "AI Replies", value: "4,852", trend: "+8.2%", color: "teal" },
                        { icon: TrendingUp, label: "Conv. Rate", value: "14.2%", trend: "+5.4%", color: "emerald" },
                        { icon: Share2, label: "Subreddits", value: "84", trend: "Active", color: "slate" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden trace-beam">
                                <CardContent className="pt-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-600'
                                            }`}>
                                            {stat.trend}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{stat.value}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                    </div>
                                </CardContent>
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Charts */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="border-none shadow-sm trace-beam">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl">Growth Velocity</CardTitle>
                                    <CardDescription>Daily lead acquisition & sentiment score</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        Leads
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                        Volume
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={leadData}>
                                            <defs>
                                                <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1e868d" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#1e868d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', background: 'var(--card)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="leads"
                                                stroke="#1e868d"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorEmerald)"
                                                animationDuration={2000}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#94A3B8"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                fill="none"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-sm trace-beam">
                                <CardHeader>
                                    <CardTitle className="text-lg">Top Subreddits</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subreddits} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 600 }}
                                                    width={90}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--card)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    radius={[0, 10, 10, 0]}
                                                    barSize={12}
                                                >
                                                    {subreddits.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={EMERALD_COLORS[index % EMERALD_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm trace-beam">
                                <CardHeader>
                                    <CardTitle className="text-lg">Lead Quality</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center pt-0">
                                    <div className="relative w-44 h-44">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                            <span className="text-3xl font-bold">88%</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Tier A Leads</span>
                                        </div>
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="88" cy="88" r="80" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                                            <circle cx="88" cy="88" r="80" fill="none" stroke="url(#emeraldGradient)" strokeWidth="12" strokeDasharray="502" strokeDashoffset="60" strokeLinecap="round" />
                                            <defs>
                                                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#1e868d" />
                                                    <stop offset="100%" stopColor="#28b1bb" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Hot Leads</CardTitle>
                                    <Badge className="bg-emerald-500 text-white border-none">Live</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10">
                                {[
                                    { user: "u/SaaS_Founder", sub: "r/startups", time: "2m ago", text: "Looking for a specialized lead gen tool..." },
                                    { user: "u/MarketingPro", sub: "r/SaaS", time: "15m ago", text: "How to automate Reddit engagement safely?" },
                                    { user: "u/DevExtra", sub: "r/webdev", time: "1h ago", text: "Need more users for my side project..." }
                                ].map((lead, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-emerald-400">{lead.user}</span>
                                            <span className="text-[10px] text-slate-500">{lead.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed italic">"{lead.text}"</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.sub}</span>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#1e868d]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 text-xs h-9">
                                    Explore All Mentions
                                </Button>
                            </CardContent>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        </Card>

                        <Card className="border-none shadow-sm trace-beam">
                            <CardHeader>
                                <CardTitle className="text-lg">Agent Control</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#1e868d]" />
                                        <span className="text-sm font-bold">Rixly Alpha-9 Active</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg text-center shadow-sm">
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Uptime</div>
                                            <div className="text-sm font-bold">99.9%</div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg text-center shadow-sm">
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Lat.</div>
                                            <div className="text-sm font-bold">42ms</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400">Auto-Reply Engagement</span>
                                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-600">On</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400">Subreddit Monitoring</span>
                                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-600">On</Badge>
                                    </div>
                                </div>
                                <Button className="w-full bg-slate-900 border-none hover:bg-slate-800 text-white font-bold h-11 tracking-wide">
                                    Configure Strategy
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Leads Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-none shadow-sm overflow-hidden trace-beam">
                        <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50 py-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold">Leads Management</CardTitle>
                                    <CardDescription>Advanced sorting and real-time monitoring of extracted leads</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Search leads..."
                                            className="pl-10 h-10 bg-white dark:bg-slate-800 border-border/50 focus:ring-emerald-500/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <TableRow className="border-border/50">
                                            <TableHead className="font-bold cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('user')}>User Identity</TableHead>
                                            <TableHead className="font-bold cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('sub')}>Source Subreddit</TableHead>
                                            <TableHead className="font-bold cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => handleSort('score')}>Intent Score</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                            <TableHead className="font-bold">Last Activity</TableHead>
                                            <TableHead className="font-bold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence>
                                            {sortedLeads.map((lead, index) => (
                                                <motion.tr
                                                    key={lead.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group border-border/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                                                                {lead.user.charAt(2)}
                                                            </div>
                                                            <span className="text-slate-900 dark:text-slate-200">{lead.user}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-none font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5">
                                                            {lead.sub}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${lead.score}%` }}
                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                    className={`h-full rounded-full ${lead.score > 90 ? 'bg-emerald-500 shadow-[0_0_8px_#1e868d]' :
                                                                        lead.score > 80 ? 'bg-emerald-400' :
                                                                            'bg-slate-400'
                                                                        }`}
                                                                />
                                                            </div>
                                                            <span className="font-bold text-xs">{lead.score}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`border-none ${lead.status === "High Priority" ? "bg-emerald-500/10 text-emerald-600" :
                                                            lead.status === "Nurturing" ? "bg-amber-500/10 text-amber-600" :
                                                                "bg-slate-500/10 text-slate-600"
                                                            }`}>
                                                            {lead.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {lead.time}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-600">
                                                            <Zap className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                        {sortedLeads.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-slate-500 dark:text-slate-400">
                                                    No leads found matching "{searchQuery}"
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                <div>Showing {sortedLeads.length} leads</div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled className="h-7 text-[10px]">Previous</Button>
                                    <Button variant="outline" size="sm" disabled className="h-7 text-[10px]">Next</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

