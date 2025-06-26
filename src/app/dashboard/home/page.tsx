// // app/dashboard/page.tsx
// "use client";

// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Calendar, Filter, Search } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
// } from "recharts";

// export default function DashboardPage() {
//   // Chart data
//   const statusData = [
//     { name: "New", value: 123, color: "#4A90E2" },
//     { name: "In Progress", value: 156, color: "#F5A623" },
//     { name: "On Hold", value: 42, color: "#9B9B9B" },
//     { name: "Resolved", value: 287, color: "#7ED321" },
//     { name: "Closed", value: 635, color: "#4A4A4A" },
//   ];

//   const trendData = [
//     { name: "Jan", created: 120, resolved: 98 },
//     { name: "Feb", created: 135, resolved: 112 },
//     { name: "Mar", created: 142, resolved: 125 },
//     { name: "Apr", created: 158, resolved: 132 },
//     { name: "May", created: 167, resolved: 145 },
//     { name: "Jun", created: 182, resolved: 158 },
//     { name: "Jul", created: 198, resolved: 172 },
//   ];

//   const priorityData = [
//     { name: "Critical", new: 12, inProgress: 8, onHold: 3 },
//     { name: "High", new: 28, inProgress: 15, onHold: 7 },
//     { name: "Medium", new: 45, inProgress: 32, onHold: 12 },
//     { name: "Low", new: 38, inProgress: 21, onHold: 20 },
//   ];

//   const departmentData = [
//     { name: "IT", tickets: 342, sla: 94 },
//     { name: "HR", tickets: 128, sla: 89 },
//     { name: "Finance", tickets: 156, sla: 92 },
//     { name: "Operations", tickets: 287, sla: 88 },
//     { name: "Marketing", tickets: 98, sla: 95 },
//   ];

//   // Table data
//   const agents = [
//     { name: "Alex Johnson", resolved: 142, avgTime: "2.4h", satisfaction: "96%" },
//     { name: "Sam Wilson", resolved: 128, avgTime: "3.1h", satisfaction: "94%" },
//     { name: "Taylor Smith", resolved: 118, avgTime: "2.8h", satisfaction: "95%" },
//     { name: "Jordan Lee", resolved: 105, avgTime: "3.5h", satisfaction: "92%" },
//     { name: "Casey Kim", resolved: 98, avgTime: "4.2h", satisfaction: "90%" },
//   ];

//   const tickets = [
//     { id: "INC-1245", subject: "Email server outage", department: "IT", priority: "Critical", status: "In Progress", updated: "10 min ago" },
//     { id: "INC-1244", subject: "Printer not working", department: "Finance", priority: "High", status: "New", updated: "25 min ago" },
//     { id: "INC-1243", subject: "VPN access request", department: "HR", priority: "Medium", status: "New", updated: "42 min ago" },
//     { id: "INC-1242", subject: "Software license renewal", department: "Operations", priority: "High", status: "On Hold", updated: "1 hour ago" },
//     { id: "INC-1241", subject: "Password reset", department: "Marketing", priority: "Low", status: "Resolved", updated: "2 hours ago" },
//   ];

//   const priorityColors = {
//     Critical: "bg-red-500",
//     High: "bg-orange-500",
//     Medium: "bg-yellow-500",
//     Low: "bg-blue-500",
//   };

//   const statusColors = {
//     New: "bg-blue-500",
//     "In Progress": "bg-amber-500",
//     "On Hold": "bg-gray-500",
//     Resolved: "bg-green-500",
//     Closed: "bg-gray-800",
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 ">
//         <h1 className="text-2xl font-bold text-gray-800">ITSM Dashboard</h1>
//       </header>

