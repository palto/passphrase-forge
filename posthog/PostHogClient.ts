// app/posthog.js
import { EventMessage, PostHog } from "posthog-node";
import { after } from "next/server";
import { cookies } from "next/headers";

export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  after(() => posthogClient.shutdown());
  return posthogClient;
}

export async function captureServerSide(props: EventMessage) {
  if (process.env.VITEST) return;

  const cookieName = "ph_" + process.env.NEXT_PUBLIC_POSTHOG_KEY + "_posthog";
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(cookieName)?.value;
  const distinctId = cookieValue
    ? JSON.parse(cookieValue).distinct_id
    : "placeholder";

  const client = PostHogClient();
  return client.captureImmediate({
    distinctId,
    ...props,
  });
}
