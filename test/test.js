var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var BareJS = require('../src/BareJS.js');

describe('BareJS', function() {
    this.timeout(10000); // timeout needs to be high because of jsdom :/
    if (typeof document == "undefined") {
        // assume we are on node js and need to init jsdom
        var jsdom = require('mocha-jsdom');
        jsdom();
    }


    before(function() {
        var container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);

        var names = ['first', 'second', 'third'];
        for (var i in names) {
            var div = document.createElement('div');
            div.id = names[i] + "-div";
            div.classList.add('div');
            div.classList.add('div-'+i);

            for (var j = 0; j < 4; j++) {
                var span = document.createElement('span');
                span.id = "child-"+i+"-"+j;
                span.classList.add('span');
                span.classList.add('child');
                span.classList.add("child-"+j);
                span.classList.add("parent-"+i);
                div.appendChild(span);
            }

            // special child
            var specialChild = document.createElement('strong');
            specialChild.id = "special-child-"+i+"-"+j;
            specialChild.classList.add('special-child');
            specialChild.classList.add('child');
            specialChild.classList.add("child-"+(j+1));
            specialChild.classList.add("parent-"+i);
            div.appendChild(specialChild);

            container.appendChild(div);
        }
    });

    describe('#one()', function() {
        this.slow(4);

        it('should find one element by id', function() {
            var div = BareJS.one('#first-div');
            expect(div).to.exist;
            //todo check if type HTMLElement and not NodeList
            expect(div.id).to.equal('first-div');
        });

        it('should find one element by tag name', function() {
            var div = BareJS.one('div');
            expect(div).to.exist;
            //todo check if type HTMLElement and not NodeList
            expect(div.tagName.toLowerCase()).to.equal('div');
        });

        it('should find one element by class', function() {
            var div = BareJS.one('.div');
            expect(div).to.exist;
            //todo check if type HTMLElement and not NodeList
            expect(div.tagName.toLowerCase()).to.equal('div');
        });

        it('should return null if no element with the specified class exists', function() {
            var div = BareJS.one('.foobar');
            expect(div).to.not.exist;
        });

        it('shouldn\'t find a element that doesn\'t exist in the dom', function() {
            var a = BareJS.one('a');
            expect(a).to.not.exist;
        });

        it('should find child element', function() {
            var parent = BareJS.one('#first-div');
            expect(parent).to.exist;
            var span = BareJS.one('span', parent);
            expect(span).to.exist;
            //todo check if type HTMLElement and not NodeList
            expect(span.tagName.toLowerCase()).to.equal('span');
            expect(span.parentNode).to.equal(parent);

            // todo check if it does not find elements outside of the parent
        });

        it('should find one element by complex selector', function() {
            var el = BareJS.one('div:first-child + .div > span:nth-child(2) ~ .span + .child');
            expect(el).to.exist;

            // todo check if the element matches the selector (e.g check if tyg name, id or class matches, and check if parent matches)
        });

        it('should find one element by complex selector (without space)', function() {
            var el = BareJS.one('div:first-child+.div>span:nth-child(2)~.span+.child');
            expect(el).to.exist;

            // todo check if the element matches the selector (e.g check if tyg name, id or class matches, and check if parent matches)
        });

    });

    describe('#all()', function() {
        this.slow(1);

        it('should find all available elements by tag name', function() {
            var els = BareJS.all('div');
            expect(els).to.exist;

            expect(els).to.have.lengthOf(document.getElementsByTagName('div').length);
        });

        it('should find only one available elements by id', function() {
            var els = BareJS.all('#first-div');
            expect(els).to.exist;

            expect(els).to.have.lengthOf(1);
        });

        it('should find all available elements by class', function() {
            var els = BareJS.all('.div');
            expect(els).to.exist;

            expect(els).to.have.lengthOf(document.getElementsByClassName('div').length);
        });

        it('should only find elements that matches the selector', function() {
            var divs = BareJS.all('div');
            expect(divs).to.exist;

            for (var i in divs) {
                var div = divs[i];

                expect(div.tagName.toLowerCase()).to.equal('div');
            }

            var childs = BareJS.all('.child');

            for (i in childs) {
                var child = childs[i];

                expect(child.classList.contains('child')).to.be.true;
            }

            var spanChilds = BareJS.all('span.child');

            for (i in spanChilds) {
                var child = spanChilds[i];

                expect(child.classList.contains('child')).to.be.true;
                expect(child.tagName.toLowerCase()).to.equal('span');
            }

        });

        it('should find all element by complex selector', function() {
            var els = BareJS.all('div + .div > span:nth-child(2) ~ .span + .child');
            expect(els).to.exist;

            // todo check if the element matches the selector (e.g check if tyg name, id or class matches, and check if parent matches)

            expect(els).to.have.lengthOf(document.querySelectorAll('div + .div > span:nth-child(2) ~ .span + .child').length);
        });

    });

    describe('#each()', function() {
        this.slow(3);
        var entries = [];

        for(var i = 0; i < 20000; i++) {
            entries.push(i);
        }

        it('sould iterate through all entries', function () {
            var num_entries = 0;
            var sum = 0;
            BareJS.each(entries, function (entry) {
                num_entries++;
                sum += entry;
            });

            expect(entries).to.have.lengthOf(num_entries);
            expect(sum).to.equal(entries.reduce(function(previousValue, currentValue){
                return currentValue + previousValue;
            }));
        });
    });

    describe('#some()', function() {
        this.slow(3);
        var entries = [];

        for(var i = 0; i < 20000; i++) {
            entries.push(i);
        }

        it('sould return true and stop after cb returns true', function () {
            var num_entries = 0;
            var sum = 0;
            var limit = entries.length - 100;

            var found = BareJS.some(entries, function (entry) {
                num_entries++;
                sum += entry;

                return entry == limit;
            });

            expect(num_entries).to.equal(limit+1);
            expect(sum).to.equal(entries.reduce(function(previousValue, currentValue){
                if (currentValue <= limit) {
                    return currentValue + previousValue;
                }

                return previousValue;
            }));
            expect(found).to.be.true;
        });

        it('sould return false and iterate through all entries if cb returns always false', function () {
            var num_entries = 0;
            var sum = 0;

            var found = BareJS.some(entries, function (entry) {
                num_entries++;
                sum += entry;

                return false;
            });

            expect(num_entries).to.equal(entries.length);
            expect(sum).to.equal(entries.reduce(function(previousValue, currentValue){
                return currentValue + previousValue;
            }));
            expect(found).to.be.false;
        });
    });
    //todo
});
