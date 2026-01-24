chrome.runtime.onInstalled.addListener((details) => {
	console.log("Installed");
	chrome.sidePanel
		.setPanelBehavior({ openPanelOnActionClick: true })
		.catch((error) => console.error(error));
});
