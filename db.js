var redis = require('redis');

module.exports = {
  publish: function publish(identity, key, value, callback) {
    console.log("publish", identity, key, value);
    callback(null);
  },

  unpublish: function unpublish(identity, key, callback) {
    console.log("unpublish", identity, key);
    callback(null);
  },

  watch: function watch(identity, identities, callback) {
    console.log("watch", identity, identities);
    callback(null);
  },

  unwatch: function unwatch(identity, identities, callback) {
    console.log("unwatch", identity, identities);
    callback(null);
  }
};
