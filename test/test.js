var chai = require('chai');
var util = require('gulp-util');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var jsdom = require('mocha-jsdom');
var BareJS = require('../src/BareJS.js');

describe('BareJS', function() {
    this.timeout(5000); // timeout needs to be high because of jsdom :/
    jsdom();

    before(function() {
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

            document.body.appendChild(div);
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

        it('shouldn\'t find a element that doesn\'t exist in the dom', function() {
            var a = BareJS.one('a');
            expect(a).to.not.exist;
        });

        it('should find child element', function() {
            var parent = BareJS.one('div');
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
        });

        it('should find one element by complex selector (without space)', function() {
            var el = BareJS.one('div:first-child+.div>span:nth-child(2)~.span+.child');
            expect(el).to.exist;
        });

    });
    //todo
});
