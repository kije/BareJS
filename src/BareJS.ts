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

declare global {
    interface Window {
        $:any;
        $$:any;
        javascriptVersion:number;
        XMLHttpRequest:XMLHttpRequest;
    }

    interface Element {
        /**
         * Adds a class to an element
         * @param clazz
         *
         * @see BareJS.addClass
         */
        addClass(clazz:string):void;

        /**
         * Removes a class from an element
         * @param clazz
         *
         * @see BareJS.removeClass
         */
        removeClass(clazz:string):void;

        /**
         * Toggles a class
         * @param clazz
         * @param force
         *
         * @see BareJS.toggleClass
         */
        toggleClass(clazz:string, force:boolean):void;

        hasClass(clazz:string):boolean;
    }
}



class BareJS {
    /**
     * @type {Object}
     */
    protected static options = {};
    /**
     *
     * @type {{version: string, shortcutEnabled: boolean, prototypesEnabled: boolean, javascriptVersion: number}}
     */
    protected static info:{
        version:string,
        shortcutEnabled:boolean,
        prototypesEnabled:boolean,
        javascriptVersion:number
    } = {
        version: '1.0@dev',
        shortcutEnabled: false,
        prototypesEnabled: false,
        javascriptVersion: undefined
    };

    constructor() {
        "use strict";

        throw new Error('BareJS can\'t not be instantiated!');
    }


    /**
     * Get the Javascript version number
     * @returns {number}
     */
    public static getJavascriptVersion():number {
        "use strict";

        if (BareJS.info.javascriptVersion == null) {
            let jsv:string[] = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0"];
            let d = document;

            for (let version of jsv) {
                let g:Element = d.createElement('script'),
                    s:Element = BareJS.one('script');

                g.setAttribute("language", "JavaScript" + version);
                g.nodeValue = "window.javascriptVersion=parseFloat('" + version + "');";
                s.parentNode.insertBefore(g, s);
                s.parentNode.removeChild(g);
            }

            BareJS.info.javascriptVersion = window.javascriptVersion;
            delete window.javascriptVersion;
        }

        return BareJS.info.javascriptVersion;
    }

    /**
     * Activates the $ shortcut
     * @param {boolean} force if set to true, overrides the $ shortcut, even if it is already set (e.g. by another library like jQuery, etc...)
     * @returns {boolean} returns true if the shortcut is activated
     */
    public static enableShortcut(force:boolean = false):boolean {
        "use strict";

        if (typeof window.$ == "undefined" || force) {
            window.$ = BareJS.one;
            window.$$ = BareJS.all;

            BareJS.info.shortcutEnabled = (window.$ == BareJS.one) && (window.$$ == BareJS.all);
        }

        return BareJS.info.shortcutEnabled;
    }

    /**
     * Adds prototypes to some objects (e.g. addClass etc... on Element)
     * @returns {boolean}
     */
    public static enablePrototypes():boolean {
        "use strict";

        Element.prototype.addClass = function (clazz:string) {
            BareJS.addClass(clazz, this);
        };

        Element.prototype.removeClass = function (clazz:string) {
            BareJS.removeClass(clazz, this);
        };

        Element.prototype.toggleClass = function (clazz:string, force:boolean = false) {
            BareJS.toggleClass(clazz, this, force);
        };

        Element.prototype.hasClass = function (clazz:string) {
            return <boolean>BareJS.hasClass(clazz, this);
        };

        // todo add Node.getElement and Node.getElements
        // todo add addClass etc... to NodeList etc...

        return BareJS.info.prototypesEnabled = true;
    }

    /**
     *
     * @param {string} selector
     * @param {Element|Document} context
     * @returns {NodeList}
     */
    public static all(selector:string, context:Element|Document = document):NodeListOf<Element> {
        "use strict";

        return context.querySelectorAll(selector);
    }

    /**
     *
     * @param {string} selector
     * @returns {boolean}
     */
    private static isSimpleSelector(selector:string):boolean {
        "use strict";

        // check, if selector is simple (e.g. only contains an id or a tag name)
        return (
            selector.trim().indexOf(" ", 1) === -1 &&
            selector.indexOf("[", 1) === -1 &&
            selector.indexOf(":", 1) === -1 &&
            selector.indexOf("*", 1) === -1 &&
            selector.indexOf("#", 1) === -1 &&
            selector.indexOf(".", 1) === -1
        );
    }

