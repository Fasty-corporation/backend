const WebSocket = {
    sendNotification: (userId, message) => {
      // Send message to the WebSocket client connected with userId
      console.log(`Sending notification to Delivery Boy ${userId}: ${message}`);
    },
  };
  
  module.exports = WebSocket;
  