# Merges the output of the expo web build process with other static public files
# to create a public_out directory that we host content from
rm -rf ../public_out
mkdir ../public_out
cp -r web-build/* ../public_out
cp -r ../public/* ../public_out
cp web-build/index.html ../public_out/index.html
echo "DONE"