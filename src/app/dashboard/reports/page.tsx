
"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  CheckCircle, 
  Users, 
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, Pie, PieChart, Legend, Tooltip } from "recharts";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { reportAPI } from '@/lib/api';
import { generateReportPDF } from '@/lib/pdf';

const chartConfig = {
  count: {
    label: "Missions",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ReportsPage() {
  const { cases, users } = useStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const totalCases = cases.length;
  const completedCases = cases.filter(c => c.status === 'Completed').length;
  const urgentCases = cases.filter(c => c.urgency === 'High').length;
  const activeVolunteers = users.filter(u => u.role === 'volunteer').length;

  const categoryData = Object.entries(
    cases.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const statusData = [
    { name: 'Open', value: cases.filter(c => c.status === 'Open').length, color: '#3b82f6' },
    { name: 'In Progress', value: cases.filter(c => c.status === 'In Progress').length, color: '#f59e0b' },
    { name: 'Completed', value: cases.filter(c => c.status === 'Completed').length, color: '#10b981' },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await reportAPI.generate();
    } catch { /* local fallback */ }
    generateReportPDF(
      cases.map(c => ({ id: c.id, title: c.title, category: c.category, urgency: c.urgency, status: c.status, location: c.location })),
      { totalCases, completedCases, urgentCases, activeVolunteers }
    );
    toast({ title: "Report Downloaded", description: "resqlink-response-protocol.pdf saved." });
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Intelligence Reports</h1>
          <p className="text-sm text-slate-500 font-medium">Data-driven insights into community mission performance.</p>
        </div>
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating}
          className="bg-slate-900 text-white rounded-xl h-10 px-5 font-bold shadow-sm"
        >
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Compile Protocol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Missions', value: totalCases, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: totalCases > 0 ? `${Math.round((completedCases/totalCases)*100)}%` : '0%', icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Urgent Alerts', value: urgentCases, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Active Assets', value: activeVolunteers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl group hover:shadow-md transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-2xl p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold">Sector Distribution</CardTitle>
            <CardDescription className="text-xs font-medium">Mission density across various service categories.</CardDescription>
          </CardHeader>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
               <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
               </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold">Mission Status Integrity</CardTitle>
            <CardDescription className="text-xs font-medium">Real-time tracking of operational progress.</CardDescription>
          </CardHeader>
          <div className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
