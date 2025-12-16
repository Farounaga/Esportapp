"""Unit-style tests for individual route functions with mocked dependencies."""

import sys
from pathlib import Path
from types import SimpleNamespace
from typing import Any, List, Optional

import pytest
from fastapi import HTTPException

# Ensure the API package is importable when tests are executed from the repository root.
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from app.routes import auth, games, matching  # noqa: E402
from app.models.game import UserGame  # noqa: E402


class DummySession:
    """Lightweight stand-in for :class:`DatabaseSession` used in route handlers."""

    def __init__(
        self,
        *,
        fetchone_results: Optional[List[Any]] = None,
        fetchall_result: Optional[Any] = None,
        rowcount: int = 0,
        lastrowid: int = 0,
    ):
        self.fetchone_iter = iter(fetchone_results or [])
        self.fetchall_result = fetchall_result
        self.rowcount = rowcount
        self.lastrowid = lastrowid
        self.queries: List[tuple[str, Any]] = []

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def execute(self, query: str, params: Any = None):  # noqa: ANN401
        self.queries.append((query, params))

    def fetchone(self):
        return next(self.fetchone_iter, None)

    def fetchall(self):
        return self.fetchall_result


@pytest.fixture(autouse=True)
def reset_db_session(monkeypatch):
    """Restore DatabaseSession import to the real object after each test."""

    yield
    monkeypatch.undo()


def test_register_creates_user(monkeypatch):
    dummy_db = DummySession(fetchone_results=[None], lastrowid=42)
    monkeypatch.setattr(auth, "DatabaseSession", lambda **kwargs: dummy_db)
    monkeypatch.setattr(auth, "hash_password", lambda pwd: f"hashed-{pwd}")
    monkeypatch.setattr(auth, "create_access_token", lambda user_id: f"token-{user_id}")

    payload = SimpleNamespace(
        email="user@example.com",
        username="newuser",
        password="secret",
        profile={},
    )

    result = auth.register(payload)

    assert result["success"] is True
    assert result["token"] == "token-42"
    assert result["user"] == {"id": 42, "email": "user@example.com", "username": "newuser"}


