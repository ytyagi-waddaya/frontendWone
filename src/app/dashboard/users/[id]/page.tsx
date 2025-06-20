// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getUser,
//   deleteUser,
//   restoreUser,
// } from "@/lib/api/route";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "sonner";
// import axios from "axios";
// import { Switch } from "@/components/ui/switch";


// export default function UserDetailPage() {
//   const { id } = useParams();
//   const userId = id as string;
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["user", userId],
//     queryFn: () => getUser(userId),
//     enabled: !!userId,
//   });

//   const user = data?.user?.[0];

//   const deleteUserMutation = useMutation({
//     mutationFn: () => deleteUser(userId),
//     onSuccess: () => {
//       toast.success("User deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["user", userId] });
//     },
//     onError: (error: any) => {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Failed to delete user.");
//       } else {
//         toast.error("Something went wrong.");
//       }
//     },
//   });

//   const restoreUserMutation = useMutation({
//     mutationFn: () => restoreUser(userId),
//     onSuccess: () => {
//       toast.success("User restored successfully!");
//       queryClient.invalidateQueries({ queryKey: ["user", userId] });
//     },
//     onError: (error: any) => {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.response?.data?.message || "Failed to restore user.");
//       } else {
//         toast.error("Something went wrong.");
//       }
//     },
//   });

//   const handleToggle = () => {
//     if (user?.isActive) {
//       deleteUserMutation.mutate();
//     } else {
//       restoreUserMutation.mutate();
//     }
//   };

//   if (isLoading) return <p className="p-4">Loading user...</p>;
//   if (isError) return <p className="p-4 text-red-600">Error: {(error as any)?.message}</p>;
//   if (!user) return <p>No user found.</p>;

//   const currentRoles = user.roles.map((r: any) => r.role.name);
//   const currentDepartments = user.departments.map((d: any) => d.department.name);

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <button
//           onClick={() => router.back()}
//           className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
//         >
//           ← Back
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold">User Details</h2>

//       <div className="bg-gray-100 p-4 rounded shadow space-y-2">
//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>

//         <p><strong>Roles:</strong> {currentRoles.join(", ") || "No roles assigned"}</p>
//         <p><strong>Departments:</strong> {currentDepartments.join(", ") || "No departments assigned"}</p>

//         <p className="flex items-center gap-4">
//   <strong>Status:</strong>
//   <Switch checked={user.isActive} onCheckedChange={handleToggle} />
//   <span>{user.isActive ? "Active" : "Inactive"}</span>
// </p>


//         <p className="text-xs text-gray-600">
//           Created: {new Date(user.createdAt).toLocaleString()}
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, deleteUser, restoreUser } from "@/lib/api/route";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { format } from "date-fns";

// Shadcn components
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Lucide React icons
import { ChevronLeft, UserX, UserCheck, AlertCircle, RefreshCw, Pencil, Loader2 } from "lucide-react";

export default function UserDetailPage() {
  const { id } = useParams();
  const userId = id as string;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  const user = data?.user?.[0];

  const deleteUserMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error("Deactivation failed", {
          description: error.response?.data?.message || "Could not deactivate user.",
        });
      } else {
        toast.error("An error occurred", {
          description: "Please try again later.",
        });
      }
    },
  });

  const restoreUserMutation = useMutation({
    mutationFn: () => restoreUser(userId),
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error("Activation failed", {
          description: error.response?.data?.message || "Could not activate user.",
        });
      } else {
        toast.error("An error occurred");
      }
    },
  });

  const handleStatusToggle = () => {
    if (user?.isActive) {
      deleteUserMutation.mutate();
    } else {
      restoreUserMutation.mutate();
    }
  };

  if (isLoading) return <UserDetailSkeleton />;
  if (isError) return <ErrorState error={error} />;
  if (!user) return <EmptyState />;

  const currentRoles = user.roles?.map((r: any) => r.role.name) || [];
  const currentDepartments = user.departments?.map((d: any) => d.department.name) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 pl-0"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to users
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <DetailItem label="Created" value={format(new Date(user.createdAt), "PPpp")} />
            <DetailItem label="Last Updated" value={format(new Date(user.updatedAt), "PPpp")} />
          </div>

          <div className="space-y-4">
            <DetailItem
              label="Roles"
              value={
                currentRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentRoles.map((role:string) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  "No roles assigned"
                )
              }
            />
            <DetailItem
              label="Departments"
              value={
                currentDepartments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentDepartments.map((dept:string) => (
                      <Badge key={dept} variant="secondary">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  "No departments assigned"
                )
              }
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <div className="flex w-full items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">
                {user.isActive
                  ? "This user can access the system"
                  : "This user cannot access the system"}
              </p>
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/users/${userId}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant={user.isActive ? "destructive" : "default"}
              onClick={handleStatusToggle}
              disabled={deleteUserMutation.isPending || restoreUserMutation.isPending}
            >
              {deleteUserMutation.isPending || restoreUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : user.isActive ? (
                <UserX className="mr-2 h-4 w-4" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Helper Components
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <Skeleton className="h-9 w-24" />
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}

function ErrorState({ error }: { error: any }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Error loading user</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {(error as any)?.message || "An unknown error occurred"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function EmptyState() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>User not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The requested user could not be found in our system.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return to users
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}