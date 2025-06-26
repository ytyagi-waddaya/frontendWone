"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface Props {
  data: { name: string; new: number; inProgress: number; onHold: number }[];
}

export default function PriorityChart({ data }: Props) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} stackOffset="sign" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="new" stackId="a" fill="#4A90E2" name="New" />
            <Bar dataKey="inProgress" stackId="a" fill="#F5A623" name="In Progress" />
            <Bar dataKey="onHold" stackId="a" fill="#9B9B9B" name="On Hold" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
