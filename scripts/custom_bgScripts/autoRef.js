// auto refresh
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install" || details.reason == "update") {
        // Function to refresh all tabs
        function refreshAllTabs() {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.reload(tab.id);
                });
            });
        }

        // Refresh all tabs when extension is refreshed
        refreshAllTabs();
    }
});