#!/usr/bin/env python3
"""
Run script for the API server.
Usage: python run.py
"""

import os

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("ENV", "development") != "production",
    )
