#!/usr/bin/env bash
set -euo pipefail

echo "== Nginx config test =="
sudo nginx -t || { echo "nginx -t failed"; exit 1; }

echo "\n== Nginx reload (dry run suggested) =="
echo "Run: sudo systemctl reload nginx"

echo "\n== Systemd: finance-app status =="
sudo systemctl status finance-app --no-pager || true

echo "\n== Recent journal entries for finance-app =="
sudo journalctl -u finance-app -n 200 --no-pager || true

echo "\n== Listening sockets for port 8000 =="
sudo ss -ltnp | grep :8000 || true

echo "\n== Quick curl tests =="
echo "Django (direct):"
curl -sS -D - http://127.0.0.1:8000/ | sed -n '1,20p' || true

echo "\nNginx local (Host header):"
curl -sS -D - -H "Host: finance.mstatilitechnologies.com" http://127.0.0.1/ | sed -n '1,20p' || true

echo "\nNginx public TLS test (insecure):"
curl -sS -D - https://finance.mstatilitechnologies.com/ --insecure | sed -n '1,20p' || true

echo "\n== File permissions to check =="
ls -ld /home/finance.mstatilitechnologies.com/public_html || true
ls -ld /home/finance.mstatilitechnologies.com/public_html/staticfiles || true
ls -ld /home/finance.mstatilitechnologies.com/logs || true
ls -l /home/finance.mstatilitechnologies.com/logs/gunicorn-*.log || true

echo "\nChecks complete. If nginx needs to pick up the new site file, copy the repo file to /etc/nginx/sites-available and enable the symlink to sites-enabled, then run: sudo systemctl reload nginx";
