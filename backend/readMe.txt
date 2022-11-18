1- Se placer sur le backend
cd backend

2- Ajout d'un fichier ".env" dans le backend.
//Dedans, ajouter ces variables d'environement: 

PORT =  "Numero de port du serveur" (doit correspondre avec celui du frontend[voir readme frontend])
MDB_USER = "Nom utilisateur MongoDB"
MDB_PASSWORD = "Mdp MongoDB" 
JWT_SECRET = "chaîne de caractères aléatoire" 

3- Installation des dépencances: 
npm i


4- LANCER SERVER :
npm run start

