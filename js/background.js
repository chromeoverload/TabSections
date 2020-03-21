// Copyleft 2020 Jared Butler

var markers = [];

//SETTINGS
var spawnNewSectionAtMarker = true;
//import * as chromeAsync from './node-modules/chrome-extension-async/chrome-extension-async.js';

function getBounds(tabs) {
    var bounds = [0, Object.keys(tabs).length - 1]
    var foundTab = false;

    for(var i = 0; i < tabs.length; i++) {
        if(!foundTab) {
            foundTab = tabs[i].active;
            if(markers.includes(tabs[i].id)) {
                bounds[0] = i;
            }
        }
        if(foundTab && markers.includes(tabs[i].id)) {
            bounds[1] = i;
            break;
        }
    }

    return bounds;
}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) { //garbage collecting
    if(markers.includes(tabId)) {
        markers.splice(markers.indexOf(tabId), 1);
        //console.log(tabId);
    }
});

chrome.tabs.onCreated.addListener(function(tab) { //new tabs added to relevant section
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        var bounds = getBounds(tabs);

        //chrome.tabs.move(tab.id, { index: tabs[bounds[1] - 1].index});
    });
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'create-divider-left') {
        chrome.tabs.query({currentWindow: true, active: true }, function (tabs) {
            if(markers.includes(tabs[0].id) && spawnNewSectionAtMarker) { //if this works CONSISTENTLY, the marker tracker works!
                chrome.tabs.create({index: (tabs[0].index), active: true, pinned: false}); //new tab
                chrome.tabs.create({index: (tabs[0].index), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //left border
            } else if (tabs[0].index === 0) {
                chrome.tabs.create({index: (tabs[0].index), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //left border
                chrome.tabs.create({index: (tabs[0].index), active: true, pinned: false}); //new tab
            } else {
                chrome.tabs.create({index: (tabs[0].index), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                });
            }
        });
    } else if (command == 'delete-section') {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            var bounds = getBounds(tabs);

            for(var i = bounds[0]; i <= bounds[1]; i++) {
                chrome.tabs.remove(tabs[i].id);
            }
        });
    } else { //create-divider-right
        //TAB LENGTH LOGIC (necessary??)
        var numTabs = -1;
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            numTabs += Object.keys(tabs).length;
        });

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) { //create-divider-right
            if(markers.includes(tabs[0].id) && spawnNewSectionAtMarker) { //if this works CONSISTENTLY, the marker tracker works!
                chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //right border
                chrome.tabs.create({index: (tabs[0].index + 1), active: true, pinned: false}); //new tab
            } else if (tabs[0].index == (numTabs)) {
              	chrome.tabs.create({index: (tabs[0].index + 1), active: true, pinned: false}); //new tab
                chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //left border
            } else {
                chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', active:false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                });
            }
        });
    }
});
