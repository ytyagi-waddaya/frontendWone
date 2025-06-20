// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { changePassword } from "@/lib/api/route";

// interface ChangePasswordDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   defaultEmail?: string;
// }

// export function ChangePasswordDialog({
//   open,
//   onOpenChange,
//   defaultEmail = "",
// }: ChangePasswordDialogProps) {
//   const [formData, setFormData] = useState({
//     email: defaultEmail,
//     newPassword: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const changePasswordMutation = useMutation({
//     mutationFn: changePassword,
//     onSuccess: (data) => {
//       toast.success("Password updated");
//       onOpenChange(false);
//     },
//     onError: (error) => {
//       toast.error("Password update failed");
//     },
//   });

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Change Password</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-2">
//           <Input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <Input
//             name="newPassword"
//             type="password"
//             placeholder="New Password"
//             value={formData.newPassword}
//             onChange={handleChange}
//           />
//         </div>
//         <DialogFooter>
//           <Button
//             onClick={() => {
//               changePasswordMutation.mutate(formData);
//             }}
//             disabled={changePasswordMutation.isPending}
//           >
//             {changePasswordMutation.isPending ? "Updating..." : "Update"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/api/route";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  defaultEmail = "",
}: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState({
    email: defaultEmail,
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Password update failed");
    },
  });

  useEffect(() => {
  if (!open) {
    setFormData({
      email: defaultEmail,
      newPassword: "",
      confirmPassword: "",
    });
  }
}, [open, defaultEmail]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          {/* <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          /> */}
          <Input
  name="confirmPassword"
  type="password"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={handleChange}
/>

{/* Match Feedback Text */}
{formData.confirmPassword && (
  <div
    className={`text-sm font-medium ${
      formData.newPassword === formData.confirmPassword
        ? "text-green-600"
        : "text-red-600"
    }`}
  >
    {formData.newPassword === formData.confirmPassword
      ? "Passwords match"
      : "Passwords do not match"}
  </div>
)}

{/* Optional Progress Bar */}
{formData.confirmPassword && (
  <div className="h-2 rounded bg-gray-200 overflow-hidden">
    <div
      className={`h-full transition-all duration-300 ${
        formData.newPassword === formData.confirmPassword
          ? "bg-green-500 w-full"
          : "bg-red-500 w-1/2"
      }`}
    />
  </div>
)}

        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (formData.newPassword !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }
              changePasswordMutation.mutate({
                email: formData.email,
                newPassword: formData.newPassword,
              });
            }}
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
