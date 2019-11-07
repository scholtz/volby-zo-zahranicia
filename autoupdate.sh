php bin/update-db-obci.php
mv js/newcities.js js/cities.js -f
php bin/makehash.php
git add index.html
git add js/
git commit -m "update cities database - autoupdate"
git push origin master
