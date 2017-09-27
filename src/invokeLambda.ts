import { Lambda } from 'aws-sdk';
import { REGION } from './consts';

export default (functionName: string, payload: Object) =>
  new Promise((resolve, reject) =>
    new Lambda({ region: REGION }).invoke(
      { FunctionName: functionName, Payload: JSON.stringify(payload) },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );
