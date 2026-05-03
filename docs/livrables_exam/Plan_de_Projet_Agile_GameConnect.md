# Plan de projet agile - GameConnect

## Methode

Le projet peut etre presente avec une methode agile simplifiee de type Scrum/Kanban. Les taches sont suivies dans Trello et decoupees en user stories.

## Roles

| Role | Responsabilite |
| --- | --- |
| Product owner | Priorise les besoins et valide les fonctionnalites. |
| Developpeur backend | API FastAPI, securite, base de donnees. |
| Developpeur frontend | Interfaces React, services Axios, tests UI. |
| Testeur | Scenarios de tests, validation fonctionnelle. |
| DevOps | Docker, variables d'environnement, deploiement. |

## Backlog par lots

| Lot | Contenu | Priorite |
| --- | --- | --- |
| Lot 1 | Authentification, compte utilisateur, JWT. | Haute |
| Lot 2 | Profil joueur et catalogue de jeux. | Haute |
| Lot 3 | Matching et acceptation/refus. | Haute |
| Lot 4 | Messagerie et notifications. | Moyenne |
| Lot 5 | Statistiques, recherche et activite. | Moyenne |
| Lot 6 | Docker, tests et documentation. | Haute |

## Exemple de sprint

| Sprint | Objectif | Resultat attendu |
| --- | --- | --- |
| Sprint 1 | Mettre en place le squelette API/frontend/BDD. | Application lancable localement. |
| Sprint 2 | Gerer comptes et profils. | Inscription, connexion, profil. |
| Sprint 3 | Gerer les jeux et le matching. | Suggestions de joueurs compatibles. |
| Sprint 4 | Ajouter messagerie, notifications et stats. | Parcours utilisateur complet. |
| Sprint 5 | Stabiliser, tester et documenter. | Dossier examen et deploiement Docker. |

## Definition of Done

Une tache est terminee si :

- le code est integre au projet ;
- les donnees sont sauvegardees correctement ;
- les erreurs principales sont gerees ;
- la fonctionnalite est testee manuellement ou automatiquement ;
- la documentation est mise a jour si necessaire.
