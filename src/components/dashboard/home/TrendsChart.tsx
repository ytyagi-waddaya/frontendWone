"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";

interface Props {
  data: { name: string; created: number; resolved: number }[];
}

export default function TrendsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="created" stackId="1" stroke="#4A90E2" fill="#4A90E2" name="Created" />
            <Area type="monotone" dataKey="resolved" stackId="2" stroke="#7ED321" fill="#7ED321" name="Resolved" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
