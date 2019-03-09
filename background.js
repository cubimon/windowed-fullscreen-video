/*
 * Find video in current tab and make it fullscreen
 */
function makeCurrentTabVideoWindowedFullscreen() {
  browser.tabs.executeScript({
    file: "/video-maximizer.js"
  });
}

browser.commands.onCommand.addListener(function(command) {
  if (command == "windowed-fullscreen") {
    makeCurrentTabVideoWindowedFullscreen();
  }
});

browser.browserAction.onClicked.addListener(makeCurrentTabVideoWindowedFullscreen);

