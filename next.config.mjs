import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needs to be here until https://github.com/vercel/next.js/issues/64525 is fixed
  transpilePackages: ["next-mdx-remote"],
  env: {
    NEXT_PUBLIC_VERSION: process.env.npm_package_version,
  },
};

export default withFlowbiteReact(bundleAnalyzer(withNextIntl(nextConfig)));
