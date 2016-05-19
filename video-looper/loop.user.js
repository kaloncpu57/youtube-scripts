// ==UserScript==
// @name         YouTube Loop
// @namespace    kaloncpu57
// @version      0.8.7
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

function styleSheet() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  return style.sheet;
}

CSSStyleSheet.prototype.makeRule = function (selector, rules, index) {
	if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) {
		sheet.addRule(selector, rules, index);
	}
};

var sheet = styleSheet();
var notifier = document.createElement("div");
notifier.setAttribute("class", "loop-notification");
notifier.appendChild(document.createElement("span"));
notifier.children[0].setAttribute("class", "yt-valign");
notifier.children[0].appendChild(document.createElement("span"));
notifier.children[0].children[0].id = "loop-notification-text";
notifier.style.height = "0";
document.querySelector("#yt-masthead").appendChild(notifier);
sheet.makeRule(".loop-notification", "background: red;position: absolute;top: 50px;right: 30px;padding: 0 10px;color: white;font-weight: 500;transition: height 0.3s linear 0.1s;height: 30px;overflow: hidden;word-wrap: normal;white-space: nowrap;", 0);

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
              if (window.loopNotifyTimer) {
                clearTimeout(window.loopNotifyTimer);
              }
              notifier.style.height = "0";
              notifier.querySelector("#loop-notification-text").textContent = "Video Loop " + (document.querySelector("#movie_player").querySelector("video").loop?"On":"Off");
              notifier.style.height = "30px";
              window.loopNotifyTimer = setTimeout(function () {notifier.style.height = "0";}, 2000);
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
        ariaChecked: document.querySelector("#movie_player").querySelector("video").loop?"true":"false",
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
