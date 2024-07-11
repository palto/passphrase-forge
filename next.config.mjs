import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needs to be here until https://github.com/vercel/next.js/issues/64525 is fixed
  transpilePackages: ['next-mdx-remote'],
};

export default withNextIntl(nextConfig);
