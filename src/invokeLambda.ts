import { Lambda } from 'aws-sdk';
import { Result } from './types';

export default (region: string, functionName: string, payload: Object) =>
  new Promise((resolve, reject) =>
    new Lambda({ region }).invoke(
      { FunctionName: functionName, Payload: JSON.stringify(payload) },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );
