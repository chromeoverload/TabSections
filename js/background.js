// Copyleft 2020 Jared Butler

var markers = [];
//var sections = [];

//SETTINGS
var spawnNewSectionAtMarker = true;

function cleanSections() {

}

function getLeftNeighbor() {

}

function getRightNeighbor() {

}

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) { //garbage collecting
    if(markers.includes(tabId)) {
        markers.splice(markers.indexOf(tabId), 1);
        //console.log(tabId);
    }
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
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {

        });
    } else {
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
