#!/bin/sh
set -eu

: "${API_BASE_URL:=http://localhost:8000}"

envsubst '${API_BASE_URL}' \
  < /usr/share/nginx/html/runtime-config.template.js \
  > /usr/share/nginx/html/runtime-config.js
