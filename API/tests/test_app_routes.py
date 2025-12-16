"""Pytest suite for FastAPI application routes and health endpoints."""

import sys
from pathlib import Path

import pytest


# Ensure the API package is importable when tests are executed from the repository root.
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from app.main import app


def test_root_endpoint():
    """Root endpoint should report API status and metadata."""
    route = next(route for route in app.routes if getattr(route, "path", "") == "/")
    payload = route.endpoint()

    assert payload.get("status") == "API is running"
    assert "name" in payload
    assert "version" in payload
    assert payload.get("docs") == "/docs"


def test_health_endpoint():
    """Health check endpoint should confirm service availability."""
    route = next(route for route in app.routes if getattr(route, "path", "") == "/health")
    response = route.endpoint()

    assert response == {"status": "healthy"}


@pytest.mark.parametrize(
    "path",
    [
        "/register",
        "/login",
        "/profile",
        "/games",
        "/user/games",
        "/matches",
        "/messages",
        "/notifications",
        "/stats/platform",
        "/search/players",
    ],
)
def test_routes_are_registered(path):
    """Ensure key domain routes are registered on the FastAPI application."""
    registered_paths = {route.path for route in app.routes}

    assert path in registered_paths, f"Expected route {path} to be registered"
