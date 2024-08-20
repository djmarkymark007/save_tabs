/*
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

*/


const API_BASE_URL = 'http://localhost/';

document.getElementById('saveButton').addEventListener('click', saveTabs);
document.getElementById('loadButton').addEventListener('click', loadTabs);


//TODO(Mark): put this with a check to the server status 
//TODO(Mark): have server refresh button that check the server status again
document.getElementById('changeIcon').addEventListener('click', changeIcon);
let isDefaultIcon = true;
async function changeIcon() {
  isDefaultIcon = !isDefaultIcon;
  chrome.action.setIcon({
    path: {
      96: isDefaultIcon ? "assets/ok.png" : "assets/fail.png"
    }
  });
};

async function saveTabs() {
  console.log("starting")
  const browserAPI = chrome || browser;
  const status = document.getElementById('status');
  status.textContent = 'Saving tabs...';
  
  try {
    /*
    console.log("Starting to save tabs...");
    
    const tabs = await new Promise((resolve, reject) => {
      browserAPI.tabs.query({}, (tabs) => {
        if (browserAPI.runtime.lastError) {
          reject(new Error(browserAPI.runtime.lastError.message));
        } else {
          resolve(tabs);
        }
      });
    });
    
    console.log("Tabs retrieved:", tabs);
    
    if (!tabs || tabs.length === 0) {
      throw new Error("No tabs retrieved");
    }

    const tabData = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));

    console.log("Tab data processed:", tabData);
    status.textContent = 'Tabs saved successfully!';
    */
    console.log("hi")
    const tabs = await new Promise(resolve => browserAPI.tabs.query({}, resolve));
    const tabData = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));
    
    console.log("wow")
    //const response = await fetch(`${API_BASE_URL}/save-tabs`, {
    const response = await fetch(`http://localhost:8080/save-tabs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tabs: tabData }),
    });
    
    if (!response.ok) {
      throw new Error('Server response was not ok.');
    }
    
    const result = await response.json();
    status.textContent = `Tabs saved successfully! ID: ${result.id}`;
  } catch (error) {
    console.error('Error saving tabs:', error);
    status.textContent = 'Error saving tabs. Please try again.';
  }
}

async function loadTabs() {
  const browserAPI = chrome || browser;
  const status = document.getElementById('status');
  status.textContent = 'Loading tabs...';
  try {
    const response = await fetch(`http://localhost:8080/save-tabs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Server response was not ok.');
    }
    
    const result = await response.json();
    if (result.tabs && result.tabs.length > 0) {
      result.tabs.forEach(tab => {
        browserAPI.tabs.create({ url: tab.url });
      });
      status.textContent = 'Tabs loaded successfully!';
    } else {
      status.textContent = 'No saved tabs found.';
    }
  } catch (error) {
    console.error('Error loading tabs:', error);
    status.textContent = 'Error loading tabs. Please try again.';
  }
}