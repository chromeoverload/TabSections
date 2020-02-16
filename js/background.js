// Copyleft 2020 Jared Butler

var markers = [];
//var sections = [];

//SETTINGS
var spawnNewSectionAtMarker = true;

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) { //garbage collecting
    if(markers.includes(tabId)) {
        markers.splice(markers.indexOf(tabId), 1);
        //console.log(tabId);
    }
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'create-divider-left') {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            if(markers.includes(tabs[0].id) && spawnNewSectionAtMarker) { //if this works CONSISTENTLY, the marker tracker works!
                chrome.tabs.create({index: (tabs[0].index), active: true, pinned: false}); //new tab
                chrome.tabs.create({index: (tabs[0].index), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //left border
            } else {
                chrome.tabs.create({index: (tabs[0].index), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                });
            }
        });
    } else { //create-divider-right
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            if(markers.includes(tabs[0].id) && spawnNewSectionAtMarker) { //if this works CONSISTENTLY, the marker tracker works!
                chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', active: false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                }); //right border
                chrome.tabs.create({index: (tabs[0].index + 1), active: true, pinned: false}); //new tab
            } else {
                chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', active:false, pinned: false}, function(tab) {
                    markers.push(tab.id);
                });
            }
        });
    }
});
