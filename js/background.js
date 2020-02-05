// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    // Sort tabs according to their index in the window.
    tabs.sort((a, b) => { return a.index < b.index; });
    let activeIndex = tabs.findIndex((tab) => { return tab.active; });
    let lastTab = tabs.length - 1;
    let newIndex = -1;
    if (command === 'flip-tabs-forward')
      newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
    else  // 'flip-tabs-backwards'
      newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;
    chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
  });
});*/

//CREATE LIST OF TAB IDS create-divider-right/left chrome.tabs.create({index: (chrome.tabs.getCurrent().index - 1), pinned: true});

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'create-divider-left') {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.create({index: (tabs[0].index - 1), url: 'index.html', pinned: false}); //note to self: can't mixed pinned tabs :( make them unclosable?
        });
        //chrome.tabs.create({index: (chrome.tabs.getCurrent().index - 1), pinned: false});
    } else { //create-divider-right
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.create({index: (tabs[0].index + 1), url: 'index.html', pinned: false});
        });
    }
});
