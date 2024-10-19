import chatgpt from './chatgpt.js';
import derivedviews from './derivedviews.js';
import constructor from './constructor.js';
import eventlog from './eventlog.js';
import notifs from './notifs.js';
import globalModule from './global.js';
import profile from './profile.js';
import migrations from './migrations.js';
import auth from './auth.js';
import admin from './admin.js';

export const coreComponents = {
    chatgpt,
    derivedviews,
    constructor,
    eventlog,
    notifs,
    global: globalModule,
    profile,
    migrations,
    auth,
    admin,
};

