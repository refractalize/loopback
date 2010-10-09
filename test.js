var lb = require('./loopback'),
    assert = require('assert');

lb.describe('a test', function () {
    lb.it('expects callback and is called', function () {
        setTimeout(lb.should_call(function () {
        }), 500);
    });

    lb.it('expects callback but not called', function () {
        lb.should_call(function () {
        });
    });

    lb.it("doesn't expect callback but is called", function () {
        setTimeout(lb.should_not_call(), 250);
    });

    lb.it("doesn't expect callback and is not called", function () {
        lb.should_not_call();
    });
});
