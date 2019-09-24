/*
 * Find video in current tab and toggle fullscreen
 */
function toggleWindowedFullscreen() {
  browser.tabs.executeScript({
    file: "/video-maximizer.js"
  }).then(() => {
    // on success toggle fullscreen
    browser.tabs.executeScript({
      code: "toggle_fullscreen()"
    })
  }, (error) => {
    console.log(`error: ${error}`)
  })
}

browser.commands.onCommand.addListener(function(command) {
  if (command == "windowed-fullscreen") {
    toggleWindowedFullscreen()
  }
})

browser.browserAction.onClicked.addListener(toggleWindowedFullscreen)
