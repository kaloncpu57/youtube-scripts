// ==UserScript==
// @name         YouTube Loop
// @namespace    kaloncpu57
// @version      0.85
// @updateURL    https://raw.githubusercontent.com/kaloncpu57/youtube-scripts/master/loop.js
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
    if (typeof attr == "undefined" || attr == "" || attr == null) {
        return false;
    }
    var classes = attr.split(" ");
    if (classes.indexOf(str) != -1) {
        return true;
    } else {
        return false;
    }
}

function createMenuItem(/*type, */label, ariaChecked, func) {
    /*
    if (type == "checkbox") {
        //
    } else if (type == "popup") {
        //
    }
    */
    var id = "custom-menu-item-" + label.toLowerCase();
    if (!document.getElementById(id)) {
        var menuitem = document.createElement("div");
        menuitem.setAttributes({
            "id": id,
            "class": "ytp-menuitem",
            "role": "menuitemcheckbox",
            "tabindex": "39",
            "aria-checked": ariaChecked,
            "html": "<div class='ytp-menuitem-label'>" + label + "</div><div class='ytp-menuitem-content'><div class='ytp-menuitem-toggle-checkbox'></div></div>"
        });
        var temp = func.toString();
        temp = temp.substring(temp.indexOf('{')+1,temp.lastIndexOf('}'));
        func = new Function('"true"==this.getAttribute("aria-checked")?this.setAttribute("aria-checked","false"):this.setAttribute("aria-checked","true");' + temp);
        menuitem.addEventListener("click", func);
        document.querySelector("#ytp-main-menu-id").appendChild(menuitem);
    }
}

function addLoop() {
    createMenuItem("Loop", document.querySelector("#player-api").querySelector("video").loop?"true":"false", function () {
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
    });
}

function loopbar() {
    if (document.querySelector(".loop-bar")) {
        return false;
    }
    var style = document.createElement("style");
    style.innerText = ".loop-end {height: 13px;width: 5px;background-color: #00D0DA;margin-left:-6.5px;border-radius: 6.5px;cursor: pointer;position: absolute;top: -5px;z-index: 45;display: none;}";
    document.head.appendChild(style);
    window.loopbar = {},
        progressbar = document.querySelector(".ytp-progress-bar-container"),
        parent = progressbar.parentElement;
    loopbar.element = document.createElement("div");
    loopbar.element.setAttributes({
        "class": "loop-bar"
    });
    parent.replaceChild(loopbar.element, progressbar);
    loopbar.element.appendChild(progressbar);
    var leftend = document.createElement("div"),
        rightend = document.createElement("div");
    leftend.setAttributes({
        "class": "loop-end",
        "style": "border-top-right-radius: 0px;border-bottom-right-radius: 0px;left: 1px;"
    });
    rightend.setAttributes({
        "class": "loop-end",
        "style": "border-top-left-radius: 0px;border-bottom-left-radius: 0px;right: -6px;"
    });
    leftend.addEventListener("mousedown", function () {
        loopbar.dragging = this;
        window.addEventListener("mousemove", loopendDrag, true);
    }, false);
    window.addEventListener("mouseup", function () {
        window.removeEventListener("mousemove", loopendDrag, true);
        loopbar.dragging = void(0);
    }, false);
    loopbar.element.appendChild(leftend);
    loopbar.element.appendChild(rightend);
    var rect = loopbar.element.getBoundingClientRect();
}

function loopendDrag(e) {
    if (!loopbar.dragging) {
        return false;
    }
    console.log(e);
    var left = parseInt(loopbar.dragging.style.left, 10);
    loopbar.dragging.style.left = (left + e.movementX) + "px";
}

//addLoop();
//loopbar();

document.body.addEventListener("transitionend", function (e) {
    //console.log(e.target);
    if (e.target.hasClass("ytp-player-content")) {
        return false;
    }
    addLoop();
    loopbar();
});

/*
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName == "src") {
            addLoop();
            loopbar();
        }
    });
});
observer.observe(document.querySelector("#movie_player").querySelector("video"), {attributes: true});
*/
