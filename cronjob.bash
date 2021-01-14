ps cax | grep node > /dev/null
if [ $? -eq 0 ]; then
  echo "Process running."
else
  echo "Process not running."
  env NODE_ENV=production /home/d0oezq0leri9/.nvm/versions/node/v10.15.0/bin/node /home/d0oezq0leri9/public_html/src/bin/www
fi