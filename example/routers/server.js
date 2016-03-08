module.exports = function(context)  {
    var router = context.express.Router();
    context.server.use(router);
    return router;
};