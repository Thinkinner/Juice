import { redirect } from "next/navigation";

/** Sign-up is disabled; product entry is handle-based demo on the home page. */
export default function SignupPage() {
  redirect("/");
}
