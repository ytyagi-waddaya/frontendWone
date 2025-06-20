"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/route";
import { toast } from "sonner";
import axios from "axios";
import { registerSchema, RegisterSchemaType } from "@/lib/validations/auth";

const validRoles = ["ADMIN", "AGENT", "APPROVER", "CLIENT"] as const;
const validDepartments = ["BASIS", "ABAP", "FUNCTIONAL", "CLIENT"] as const;


export default function RegisterForm() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departments: [],
      roles: [],
    },

  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully!");
       reset({
        name: "",
        email: "",
        password: "",
        departments:[],
        roles: [],
      });
      setValue("departments", []);
      setValue("roles", []);
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    },
  });

  const onSubmit = (values: RegisterSchemaType) => {   
    mutation.mutate(values);
  };

  const selectedRoles = watch("roles");
  const selectedDepartments = watch("departments");

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 mt-15 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="shadow-none border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>
              Raise, track, and manage IT tickets all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Department (Multi-select) */}
                <div className="grid gap-3">
                  <Label htmlFor="department">Select Departments</Label>
                  <Select
                    onValueChange={(value) => {
                      if (
                        validDepartments.includes(value as typeof validDepartments[number]) &&
                        !selectedDepartments.includes(value as typeof validDepartments[number])
                      ) {
                        setValue("departments", [
                          ...selectedDepartments,
                          value as "BASIS" | "ABAP" | "FUNCTIONAL" | "CLIENT",
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Departments</SelectLabel>
                        {validDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{dept.toUpperCase()}</span>
                              {/* Optional: Add description here */}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDepartments.map((department) => (
                      <span
                        key={department}
                        className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center"
                      >
                        {department}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "departments",
                              selectedDepartments.filter((d) => d !== department)
                            )
                          }
                          className="ml-1 text-green-600 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {errors.departments && (
                    <p className="text-sm text-red-500">{errors.departments.message}</p>
                  )}
                </div>

                  {/* Roles (Multi-select) */}
                <div className="grid gap-3">
                  <Label htmlFor="roles">Select Roles</Label>
                  <Select
                    onValueChange={(value) => {
                      if (
                        validRoles.includes(value as typeof validRoles[number]) &&
                        !selectedRoles.includes(value as typeof validRoles[number])
                      ) {
                        setValue("roles", [
                          ...selectedRoles,
                          value as "ADMIN" | "APPROVER" | "CLIENT" | "AGENT",
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="ADMIN">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Admin</span>
                            <span className="text-xs text-muted-foreground">Full access to system settings</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="AGENT">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Agent</span>
                            <span className="text-xs text-muted-foreground">Handles tickets and reports</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="CLIENT">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Client</span>
                            <span className="text-xs text-muted-foreground">Can raise and view tickets only</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="APPROVER">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Approver</span>
                            <span className="text-xs text-muted-foreground">Can approve and view tickets only</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "roles",
                              selectedRoles.filter((r) => r !== role)
                            )
                          }
                          className="ml-1 text-blue-600 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.roles && (
                    <p className="text-sm text-red-500">
                      {errors.roles.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
