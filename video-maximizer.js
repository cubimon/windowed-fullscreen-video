(function() {
  var div = undefined;

  function fullscreen_elem(elem) {
    var bb = elem.getBoundingClientRect();
    elem.style.width = "100%";
    elem.style.height = "100%";
    elem.style.top = "0px";
    elem.style.left = "0px";
  }

  function fullscreen_video() {
    var video = document.querySelector("video");
    if (video == undefined) {
      alert("video not found");
      return;
    }
    if (div != undefined) {
      return;
    }
    for (var child of document.body.children) {
      child.style.display = "None";
    }

    // create env
    div = document.createElement("div");
    document.body.appendChild(div);
    div.appendChild(video);
    fullscreen_elem(div);
    fullscreen_elem(video);

    // set controls and listen for change,
    // so controls are always displayed
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
      if (!video.controls) {
        video.controls = true;
      }
    });
    observer.observe(video, {
      attributes: true
    });
    video.controls = true;
  }

  fullscreen_video();
})();


