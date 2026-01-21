import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  redirect("/dashboard");
}
