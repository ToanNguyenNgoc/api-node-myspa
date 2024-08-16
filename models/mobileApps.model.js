const mongoose = require('mongoose');

const MobileAppsSchema = mongoose.Schema({
    app_code: {
        type: String,
    },
    code: {
        type: String,
    },
    access_token: {
        type: String
    },
    fullname: {
        type: String
    },
    created_at: { type: Date, default: Date.now }
})

const MobileApps = mongoose.model('MobileApps', MobileAppsSchema);
module.exports = MobileApps