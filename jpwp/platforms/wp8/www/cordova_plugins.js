cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.jsmobile.plugins.sms/www/sms.js",
        "id": "com.jsmobile.plugins.sms.sms",
        "clobbers": [
            "window.sms"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.email-composer/www/email_composer.js",
        "id": "de.appplant.cordova.plugin.email-composer.EmailComposer",
        "clobbers": [
            "plugin.email"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.jsmobile.plugins.sms": "0.0.1",
    "de.appplant.cordova.plugin.email-composer": "0.8.1"
}
// BOTTOM OF METADATA
});