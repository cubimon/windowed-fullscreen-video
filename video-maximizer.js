if (!window.isInitialized) {
  console.log("initializing")
  window.isInitialized = true
  window.isFullscreen = false
  window.oldDisplayPerNodeId = {}
  window.video = undefined
  window.videoDiv = undefined
  window.videoObserver = undefined
  window.videoOldStyle = undefined
  window.videoOldParent = undefined

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
    window.videoOldParent.appendChild(window.video)
    window.video = undefined
    window.videoOldParent = undefined
    window.videoOldStyle = undefined

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
    })
    window.videoObserver.observe(window.video, {
      attributes: true
    })
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