import createNextIntlPlugin from "next-intl/plugin";
import pack from './package.json' assert { type: 'json' };

const withNextIntl = createNextIntlPlugin();
const version = pack.version;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needs to be here until https://github.com/vercel/next.js/issues/64525 is fixed
  transpilePackages: ['next-mdx-remote'],
  env: {
    NEXT_PUBLIC_VERSION: version,
  }
};

export default withNextIntl(nextConfig);
