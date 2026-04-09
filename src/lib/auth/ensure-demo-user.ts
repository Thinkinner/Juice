import { DEMO_USER_EMAIL, DEMO_USER_ID } from "@/lib/auth/demo-user";
import { prisma } from "@/lib/prisma";

/** Ensures the fixed demo row exists (used by demo login + session). */
export async function ensureDemoUserInDb() {
  return prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: "Demo creator",
    },
    update: { email: DEMO_USER_EMAIL },
  });
}
