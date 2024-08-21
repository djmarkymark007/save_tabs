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


// startup 
chrome.runtime.onStartup.addListener(() => {
  // Your code here
  console.log("Browser started!");
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    // A window has come into focus
    console.log("Window focused:", windowId);
    // Your code here
  }
});

let button_names = [];
let num_buttons = 0;

async function render() {
  // do i like this
  chrome.storage.local.get(["button_names", "num_buttons"], result => {
    console.log(result)
    const status = document.getElementById('status');
    status.textContent = "clicked"
    button_names = result["button_names"]
    console.log(result)
    console.log(result["num_buttons"])
    console.log(typeof result["num_buttons"])

    num_buttons = result["num_buttons"]

    for (tag_name of result["button_names"]) {
      status.textContent = "button"
      box = document.getElementById('tag-contanier')    
      div = document.createElement('div')
      div.classList.add('inner')
      newButton = document.createElement('button')
      newButton.textContent = tag_name 
      div.appendChild(newButton)
      box.appendChild(div)
    }
  })
};

document.getElementById("clear").addEventListener('click', clearStorage)
function clearStorage() {
  chrome.storage.local.set({"button_names": [], "num_buttons": 0})
  button_names = []
  num_buttons = 0
}


document.getElementById('add').addEventListener('click', add);


async function add() {
  box = document.getElementById('tag-contanier')
  tag_name = document.getElementById("tag_input")
  div = document.createElement('div')
  div.classList.add('inner')
  newButton = document.createElement('button')
  button_names.push(num_buttons + ') ' + tag_name.value)
  newButton.textContent = num_buttons + ") " + tag_name.value
  div.appendChild(newButton)
  box.appendChild(div)
  num_buttons += 1
  chrome.storage.local.set({"button_names": button_names, "num_buttons": num_buttons}, result => {
    console.log("stored")
  })
}

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

render();