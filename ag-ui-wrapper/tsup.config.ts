import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["server.ts"],
	format: ["esm"],
	target: "node20",
	outDir: "dist",
	// Bundle all @repo/* workspace packages into the output
	// This is critical for Docker containers where workspace symlinks don't work
	noExternal: [/^@repo\/.*/],
	// Keep external dependencies that are installed in node_modules
	external: [
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

