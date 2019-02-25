(function() {
  var div = undefined;

  function fullscreen_elem(elem) {
    var bb = elem.getBoundingClientRect();
    elem.style.width = `${document.documentElement.clientWidth}px`;
    elem.style.height = `${document.documentElement.clientHeight}px`;
    elem.style.top = `-${bb.y}px`;
    elem.style.left =`-${bb.x}px`;
  }

  function fullscreen_video() {
    var video = document.querySelector("video");
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


