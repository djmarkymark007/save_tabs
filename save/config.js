document.getElementById("save_config").addEventListener("click", save);

function save() {
    ip = document.getElementById("server_ip")
    ip.value
    chrome.storage.local.set({"server_ip": ip.value}, result => {
    console.log("stored")
  })
  
  load_settings()
}

function removeAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function load_settings() {
    chrome.storage.local.get(["server_ip"], result => {
        server_ip = ""
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            server_ip = "localhost"
        }
        else {
            server_ip = result["server_ip"]
        }
        div = document.getElementById("current_server_ip")
        removeAllChildren(div)        
        ip = document.createElement("h2")
        ip.textContent = server_ip
        div.appendChild(ip)
        
    })
}

load_settings()