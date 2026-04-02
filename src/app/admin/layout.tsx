import { redirect } from "next/navigation";

export default async function AdminLayout() {
  redirect("/dashboard");
}
