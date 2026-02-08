import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  api_host: "/ph",
  defaults: "2025-11-30",
});
