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
	external: [],
	// Clean output directory before build
	clean: true,
	// Generate sourcemaps for debugging
	sourcemap: true,
});

