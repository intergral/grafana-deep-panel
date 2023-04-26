#!/usr/bin/env bash

rm -rf intergral-deep-panel || exit $?

rm *.zip* || exit $?

cp -r dist intergral-deep-panel  || exit $?

VERSION=$(cat package.json | grep version | awk -F'"' '{ print $4 }')

zip intergral-deep-panel-${VERSION}.zip intergral-deep-panel -r  || exit $?

md5sum intergral-deep-panel-${VERSION}.zip > intergral-deep-panel-${VERSION}.zip.md5  || exit $?

cat intergral-deep-panel-${VERSION}.zip.md5