/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_HOST: process.env.SERVER_HOST,
    }
}

module.exports = nextConfig
