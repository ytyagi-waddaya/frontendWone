// // MentionDropdown.tsx
// "use client";

// import React from "react";

// interface MentionDropdownProps {
//   show: boolean;
//   query: string;
//   onSelect: (name: string) => void;
// }

// const users = ["Test", "Alice", "Bob", "Charlie"]; // Replace with API fetch if needed

// export default function MentionDropdown({ show, query, onSelect }: MentionDropdownProps) {
//   if (!show || query.trim() === "") return null;

//   const filtered = users.filter((user) =>
//     user.toLowerCase().startsWith(query.toLowerCase())
//   );

//   return (
//     <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-48 max-h-40 overflow-y-auto">
//       {filtered.map((user) => (
//         <div
//           key={user}
//           className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
//           onClick={() => onSelect(user)}
//         >
//           @{user}
//         </div>
//       ))}
//       {filtered.length === 0 && (
//         <div className="px-3 py-1 text-gray-400 italic">No matches</div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { listAllUsers } from "@/lib/api/route"; // adjust path as needed

// interface MentionDropdownProps {
//   show: boolean;
//   query: string;
//   onSelect: (mention: string) => void;
// }

// interface User {
//   id: string;
//   name: string;
//   email?: string;
// }

// export default function MentionDropdown({ show, query, onSelect }: MentionDropdownProps) {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filtered, setFiltered] = useState<User[]>([]);


// useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const res = await listAllUsers();
//       console.log("[🐛 Raw user response]", res);
//       const users = Array.isArray(res) ? res : res.users || [];
//       setUsers(users);
//     } catch (err) {
//       console.error("❌ Failed to fetch users:", err);
//     }
//   };

//   fetchUsers();
// }, []);


//   useEffect(() => {
//     if (!query.trim()) return setFiltered([]);
//     const q = query.toLowerCase();
//     setFiltered(users.filter((u) => u.name.toLowerCase().startsWith(q)));
//   }, [query, users]);

//   if (!show || query.trim() === "") return null;

//   return (
//     <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-48 max-h-40 overflow-y-auto">
//       {filtered.length > 0 ? (
//         filtered.map((user) => (
//           <div
//             key={user.id}
//             className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
//             onClick={() => onSelect(user.name)}
//           >
//             @{user.name}
//           </div>
//         ))
//       ) : (
//         <div className="px-3 py-1 text-gray-400 italic">No matches</div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { listAllUsers } from "@/lib/api/route"; // adjust path as needed
import { useQuery } from "@tanstack/react-query";

interface MentionDropdownProps {
  show: boolean;
  query: string;
  onSelect: (mention: string) => void;
}

interface User {
  id: string;
  name: string;
  email?: string;
}

export default function MentionDropdown({
  show,
  query,
  onSelect,
}: MentionDropdownProps) {
  const [filtered, setFiltered] = useState<User[]>([]);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await listAllUsers();
      const userList = Array.isArray(res) ? res : res.users || [];
      console.log("[📦 All Users Fetched]", userList);
      return userList;
    },
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });

  useEffect(() => {
    if (!query.trim()) return setFiltered([]);
    const q = query.toLowerCase();
    setFiltered(
      users.filter((u) => u.name.toLowerCase().startsWith(q))
    );
  }, [query, users]);

  if (!show || query.trim() === "") return null;
  if (isLoading) return <div className="text-xs text-gray-400">Loading users...</div>;
  if (isError) return <div className="text-xs text-red-500">Failed to load users</div>;

  return (
    <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-48 max-h-40 overflow-y-auto">
      {filtered.length > 0 ? (
        filtered.map((user) => (
          <div
            key={user.id}
            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(user.name)}
          >
            @{user.name}
          </div>
        ))
      ) : (
        <div className="px-3 py-1 text-gray-400 italic">No matches</div>
      )}
    </div>
  );
}
