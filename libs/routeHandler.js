
let Q              = require('q'),
    _              = require('lodash'),
    fp             = require('path'),
    fs             = require("fs");


/**
 * APIHandler is class instantiated once per each route defined in router, during
 * the initialization process.
 * It's job is to register custom middleware to route, create APIExpress
 * instance per each request on that route, and invoke corresponding processor
 * method (defined in service) with correct context.
 * APIExpress object represents that context, and is responsible for handling
 * entire request from input parameters to response. This way, multiple calls
 * to single route will be distanced with different APIExpress objects.
 *
 * @param {APIHandler~processor} processor
 * @constructor
 */
function APIHandler(processor) {
    if (!_.isFunction(processor)) {
        throw Error('Invalid processor, must be a function!')
    }
    this._processor = processor;
}

/**
 * @param {*} value
 * @return {*}
 * @private
 */
function _onSuccess(value) {
    if (value === undefined) {
        return false;
    }
    this.res.status(200);
    this.res.body = value; // Manually set body property since res.json is not providing it.
    this.res.json(value);
    return false;
}

/**
 * @param {*} result
 * @private
 */
function _onProcess(result) {
    this.next(result);
}

/**
 * @param {APIExpress} express
 * @param {function(this:APIHandler)} onSuccess
 * @param {function(this:APIHandler)} onFailure
 * @param {function(this:APIHandler)} onProcess
 * @return {*}
 * @private
 */
function _onRequest(express, onSuccess, onFailure, onProcess) {
    return this.onProcess(express, onSuccess, onFailure).done(onProcess);
}

/**
 * @param {object} data
 * @param {function(this:APIHandler, value)} onSuccess
 * @param {function(this:APIHandler, error)} onFailure
 * @return {*} The result of the process
 */

APIHandler.prototype.onProcess = function (express, onSuccess, onFailure) {
    var context = {_express: {}};
    _.extend(context._express, express);
    var data = this.buildData(express.req);

    return Q.try(function () {
        return Q(this._processor.call(context, data)).then(onSuccess)
    }.bind(this)).catch(onFailure);
};

/**
 * @return {Express~middleware}
 */
APIHandler.prototype.middleware = function () {
    var onRequest = _onRequest.bind(this);
    return function (req, res, next) {
        if (res._headerSent) {
            next();
        } else {

            var apiExpress = new APIExpress(req, res, next);
            var onSuccess = _onSuccess.bind(apiExpress)
                , onFailure = _onFailure.bind(apiExpress)
                , onProcess = _onProcess.bind(apiExpress)
            ;

            onRequest(apiExpress, onSuccess, onFailure, onProcess);
        }
    }.bind(this);
};

/**
 * @param {APIHandler~processor} processor
 * @return {APIHandler}
 */
APIHandler.factory = function (processor) {
    return new APIHandler(processor);
};

/**
 * @param {APIHandler~processor} processor
 * @param {object} options
 * @return {Express~middleware}
 */
APIHandler.register = function (processor, options) {
    var handler = APIHandler.factory(processor);
    if (_.isFunction(options)) {
        handler = options(handler);
        if (!handler instanceof APIHandler) {
            throw('APIHandler.register options callback did NOT return a valid APIHandler')
        }
    } else if (_.isPlainObject(options)) {
        _.extend(handler, options);
    } else if (options !== undefined) {
        throw ('APIHandler.register options override is NOT a valid override object')
    }
    return handler.middleware();
};

module.exports = APIHandler;