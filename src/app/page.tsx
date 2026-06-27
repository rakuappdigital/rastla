import { redirect } from "next/navigation";

// Proxy handles the actual lang redirect; this is a fallback
export default function Home() {
  redirect("/tr");
}
