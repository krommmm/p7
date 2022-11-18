*README disponible sur frontend et backend



############################################
############ Installer frontend ############

1- Se placer sur frontend
cd frontend

2- installation dépendances
npm i 

3- Configuration port serveur:
indiquer le port dans src/components/varGlobal.js

4- LANCER APP: 
npm run start





###########################################
############ Installer backend ############

1- Se placer sur le backend
cd backend

2- Ajout d'un fichier ".env" dans le backend.
//Dedans, ajouter ces variables d'environement: 

PORT =  "NumeroDePortDuServeur" (doit correspondre avec celui du frontend[voir readme frontend])
MDB_USER = "NomUtilisateurMongoDB"
MDB_PASSWORD = "MdpMongoDB" 
JWT_SECRET = "mettreUnToken" 

3- Installation des dépencances: 
npm i


4- LANCER SERVER :
npm run start