    /**
     *
     * @param {string} selector
     * @param {Element|Document} context
     * @returns {Element}
     */
    public static one(selector:string, context:Element|Document = document):Element {
        "use strict";

        selector = selector.trim();

        if (BareJS.isSimpleSelector(selector)) {
            let firstCharacter:string = selector.substr(0,1);

            if (firstCharacter === "#" && context == document) {
                return (<Document>context).getElementById(selector.substr(1));
            } else if (firstCharacter === ".") {
                let results = context.getElementsByClassName(selector.substr(1));
                return results.length > 0 ? results[0] : null;
            } else if (["[", ":", "*"].indexOf(firstCharacter) === -1) {
                let results = context.getElementsByTagName(selector);
                return results.length > 0 ? results[0] : null;
            }
        }

        return context.querySelector(selector);
    }


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
    public static each(iterable:any, cb:Function):void {
        "use strict";

        let i = 0;
        for (let value of iterable) {
            cb(value, i++);
        }
    }

    /**
     * Loops through an array and calls the provided callback function for every element, until the callback returns true for an element.
     * @param iterable
     * @param {BareJS~iterateCallback} cb
     * @returns {boolean} returns true, if the provided callback function has returned true for one element
     */
    public static some(iterable:any, cb:Function):boolean {
        "use strict";

        let i = 0;
        for (let value of iterable) {
            if (cb(value, i++)) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     */
    public static addClass(clazz:string, elements:Element|NodeListOf<Element>|Element[]):void {
        "use strict";

        // todo fallback, if classList is not supported
        // see http://stackoverflow.com/questions/7388626/how-do-i-add-a-class-to-the-html-element-without-jquery

        if ("length" in elements && typeof (<Element[]>elements).length === "undefined") {
            elements = <Element[]>[elements];
        }


        BareJS.each(elements, function (el:Element) {
            el.classList.add(clazz);
        });
    }

    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     */
    public static removeClass(clazz:string, elements:Element|NodeListOf<Element>|Element[]):void {
        "use strict";

        // todo fallback, if classList is not supported

        if ("length" in elements) {
            elements = <Element[]>[elements];
        }

        BareJS.each(elements, function (el:Element) {
            el.classList.remove(clazz);
        });
    }

    /**
     *
     * @param {string} clazz
     * @param {Element|Element[]|NodeList} elements
     * @param {boolean} force if set to true, the class will be added to the element, regardless if it is already present
     */
    public static toggleClass(clazz:string, elements:Element|NodeListOf<Element>|Element[], force:boolean = false):void {
        "use strict";

        // todo fallback, if classList is not supported

        if ("length" in elements) {
            elements = <Element[]>[elements];
        }

        if (force) {
            BareJS.addClass(clazz, elements);
        } else {
            BareJS.each(elements, function (el:Element) {
                el.classList.toggle(clazz);
            });
        }
    }

    /**
     *
     * @param clazz
     * @param elements
     * @returns {boolean|boolean[]}
     */
    public static hasClass(clazz:string, elements:Element|NodeListOf<Element>|Element[]):boolean|boolean[] {
        "use strict";

        // todo fallback, if classList is not supported

        if ("length" in elements) {
            elements = <Element[]>[elements];
        }

        let hasClass:any[] = [];
        BareJS.each(elements, function (el:Element) {
            hasClass.push(el.classList.contains(clazz));
        });

        if (hasClass.length > 1) {
            return hasClass;
        } else {
            return hasClass.shift();
        }
    }

    /**
     *
     * @param options
     * @returns {Document|JSON|string}
     * @todo finish
     */
    public static request(options:{

    } = {}):Document|JSON|string {
        "use strict";

        let xmlhttp:XMLHttpRequest;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "ajax_info.txt", true);
        xmlhttp.send();

        return xmlhttp.responseXML;
    }

    // todo add event functions (addEvent, fireEvent, removeEvent) & maybe something like the mootools pseudoevents (:relay() would be nice)
    // todo add string formatting method
    // todo add DOM traversing methods (like getParent([selector]) etc...)
    // todo methods for creating events
}


export = BareJS;
