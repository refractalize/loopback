var sys = require('sys');

var test_stack = [];
var descriptions = [];
var callback_expectations = function () {
    var callbacks = [];
    var current_test;
    var current_callback_expectations;

    return {
        create_callback_expectation: function (expected_to_be_called_back) {
            var expectation = create_callback(current_test, expected_to_be_called_back);
            callbacks.push(expectation);
            current_callback_expectations.push(expectation);
            return expectation;
        },
        assert_callbacks: function () {
            for (var c in callbacks) {
                var callback = callbacks[c];
                callback.assert_calledback();
            }
        },
        run_and_collect_callback_expectations: function (test, func) {
            current_test = test;
            current_callback_expectations = [];
            try {
                func();
            } finally {
                current_test = undefined;
            }
            return current_callback_expectations;
        },
    }
}();

var create_callback = function (test, expected_to_be_called_back) {
    var is_called_back = false;

    var callback_expectation = {
        called_back: function () {
            is_called_back = true;
            test.callback_made(callback_expectation);
        },
        assert_calledback: function () {
            if (!is_called_back) {
                test.callback_made(callback_expectation);
            }
        },
        success: function () {
            return is_called_back === expected_to_be_called_back;
        },
    };

    return callback_expectation;
};

var create_description = function (name) {
    var tests = [];
    var number_of_tests_complete = 0;

    var description = {
        name: name,
        run: function () {
            for(var t in tests) {
                var test = tests[t];
                test.run();
            }
        },
        create_test: function (name, test_function) {
            var test = create_test(description, name, test_function);
            tests.push(test);
            return test;
        },
        test_failed: function (test, exception) {
            number_of_tests_complete++;
            if (number_of_tests_complete === tests.length) {
            }
            sys.print(name + ' ' + test.name + " [0;31mFAILED[0m\n");
        },
        test_passed: function (test) {
            number_of_tests_complete++;
            if (number_of_tests_complete === tests.length) {
            }
            sys.print(name + ' ' + test.name + " [0;32;40mOK[0m\n");
        }
    };

    return description;
};

var create_test = function(description, name, test_function) {
    var callbacks;
    var number_of_callbacks_finished;
    var already_failed = false;

    var failed = function (exception) {
        description.test_failed(test, exception);
    };

    var passed = function () {
        description.test_passed(test);
    };

    var test = {
        name: name,
        run: function () {
            try {
                callbacks = callback_expectations.run_and_collect_callback_expectations(test, test_function);
                number_of_callbacks_finished = callbacks.length;
                if (number_of_callbacks_finished === 0) {
                    passed();
                }
            } catch (e) {
                failed(e);
            }
        },
        callback_made: function (callback_expectation) {
            number_of_callbacks_finished--;
            if (!callback_expectation.success()) {
                already_failed = true;
                failed('didnt expect callback');
            } else if (number_of_callbacks_finished == 0 && !already_failed) {
                passed();
            }
        },
    };

    return test;
}

exports.describe = function (name, tests) {
    //console.log(name);
    var description = create_description(name);
    test_stack.push(description);
    tests();
    description.run();
};

exports.it = function (name, test) {
    //console.log(name);
    test_stack[test_stack.length - 1].create_test(name, test);
};

exports.should_call = function (func) {
    var expectation = callback_expectations.create_callback_expectation(true);
    return function () {
        expectation.called_back();
        return func();
    }
};

exports.should_not_call = function () {
    var expectation = callback_expectations.create_callback_expectation(false);
    return function () {
        expectation.called_back();
    };
}

process.addListener('exit', function () {
    //console.log('exiting');
    callback_expectations.assert_callbacks();
});
