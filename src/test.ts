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
  name: 'checker'
};

const runTask = (
  cid: string,
  pkg: string,
  isProduction: boolean,
  { region, cluster, taskDefinition, name }: TaskOptions = defaultOptions
) => {
  return new Promise((resolve, reject) => {
    new AWS.ECS({ region }).runTask(
      {
        cluster,
        taskDefinition,
        overrides: {
          containerOverrides: [
            {
              name,
              command: [ 'node', '.', cid, pkg ],
              environment: [
                  { name: 'NODE_ENV', value: isProduction ? 'production': 'dev' }
              ]
            }
          ]
        }
      },
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });
};

runTask('123', 'repatch', false).then(d => console.log(d));
