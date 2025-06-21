import React from "react";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  // Rediriger vers le dashboard
  redirect("/admin/dashboard");
}
