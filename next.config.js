/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove static export - we need server components for Anthropic API
}

module.exports = nextConfig
