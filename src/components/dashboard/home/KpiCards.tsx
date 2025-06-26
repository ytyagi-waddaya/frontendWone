// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export default function KpiCards() {
//   const kpis = [
//     { title: "Total Tickets", value: "1,243" },
//     { title: "Open Tickets", value: "328" },
//     { title: "In Progress", value: "156" },
//     { title: "SLA Compliance", value: "92.5%" },
//   ];

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
//       {kpis.map((kpi) => (
//         <Card key={kpi.title}>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{kpi.value}</div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Ticket {
  id: string;
  status: string;
  createdAt: string;
  // Extend with additional fields if needed
}

interface KpiCardsProps {
  data?: { tickets: Ticket[] };
  isLoading: boolean;
}

export default function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const tickets = data?.tickets ?? [];

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) =>
    ["NEW", "IN_PROGRESS", "ON_HOLD", "APPROVED"].includes(t.status)
  ).length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const slaCompliance = "92.5%"; // Replace with actual SLA logic if available

  const kpis = [
    { title: "Total Tickets", value: totalTickets },
    { title: "Open Tickets", value: openTickets },
    { title: "In Progress", value: inProgress },
    { title: "SLA Compliance", value: slaCompliance },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

