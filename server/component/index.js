var coreComponents = {
    chatgpt: require('./chatgpt'),
    derivedviews: require('./derivedviews'),
    constructor: require('./constructor'),
    eventlog: require('./eventlog'),
    notifs: require('./notifs'),
    global: require('./global'),
    profile: require('./profile'),
    migrations: require('../migrations/migrations'),
    auth: require('./auth'),
    admin: require('./admin'),
}

exports.coreComponents = coreComponents;

