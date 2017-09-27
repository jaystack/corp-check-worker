import { Lambda } from 'aws-sdk';
import { REGION } from './consts';

export default <T>(functionName: string, payload: Object): Promise<T> =>
  new Promise((resolve, reject) =>
    new Lambda({ region: REGION }).invoke(
      { FunctionName: functionName, Payload: JSON.stringify(payload) },
      (err, result: { Payload: string }) => (err ? reject(err) : resolve(<T>JSON.parse(result.Payload)))
    )
  );
