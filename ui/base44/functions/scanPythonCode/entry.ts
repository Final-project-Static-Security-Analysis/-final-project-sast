import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { code } = await req.json();

  if (!code || typeof code !== 'string') {
    return Response.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  // Use LLM with a strict prompt to perform real AST-based SAST analysis
  const prompt = `You are a Python static analysis security tool (SAST) that uses AST analysis.

Analyze the following Python code for security vulnerabilities. You must:
1. Mentally parse the code as if using Python's ast module (ast.parse, ast.walk)
2. Identify dangerous AST node patterns using the FULL rule set below.
3. For each finding, provide the EXACT line number, the exact code snippet on that line, and generate proper SARIF output.
4. Also produce a full AST walk trace showing every relevant node visited, and for each VULNERABLE node explain WHY it is flagged.

## DETECTION RULES — apply ALL of these:

### Already supported (keep existing logic):
- PVS001 SQL Injection: string concatenation / % formatting / f-string directly in SQL execute() calls.
- PVS002 Path Traversal: open() / os.path.join() / file ops where argument flows from request/user input without sanitization.
- PVS003 Code Injection / Eval: eval(), exec(), compile() called with non-constant argument.
- PVS004 Deserialization: pickle.loads(), pickle.load(), yaml.load() without Loader=yaml.SafeLoader, marshal.loads().
- PVS005 Hardcoded Secret / Sensitive Exposure: variable named password/secret/api_key/token/key assigned a string literal, OR such a variable printed/logged/returned in a response.

### NEW rules to add:

- PVS006 Reflected XSS (Flask/Django): user-controlled input (request.args, request.form, request.GET, request.POST, request.data) flows into an HTTP response without escaping — e.g. return request.args.get('x'), HttpResponse(user_input), render_template_string(user_input), Markup(user_input). Flag Call nodes where a request-derived value reaches a response-output sink without passing through escape()/markupsafe.escape()/bleach.clean().

- PVS007 Stored XSS (Flask/Django): user-controlled input written to a DB (e.g. db.session.add(), Model.save(), cursor.execute INSERT with user data) AND separately read back and rendered unsanitized into an HTML response. Flag both the write and the render sink when both are present in the same file. Note in the message that this is a Stored XSS pattern.

- PVS008 CSRF — Missing CSRF Protection (Flask/Django): a route handler for POST/PUT/DELETE/PATCH that does NOT have a @csrf_protect decorator, does NOT check request.form.get('csrf_token'), and does NOT use Flask-WTF CSRFProtect or Django's {% csrf_token %}. Look for @app.route(..., methods=[...'POST'...]) or @require_POST without any CSRF guard. Flag the route definition.

- PVS009 Missing Authorization: a route handler / view function that accesses sensitive operations (DB write, file write, admin action) without any authorization check — no @login_required, no current_user check, no request.user.is_authenticated, no JWT decode, no session['user'] check anywhere in the function body or its decorators. Only flag if the function clearly performs a privileged action.

- PVS010 OS Command Injection: subprocess.call/run/Popen/check_output with shell=True and a non-constant argument, or os.system() / os.popen() called with a non-constant argument that includes user input or string concatenation. Also flag paramiko exec_command() with concatenated strings.

- PVS011 Unrestricted File Upload: a route that accepts file uploads (request.files) and saves the file without checking its extension or MIME type. Specifically: no check against an allowlist of extensions (e.g. ALLOWED_EXTENSIONS), no filename.rsplit('.', 1) allowlist check, no imghdr/filetype check before saving. Flag werkzeug FileStorage.save() / open(filename, 'wb') calls inside upload handlers that lack extension validation.

- PVS012 SSRF (Server-Side Request Forgery): requests.get/post/put/request() or urllib.request.urlopen() called where the URL argument is derived from user input (request.args, request.form, request.json, request.data) without validation against an allowlist. Flag the Call node and note that an attacker can force the server to fetch internal resources.

- PVS013 Improper Input Validation: a route handler that takes user input (request.form, request.args, request.json, request.data) and uses it in a sensitive operation (DB query, file operation, redirect, arithmetic/financial calculation) without any validation — no type casting (int(), float()), no range check, no regex validation, no allowlist check. Also flag open redirect patterns where redirect() is called with a user-supplied URL without verifying it starts with '/' or belongs to an allowlist. Flag the point where unvalidated input flows into the sensitive operation.

IMPORTANT: Be precise. Only report real findings. For safe code, return zero findings. Do NOT flag sanitized/validated patterns as vulnerable.

Python code to analyze:
\`\`\`python
${code}
\`\`\`

Return a JSON object with this exact structure:
{
  "findings": [
    {
      "ruleId": string (e.g. "PVS001"),
      "ruleName": string (e.g. "SQL Injection"),
      "severity": "critical" | "high" | "medium" | "low",
      "message": string (specific explanation of this exact finding),
      "line": number (1-based line number),
      "column": number (1-based column, or 1 if unknown),
      "snippet": string (the exact vulnerable line of code, trimmed),
      "fix": string (concrete fix recommendation),
      "cwe": string (e.g. "CWE-89"),
      "owasp": string (e.g. "A03:2021")
    }
  ],
  "ast_trace": {
    "steps": [
      {
        "step": number (sequential step index starting at 1),
        "action": "PARSE" | "WALK" | "VISIT" | "CHECK" | "FLAG" | "SAFE",
        "node_type": string (AST node class, e.g. "Module", "FunctionDef", "Call", "Assign", "BinOp"),
        "node_detail": string (brief description, e.g. "func=eval, args=[Name(id='expr')]"),
        "line": number or null,
        "result": "visiting" | "safe" | "suspicious" | "vulnerable" | "flagged",
        "reason": string (why this node is interesting or flagged — explain the AST logic, e.g. "Call node where func.id == 'eval' and arg is Name (variable), not Constant — taint possible"),
        "finding_id": string or null (ruleId if this step produced a finding, else null)
      }
    ],
    "summary": string (1-2 sentence summary of the AST walk process)
  },
  "sarif": {
    "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    "version": "2.1.0",
    "runs": [
      {
        "tool": {
          "driver": {
            "name": "PyVulnScan",
            "version": "1.0.0",
            "informationUri": "https://github.com/pyVulnScan",
            "rules": []
          }
        },
        "results": []
      }
    ]
  },
  "summary": {
    "total": number,
    "critical": number,
    "high": number,
    "medium": number,
    "low": number,
    "linesAnalyzed": number
  },
  "safe_code": string (a complete, corrected, fully working version of the input code with ALL vulnerabilities fixed. Apply best-practice security patches: parameterized queries, allowlists, input validation, escape functions, etc. Preserve the original structure and logic — only change what is necessary to fix security issues. Add inline comments on each fixed line explaining what was changed and why. If the code is already safe, return it unchanged.)
}

Fill "sarif.runs[0].tool.driver.rules" with one entry per unique ruleId:
{ "id": ruleId, "name": ruleName, "shortDescription": { "text": message }, "helpUri": owasp_url }

Fill "sarif.runs[0].results" with one entry per finding:
{
  "ruleId": ruleId,
  "level": "error" for critical/high, "warning" for medium, "note" for low,
  "message": { "text": message },
  "locations": [{ "physicalLocation": { "artifactLocation": { "uri": "input.py" }, "region": { "startLine": line, "startColumn": column, "snippet": { "text": snippet } } } }]
}

For ast_trace.steps: include 8-20 steps. Start with PARSE (Module), then walk top-level nodes (FunctionDef/ClassDef/Import), then for each function walk its body nodes, focusing on Call nodes and BinOp nodes. Mark suspicious ones as "suspicious" while checking arguments, and finally "flagged" for confirmed vulnerabilities. Safe patterns get "safe". Make the trace educational and show the actual AST reasoning.`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ruleId: { type: 'string' },
              ruleName: { type: 'string' },
              severity: { type: 'string' },
              message: { type: 'string' },
              line: { type: 'number' },
              column: { type: 'number' },
              snippet: { type: 'string' },
              fix: { type: 'string' },
              cwe: { type: 'string' },
              owasp: { type: 'string' },
            },
          },
        },
        ast_trace: {
          type: 'object',
          properties: {
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  step: { type: 'number' },
                  action: { type: 'string' },
                  node_type: { type: 'string' },
                  node_detail: { type: 'string' },
                  line: { type: 'number' },
                  result: { type: 'string' },
                  reason: { type: 'string' },
                  finding_id: { type: 'string' },
                },
              },
            },
            summary: { type: 'string' },
          },
        },
        sarif: { type: 'object' },
        safe_code: { type: 'string' },
        summary: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            critical: { type: 'number' },
            high: { type: 'number' },
            medium: { type: 'number' },
            low: { type: 'number' },
            linesAnalyzed: { type: 'number' },
          },
        },
      },
    },
    model: 'claude_sonnet_4_6',
  });

  return Response.json(result);
});