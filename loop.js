// ==UserScript==
// @name         YouTube Loop
// @namespace    kaloncpu57
// @version      0.7
// @description  Adds a loop option to the YouTube HTML5 player settings
// @author       kaloncpu57
// @match        http*://www.youtube.com/watch?*
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

function createMenuItem(/*type, */label, ariaChecked, func) {
    /*
  if (type == "checkbox") {

  } else if (type == "popup") {

  }
  */

    var menuitem = document.createElement("div");
    menuitem.setAttributes({
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

createMenuItem("Loop", document.querySelector("#player-api").querySelector("video").loop?"true":"false", function () {
    var vid = document.querySelector("#player-api").querySelector("video");
    if (this.getAttribute("aria-checked") == "true") {
        vid.loop = true;
    } else {
        vid.loop = false;
    }
});
