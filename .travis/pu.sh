#!/bin/sh

setup_git() {
  # Set the user name and email to match the API token holder
  # This will make sure the git commits will have the correct photo
  # and the user gets the credit for a checkin
  git config --global user.email "p.mikosza@outlook.com"
  git config --global user.name "miki10194"
  git config --global push.default matching
  
  # Get the credentials from a file
  git config credential.helper "store --file=.git/credentials"
  
  # This associates the API Key with the account
  echo "https://${GITHUB_API_KEY}@github.com/silevis/dynagrid.git" > .git/credentials
}

make_version() {
  # Make sure that the workspace is clean
  # It could be "dirty" if
  # 1. package-lock.json is not aligned with package.json
  # 2. npm install is run
  git checkout -- .
  
  # Echo the status to the log so that we can see it is OK
  git status
  
  # Run the deploy build and increment the package versions
  # %s is the placeholder for the created tag
  npm version patch -m "chore: release version %s"
  echo 'version updated'
}

upload_files() {
  # This make sure the current work area is pushed to the tip of the current branch
  echo 'before push'
  git remote add origin git@github.com:silevis/dynagrid.git
  git push origin HEAD:$TRAVIS_BRANCH
  echo 'after push'
  
  # This pushes the new tag
  git push --tags
}

setup_git
make_version
upload_files