def test_register_existing_user(monkeypatch):
    dummy_db = DummySession(fetchone_results=[{"id": 1}])
    monkeypatch.setattr(auth, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        auth.register(SimpleNamespace(email="dup@example.com", username="dup", password="x", profile={}))

    assert exc.value.status_code == 400


def test_login_success(monkeypatch):
    db_user = {"id": 5, "username": "demo", "password_hash": "pw", "email_verified": 1}
    dummy_db = DummySession(fetchone_results=[db_user])
    monkeypatch.setattr(auth, "DatabaseSession", lambda **kwargs: dummy_db)
    monkeypatch.setattr(auth, "verify_password", lambda pwd, hash_: True)
    monkeypatch.setattr(auth, "create_access_token", lambda user_id: f"token-{user_id}")

    result = auth.login(SimpleNamespace(email="demo@example.com", password="pw"))

    assert result["token"] == "token-5"
    assert result["user"]["email_verified"] is True


def test_login_invalid(monkeypatch):
    db_user = {"id": 5, "username": "demo", "password_hash": "pw", "email_verified": 1}
    dummy_db = DummySession(fetchone_results=[db_user])
    monkeypatch.setattr(auth, "DatabaseSession", lambda **kwargs: dummy_db)
    monkeypatch.setattr(auth, "verify_password", lambda pwd, hash_: False)

    with pytest.raises(HTTPException) as exc:
        auth.login(SimpleNamespace(email="demo@example.com", password="wrong"))

    assert exc.value.status_code == 401


def test_get_all_games(monkeypatch):
    games_list = [
        {"id": 1, "name": "Game A", "category": "FPS", "icon_url": None},
        {"id": 2, "name": "Game B", "category": "RPG", "icon_url": "http://icon"},
    ]
    dummy_db = DummySession(fetchall_result=games_list)
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    result = games.get_all_games()

    assert result == games_list
    assert dummy_db.queries, "Expected database queries to be executed"


def test_add_user_game_not_found(monkeypatch):
    dummy_db = DummySession(fetchone_results=[None])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    user_game = UserGame(game_id=99)
    with pytest.raises(HTTPException) as exc:
        games.add_user_game(user_game, user_id=123)

    assert exc.value.status_code == 404


def test_add_user_game_duplicate(monkeypatch):
    dummy_db = DummySession(fetchone_results=[{"id": 1, "name": "Valorant"}, {"id": 10}])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        games.add_user_game(UserGame(game_id=1), user_id=123)

    assert exc.value.status_code == 409


def test_add_user_game_success(monkeypatch):
    dummy_db = DummySession(fetchone_results=[{"id": 1, "name": "Valorant"}, None])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    result = games.add_user_game(UserGame(game_id=1, skill_level="advanced"), user_id=123)

    assert result["success"] is True
    assert "added to your profile" in result["message"]


def test_update_user_game_missing(monkeypatch):
    dummy_db = DummySession(fetchone_results=[None])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        games.update_user_game(5, UserGame(game_id=5), user_id=321)

    assert exc.value.status_code == 404


def test_update_user_game_success(monkeypatch):
    dummy_db = DummySession(fetchone_results=[{"id": 15}])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    result = games.update_user_game(5, UserGame(game_id=5, hours_played=100), user_id=321)

    assert result == {"success": True, "message": "Game updated successfully"}


def test_remove_user_game_missing(monkeypatch):
    dummy_db = DummySession(fetchone_results=[None])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        games.remove_user_game(game_id=7, user_id=55)

    assert exc.value.status_code == 404


def test_remove_user_game_success(monkeypatch):
    dummy_db = DummySession(fetchone_results=[{"name": "Apex Legends"}])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    result = games.remove_user_game(game_id=7, user_id=55)

    assert result["success"] is True
    assert "removed from your profile" in result["message"]


def test_search_games_builds_query(monkeypatch):
    dummy_db = DummySession(fetchall_result=[{"id": 1, "name": "Game", "category": "Action", "icon_url": None}])
    monkeypatch.setattr(games, "DatabaseSession", lambda **kwargs: dummy_db)

    result = games.search_games(q="Game", category="Action")

    assert result == dummy_db.fetchall_result
    assert any("AND name LIKE" in query for query, _ in dummy_db.queries)
    assert any("AND category" in query for query, _ in dummy_db.queries)


def test_find_matches_no_games(monkeypatch):
    monkeypatch.setattr(matching, "find_matches_advanced", lambda user_id, limit=10: [])
    dummy_db = DummySession(fetchone_results=[{"count": 0}])
    monkeypatch.setattr(matching, "DatabaseSession", lambda **kwargs: dummy_db)

    result = matching.find_matches(user_id=1, limit=5)

    assert result == {"matches": [], "message": "Ajoute des jeux à ton profil pour trouver des matchs"}


def test_find_matches_with_candidates(monkeypatch):
    candidates = [
        {"user_id": 2, "match_score": 88},
        {"user_id": 3, "match_score": 75},
    ]
    monkeypatch.setattr(matching, "find_matches_advanced", lambda user_id, limit=10: candidates)
    monkeypatch.setattr(matching, "create_match_record", lambda user1, user2, score: user2 * 10)

    result = matching.find_matches(user_id=1, limit=2)

    assert result["matches"][0]["match_id"] == 20
    assert result["matches"][1]["match_id"] == 30


def test_accept_match_not_found(monkeypatch):
    dummy_db = DummySession(rowcount=0)
    monkeypatch.setattr(matching, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        matching.accept_match(match_id=10, user_id=5)

    assert exc.value.status_code == 404


def test_accept_match_success(monkeypatch):
    dummy_db = DummySession(rowcount=1)
    monkeypatch.setattr(matching, "DatabaseSession", lambda **kwargs: dummy_db)

    result = matching.accept_match(match_id=10, user_id=5)

    assert result == {"success": True, "message": "Match accepted"}


def test_reject_match_not_found(monkeypatch):
    dummy_db = DummySession(rowcount=0)
    monkeypatch.setattr(matching, "DatabaseSession", lambda **kwargs: dummy_db)

    with pytest.raises(HTTPException) as exc:
        matching.reject_match(match_id=11, user_id=4)

    assert exc.value.status_code == 404


def test_reject_match_success(monkeypatch):
    dummy_db = DummySession(rowcount=2)
    monkeypatch.setattr(matching, "DatabaseSession", lambda **kwargs: dummy_db)

    result = matching.reject_match(match_id=11, user_id=4)

    assert result == {"success": True, "message": "Match rejected"}
