chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getCurrentTabUrl') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let activeTab = tabs[0];
        let activeTabURL = activeTab.url;
        sendResponse({ url: activeTabURL });
      });
      return true; // Keep the message channel open for sendResponse
    }
  });
  