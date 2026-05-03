# 03 - Conception

## MCD

Le modele conceptuel represente les entites principales : utilisateur, profil, jeu, association utilisateur-jeu, preferences, match, message, notification et activite.

Voir aussi le fichier Mermaid : [mcd.mmd](mcd.mmd).

```mermaid
erDiagram
    UTILISATEUR ||--o| PROFIL : possede
    UTILISATEUR ||--o{ UTILISATEUR_JEU : declare
    JEU ||--o{ UTILISATEUR_JEU : est_choisi
    UTILISATEUR ||--o| PREFERENCE : configure
    UTILISATEUR ||--o{ MATCH : joueur_1
    UTILISATEUR ||--o{ MATCH : joueur_2
    UTILISATEUR ||--o{ MESSAGE : envoie
    UTILISATEUR ||--o{ MESSAGE : recoit
    UTILISATEUR ||--o{ NOTIFICATION : recoit
    UTILISATEUR ||--o{ ACTIVITE : genere
```

## MLD

Le MLD est implemente dans `deploy/docker/mysql-init/00_schema.sql`. Il ajoute les cles primaires, cles etrangeres, index, contraintes d'unicite et types enumeres MySQL.

Voir aussi le fichier Mermaid : [mld.mmd](mld.mmd).

Relations principales :

| Table | Role | Relations |
| --- | --- | --- |
| `users` | Compte et authentification | Liee a toutes les donnees utilisateur. |
| `user_profiles` | Profil social et preferences de confidentialite | `user_id` unique vers `users`. |
| `games` | Catalogue des jeux | Liee a `user_games`. |
| `user_games` | Association N-N utilisateur/jeu | Unique sur `(user_id, game_id)`. |
| `matches` | Mise en relation | Deux FK vers `users`. |
| `messages` | Messagerie privee | FK expediteur et destinataire vers `users`. |
| `notifications` | Evenements utilisateur | FK vers le proprietaire et l'utilisateur source. |
| `user_activity_logs` | Traces d'activite | FK vers `users`. |

## Diagramme de classes simplifie

```mermaid
classDiagram
    class FastAPIApp {
        +include_router()
        +health_check()
    }

    class AuthRoutes {
        +register()
        +login()
    }

    class ProfileRoutes {
        +get_profile()
        +update_profile()
        +get_activity_stats()
    }

    class GamesRoutes {
        +get_games()
        +get_user_games()
        +add_user_game()
        +update_user_game()
        +delete_user_game()
    }

    class MatchingRoutes {
        +find_matches()
        +get_matches()
        +accept_match()
        +reject_match()
    }

    class MessageRoutes {
        +get_conversations()
        +get_messages()
        +send_message()
        +delete_message()
    }

    class AuthService {
        +create_access_token()
        +verify_token()
        +hash_password()
        +verify_password()
    }

    class MatchingService {
        +calculate_match_score()
        +find_matches_advanced()
        +create_match_record()
    }

    class ActivityMonitor {
        +log_activity()
        +check_inactive_accounts()
        +get_activity_stats()
        +reactivate_account()
    }

    class DatabaseSession {
        +execute()
        +fetchone()
        +fetchall()
        +lastrowid
        +rowcount
    }

    FastAPIApp --> AuthRoutes
    FastAPIApp --> ProfileRoutes
    FastAPIApp --> GamesRoutes
    FastAPIApp --> MatchingRoutes
    FastAPIApp --> MessageRoutes
    AuthRoutes --> AuthService
    MatchingRoutes --> MatchingService
    ProfileRoutes --> ActivityMonitor
    AuthRoutes --> DatabaseSession
    ProfileRoutes --> DatabaseSession
    GamesRoutes --> DatabaseSession
    MatchingRoutes --> DatabaseSession
    MessageRoutes --> DatabaseSession
```

## Diagrammes de sequence

