"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AgreementForm } from "@/components/agreement-form";

export default function AgreementPage() {
  const router = useRouter();

  const handleAgree = () => {
    document.cookie = 'agreementAgreed=true; path=/; max-age=31536000';
    router.push('/signup');
  };

  return (
    <AgreementForm onAgree={handleAgree} />
  );
}
