Basic implementation of an async testing framework for node. Uses an rspec style, but is able to assert on async callbacks.

    $ node test.js
    a test doesn't expect callback but is called FAILED
    a test expects callback and is called OK
    a test expects callback but not called FAILED
    a test doesn't expect callback and is not called OK
