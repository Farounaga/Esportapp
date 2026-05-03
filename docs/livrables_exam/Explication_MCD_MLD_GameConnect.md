# Explication MCD / MLD - GameConnect

## Objectif du modele de donnees

Le modele de donnees doit representer les utilisateurs, leur profil de joueur, les jeux qu'ils pratiquent, les mises en relation, les messages, les notifications et l'activite.

## Entites principales

| Entite | Description |
| --- | --- |
| Utilisateur | Compte avec email, pseudo et mot de passe hache. |
| Profil | Informations sociales et e-sport de l'utilisateur. |
| Jeu | Catalogue des jeux disponibles. |
| UtilisateurJeu | Association entre un utilisateur et un jeu. |
| Preference | Preferences de mode de jeu et horaires. |
| Match | Mise en relation entre deux utilisateurs. |
| Message | Message prive entre deux utilisateurs. |
| Notification | Information envoyee a un utilisateur. |
| Activite | Trace technique d'une action utilisateur. |

## Cardinalites principales

| Relation | Cardinalite | Justification |
| --- | --- | --- |
| Utilisateur - Profil | 1,1 | Un utilisateur possede un seul profil. |
| Utilisateur - Jeu | N,N | Un joueur peut jouer a plusieurs jeux et un jeu concerne plusieurs joueurs. |
| Utilisateur - Match | 1,N | Un joueur peut avoir plusieurs matchs. |
| Utilisateur - Message | 1,N | Un joueur peut envoyer et recevoir plusieurs messages. |
| Utilisateur - Notification | 1,N | Un joueur peut recevoir plusieurs notifications. |

## Passage au MLD

Le passage au MLD introduit :

- des cles primaires `id` ;
- des cles etrangeres vers `users` et `games` ;
- une table d'association `user_games` pour la relation N-N ;
- une contrainte unique `(user_id, game_id)` ;
- une contrainte unique sur les matchs `(user1_id, user2_id)` ;
- des index pour ameliorer les performances.

## Tables SQL importantes

| Table | Cle primaire | Cles etrangeres |
| --- | --- | --- |
| `users` | `id` | Aucune |
| `user_profiles` | `id` | `user_id` vers `users` |
| `games` | `id` | Aucune |
| `user_games` | `id` | `user_id`, `game_id` |
| `matches` | `id` | `user1_id`, `user2_id` |
| `messages` | `id` | `sender_id`, `receiver_id` |
| `notifications` | `id` | `user_id`, `from_user_id` |
| `user_activity_logs` | `id` | `user_id` |

## Fichiers associes

- MCD Mermaid : `docs/03_conception/mcd.mmd`
- MLD Mermaid : `docs/03_conception/mld.mmd`
- Schema SQL Docker : `deploy/docker/mysql-init/00_schema.sql`
- Schema SQL local : `localsetup/database.sql`
