import AWS = require('aws-sdk');

export type TaskOptions = {
  region: string;
  cluster: string;
  taskDefinition: string;
  name: string;
};

const defaultOptions = {
  region: 'eu-central-1',
  cluster: 'checkers',
  taskDefinition: 'check',
  name: 'ckecker'
};

export default (cid: string, pkg: string, { region, cluster, taskDefinition, name }: TaskOptions = defaultOptions) => {
  return new Promise((resolve, reject) => {
    new AWS.ECS({ region }).runTask(
      {
        cluster,
        taskDefinition,
        overrides: {
          containerOverrides: [ { name, command: [ 'node', '.', cid, pkg ] } ]
        }
      },
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });
};
