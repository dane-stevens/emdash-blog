import node from "@astrojs/node";
import react from "@astrojs/react";
import { auditLogPlugin } from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { s3,local } from "emdash/astro";
import { postgres, sqlite } from "emdash/db";


const database= import.meta.env.PROD
? postgres({
				connectionString: process.env.DATABASE_URL
			})
			: sqlite({ url:"file:./data.db" })


const storage = import.meta.env.PROD
  ? s3({
		endpoint: process.env.S3_ENDPOINT,
		bucket: process.env.S3_BUCKET,
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "auto", // Optional, defaults to "auto"
    // publicUrl: process.env.S3_PUBLIC_URL, // Optional CDN URL
	})
	: local({
		directory:"./uploads",
		baseUrl: "/_emdash/api/media/file"
	})

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database,
			storage,
			plugins: [auditLogPlugin()],
			siteUrl: process.env.SITE_URL
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});