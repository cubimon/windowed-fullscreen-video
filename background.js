/*
 * Find video in current tab and make it fullscreen
 */
function makeCurrentTabVideoWindowedFullscreen() {
  browser.tabs.executeScript({
    file: "/video-maximizer.js"
  });
  browser.tabs.executeScript({
    code: "toggle_fullscreen()"
  });
}

browser.commands.onCommand.addListener(function(command) {
  if (command == "windowed-fullscreen") {
    makeCurrentTabVideoWindowedFullscreen()
  }
});

browser.browserAction.onClicked.addListener(makeCurrentTabVideoWindowedFullscreen)

