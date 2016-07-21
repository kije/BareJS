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

// construct
var BareJS = function (selector, context) {
    "use strict";

    return BareJS.all(selector, context);
};


BareJS._isIterable = function (obj) {
    "use strict";

    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
};


// setup methods

BareJS.shortcutEnabled = false; // todo make general values object of BareJS
/**
 * Activates the $ shortcut
 * @param {boolean|undefined} force if set to true, overrides the $ shortcut, even if it is already set (e.g. by another library like jQuery, etc...)
 * @return {boolean} returns true if the shortcut is activated
 */
BareJS.enableShortcut = function (force) {
    "use strict";

    if (typeof $ == "undefined" || force) {
        window.$ = window.BareJS;

        BareJS.shortcutEnabled = true;
    }

    return BareJS.shortcutEnabled;
};


BareJS.prototypesEnabled = false;

/**
 * Adds prototypes to some objects (e.g. addClass etc.. on Node)
 */
BareJS.enablePrototypes = function () {
    "use strict";

    /**
     * @see BareJS.addClass
     */
    Node.prototype.addClass = function (clazz) {
          BareJS.addClass(clazz, this);
    };

    /**
     * @see BareJS.removeClass
     */
    Node.prototype.removeClass = function (clazz) {
        BareJS.removeClass(clazz, this);
    };

    /**
     * @see BareJS.toggleClass
     */
    Node.prototype.toggleClass = function (clazz, force) {
        BareJS.toggleClass(clazz, this, force);
    };

    BareJS.prototypesEnabled = true;
};


// methods

/**
 *
 * @param {string} selector
 * @param {Node|null} context
 */
BareJS.all = function (selector,context) {
    "use strict";

    return (context || document).querySelectorAll(selector);
};

/**
 *
 * @param {string} selector
 * @param {Node|null} context
 */
BareJS.one = function (selector,context) {
    "use strict";

    return (context || document).querySelector(selector);
};

/**
 *
 * @param {Iterable} iterable
 * @param {function} cb
 */
BareJS.each = function (iterable, cb) {
    "use strict";

    if (!BareJS._isIterable(iterable)) {
        iterable = [iterable];
    }

    var iterator = iterable[Symbol.iterator]();

    var el, i = 0;
    while ((el = iterator.next()) && !el.done) {
        cb(el.value, i++);
    }
};

/**
 *
 * @param {Iterable} iterable
 * @param {function} cb
 *
 * @return {boolean}
 */
BareJS.some = function (iterable, cb) {
    "use strict";

    if (!BareJS._isIterable(iterable)) {
        iterable = [iterable];
    }

    var iterator = iterable[Symbol.iterator]();

    var el, i = 0;
    while ((el = iterator.next()) && !el.done) {
        if (cb(el.value, i++)) {
            return true;
        }
    }

    return false;
};

/**
 *
 * @param {string} clazz
 * @param {NodeList|Array|Node} nodes
 */
BareJS.addClass = function (clazz, nodes) {
    "use strict";

    if (!BareJS._isIterable(nodes)) {
        nodes = [nodes];
    }

    BareJS.each(nodes, function (el) {
        el.classList.add(clazz);
    });
};

/**
 *
 * @param {string} clazz
 * @param {NodeList|Array|Node} nodes
 */
BareJS.removeClass = function (clazz, nodes) {
    "use strict";

    if (!BareJS._isIterable(nodes)) {
        nodes = [nodes];
    }

    BareJS.each(nodes, function (el) {
        el.classList.remove(clazz);
    });
};

/**
 *
 * @param {string} clazz
 * @param {NodeList|Array|Node} nodes
 * @param {boolean|undefined} force if set to true, the class will be added to the element, regardless if it is already present
 */
BareJS.toggleClass = function (clazz, nodes, force) {
    "use strict";

    if (typeof force == "undefined") {
        force = false;
    }

    if (!BareJS._isIterable(nodes)) {
        nodes = [nodes];
    }

    if (force) {
        BareJS.addClass(clazz, nodes);
    } else {
        BareJS.each(nodes, function (el) {
            el.classList.toggle(clazz);
        });
    }
};

/**
 *
 * @param {string} clazz
 * @param {NodeList|Array|Node} nodes
 * @return {boolean|boolean[]|undefined}
 */
BareJS.hasClass = function (clazz, nodes) {
    "use strict";

    if (!BareJS._isIterable(nodes)) {
        nodes = [nodes];
    }

    var hasClass = [];
    BareJS.each(nodes, function (el) {
        hasClass.push(el.classList.contains(clazz));
    });

    if (hasClass.length > 1) {
        return hasClass;
    } else {
        return hasClass.shift();
    }
};

/**
 *
 * @param options
 * @returns {Document}
 * @todo finish
 */
BareJS.request = function (options) {
    "use strict";
    
    var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET","ajax_info.txt",true);
    xmlhttp.send();

    return xmlhttp.responseXML;
};


// todo add event functions (addEvent, fireEvent, removeEvent) & maybe something like the mootools pseudoevents (:relay() would be nice)
// todo add string formatting method
// todo add DOM traversing methodes (like getParent([selector]) etc...)


window.BareJS = BareJS;
