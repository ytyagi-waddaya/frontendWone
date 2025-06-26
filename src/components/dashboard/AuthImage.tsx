"use client"; 

import Image from "next/image";

export default function AuthImage() {
  return (
    <Image
      src="/Vector.svg"
      alt="auth image"
      width={100}
      height={80}
      priority
    />
  );
}
