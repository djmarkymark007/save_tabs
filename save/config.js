let api;

if (typeof browser !== 'undefined') {
    api = browser;
} else if (typeof chrome !== 'undefined') {
    api = chrome;
} else {
    throw new Error('Neither browser nor chrome API is available. This extension cannot run in this environment.');
}


document.getElementById("save_config").addEventListener("click", save);

const debug = 1
let setting_names = ["server_ip", "server_port"]
let defualt_settings = {"server_ip": "localhost", "server_port": "8080"}
let setting_styles = ["h2", "h2"]
let clear_setting_values = ["", ""]

function save() {
    //TODO(Mark): should this be validated?
    let settings = {} 
    let settings_nodes = []
    for (i = 0; i < setting_names.length; i++) {
        let setting_name = setting_names[i]
        settings_nodes.push(document.getElementById(setting_name))
        settings[setting_name] = settings_nodes[i].value
    }
    api.storage.local.set(settings, result => {
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
    api.storage.local.get(setting_names, result => {
        server_ip = ""
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            add_nodes(defualt_settings, setting_styles)
        }
        else {
            add_nodes(result, setting_styles)
        }
        /*
        div = document.getElementById("current_server_ip")
        removeAllChildren(div)        
        ip = document.createElement("h2")
        ip.textContent = server_ip
        div.appendChild(ip)
        */
        
    })
}

function add_nodes(settings, styles) {
    keys = Object.keys(settings)
    for (let i = 0; i < keys.length; i++) {
        value = keys[i]
        clear_all_add_child_node("current_" + value, settings[value], styles[i])
    }
}

function add_child_node(parent, value, style) {
    parent_node = document.getElementById(parent)
    node = document.createElement(style)
    node.textContent = value
    parent_node.appendChild(node)
    return node
}

function clear_all_add_child_node(parent, value, style) {
    parent_node = document.getElementById(parent)
    removeAllChildren(parent_node)
    node = document.createElement(style)
    node.textContent = value
    parent_node.appendChild(node)
}

if (debug) {
    node = add_child_node("clear", "clear_setting_storage", "button")
    node.addEventListener('click', clear_settings)
}

function clear_settings() {
    for (value of setting_names) {
        api.storage.local.remove(value)
    }
    load_settings()
}

load_settings()