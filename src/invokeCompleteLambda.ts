import { Lambda } from 'aws-sdk';
import { Info } from './types';

export type Options = {
  region: string;
  function: string;
};

export default (cid: string, data: Info, { region, function: FunctionName }: Options) =>
  new Promise((resolve, reject) =>
    new Lambda({ region }).invoke(
      { FunctionName, Payload: JSON.stringify({ cid, data }) },
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );
