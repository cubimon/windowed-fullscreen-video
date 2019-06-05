if (!window.isInitialized) {
  console.log("initializing")
  window.isInitialized = true
  // Current state/if windowed fullscreen or not
  window.isFullscreen = false
  // We hide all top nodes by setting css style to "display:none"
  // So we remember the old css display attribute to undo fullscreen later
  window.oldDisplayPerNodeId = {}
  // We overwrite all style changes to video in windowed fullscreen mode, to enforce our style.
  // So we want to save the old style, but we don't want to see our own style changes
  window.videoIgnoreNextStyleChange = false
  // Video element to make fullscreen/show browser's default control elements
  window.video = undefined
  // Extra top level div, where video is stored in windowed fullscreen mode
  // Only that is not hidden in windowed fullscreen mode
  window.videoDiv = undefined
  // Observer to listen for controls/style attribute changes
  // to force/override/remember these attributes
  window.videoObserver = undefined
  // Old parent in dom before moving video element to video div
  window.videoOldParent = undefined
  // Old style attribute of video before windowed fullscreen mode
  window.videoOldStyle = undefined
  // Old controls attribute of video before windowed fullscreen mode
  window.videoOldControls = undefined

  nodeNamesToSkip = ["script", "style"].map((str) => str.toUpperCase())

  function fullscreen_elem(elem) {
    var bb = elem.getBoundingClientRect()
    elem.style.width = "100%"
    elem.style.height = "100%"
    elem.style.top = "0px"
    elem.style.left = "0px"
  }

  function undo_fullscreen_video() {
    if (!window.isFullscreen)
      return
    window.isFullscreen = false

    // display everything again
    for (var nodeId in window.oldDisplayPerNodeId) {
      var node = document.getElementById(nodeId);
      if (node == undefined)
        continue
      var oldDisplay = window.oldDisplayPerNodeId[nodeId]
      if (oldDisplay) {
        node.style.display = oldDisplay
      } else {
        node.style.removeProperty("display")
      }
    }
    window.oldDisplayPerNodeId = {}

    // move video to old position in dom
    window.video.style.cssText = window.videoOldStyle
    window.video.controls = window.videoOldControls
    window.videoOldParent.appendChild(window.video)
    window.video = undefined
    window.videoOldParent = undefined
    window.videoOldStyle = undefined
    window.videoOldControls = undefined

    // remove video div
    document.body.removeChild(window.videoDiv)
    window.videoDiv = undefined

    // remove observer
    window.videoObserver.disconnect()
    window.videoObserver = undefined
  }

  function fullscreen_video() {
    if (window.isFullscreen)
      return
    window.isFullscreen = true

    // find video
    window.video = document.querySelector("video")
    if (window.video == undefined) {
      alert("video not found")
      return
    }
    window.videoOldParent = window.video.parentElement
    window.videoOldStyle = window.video.style.cssText

    // hide everything except video div
    var index = 0
    for (var child of document.body.children) {
      if (nodeNamesToSkip.includes(child.nodeName))
        continue
      if (child.id == "") {
        child.id = "wfs" + index
        index += 1
      }
      window.oldDisplayPerNodeId[child.id] = child.style.display
      child.style.display = "None"
    }

    // create video div
    window.videoDiv = document.createElement("div")
    document.body.appendChild(window.videoDiv)
    window.videoDiv.appendChild(window.video)
    fullscreen_elem(window.videoDiv)
    fullscreen_elem(window.video)

    // set controls and listen for change, so controls are always displayed
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    window.videoObserver = new MutationObserver(function(mutations, observer) {
      if (!window.video.controls) {
        window.video.controls = true
      }
      for (mutation of mutations) {
        if (mutation.type == "attributes" && mutation.attributeName == "style") {
          if (window.videoIgnoreNextStyleChange) {
            window.videoIgnoreNextStyleChange = false
            return
          } else {
            window.videoOldStyle = window.video.style.cssText
            window.videoIgnoreNextStyleChange = true
            fullscreen_elem(window.video)
            return
          }
        }
      }
    })
    window.videoObserver.observe(window.video, {
      attributes: true
    })
    window.videoOldControls = window.video.controls
    window.video.controls = true
  }

  window.toggle_fullscreen = function() {
    if (!window.isFullscreen) {
      console.log("fullscreen")
      fullscreen_video()
    } else {
      console.log("undo fullscreen")
      undo_fullscreen_video()
    }
  }
}