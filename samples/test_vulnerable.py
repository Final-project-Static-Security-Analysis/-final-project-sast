"""
test_vulnerable.py — Intentionally vulnerable Python code for testing PyScanner.
DO NOT use in production. All vulnerabilities are intentional.
"""

import sqlite3
import subprocess
import os
import pickle
import hashlib
import random
import requests
from flask import Flask, request, render_template_string

app = Flask(__name__)

# ──────────────────────────────────────────
# CWE-200: Hardcoded secrets
# ──────────────────────────────────────────
DATABASE_PASSWORD = "SuperSecret123!"        # CWE-200
AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"      # CWE-200
SECRET_TOKEN = "my-jwt-secret-do-not-share"  # CWE-200


# ──────────────────────────────────────────
# CWE-89: SQL Injection
# ──────────────────────────────────────────
def get_user(username):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # Direct string concatenation — SQL injection
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()


def search_products(keyword):
    conn = sqlite3.connect("products.db")
    cursor = conn.cursor()
    # f-string interpolation — SQL injection
    cursor.execute(f"SELECT * FROM products WHERE name LIKE '%{keyword}%'")
    return cursor.fetchall()


# ──────────────────────────────────────────
# CWE-78: OS Command Injection
# ──────────────────────────────────────────
def ping_host(host):
    # shell=True with user input — command injection
    result = subprocess.run(f"ping -c 4 {host}", shell=True, capture_output=True)
    return result.stdout


def list_files(directory):
    # os.system with user input
    os.system("ls -la " + directory)


# ──────────────────────────────────────────
# CWE-22: Path Traversal
# ──────────────────────────────────────────
@app.route("/read-file")
def read_file():
    filename = request.args.get("file")
    # No sanitization — path traversal possible (../../etc/passwd)
    with open(filename, "r") as f:
        return f.read()


@app.route("/download")
def download():
    base = "/var/www/uploads/"
    path = request.args.get("path")
    # Still vulnerable — base path bypass possible
    return open(base + path).read()


# ──────────────────────────────────────────
# CWE-94: Code Injection
# ──────────────────────────────────────────
@app.route("/eval")
def eval_code():
    expr = request.args.get("expr")
    result = eval(expr)           # Direct eval of user input — RCE
    return str(result)


@app.route("/execute")
def execute_code():
    code = request.form.get("code")
    exec(code)                    # exec of user-supplied code — RCE
    return "executed"


# ──────────────────────────────────────────
# CWE-79: XSS
# ──────────────────────────────────────────
@app.route("/greet")
def greet():
    name = request.args.get("name", "")
    # Direct injection into HTML — stored/reflected XSS
    return render_template_string(f"<h1>Hello, {name}!</h1>")


@app.route("/search")
def search():
    query = request.args.get("q", "")
    # No escaping
    return f"<p>Results for: {query}</p>"


# ──────────────────────────────────────────
# CWE-502: Insecure Deserialization
# ──────────────────────────────────────────
@app.route("/load-session", methods=["POST"])
def load_session():
    data = request.data
    # pickle.loads on user data — arbitrary code execution
    session = pickle.loads(data)
    return str(session)


# ──────────────────────────────────────────
# CWE-918: SSRF
# ──────────────────────────────────────────
@app.route("/fetch")
def fetch_url():
    url = request.args.get("url")
    # User-controlled URL — SSRF to internal services
    response = requests.get(url)
    return response.text


# ──────────────────────────────────────────
# CWE-327/328: Weak Cryptography
# ──────────────────────────────────────────
def hash_password(password):
    # MD5 for password hashing — completely broken
    return hashlib.md5(password.encode()).hexdigest()


def generate_token():
    # random is not cryptographically secure
    return str(random.randint(100000, 999999))


# ──────────────────────────────────────────
# CWE-862: Missing Authorization
# ──────────────────────────────────────────
@app.route("/admin/delete-user", methods=["POST"])
def delete_user():
    # No authentication or authorization check!
    user_id = request.form.get("user_id")
    conn = sqlite3.connect("users.db")
    conn.execute(f"DELETE FROM users WHERE id = {user_id}")
    conn.commit()
    return "deleted"


@app.route("/admin/export-data")
def export_all_data():
    # No role check — any user can export all data
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    return str(cursor.fetchall())


if __name__ == "__main__":
    app.run(debug=True)  # debug=True in production — exposes debugger