//       <main className="flex-1 p-4 md:p-6">
//         {/* KPI Cards */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
//               {/* <span className="text-xs text-green-600">+12% from last week</span> */}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">1,243</div>
//               {/* <CardDescription>123 created today</CardDescription> */}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
//               {/* <span className="text-xs text-red-600">-5% from last week</span> */}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">328</div>
//               <CardDescription>
//                 {/* <span className="text-amber-500">42 older than 72h</span> */}
//               </CardDescription>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">In Progress</CardTitle>
//               {/* <span className="text-xs text-green-600">+8% from last week</span> */}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">156</div>
//               {/* <CardDescription>Avg. 4.2h handling time</CardDescription> */}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
//               {/* <span className="text-xs text-green-600">+2% from last week</span> */}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">92.5%</div>
//               {/* <CardDescription>18 tickets breached</CardDescription> */}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Charts */}
//         <Tabs defaultValue="overview" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             {/* <TabsTrigger value="departments">By Department</TabsTrigger>
//             <TabsTrigger value="categories">By Category</TabsTrigger> */}
//           </TabsList>
//           <TabsContent value="overview" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               <Card className="md:col-span-1">
//                 <CardHeader>
//                   <CardTitle>Ticket Status</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pl-2">
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={statusData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={100}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {statusData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//               <Card className="md:col-span-1">
//                 <CardHeader>
//                   <CardTitle>Priority Distribution</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart
//                       data={priorityData}
//                       //@ts-ignore
//                       stackOffset="stack"
//                       margin={{
//                         top: 20,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="new" stackId="a" fill="#4A90E2" name="New" />
//                       <Bar dataKey="inProgress" stackId="a" fill="#F5A623" name="In Progress" />
//                       <Bar dataKey="onHold" stackId="a" fill="#9B9B9B" name="On Hold" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//               <Card className="md:col-span-2 lg:col-span-1">
//                 <CardHeader>
//                   <CardTitle>Department Breakdown</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart
//                       data={departmentData}
//                       margin={{
//                         top: 5,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis yAxisId="left" orientation="left" stroke="#4A90E2" />
//                       <YAxis yAxisId="right" orientation="right" stroke="#7ED321" domain={[0, 100]} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar yAxisId="left" dataKey="tickets" fill="#4A90E2" name="Tickets" />
//                       <Bar yAxisId="right" dataKey="sla" fill="#7ED321" name="SLA %" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="grid gap-4 md:grid-cols-1">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Ticket Trends</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <AreaChart
//                       data={trendData}
//                       margin={{
//                         top: 10,
//                         right: 30,
//                         left: 0,
//                         bottom: 0,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Area type="monotone" dataKey="created" stackId="1" stroke="#4A90E2" fill="#4A90E2" name="Created" />
//                       <Area type="monotone" dataKey="resolved" stackId="2" stroke="#7ED321" fill="#7ED321" name="Resolved" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* Bottom Section */}
//         {/* <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="md:col-span-1">
//             <CardHeader>
//               <CardTitle>Top Performers</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Agent</TableHead>
//                     <TableHead className="text-right">Resolved</TableHead>
//                     <TableHead className="text-right">Avg. Time</TableHead>
//                     <TableHead className="text-right">Satisfaction</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {agents.map((agent) => (
//                     <TableRow key={agent.name}>
//                       <TableCell className="font-medium">{agent.name}</TableCell>
//                       <TableCell className="text-right">{agent.resolved}</TableCell>
//                       <TableCell className="text-right">{agent.avgTime}</TableCell>
//                       <TableCell className="text-right">{agent.satisfaction}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle>Recent Activity</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Ticket ID</TableHead>
//                     <TableHead>Subject</TableHead>
//                     <TableHead>Department</TableHead>
//                     <TableHead>Priority</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Last Updated</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {tickets.map((ticket) => (
//                     <TableRow key={ticket.id}>
//                       <TableCell className="font-medium">{ticket.id}</TableCell>
//                       <TableCell>{ticket.subject}</TableCell>
//                       <TableCell>{ticket.department}</TableCell>
//                       <TableCell>
//                         <Badge className={`${priorityColors[ticket.priority as keyof typeof priorityColors]} text-white`}>
//                           {ticket.priority}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={`${statusColors[ticket.status as keyof typeof statusColors]} text-white`}>
//                           {ticket.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">{ticket.updated}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div> */}
//       </main>
//     </div>
//   );
// }


// components/dashboard/DashboardPage.tsx
"use client";

import KpiCards from "@/components/dashboard/home/KpiCards";
import StatusChart from "@/components/dashboard/home/StatusChart";
import PriorityChart from "@/components/dashboard/home/PriorityChart";
import DepartmentChart from "@/components/dashboard/home/DepartmentChart";
import TrendsChart from "@/components/dashboard/home/TrendsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketsByUserId } from "@/lib/api/route";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Ticket {
  id: string;
  status: string;
  priority: string;
  department?: {
    name: string;
  };
  createdAt: string;
  // Add more fields as needed
}


export default function DashboardPage() {
const [activeOnly, setActiveOnly] = useState(true);
    const { data: userTicketData, isLoading } = useQuery({
    queryKey: ["ticketsByUser", activeOnly ],
    queryFn: () => TicketsByUserId(activeOnly),
  });

  const tickets:Ticket[] = userTicketData?.tickets || [];

const statusData = [
  { name: "New", value: tickets.filter(t => t.status === "NEW").length, color: "#4A90E2" },
  { name: "In Progress", value: tickets.filter(t => t.status === "IN_PROGRESS").length, color: "#F5A623" },
  { name: "On Hold", value: tickets.filter(t => t.status === "ON_HOLD").length, color: "#9B9B9B" },
  { name: "Resolved", value: tickets.filter(t => t.status === "RESOLVED").length, color: "#7ED321" },
  { name: "Closed", value: tickets.filter(t => t.status === "CLOSED").length, color: "#4A4A4A" },
  { name: "Approved", value: tickets.filter(t => t.status === "APPROVED").length, color: "#00C49F" }, // add others as needed
];


  // const trendData = [
  //   { name: "Jan", created: 120, resolved: 98 },
  //   { name: "Feb", created: 135, resolved: 112 },
  //   { name: "Mar", created: 142, resolved: 125 },
  //   { name: "Apr", created: 158, resolved: 132 },
  //   { name: "May", created: 167, resolved: 145 },
  //   { name: "Jun", created: 182, resolved: 158 },
  //   { name: "Jul", created: 198, resolved: 172 },
  // ];

const priorities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const priorityData = priorities.map(priority => {
  const filtered = tickets.filter(t => t.priority?.toUpperCase() === priority);
  return {
    name: priority.charAt(0) + priority.slice(1).toLowerCase(),
    new: filtered.filter(t => t.status === "NEW").length,
    inProgress: filtered.filter(t => t.status === "IN_PROGRESS").length,
    onHold: filtered.filter(t => t.status === "ON_HOLD").length,
  };
});


// const departmentsMap = new Map();

// tickets.forEach(ticket => {
//   const name = ticket.department?.name || "Unknown";
//   if (!departmentsMap.has(name)) {
//     departmentsMap.set(name, { name, tickets: 0, sla: 90 }); // SLA as dummy
//   }
//   departmentsMap.get(name).tickets += 1;
// });

// const departmentData = Array.from(departmentsMap.values());


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800">ITSM Dashboard</h1>
      </header>

      <main className="flex-1 p-4 md:p-6">
        {/* <KpiCards /> */}
        <KpiCards data={userTicketData} isLoading={isLoading} />


        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatusChart data={statusData} />
              <PriorityChart data={priorityData} />
              {/* <DepartmentChart data={departmentData} /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              {/* <TrendsChart data={trendData} /> */}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
