var socket_io = require('socket.io');
var db = require('./db');

/*
 * handle an api call for the given identity
 */
function handle(identity, message, callback) {
  switch (message.type) {
    case 'publish':
      db.publish(identity, message.key, message.value, callback);
      break;
    case 'unpublish':
      db.unpublish(identity, message.key, callback);
      break;
    case 'watch':
      db.watch(identity, message.identities, callback);
      break;
    case 'unwatch':
      db.unwatch(identity, message.identities, callback);
      break;
    default:
      callback(new Error("No such method"));
  }
}

/*
 * bind app to socket.io module
 */
var bind = module.exports.bind = function bind(app, sessionStore, sessionKey) {
  var io = socket_io.listen(app);

  /*
   * authorization middleware
   */

  io.set('authorization', function(data, accept) {
    // could compare session id and cookie here
    // using sessionStore and sessionKey
  });

  /*
   * accept a socket.io connection
   */

  io.sockets.on('connection', function(socket) {
    var auth_ok = false;
    var identity = '';

    socket.on('message', function(message) {
      switch (message.type) {
        case 'connect':
          verify(message.assertion, function(err, email) {
            if (!!err) {
              return socket.json.send({success: false, error: err});
            }
            auth_ok = true;
            identity = email;
            return socket.json.send({success: true, identity: email});
          });
          break;

        default:
          if (!auth_ok) {
            return socket.json.send({
              success: false, 
              error: new Error("Not authenticated")
            });
          } else {
            handle(identity, message, function(err) {
              if (!!err) {
                return socket.json.send({success: true});
              }
              return socket.json.send({success: false, error: err});
            });
          }
          break;
      }
    });

    socket.on('disconnect', function() {
      if (auth_ok) {
        auth_ok = false;
        return socket.json.send({success: true});
      } else {
        return socket.json.send({success: false, error: new Error("Not signed in")});
      }
    });
  });

};
