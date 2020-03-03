Description : Réaliser un chat en temps réel de type Messenger avec des web socket
Techno : React / Node / MongoDB
Fonctionalitées : - Créer des conversations - Ajouter des contacts - Voir leur status (online) - Gérer son profil - Espace admin

Démarrer le projet :
git clone https://github.com/stephAc/messenger.git
cd messenger
docker-compose up -d (lance automatique front back et bdd en important les seeds)

Quelques commandes en cas de bug avec docker
docker-compose ps ( permet de visualiser tous les conteneur qui tournent )
docker-compose down ( pour arrêter tous les conteneur )
docker-compose down <name conteneur>
docker-compose up <name> (pour spécifier un conteneur à relancer)
docker-compose logs -f <conteneur> (pour logger en temps)

Utilisation :
Ouvrir un Browser => https://localhost:3000
