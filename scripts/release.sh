#!/bin/bash
#
echo "Reedsy Quill Fork release."
echo ""

# Init
VERSION=$1

if [ "$VERSION" = "" ]
then
  echo "You must provide a release version!"
  echo "Exiting"
  exit
else
  echo "Is $VERSION the correct version?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

# Make sure the release is coming from the master branch
CURRENT_BRANCH=$(git symbolic-ref -q HEAD)
CURRENT_BRANCH=${CURRENT_BRANCH##refs/heads/}
CURRENT_BRANCH=${CURRENT_BRANCH:-HEAD}

if [ "$CURRENT_BRANCH" != "reedsy" ]
then
  echo "You must be releasing from the reedsy branch."
  exit
fi

# Create temporary branch
git checkout -b release-$VERSION

# Dist it up
grunt dist

# Sort out the .gitignore
echo "" >> ./.gitignore
echo "!/dist" >> ./.gitignore

# Add and commit the dist files
git add ./dist
git commit -m "Build $VERSION"

# Tag it up
git tag v$VERSION

# Push it up
git push origin refs/tags/v$VERSION

# Revert all the changes
git checkout reedsy
git checkout .gitignore
git branch -D release-$VERSION
