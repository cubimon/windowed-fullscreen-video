/*
 * Find video in current tab and make it fullscreen
 */
function makeCurrentTabVideoWindowedFullscreen() {
  browser.tabs.executeScript({
    file: "/video-maximizer.js"
  });
}

browser.browserAction.onClicked.addListener(makeCurrentTabVideoWindowedFullscreen);

