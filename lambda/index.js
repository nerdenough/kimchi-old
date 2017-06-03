// For now, we'll just send back the event containing the intent
// and slot info and handle it directly within the bot code itself.
exports.handler = (event, context, callback) => {
  callback(null, {
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: JSON.stringify(event || '')
      }
    }
  })
}
