var ORDER_IN_LIST = template('<li data-id="<%- order.id %>"><p><%- order.summary %></p></li>');

$(function whenDomIsReady(){

  // Every time we receive a relevant socket event...
  io.socket.on('order', function (msg) {

    // Let's see what the server has to say...
    switch(msg.verb) {

      case 'created': (function(){

        // Render the new order in the DOM.
        var newOrderHtml = ORDER_IN_LIST(msg.data);
        $('#orders').append(newOrderHtml);

      })(); return;

      case 'destroyed': (function(){

        // Find any existing orders w/ this id in the DOM.
        //
        // > Remember: To prevent XSS attacks and bugs, never build DOM selectors
        // > using untrusted provided by users.  (In this case, we know that "id"
        // > did not come from a user, so we can trust it.)
        var $deletedOrders = $('#orders').find('[data-id="'+msg.id+'"]');

        // Then, if there are any, remove them from the DOM.
        $deletedOrders.remove();

      })(); return;

      // Ignore any unrecognized messages
      default: return;

    }//< / switch >

  });//< / io.socket.on() >

});//< / when DOM is ready >
