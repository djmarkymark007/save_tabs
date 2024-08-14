document.getElementById('saveButton').addEventListener('click', saveTabs);
document.getElementById('loadButton').addEventListener('click', loadTabs);

function saveTabs() {
  const browserAPI = chrome || browser;
  browserAPI.tabs.query({}, function(tabs) {
    const urls = tabs.map(tab => tab.url);
    browserAPI.storage.local.set({ savedTabs: urls }, function() {
      console.log('Tabs saved');
    });
  });
}

function loadTabs() {
  const browserAPI = chrome || browser;
  browserAPI.storage.local.get(['savedTabs'], function(result) {
    if (result.savedTabs) {
      result.savedTabs.forEach(url => {
        browserAPI.tabs.create({ url: url });
      });
    }
  });
}
