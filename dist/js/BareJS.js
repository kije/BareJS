// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
"use strict";
var BareJS = (function () {
    function BareJS() {
        "use strict";
        throw new Error('BareJS can\'t not be instantiated!');
    }
    /**
     * Get the Javascript version number
     * @returns {number}
     */
    BareJS.getJavascriptVersion = function () {
        "use strict";
        if (BareJS.info.javascriptVersion == null) {
            var jsv = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0"];
            var d = document;
            for (var _i = 0, jsv_1 = jsv; _i < jsv_1.length; _i++) {
                var version = jsv_1[_i];
                var g = d.createElement('script'), s = BareJS.one('script');
                g.setAttribute("language", "JavaScript" + version);
                g.nodeValue = "window.javascriptVersion=parseFloat('" + version + "');";
                s.parentNode.insertBefore(g, s);
                s.parentNode.removeChild(g);
            }
            BareJS.info.javascriptVersion = window.javascriptVersion;
            delete window.javascriptVersion;
        }
        return BareJS.info.javascriptVersion;
    };
    /**
     * Activates the $ shortcut
     * @param {boolean} force if set to true, overrides the $ shortcut, even if it is already set (e.g. by another library like jQuery, etc...)
     * @returns {boolean} returns true if the shortcut is activated
     */
    BareJS.enableShortcut = function (force) {
        "use strict";
        if (force === void 0) { force = false; }
        if (typeof window.$ == "undefined" || force) {
            window.$ = BareJS.one;
            window.$$ = BareJS.all;
            BareJS.info.shortcutEnabled = (window.$ == BareJS.one) && (window.$$ == BareJS.all);
        }
        return BareJS.info.shortcutEnabled;
    };
    /**
     * Adds prototypes to some objects (e.g. addClass etc... on Element)
     * @returns {boolean}
     */
    BareJS.enablePrototypes = function () {
        "use strict";
        Element.prototype.addClass = function (clazz) {
            BareJS.addClass(clazz, this);
        };
        Element.prototype.removeClass = function (clazz) {
            BareJS.removeClass(clazz, this);
        };
        Element.prototype.toggleClass = function (clazz, force) {
            if (force === void 0) { force = false; }
            BareJS.toggleClass(clazz, this, force);
        };
        Element.prototype.hasClass = function (clazz) {
            return BareJS.hasClass(clazz, this);
        };
        // todo add Node.getElement and Node.getElements
        // todo add addClass etc... to NodeList etc...
        return BareJS.info.prototypesEnabled = true;
    };
    /**
     *
     * @param {string} selector
     * @param {Element|Document} context
     * @returns {NodeList}
     */
    BareJS.all = function (selector, context) {
        "use strict";
        if (context === void 0) { context = document; }
        return context.querySelectorAll(selector);
    };
    /**
     *
     * @param {string} selector
     * @returns {boolean}
     */
    BareJS.isSimpleSelector = function (selector) {
        "use strict";
        // check, if selector is simple (e.g. only contains an id or a tag name)
        return (selector.trim().indexOf(" ", 1) === -1 &&
            selector.indexOf("[", 1) === -1 &&
            selector.indexOf(":", 1) === -1 &&
            selector.indexOf("*", 1) === -1 &&
            selector.indexOf("#", 1) === -1 &&
            selector.indexOf(".", 1) === -1);
    };
    /**
     *
     * @param {string} selector
     * @param {Element|Document} context
     * @returns {Element}
     */
    BareJS.one = function (selector, context) {
        "use strict";
        if (context === void 0) { context = document; }
        selector = selector.trim();
        if (BareJS.isSimpleSelector(selector)) {
            var firstCharacter = selector.substr(0, 1);
            if (firstCharacter === "#" && context == document) {
                return context.getElementById(selector.substr(1));
            }
            else if (firstCharacter === ".") {
                var results = context.getElementsByClassName(selector.substr(1));
                return results.length > 0 ? results[0] : null;
            }
            else if (["[", ":", "*"].indexOf(firstCharacter) === -1) {
                var results = context.getElementsByTagName(selector);
                return results.length > 0 ? results[0] : null;
            }
        }
        return context.querySelector(selector);
    };
    /**
     * @callback BareJs~iterateCallback
     * @param value
     * @param {number} index
     * @returns {boolean}
     */
    /**
     * Loops through an array and calls the provided callback function for every element
     * @param iterable
     * @param {BareJS~iterateCallback} cb
     */
    BareJS.each = function (iterable, cb) {
        "use strict";
        var i = 0;
        for (var _i = 0, iterable_1 = iterable; _i < iterable_1.length; _i++) {
            var value = iterable_1[_i];
            cb(value, i++);
        }
    };
    /**
     * Loops through an array and calls the provided callback function for every element, until the callback returns true for an element.
     * @param iterable
     * @param {BareJS~iterateCallback} cb
     * @returns {boolean} returns true, if the provided callback function has returned true for one element
     */
    BareJS.some = function (iterable, cb) {
        "use strict";
        var i = 0;
        for (var _i = 0, iterable_2 = iterable; _i < iterable_2.length; _i++) {
            var value = iterable_2[_i];
            if (cb(value, i++)) {
                return true;
            }
        }
        return false;
    };
    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     */
    BareJS.addClass = function (clazz, elements) {
        "use strict";
        if ("length" in elements && typeof elements.length === "undefined") {
            elements = [elements];
        }
        console.log(elements);
        BareJS.each(elements, function (el) {
            el.classList.add(clazz);
        });
    };
    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     */
    BareJS.removeClass = function (clazz, elements) {
        "use strict";
        if ("length" in elements) {
            elements = [elements];
        }
        BareJS.each(elements, function (el) {
            el.classList.remove(clazz);
        });
    };
    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     * @param {boolean} force if set to true, the class will be added to the element, regardless if it is already present
     */
    BareJS.toggleClass = function (clazz, elements, force) {
        "use strict";
        if (force === void 0) { force = false; }
        if ("length" in elements) {
            elements = [elements];
        }
        if (force) {
            BareJS.addClass(clazz, elements);
        }
        else {
            BareJS.each(elements, function (el) {
                el.classList.toggle(clazz);
            });
        }
    };
    /**
     *
     * @param clazz
     * @param elements
     * @returns {boolean|boolean[]}
     */
    BareJS.hasClass = function (clazz, elements) {
        "use strict";
        if ("length" in elements) {
            elements = [elements];
        }
        var hasClass = [];
        BareJS.each(elements, function (el) {
            hasClass.push(el.classList.contains(clazz));
        });
        if (hasClass.length > 1) {
            return hasClass;
        }
        else {
            return hasClass.shift();
        }
    };
    /**
     *
     * @param options
     * @returns {Document|JSON|string}
     * @todo finish
     */
    BareJS.request = function (options) {
        "use strict";
        if (options === void 0) { options = {}; }
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", "ajax_info.txt", true);
        xmlhttp.send();
        return xmlhttp.responseXML;
    };
    /**
     * @type {Object}
     */
    BareJS.options = {};
    /**
     *
     * @type {{version: string, shortcutEnabled: boolean, prototypesEnabled: boolean, javascriptVersion: number}}
     */
    BareJS.info = {
        version: '1.0@dev',
        shortcutEnabled: false,
        prototypesEnabled: false,
        javascriptVersion: undefined
    };
    return BareJS;
}());
module.exports = BareJS;
