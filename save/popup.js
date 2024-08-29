let api;

if (typeof browser !== 'undefined') {
    api = browser;
} else if (typeof chrome !== 'undefined') {
    api = chrome;
} else {
    throw new Error('Neither browser nor chrome API is available. This extension cannot run in this environment.');
}


/* TODO(Mark): keep this. this is the local version allow switching between local and server
   should this be default?

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

import {
  setting_names,
  defualt_settings,
  default_server_ip,
  default_server_port
} from "./settings.js"

let server_ip = default_server_ip 
let server_port = default_server_port
function load_settings() {
  api.storage.local.get(["server_ip", "server_port"], result => {
      if (Object.keys(result).length !== 0 || result.constructor === Object) {
        if (result["server_ip"] !== undefined && result["server_ip"] !== "") {
          server_ip = result["server_ip"]
        }
        if (result["server_port"] !== undefined && result["server_port"] !== "") {
          server_port = result["server_port"]
        }
      }
  })
}


document.getElementById('saveButton').addEventListener('click', saveTabs);
document.getElementById('loadButton').addEventListener('click', loadTabs);

let button_names = [];
let num_buttons = 0;

function render() {
  // do i like this
  try {
    api.storage.local.get(["button_names", "num_buttons"], result => {
      console.log(Object.keys(result))
      console.log(Object.keys(result).length)
      if (Object.keys(result).length === 0 && result.constructor === Object) {
        button_names = []
        num_buttons = 0
      }
      else {
        console.log(result)
        const status = document.getElementById('status');
        status.textContent = "clicked"
        button_names = result["button_names"]
        console.log(result)
        console.log(result["num_buttons"])
        console.log(typeof result["num_buttons"])

        num_buttons = result["num_buttons"]

        for (let tag_name of result["button_names"]) {
          status.textContent = "button"
          let box = document.getElementById('tag-contanier')    
          let div = document.createElement('div')
          div.classList.add('inner')
          let newButton = document.createElement('button')
          newButton.textContent = tag_name 
          div.appendChild(newButton)
          box.appendChild(div)
        }
      }
    })
  }
  catch (error) {
    button_names = []
    num_buttons = 0
  }

};

document.getElementById("clear").addEventListener('click', clearStorage)
function clearStorage() {
  api.storage.local.set({"button_names": [], "num_buttons": 0})
  button_names = []
  num_buttons = 0
}


document.getElementById('add').addEventListener('click', add);


async function add() {
  let box = document.getElementById('tag-contanier')
  let tag_name = document.getElementById("tag_input")
  let div = document.createElement('div')
  div.classList.add('inner')
  let newButton = document.createElement('button')
  button_names.push(num_buttons + ') ' + tag_name.value)
  newButton.textContent = num_buttons + ") " + tag_name.value
  div.appendChild(newButton)
  box.appendChild(div)
  num_buttons += 1
  api.storage.local.set({"button_names": button_names, "num_buttons": num_buttons}, result => {
    console.log("stored")
  })
}

//TODO(Mark): put this with a check to the server status 
//TODO(Mark): have server refresh button that check the server status again
document.getElementById('changeIcon').addEventListener('click', changeIcon);
let isDefaultIcon = true;
async function changeIcon() {
  isDefaultIcon = !isDefaultIcon;
  api.action.setIcon({
    path: {
      96: isDefaultIcon ? "assets/ok.png" : "assets/fail.png"
    }
  });
};

async function saveTabs() {
  console.log("starting")
  const status = document.getElementById('status');
  status.textContent = 'Saving tabs...';
  
  try {
    /*
    console.log("Starting to save tabs...");
    
    const tabs = await new Promise((resolve, reject) => {
      api.tabs.query({}, (tabs) => {
        if (api.runtime.lastError) {
          reject(new Error(api.runtime.lastError.message));
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
    const tabs = await new Promise(resolve => api.tabs.query({}, resolve));
    const tabData = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));
    
    console.log("wow")
    //const response = await fetch(`${API_BASE_URL}/save-tabs`, {
    const response = await fetch(`http://${server_ip}:${server_port}/save-tabs`, {
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
  const status = document.getElementById('status');
  status.textContent = 'Loading tabs...';
  console.log(default_server_ip)
  console.log(default_server_port)
  console.log(server_ip)
  console.log(server_port)
  console.log(`http://${server_ip}:${server_port}/save-tabs`)
  try {
    const response = await fetch(`http://${server_ip}:${server_port}/save-tabs`, {
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
        api.tabs.create({ url: tab.url });
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

load_settings();
render();

