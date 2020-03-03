extract data :

docker-compose exec mongo mongo

show dbs
use <database>
show collections
exit

Then, run mongoexport command in the shell (not in mongo):
docker-compose exec mongo /bin/bash
mongoexport -d <database-name> -c <collection-name> --out=<name-of-file>.json --jsonArray

On local computer
docker cp fakedatagenerator_mongo_1:/output.json .

Vérifier que le fichier output.json contient un array d'objets. 
 
link : https://gist.github.com/JaniAnttonen/90945058ed41616f96d2cfa5f131bd09

other
docker stop \$(docker ps -a -q)
