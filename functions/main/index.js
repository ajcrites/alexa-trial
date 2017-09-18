// ALEXA SETUP

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const myBucket = 'adder-alexa';
const myObject = 'test.txt';

exports.handler = function(event, context, callback){
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.dynamoDBTableName = 'AdderTable';
    alexa.execute();
};

// INTENT HANDLERS

const handlers = {
    'AddNumbersIntent': function() {
        const numberOne = parseInt(this.event.request.intent.slots.NumberOne.value);
        const numberTwo = parseInt(this.event.request.intent.slots.NumberTwo.value);

        const result = numberOne + numberTwo;

        this.attributes['result'] = result;

        this.emit(':tell', 'Adding ' + numberOne.toString() + ' to ' + numberTwo.toString() + ' equals ' + result.toString());
    },

    'LastResultIntent': function() {
        this.emit(':tell', 'The last result was ' + this.attributes['result']);
    },

    'ReadMediaIntent': function() {
        const myParams = {
            Bucket: myBucket,
            Key: myObject
        };

        S3read(myParams, myResult => {
                this.response.speak('The S 3 file says, ' + myResult);
                this.emit(':responseReady');
            }
        )
    },

    'AMAZON.PauseIntent': function() {
        this.response.speak('Paused!');
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function() {
        this.response.speak('Ask me to add two numbers').listen('Try again');
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function() {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function() {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    }
};

// HELPER FUNCTIONS

function S3read(params, callback) {
    const s3 = new AWS.S3();

    s3.getObject(params, function (err, data) {
        if (err) { console.error(err); }
        else {
            callback(data.Body.toString());
        }
    });
}
