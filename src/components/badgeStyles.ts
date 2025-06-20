// type StyleMap = {
//   [key: string]: string;
// };

// export const statusStyles: StyleMap = {
//   OPEN: "bg-green-100 text-green-800 ring-1 ring-green-300",
//   IN_PROGRESS: "bg-sky-100 text-sky-800 ring-1 ring-sky-300",
//   PENDING_APPROVAL: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
//   APPROVED: "bg-teal-100 text-teal-800 ring-1 ring-teal-300",
//   REJECTED: "bg-rose-100 text-rose-800 ring-1 ring-rose-300",
//   REASSIGNED: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300",
//   CLOSED: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
//   REOPENED: "bg-fuchsia-100 text-fuchsia-800 ring-1 ring-fuchsia-300",
//   AWAITING_INPUT: "bg-pink-100 text-pink-800 ring-1 ring-pink-300",
//   ON_HOLD: "bg-slate-100 text-slate-600 ring-1 ring-slate-300",
// };

// export const priorityStyles: StyleMap = {
//   CRITICAL: "bg-rose-200 text-rose-900 ring-1 ring-rose-400",
//   HIGH: "bg-orange-100 text-orange-800 ring-1 ring-orange-300",
//   MEDIUM: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300",
//   LOW: "bg-lime-100 text-lime-800 ring-1 ring-lime-300",
// };

// export const departmentStyles: StyleMap = {
//   BASIS: "bg-blue-100 text-blue-800 ring-1 ring-blue-300",
//   ABAP: "bg-violet-100 text-violet-800 ring-1 ring-violet-300",
//   FUNCTIONAL: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
//   CLIENT: "bg-purple-100 text-purple-800 ring-1 ring-purple-300",
//   DEFAULT: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
// };

// export const getStyle = (
//   type: "status" | "priority" | "department",
//   key: string
// ): string => {
//   const upperKey = key?.toUpperCase();
//   switch (type) {
//     case "status":
//       return statusStyles[upperKey] || "bg-gray-100 text-gray-600 ring-1 ring-gray-300";
//     case "priority":
//       return priorityStyles[upperKey] || "bg-gray-100 text-gray-600 ring-1 ring-gray-300";
//     case "department":
//       return departmentStyles[upperKey] || departmentStyles.DEFAULT;
//     default:
//       return "";
//   }
// };


// styles.ts
type StyleMap = {
  [key: string]: string;
};

export const statusStyles: StyleMap = {
  OPEN: "bg-green-100 text-green-800 ring-1 ring-green-300",
  IN_PROGRESS: "bg-sky-100 text-sky-800 ring-1 ring-sky-300",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
  APPROVED: "bg-teal-100 text-teal-800 ring-1 ring-teal-300",
  REJECTED: "bg-rose-100 text-rose-800 ring-1 ring-rose-300",
  REASSIGNED: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300",
  CLOSED: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
  REOPENED: "bg-fuchsia-100 text-fuchsia-800 ring-1 ring-fuchsia-300",
  AWAITING_INPUT: "bg-pink-100 text-pink-800 ring-1 ring-pink-300",
  ON_HOLD: "bg-slate-100 text-slate-600 ring-1 ring-slate-300",
};

export const priorityStyles: StyleMap = {
  CRITICAL: "bg-rose-200 text-rose-900 ring-1 ring-rose-400",
  HIGH: "bg-orange-100 text-orange-800 ring-1 ring-orange-300",
  MEDIUM: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300",
  LOW: "bg-lime-100 text-lime-800 ring-1 ring-lime-300",
};

export const departmentStyles: StyleMap = {
  BASIS: "bg-blue-100 text-blue-800 ring-1 ring-blue-300",
  ABAP: "bg-violet-100 text-violet-800 ring-1 ring-violet-300",
  FUNCTIONAL: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
  CLIENT: "bg-purple-100 text-purple-800 ring-1 ring-purple-300",
  DEFAULT: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
};

export const actionStyles: StyleMap = {
  CREATED: "bg-blue-100 text-blue-800 ring-1 ring-blue-300",
  STATUS_CHANGE: "bg-sky-100 text-sky-800 ring-1 ring-sky-300",
  ASSIGNMENT: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300",
  APPROVAL: "bg-teal-100 text-teal-800 ring-1 ring-teal-300",
  REJECTION: "bg-rose-100 text-rose-800 ring-1 ring-rose-300",
  COMMENT: "bg-gray-100 text-gray-800 ring-1 ring-gray-300",
  DEFAULT: "bg-gray-100 text-gray-600 ring-1 ring-gray-300",
};

export const getStyle = (
  type: "status" | "priority" | "department" | "action",
  key: string
): string => {
  const upperKey = key?.toUpperCase();
  switch (type) {
    case "status":
      return statusStyles[upperKey] || "bg-gray-100 text-gray-600 ring-1 ring-gray-300";
    case "priority":
      return priorityStyles[upperKey] || "bg-gray-100 text-gray-600 ring-1 ring-gray-300";
    case "department":
      return departmentStyles[upperKey] || departmentStyles.DEFAULT;
    case "action":
      return actionStyles[upperKey] || actionStyles.DEFAULT;
    default:
      return "";
  }
};