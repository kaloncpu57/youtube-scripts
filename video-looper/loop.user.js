// ==UserScript==
// @name         YouTube Loop
// @namespace    kaloncpu57
// @version      0.8.6
// @updateURL    http://kaloncpu57.github.io/youtube-scripts/video-looper/loop.user.js
// @description  Adds a loop option to the YouTube HTML5 player settings
// @author       kaloncpu57
// @match        http*://www.youtube.com/*
// @grant        none
// ==/UserScript==

Element.prototype.setAttributes = function (attrs) {
    for (var idx in attrs) {
        if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
            for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
        } else if (idx === 'html') {
            this.innerHTML = attrs[idx];
        } else {
            this.setAttribute(idx, attrs[idx]);
        }
    }
};

Element.prototype.hasClass = function (str) {
    var attr = this.getAttribute("class");
    if (typeof attr == "undefined" || attr === "" || attr === null) {
        return false;
    }
    var classes = attr.split(" ");
    if (classes.indexOf(str) != -1) {
        return true;
    } else {
        return false;
    }
};

function checkCtrlAlt(obj, ctrl, alt) {
  if ((obj.ctrl && !ctrl) || (obj.alt && !alt) || (!obj.ctrl && ctrl) || (!obj.alt && alt)) {
    return false;
  }
  return true;
}

function createMenuItem(opt) {
    var id = "custom-menu-item-" + opt.label.toLowerCase();
    if (!document.getElementById(id)) {
        var menuitem = document.createElement("div");
        menuitem.setAttributes({
            "id": id,
            "class": "ytp-menuitem",
            "role": "menuitemcheckbox",
            "tabindex": "39",
            "aria-checked": opt.ariaChecked,
            "html": "<div class='ytp-menuitem-label'>" + opt.label + "</div><div class='ytp-menuitem-content'><div class='ytp-menuitem-toggle-checkbox'></div></div>"
        });
        var temp = opt.func.toString();
        temp = temp.substring(temp.indexOf('{')+1,temp.lastIndexOf('}'));
        func = new Function('"true"==this.getAttribute("aria-checked")?this.setAttribute("aria-checked","false"):this.setAttribute("aria-checked","true");' + temp);
        menuitem.addEventListener("click", func);
        if (opt.hotkey) {
          window.addEventListener("keydown", function (e) {
            if (checkCtrlAlt(opt.hotkey, e.ctrlKey, e.altKey) && e.keyCode == opt.hotkey.keycode) {
              menuitem.click();
            }
          });
        }
        document.querySelector("#ytp-main-menu-id").appendChild(menuitem);
    }
}

function addLoop() {
    createMenuItem(
      {
        label: "Loop",
        ariaChecked: document.querySelector("#player-api").querySelector("video").loop?"true":"false",
        hotkey: {ctrl: true, alt: true, keycode: 76},
        func: function () {
          var vid = document.querySelector("#movie_player").querySelector("video");
          var loopends = document.querySelectorAll(".loop-end");
          if (this.getAttribute("aria-checked") == "true") {
              vid.loop = true;
              for (var i = 0; i < loopends.length; i++) {
                  loopends[i].style.display = "block";
              }
          } else {
              vid.loop = false;
              for (var i = 0; i < loopends.length; i++) {
                  loopends[i].style.display = "none";
              }
          }
      }
    }
  );
}

document.body.addEventListener("transitionend", function (e) {
    if (e.target.hasClass("ytp-player-content")) {
        return false;
    }
    addLoop();
});
