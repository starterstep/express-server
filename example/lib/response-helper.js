var $ = module.exports = {};

$.error = function(status, message) {
    if (typeof status === 'undefined') {
        status = 400;
    }

    var err = new Error(message);
    err.name = 'ResponseError';
    err.status = status;
    err.isResponseError = true;

    return err;
};

$.sendError = function(err, res) {
    console.error('ERROR stack ', err.stack);
    if (err.isResponseError) {
        res.json({
            error:err.message
        }, err.status);
    } else {
        res.send('Internal Server Error', 500);
    }
    return true;
};

$.send = function(err, result, res) {
    if (typeof res === 'undefined') {
        res = result;
        result = {};
    }
    err && $.sendError(err, res) || res.json(result||{});
};

$.render = function(err, view, result, res) {
    if (typeof res === 'undefined') {
        res = result;
        result = {};
    }
    err && $.sendError(err, res) || res.render(view, result||{});
};