# 05 - Tests

## Strategie de test

La strategie combine :

- tests unitaires frontend avec Jest et React Testing Library ;
- tests d'integration API par script Python utilisant `requests` ;
- tests manuels de parcours utilisateur ;
- verification du deploiement Docker par healthchecks.

## Plan de tests fonctionnels

| ID | Scenario | Precondition | Resultat attendu |
| --- | --- | --- | --- |
| TF01 | Inscription utilisateur | API et BDD demarrees | Compte cree, profil cree, JWT retourne. |
| TF02 | Connexion | Compte existant | JWT retourne et stocke par le frontend. |
| TF03 | Modification profil | Utilisateur connecte | Les nouvelles donnees apparaissent apres rechargement. |
| TF04 | Ajout d'un jeu | Utilisateur connecte, catalogue rempli | Le jeu est associe au profil. |
| TF05 | Doublon jeu | Meme jeu deja ajoute | L'API refuse ou evite le doublon grace a la contrainte unique. |
| TF06 | Recherche de matchs | Utilisateur avec au moins un jeu | Liste de profils compatibles ou message informatif. |
| TF07 | Acceptation d'un match | Match pending | Statut passe a accepted. |
| TF08 | Refus d'un match | Match pending | Statut passe a rejected. |
| TF09 | Envoi de message autorise | Match accepted | Message insere et visible dans la conversation. |
| TF10 | Envoi de message non autorise | Aucun match accepted | Reponse HTTP 403. |
| TF11 | Notification lue | Notification existante | `is_read` passe a true. |
| TF12 | Deploiement Docker | Docker disponible | Frontend, API et BDD passent en healthy. |

## Tests unitaires frontend

Tests presents dans `frontend/src/__tests__` :

| Fichier | Objet teste |
| --- | --- |
| `AuthContext.test.jsx` | Gestion du contexte d'authentification. |
| `Avatar.test.jsx` | Rendu du composant avatar. |
| `FormInput.test.jsx` | Comportement des champs de formulaire. |
| `Messages.test.jsx` | Interface de messagerie. |
| `ThemeContext.test.jsx` | Gestion du theme. |
| `Toast.test.jsx` | Notifications visuelles cote frontend. |

Commande :

```bash
cd frontend
npm install
npm test
```

Avec couverture :

```bash
npm run test:coverage
```

## Tests API

Script present : `API/tests/test_api.py`.

Ce script teste :

- disponibilite de l'API ;
- inscription ;
- connexion ;
- recuperation du profil ;
- mise a jour du profil ;
- recuperation des jeux ;
- ajout d'un jeu utilisateur ;
- recherche de matchs.

Commande :

```bash
cd API
pip install -r requirements.txt
python tests/test_api.py
```

Preconditions :

- API lancee sur `http://localhost:8000` ;
- MySQL demarre et schema initialise ;
- jeux de reference disponibles en base pour tester l'ajout de jeu.

## Tests techniques de securite

| Point verifie | Methode |
| --- | --- |
| Mot de passe faible | Validation Pydantic pendant l'inscription. |
| Identifiants incorrects | `POST /login` doit retourner HTTP 401. |
| Route protegee sans JWT | Requete sans header `Authorization`. |
| JWT invalide | Requete avec token modifie. |
| Message sans match accepte | `POST /messages` doit retourner HTTP 403. |
| Profil prive | Le profil ne doit pas etre propose dans le matching. |

## Rapport de tests a renseigner avant soutenance

| Date | Environnement | Commande | Resultat |
| --- | --- | --- | --- |
| A completer | Local frontend | `npm test` | A completer |
| A completer | Local API + MySQL | `python tests/test_api.py` | A completer |
| A completer | Docker Compose | `docker compose up -d --build` | A completer |

## Limites actuelles des tests

- Le script API est un test d'integration manuel, pas encore un test Pytest automatise.
- Les tests backend ne couvrent pas encore tous les endpoints : notifications, stats, recherche et suppression logique des messages.
- Les tests de securite sont documentes mais doivent etre executes systematiquement avant livraison.
- Aucun rapport de couverture backend n'est encore genere.
