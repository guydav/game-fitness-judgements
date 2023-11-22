#!/bin/bash

ENV_FILE='env/.env.git.local'

echo "Regenerating local environment file based on git info $ENV_FILE"
echo "# DO NOT EDIT THIS FILE IT IS AUTOMATICALLY GENERATED" > $ENV_FILE
echo "# this file is automatically generated by the post-commit hook (see scripts/generate_git_env)." >> $ENV_FILE
echo "" >> $ENV_FILE

PROJECT_NAME=$(basename $(git remote get-url origin) .git | tr '[:upper:]' '[:lower:]')
echo "VITE_PROJECT_NAME      = $PROJECT_NAME" >> $ENV_FILE

HASH=$(git rev-parse --short HEAD)
echo "VITE_GIT_HASH          = $HASH" >> $ENV_FILE

echo 'VITE_GIT_REPO_NAME     = ${VITE_PROJECT_NAME}' >> $ENV_FILE

GITURL=$(git remote get-url origin);
if [[ $GITURL == git@* ]];
then
    OWNER=$(echo $GITURL | awk -F':' '{print $2}' | awk -F'/' '{print $1}' );
else
    OWNER=$(echo $GITURL | awk -F'/' '{print $4}');
fi
OWNER=$(echo $OWNER | tr '[:upper:]' '[:lower:]')
echo "VITE_GIT_OWNER = ${OWNER}" >> $ENV_FILE

BRANCH=$(git rev-parse --abbrev-ref HEAD | tr '[:upper:]' '[:lower:]')
echo "VITE_GIT_BRANCH_NAME   = $BRANCH" >> $ENV_FILE

escape_quotes() {
  # Get the input string
  input="$1"
  # Escape single quotes
  input="${input//\'/\'}"
  # Escape double quotes
  input="${input//\"/\\\"}"
  # Return the escaped string
  echo "$input"
}
MSG=$(escape_quotes "$(git log -1 --pretty=%s)");
echo "VITE_GIT_LAST_MSG      = $MSG" >> $ENV_FILE

echo 'VITE_DEPLOY_BASE_PATH   =  "/${VITE_GIT_OWNER}/${VITE_GIT_REPO_NAME}/${VITE_GIT_BRANCH_NAME}/"' >> $ENV_FILE

CODENAME=$(node scripts/codenamize.js "/${OWNER}/${PROJECT_NAME}/${BRANCH}")
echo "VITE_CODE_NAME          = ${CODENAME}" >> $ENV_FILE

echo "" >> $ENV_FILE
echo "# this port might not be correct, but it doesn't really matter" >> $ENV_FILE

if [ "$OWNER" == "NYUCCL" ] && [ "$PROJECT_NAME" == "smile" ] ; then
    echo "VITE_DEV_PORT_NUM           =  3000" >> $ENV_FILE
else
    echo "VITE_DEV_PORT_NUM           =  3010" >> $ENV_FILE
fi

echo 'VITE_DEPLOY_URL         =  "http://localhost:${VITE_DEV_PORT_NUM}${VITE_DEPLOY_BASE_PATH}"' >> $ENV_FILE
echo 'VITE_CODE_NAME_DEPLOY_URL         =  "http://localhost:${VITE_DEV_PORT_NUM}/e/${VITE_CODE_NAME}"' >> $ENV_FILE
