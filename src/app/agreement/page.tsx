"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AgreementForm } from "@/components/agreement-form";

export default function AgreementPage() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    router.replace('/recruitment-closed')
    const agreed = document.cookie.includes('agreementAgreed=true')
    if (agreed) {
      router.replace('/signup')
    } else {
      setAllowed(true)
    }
  }, [router])

  if (!allowed) return null

  const handleAgree = () => {
    document.cookie = 'agreementAgreed=true; path=/; max-age=31536000';
    router.push('/signup');
  };

  return (
    <AgreementForm onAgree={handleAgree} />
  );
}
