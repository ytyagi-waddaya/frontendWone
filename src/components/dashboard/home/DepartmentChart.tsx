"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface Props {
  data: { name: string; tickets: number; sla: number }[];
}

export default function DepartmentChart({ data }: Props) {
  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Department Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#4A90E2" />
            <YAxis yAxisId="right" orientation="right" stroke="#7ED321" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="tickets" fill="#4A90E2" name="Tickets" />
            <Bar yAxisId="right" dataKey="sla" fill="#7ED321" name="SLA %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
