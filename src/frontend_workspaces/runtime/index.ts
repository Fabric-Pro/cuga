export * from "./commands";
export * from "./functions";
export * from "./responses";
export interface Module {
	start(): void;
	stop(): void;
}
