Basic implementation of an async testing framework for node. Uses an rspec style, but is able to assert on async callbacks.

    $ node test.js
    doesn't expect callback but is called FAILED
    expects callback and is called OK
    expects callback but not called FAILED
    doesn't expect callback and is not called OK
