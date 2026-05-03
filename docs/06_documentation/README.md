# 06 - Documentation technique et utilisateur

## Guide d'installation technique

### Prerequis

- Git
- Python 3.10 ou superieur
- Node.js 18 ou superieur
- MySQL 8 ou Docker
- Docker Compose pour le deploiement conteneurise

### Installation recommandee avec Docker

1. Cloner le depot :

```bash
git clone https://github.com/Farounaga/Esportapp.git
cd Esportapp
```

2. Copier ou creer les variables d'environnement si necessaire :

```bash
copy deploy\docker\.env.example .env
```

3. Modifier les secrets :

```env
MYSQL_ROOT_PASSWORD=mot_de_passe_root
MYSQL_DATABASE=esport_social
MYSQL_USER=esport_user
MYSQL_PASSWORD=mot_de_passe_app
JWT_SECRET=secret_long_et_unique
CORS_ORIGINS=http://localhost:8080
```

4. Lancer les services :

```bash
docker compose up -d --build
```

5. Verifier les services :

```bash
docker compose ps
```

Acces :

- Application : `http://localhost:8080`
- API : `http://localhost:8000`
- Documentation Swagger : `http://localhost:8000/docs`

## Guide de deploiement

Le projet peut etre deploye sur une seule machine avec `docker-compose.yml` ou sur plusieurs VM avec les fichiers dans `deploy/docker/vm`.

Topologie recommandee :

| VM | Service | Exposition |
| --- | --- | --- |
| VM 1 | MySQL | Reseau prive uniquement |
| VM 2 | API FastAPI | Accessible par le frontend |
| VM 3 | Frontend Nginx | Accessible par les utilisateurs |

Bonnes pratiques :

- Changer tous les mots de passe par defaut.
- Utiliser un `JWT_SECRET` long et aleatoire.
- Restreindre `CORS_ORIGINS` au domaine reel du frontend.
- Sauvegarder regulierement le volume MySQL.
- Ne pas exposer MySQL publiquement.

## Documentation utilisateur

### Creer un compte

1. Aller sur la page d'inscription.
2. Renseigner email, pseudo et mot de passe.
3. Completer les informations de profil utiles : region, niveau, bio, plateformes.
4. Valider l'inscription.

### Se connecter

1. Aller sur la page de connexion.
2. Saisir email et mot de passe.
3. Une fois connecte, la navigation donne acces au profil, aux jeux, au matching et aux messages.

### Completer son profil

1. Ouvrir la page Profil.
2. Modifier les informations personnelles et gaming.
3. Choisir la visibilite du profil.
4. Enregistrer les modifications.

### Ajouter un jeu

1. Ouvrir la page Jeux.
2. Selectionner un jeu du catalogue.
3. Indiquer son niveau, son rang, son temps de jeu et si le jeu est favori.
4. Valider l'ajout.

### Trouver des coequipiers

1. Ouvrir la page Matching.
2. Lancer la recherche de matchs.
3. Consulter les profils proposes et leur score.
4. Accepter ou refuser les propositions.

### Envoyer un message

1. Avoir un match accepte avec un autre joueur.
2. Ouvrir la page Messages.
3. Selectionner la conversation.
4. Saisir et envoyer le message.

### Gerer les notifications

1. Ouvrir le centre de notifications.
2. Lire les notifications recentes.
3. Marquer une notification comme lue ou supprimer les notifications inutiles.

## Depannage

| Probleme | Cause possible | Solution |
| --- | --- | --- |
| Le frontend ne contacte pas l'API | `API_BASE_URL` incorrect | Verifier `frontend/public/runtime-config.js` ou la variable Docker. |
| Erreur CORS | Origine frontend non autorisee | Modifier `CORS_ORIGINS`. |
| Connexion MySQL impossible | Identifiants ou host incorrects | Verifier `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`. |
| Token refuse | JWT expire ou secret different | Se reconnecter et verifier `JWT_SECRET`. |
| Aucun match trouve | Aucun jeu ajoute ou pas de profil compatible | Ajouter des jeux et verifier les donnees de test. |
| Docker API unhealthy | BDD pas prete ou schema absent | Consulter `docker compose logs api db`. |
