let api;

if (typeof browser !== 'undefined') {
    api = browser;
} else if (typeof chrome !== 'undefined') {
    api = chrome;
} else {
    throw new Error('Neither browser nor chrome API is available. This extension cannot run in this environment.');
}


document.getElementById("save_config").addEventListener("click", save);

document.getElementById("debug").addEventListener("click", startDebug);
let debug = 0

function startDebug() {
    //TODO(Mark): maybe use the setting.js
    debug ? debug = 0 : debug = 1
    if (debug) {
        let node = add_child_node("clear", "clear_setting_storage", "button")
        node.addEventListener('click', clear_settings)
    } else {
        removeAllChildren("clear")
    }
}

import {
setting_names,
defualt_settings,
setting_styles,
clear_setting_values
} from "./settings.js"

function save() {
    //TODO(Mark): should this be validated?
    let settings = {} 
    let settings_nodes = []
    for (let i = 0; i < setting_names.length; i++) {
        let setting_name = setting_names[i]
        settings_nodes.push(document.getElementById(setting_name))
        let setting_value = settings_nodes[i].value
        if (setting_value === "") {
            continue
        }
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
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            add_nodes(defualt_settings, setting_styles)
        }
        else {
            let keys = Object.keys(result)
            for (let i = 0; i < setting_names.length; i++) {
                let value = setting_names[i]
                if (result[value] === "" || result[value] === undefined) {
                    clear_all_add_child_node("current_" + value, defualt_settings[value], setting_styles[i])
                }
                clear_all_add_child_node("current_" + value, result[value], setting_styles[i])
            }
        }
    })
}

function add_nodes(settings, styles) {
    let keys = Object.keys(settings)
    for (let i = 0; i < keys.length; i++) {
        let value = keys[i]
        clear_all_add_child_node("current_" + value, settings[value], styles[i])
    }
}

function add_child_node(parent, value, style) {
    let parent_node = document.getElementById(parent)
    let node = document.createElement(style)
    node.textContent = value
    parent_node.appendChild(node)
    return node
}

function clear_all_add_child_node(parent, value, style) {
    let parent_node = document.getElementById(parent)
    removeAllChildren(parent_node)
    let node = document.createElement(style)
    node.textContent = value
    parent_node.appendChild(node)
}


function clear_settings() {
    for (let value of setting_names) {
        api.storage.local.remove(value)
        let input = document.getElementById(value)
        input.value = ""
    }

    load_settings()
}

load_settings()