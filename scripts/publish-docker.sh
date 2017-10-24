#!/bin/bash
set -ev

if [ -z "$IMAGE_NAME" ]; then
  echo "ERROR: no IMAGE_NAME.  Please set as global env in travis.yml, or in shell environment"
  exit 1
fi
if [ -z "$REGISTRY_USERNAME" ]; then
  echo "ERROR: no REGISTRY_USERNAME.  Please set as global env in travis.yml, or in shell environment"
  exit 1
fi
if [ -z "$REGISTRY_PASSWORD" ]; then
  echo "ERROR: no REGISTRY_PASSWORD.  Please set as global env in travis.yml, or in shell environment"
  exit 1
fi
if [ -z "$REGISTRY_URL" ]; then
  echo "ERROR: no REGISTRY_URL.  Please set as global env in travis.yml, or in shell environment"
  exit 1
fi
if [ -z "$VERSION" ]; then
  echo "ERROR: no VERSION.  Please set as global env in travis.yml, or in shell environment"
  exit 1
fi

docker build -t ${IMAGE_NAME} .
docker login -u ${REGISTRY_USERNAME} -p ${REGISTRY_PASSWORD} ${REGISTRY_URL}
docker tag ${IMAGE_NAME}:latest ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:latest
docker push ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:latest

if [ "$VERSION" == "true" ]; then
  docker tag ${IMAGE_NAME}:latest ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TRAVIS_BUILD_NUMBER}
  docker push ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TRAVIS_BUILD_NUMBER}
fi
