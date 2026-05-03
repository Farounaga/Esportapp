# Note de cadrage - GameConnect

## Contexte

GameConnect est une plateforme sociale e-sport. Elle permet a des joueurs de creer un profil, d'indiquer leurs jeux, leur niveau et leurs preferences, puis d'etre mis en relation avec des coequipiers compatibles.

## Probleme identifie

Les joueurs utilisent souvent plusieurs outils differents pour trouver des partenaires : Discord, forums, plateformes de jeu, reseaux sociaux. Cette dispersion rend la recherche de coequipiers moins efficace.

## Objectif du projet

Centraliser les informations importantes d'un joueur et proposer un systeme de matching base sur des criteres concrets : jeux en commun, niveau, region, fuseau horaire et objectif recherche.

## Perimetre

### Inclus

- Inscription et connexion.
- Gestion du profil utilisateur.
- Catalogue de jeux.
- Association utilisateur-jeu.
- Matching de joueurs.
- Acceptation ou refus de matchs.
- Messagerie entre matchs acceptes.
- Notifications.
- Statistiques et recherche.
- Deploiement Docker.

### Hors perimetre initial

- Paiement ou abonnement.
- Application mobile native.
- Moderation avancee.
- Chat temps reel WebSocket.
- Connexion directe a Steam, Riot ou Twitch.

## Public cible

- Joueurs casual cherchant des partenaires reguliers.
- Joueurs competitifs cherchant une equipe.
- Communautes e-sport amateurs.

## Contraintes

- Projet web compatible BTS SIO SLAM.
- Base de donnees relationnelle MySQL.
- API REST separee du frontend.
- Authentification securisee.
- Documentation claire pour installation, tests et deploiement.

## Livrables

- Code source versionne sur GitHub.
- Scripts SQL de creation de base.
- Documentation technique et utilisateur.
- Plan de tests.
- MCD, MLD et diagrammes.
- Guide de deploiement Docker.
