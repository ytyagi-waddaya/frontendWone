"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicket, getAllDepartments } from "@/lib/api/route"; // your API call function
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TicketFormData = {
  title: string;
  description: string;
  priority: string;
  departmentId: string;
  attachments?: FileList;
};

type Department = {
  id: string;
  name: string;
  isActive: boolean;
  deletedAt: string | null;
};

export default function TicketForm() {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TicketFormData>();
  const [files, setFiles] = useState<File[]>([]);

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success("Ticket created successfully!");
      reset();
      setFiles([]);
    },
    onError: (error: any) => {
      toast.error("Failed to create ticket.");
    },
  });

  const { data, isLoading, isError } = useQuery({
  queryKey: ["departments"],
  queryFn: getAllDepartments,
});

const departments: Department[] = data?.departments || [];

  const onSubmit = (data: TicketFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("departmentId", data.departmentId);
    

    // Append files to formData
    if (files.length) {
      files.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    mutation.mutate(formData);
  };

  // Handle file input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex max-h-screen items-center justify-center mt-10 lg:mt-40 gap-6 p-6 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
         <Card className="shadow-none border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Ticket</CardTitle>
           </CardHeader>
          <CardContent>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <div className="grid gap-6">
        <div className="grid gap-3">
            <Label>Title</Label>
            <Input {...register("title", { required: true })} placeholder="Issue title" />
            {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

      <div className="grid gap-3">
        <Label>Description</Label>
        <Textarea {...register("description", { required: true })} placeholder="Type detailed description here."/>
        {errors.description && <p className="text-red-500">Description is required</p>}
      </div>
    <div className="grid gap-3">
      <Label htmlFor="priority">Priority</Label>
      <Select
        onValueChange={(value) => setValue("priority", value)}
        value={watch("priority") || ""}
      >
        <SelectTrigger id="priority" className="w-full">
          <SelectValue placeholder="Select Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
          <SelectLabel>Priority</SelectLabel>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors.priority && (
        <p className="text-red-500 text-sm mt-1">Priority is required</p>
      )}
    </div>

    <div className="grid gap-3">
      <Label htmlFor="departmentId">Department</Label>
      <Select
    onValueChange={(value) => setValue("departmentId", value)}
    value={watch("departmentId") || ""}
    >
    <SelectTrigger id="departmentId" className="w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : "Select Department"} />
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
        <SelectLabel>Department</SelectLabel>
        {departments.map((dept) => (
    <SelectItem key={dept.id} value={dept.id}>
        {dept.name}
    </SelectItem>
    ))}

    </SelectGroup>
  </SelectContent>
</Select>

      {errors.departmentId && (
        <p className="text-red-500 text-sm mt-1">Department is required</p>
      )}
    </div>

      <div className="grid gap-3">
        <Label>Attachments</Label>
        <Input type="file" multiple onChange={onFileChange} />
        {files.length > 0 && (
          <ul className="mt-2">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
       {mutation.isPending ? "Creating..." : "Create Ticket"}
      </Button>
      </div>
    </form>
    </CardContent>
    </Card>
    </div>
    </div>
  );
  
}
