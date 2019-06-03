/*
 * Find video in current tab and toggle fullscreen
 */
function toggleWindowedFullscreen() {
  browser.tabs.executeScript({
    file: "/video-maximizer.js"
  });
  browser.tabs.executeScript({
    code: "toggle_fullscreen()"
  });
}

browser.commands.onCommand.addListener(function(command) {
  if (command == "windowed-fullscreen") {
    toggleWindowedFullscreen()
  }
});

browser.browserAction.onClicked.addListener(toggleWindowedFullscreen)
