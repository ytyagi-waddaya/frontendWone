// import { NextRequest, NextResponse } from "next/server";
// import { validateAuth } from "@/lib/validations/validateAuth";
// // import { cookies } from "next/headers";
// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//   userId: string;
//   name: string;
//   email: string;
//   role: string[]; // assuming it's an array
// }

// // export const middleware = async (req: NextRequest) => {
// //    try {
// //   console.log("🔍 Middleware triggered:", req.nextUrl.pathname);

// //   const accessToken = req.cookies.get("access_token")?.value;
// //   const refreshToken = req.cookies.get("refresh_token")?.value;

// //   if (!accessToken || !refreshToken) {
// //     console.warn("⚠️ Tokens missing. Redirecting to /");
// //     const url = req.nextUrl.clone();
// //     url.pathname = "/";
// //     return NextResponse.redirect(url);
// //   }
 
 
// //     const authData = await validateAuth(accessToken || "", refreshToken || "");
// //     if (!authData || !authData?.success) {
// //       console.warn("❌ Auth invalid. Redirecting to /");
// //       const url = req.nextUrl.clone();
// //       url.pathname = "/";
// //       return NextResponse.redirect(url);
// //     }

// //     return NextResponse.next();
// //   } catch (error) {
// //     console.error("🔥 Middleware error:", error);
// //     const url = req.nextUrl.clone();
// //     url.pathname = "/";
// //     return NextResponse.redirect(url);
// //   }
// // };

// export const middleware = async (req: NextRequest) => {
//   try {
//     console.log("🔍 Middleware triggered:", req.nextUrl.pathname);

//     const accessToken = req.cookies.get("access_token")?.value;
//     const refreshToken = req.cookies.get("refresh_token")?.value;

//     // ⚠️ No tokens at all → redirect immediately
//     if (!accessToken && !refreshToken) {
//       console.warn("⚠️ No tokens present. Redirecting to /");
//       const url = req.nextUrl.clone();
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }

//     // ✅ At least one token present → try validating
//     const authData = await validateAuth(accessToken || "", refreshToken || "");

//     if (!authData?.success) {
//       console.warn("❌ Auth invalid. Redirecting to /");
//       const url = req.nextUrl.clone();
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }

//     const decoded = jwtDecode<DecodedToken>(accessToken || "");
//     const roles = decoded?.role;
//     const roleString = Array.isArray(roles)
//   ? roles.join(",")
//   : typeof roles === "string"
//     ? roles
//     : "";
    

//     // ✅ Pass role via request header
//     const response = NextResponse.next();
//     response.headers.set("x-user-role", roleString); // custom header
//     return response;
//     // return NextResponse.next();
//   } catch (error) {
//     console.error("🔥 Middleware error:", error);
//     const url = req.nextUrl.clone();
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }
// };

// export const config = {
//   matcher: ["/dashboard/:path*"], 
// };

import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/lib/validations/validateAuth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  role: string | string[]; // can be single or multiple roles
}

export const middleware = async (req: NextRequest) => {
  try {
    console.log("🔍 Middleware triggered:", req.nextUrl.pathname);

    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      console.warn("⚠️ No tokens present. Redirecting to /");
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Validate tokens
    const authData = await validateAuth(accessToken || "", refreshToken || "");
    if (!authData?.success) {
      console.warn("❌ Invalid token. Redirecting to /");
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Decode token
    const decoded = jwtDecode<DecodedToken>(accessToken || "");

    // Handle role: string or array
    const roles = decoded.role;
    const roleString =
      Array.isArray(roles) ? roles.join(",") : typeof roles === "string" ? roles : "";

    const response = NextResponse.next();

    // Set all custom headers you may need
    response.headers.set("x-user-id", decoded.userId);
    response.headers.set("x-user-name", decoded.name);
    response.headers.set("x-user-email", decoded.email);
    response.headers.set("x-user-role", roleString); // comma-separated if multiple

    return response;
  } catch (error) {
    console.error("🔥 Middleware error:", error);
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
};

// Apply middleware only on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
