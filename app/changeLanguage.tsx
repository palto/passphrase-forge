"use server";
import { cookies } from "next/headers";

export async function changeLanguage(language: string) {
  (await cookies()).set("NEXT_LOCALE", language);
}
