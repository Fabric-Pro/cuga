import "../symbol.dispose.polyfill";
import log from "loglevel";
import logPrefix from "loglevel-plugin-prefix";
import type { Module } from "runtime";
import { FrameMarkElementsModule } from "../content/frame.mark.elements";
import { DOMTreeModule } from "../content/page_analysis/dom_tree_module";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,

	main() {
		console.log("Hello content.");
		logPrefix.reg(log);
		logPrefix.apply(log, { template: "[%t] %l %n:" });
		log.enableAll();

		const modules: Module[] = [
			new FrameMarkElementsModule(),
			new DOMTreeModule(),
		];

		for (const module of modules) module.start();
	},
});
