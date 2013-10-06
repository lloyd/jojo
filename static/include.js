var JoJo = (function() {
  var commChan;
  var doc = document;

  function connect(args, cb) {
    if (!commChan) {
      var iframe = doc.createElement("iframe");
      iframe.style.display = "none";
      doc.body.appendChild(iframe);
      iframe.src = "jojoframe.html";
      commChan = Channel.build({
        window: iframe.contentWindow,
        origin: '*', // XXX insecure
        scope: "jojo",
        onReady: function(rv) {
          console.log("iframe is ready");
        }
      });

      var connectCB = args.onconnect;
      commChan.call({
        method: 'connect',
        params: args,
        success: function(response) {
          connectCB(response);
        }
      });
    }
  }

  return {
    connect: connect
  };
})();