### Inscription

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend React
    participant A as API FastAPI
    participant S as AuthService
    participant B as MySQL

    U->>F: Remplit le formulaire d'inscription
    F->>A: POST /register
    A->>B: Verifie email et username uniques
    A->>S: hash_password(password)
    S-->>A: password_hash bcrypt
    A->>B: Insere users et user_profiles
    A->>S: create_access_token(user_id)
    S-->>A: JWT
    A-->>F: success, token, user
    F-->>U: Redirection vers l'application
```

### Recherche de matchs

```mermaid
sequenceDiagram
    actor U as Joueur
    participant F as Frontend React
    participant A as API FastAPI
    participant M as MatchingService
    participant B as MySQL

    U->>F: Clique sur recherche de matchs
    F->>A: POST /matches avec JWT
    A->>A: Verifie le token
    A->>M: find_matches_advanced(user_id)
    M->>B: Recupere profil et jeux du joueur
    M->>B: Recupere candidats avec jeux communs
    M->>M: Calcule le score pondere
    M->>B: Cree ou met a jour les matches pending
    A-->>F: Liste des matchs tries par score
    F-->>U: Affiche les suggestions
```

### Envoi d'un message

```mermaid
sequenceDiagram
    actor U as Joueur expediteur
    participant F as Frontend React
    participant A as API FastAPI
    participant B as MySQL
    actor D as Destinataire

    U->>F: Saisit un message
    F->>A: POST /messages avec JWT
    A->>B: Verifie match accepted entre les deux joueurs
    alt Match accepte
        A->>B: Insere le message
        A-->>F: Confirmation
        F-->>U: Message affiche
    else Match non accepte
        A-->>F: HTTP 403
        F-->>U: Message d'erreur
    end
```

## Maquette fonctionnelle

Les ecrans principaux du frontend sont implementes dans `frontend/src/pages`.

| Ecran | Objectif | Route frontend |
| --- | --- | --- |
| Accueil | Presenter la plateforme et les statistiques | `/` |
| Connexion | Authentifier un utilisateur | `/login` |
| Inscription | Creer un compte et profil initial | `/register` |
| Profil | Consulter et modifier ses informations | `/profile` |
| Jeux | Gerer sa bibliotheque de jeux | `/games` |
| Matching | Voir les suggestions de coequipiers | `/matching` |
| Messages | Echanger avec les matchs acceptes | `/messages` |
| Mentions legales, CGU, confidentialite | Informations legales | `/legal`, `/terms`, `/privacy` |

Wireframe simplifie :

```text
+--------------------------------------------------+
| Navigation : logo, accueil, jeux, matching, profil |
+--------------------------------------------------+
| Contenu principal selon la page                   |
| - cartes de profil / jeux / matchs                |
| - formulaires d'edition                           |
| - listes de messages ou notifications             |
+--------------------------------------------------+
| Footer : liens et informations legales            |
+--------------------------------------------------+
```

## Architecture applicative

```mermaid
flowchart TB
    Browser["Navigateur utilisateur"]
    Frontend["Frontend React + Vite"]
    Nginx["Nginx en production"]
    API["API FastAPI"]
    Routes["Routes API"]
    Services["Services metier"]
    DBSession["DatabaseSession"]
    MySQL["MySQL 8"]

    Browser --> Frontend
    Nginx --> Frontend
    Frontend -->|HTTP JSON / Axios| API
    API --> Routes
    Routes --> Services
    Routes --> DBSession
    Services --> DBSession
    DBSession --> MySQL
```

L'architecture suit une separation claire :

- Vue : composants et pages React.
- Controleurs API : routes FastAPI.
- Services metier : authentification, matching, activite.
- Modele de donnees : Pydantic pour les DTO et MySQL pour la persistance.

L'API REST expose des ressources coherentes : `/register`, `/login`, `/profile`, `/games`, `/matches`, `/messages`, `/notifications`, `/stats` et `/search`.
