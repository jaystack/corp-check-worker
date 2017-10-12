const AWS = require('aws-sdk');

const defaultOptions = {
  region: 'eu-central-1',
  cluster: 'corp-check-worker',
  taskDefinition: 'check-dev',
  name: 'checker'
};

const runTask = (cid, pkg, isProduction, { region, cluster, taskDefinition, name } = defaultOptions) => {
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
              environment: [ { name: 'NODE_ENV', value: isProduction ? 'production' : 'dev' } ]
            }
          ]
        }
      },
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });
};

runTask('1', 'redux', false).then(d => console.log(d));
