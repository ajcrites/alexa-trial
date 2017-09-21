export const handlers = {
  'AMAZON.PauseIntent'() {
    this.response.speak('Paused!');
    this.emit(':responseReady');
  },

  'AMAZON.HelpIntent'() {
    this.response.speak('Ask me to add two numbers').listen('Try again');
    this.emit(':responseReady');
  },

  'AMAZON.CancelIntent'() {
      this.response.speak('Goodbye!');
      this.emit(':responseReady');
  },

  'AMAZON.StopIntent'() {
      this.response.speak('Goodbye!');
      this.emit(':responseReady');
  }
};
