import { handler as alexaHandler } from 'alexa-sdk';
import { S3 } from 'aws-sdk';
import { get } from 'lodash';

import { handlers as handlerHelpers } from './helper.intents';

const Bucket = 'adder-alexa';
const Key = 'test.txt';

const handlers = {
  AddNumbersIntent() {
    const numberOne = parseInt(get(this.event, 'request.intent.slots.NumberOne.value'));
    const numberTwo = parseInt(get(this.event, 'request.intent.slots.NumberTwo.value'));

    const result = numberOne + numberTwo;

    this.attributes.result = result;

    this.emit(':tell', `Adding ${numberOne} to ${numberTwo} equals ${result}`);
  },

  LastResultIntent() {
    this.emit(':tell', `The last result was ${this.attributes.result}`);
  },

  async ReadMediaIntent() {
    const s3Params: S3.GetObjectRequest = {
      Bucket,
      Key,
    };

    const s3 = new S3;
    const data = await s3.getObject(s3Params).promise();
    const fileText = data.Body.toString();

    this.response.speak(`The S 3 file says, ${fileText}`);
    this.emit(':responseReady');
  },
};

export function handler(event, context, callback) {
  const alexa = alexaHandler(event, context, callback);
  alexa.registerHandlers(handlers, handlerHelpers);
  alexa.dynamoDBTableName = 'AdderTable';
  alexa.execute();
}
