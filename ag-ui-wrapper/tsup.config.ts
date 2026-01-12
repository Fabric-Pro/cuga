import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["server.ts"],
	format: ["esm"],
	target: "node20",
	outDir: "dist",
	// Bundle most @repo/* workspace packages into the output
	// This is critical for Docker containers where workspace symlinks don't work
	// EXCEPTION: @repo/database and @repo/ai are excluded to keep agents stateless and database-agnostic
	noExternal: [
		/^@repo\/agent-core$/,
		/^@repo\/agent-types$/,
		/^@repo\/agent-tools$/,
		/^@repo\/agent-prompts$/,
		/^@repo\/agent-runtime$/,
		/^@repo\/ai-token$/,
		/^@repo\/utils$/,
		/^@repo\/logs$/,
		// Small utility packages that should be bundled
		"uuid",
		"zod",
		// Hono web framework - bundle to avoid node_modules dependency
		"hono",
		"@hono/node-server",
	],
	// Keep these packages external - they're installed in node_modules or not used by agents
	external: [
		// Database packages - agents should be stateless and database-agnostic
		"@repo/database",
		// AI package has database imports for dynamic model selection
		"@repo/ai",
		// Template engines that use dynamic require() - must be external
		"nunjucks",
		"handlebars",
		"mustache",
		"liquidjs",
		// Database packages that use dynamic require() - must be external
		"pg",
		"@prisma/adapter-pg",
		"@prisma/client",
		// Node.js built-in modules that may be dynamically required by bundled dependencies
		"events",
		"stream",
		"util",
		"path",
		"fs",
		"buffer",
		"url",
		"querystring",
	],
	// Clean output directory before build
	clean: true,
	// Generate sourcemaps for debugging
	sourcemap: true,
});

