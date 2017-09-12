#!/bin/bash
DOCKER_LOGIN=$(aws ecr get-login --no-include-email --region eu-central-1)
$DOCKER_LOGIN
docker build -t corp-check .
docker tag corp-check:latest 856324650258.dkr.ecr.eu-central-1.amazonaws.com/corp-check:latest
docker push 856324650258.dkr.ecr.eu-central-1.amazonaws.com/corp-check:latest