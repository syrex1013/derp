# Grepagent — Developer Build Guide for AI Agent

This document is a **machine-readable build sequence** designed for an AI agent or automation pipeline. It defines **how to create the full Grepagent TypeScript project from scratch**, including folder structure, file creation order, content templates, build verification, and packaging.

---

## 1️⃣ Project Initialization

**Objective:** Create project root and initialize npm environment.

**Commands:**

```bash
mkdir grepagent && cd grepagent
npm init -y
npm install typescript ts-node pkg chalk axios inquirer ora
npm install --save-dev @types/node
npx tsc --init
```

**Expected Output:**

* `package.json`
* `tsconfig.json`

---

## 2️⃣ Folder Structure Creation

**Objective:** Create the directory tree.

**Commands:**

```bash
mkdir -p src/providers
mkdir -p .github/workflows
```

**Expected Tree:**

```
grepagent/
├─ src/
│  ├─ cli.ts
│  ├─ config.ts
│  ├─ llmRouter.ts
│  ├─ prompts.ts
│  ├─ engines.ts
│  ├─ utils.ts
│  └─ providers/
│     ├─ base.ts
│     ├─ ollama.ts
│     ├─ lmstudio.ts
│     ├─ openai.ts
│     ├─ bedrock.ts
│     └─ openrouter.ts
├─ package.json
├─ tsconfig.json
├─ README.md
├─ LICENSE
├─ .gitignore
└─ .github/workflows/release.yml
```

---

## 3️⃣ File Creation Instructions

### 3.1 `src/utils.ts`

**Purpose:** Utility helpers for path resolution and argument quoting.

**Contents:** Implement `which()`, `quote()`, and `isProbablyNaturalLanguage()` functions.

### 3.2 `src/config.ts`

**Purpose:** Manage persistent configuration.

**Contents:** Create `GrepAgentConfig` interface, `loadConfig()`, and `saveConfig()` using `~/.grepagent.json` path.

### 3.3 `src/prompts.ts`

**Purpose:** Provide LLM prompt templates.

**Contents:** Export `regexPrompt()` returning `system` and `user` strings.

### 3.4 `src/engines.ts`

**Purpose:** Handle grep/ripgrep engine detection and execution.

**Contents:** Implement `resolveEngine()` and `runEngine()` using `child_process.spawn`.

### 3.5 `src/providers/base.ts`

**Purpose:** Define provider interface.

**Contents:** Interface `Provider` with `complete()` returning `{ regex, explanation }`.

### 3.6 Provider Implementations

**Goal:** Implement provider classes with consistent interface.

#### 3.6.1 `src/providers/ollama.ts`

Use `axios.post` to call `/api/chat` endpoint.

#### 3.6.2 `src/providers/lmstudio.ts`

POST to `/v1/chat/completions` with dummy bearer token.

#### 3.6.3 `src/providers/openai.ts`

POST to `https://api.openai.com/v1/chat/completions` using `OPENAI_API_KEY`.

#### 3.6.4 `src/providers/bedrock.ts`

Stub or connect via proxy endpoint defined in `BEDROCK_URL`.

#### 3.6.5 `src/providers/openrouter.ts`

POST to `https://openrouter.ai/api/v1/chat/completions` using `OPENROUTER_API_KEY`.

### 3.7 `src/llmRouter.ts`

**Purpose:** Select provider and handle exceptions.

**Implementation:**

```ts
import { OllamaProvider } from './providers/ollama.js';
...
export async function naturalQueryToRegex(intent, cfg) {
  const { system, user } = regexPrompt(intent);
  // Select provider by cfg.provider
}
```

### 3.8 `src/cli.ts`

**Purpose:** Main executable logic.

**Steps:**

1. Parse arguments.
2. Handle `--init`, `--config`, `--help`.
3. Generate regex via LLM.
4. Display colorized output with chalk.
5. Preview first matches via `spawnSync`.
6. Run engine.

Include banner header (`chalk.bold.blue("grepagent")`).

### 3.9 `package.json`

**Purpose:** Metadata and build scripts.

**Scripts:**

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "node --loader ts-node/esm src/cli.ts --help",
    "pkg": "pkg --targets node18-macos-x64,node18-linux-x64 --output dist/grepagent dist/cli.js",
    "prepublishOnly": "npm run build"
  }
}
```

### 3.10 `tsconfig.json`

Use compiler options for ESM, ES2020 target, outDir `dist`.

### 3.11 `.gitignore`

```
node_modules
.DS_Store
/dist
npm-debug.log*
*.tgz
.grepagent.json
```

### 3.12 `LICENSE`

Insert MIT license text.

### 3.13 `README.md`

Include usage examples, installation instructions, and provider configuration.

### 3.14 `.github/workflows/release.yml`

**Purpose:** Build and upload release assets on version tags.

Use GitHub Actions workflow defined in the Project Guide.

---

## 4️⃣ Build & Verification Commands

```bash
npm install
npm run build
npm link
grepagent --help
grepagent "emails in files" -r . --dry-run --explain
```

Expected output:

* Blue banner header.
* Cyan regex preview.
* Gray explanation.
* Magenta command string.

---

## 5️⃣ Packaging

**Commands:**

```bash
npm run pkg
mkdir release
cp dist/grepagent release/
zip -r grepagent-v0.1.0.zip release
```

Expected artifact:
`release/grepagent-v0.1.0.zip`

---

## 6️⃣ Publishing Pipeline

### GitHub

```bash
gh repo create your/grepagent --public --source=. --remote=origin
git push -u origin main
git tag v0.1.0
git push --tags
gh release create v0.1.0 release/grepagent-v0.1.0.zip \
  --title "grepagent v0.1.0" \
  --notes "Initial AI-powered grep release."
```

### npm

```bash
npm login
npm version patch
npm publish --access public
```

### Homebrew

Create new tap repo `homebrew-grepagent` and add formula referencing GitHub release asset.

### AUR

Generate PKGBUILD (template provided) and push via `aurpublish`.

### Debian

```bash
fpm -s dir -t deb -n grepagent -v 0.1.0 dist/grepagent=/usr/bin/grepagent
```

---

## 7️⃣ Agent Behavior Sequence Summary

1. Initialize npm + TypeScript.
2. Generate folder tree.
3. Write all source and metadata files.
4. Compile and verify CLI output.
5. Build release binaries.
6. Zip and attach assets.
7. Tag and publish to GitHub.
8. Publish to npm registry.
9. Optionally generate platform-specific packages.

---

## 8️⃣ Validation Rules

| Check                | Expected Result                  |
| -------------------- | -------------------------------- |
| `tsc` exit code      | 0                                |
| `grepagent --help`   | Displays usage info              |
| `grepagent 'emails'` | Generates regex and runs grep    |
| `grepagent --init`   | Creates ~/.grepagent.json        |
| `npm run pkg`        | Produces dist/grepagent binaries |
| `zip` artifact       | Exists in /release folder        |

---

## 9️⃣ Environment Variables

```
OPENAI_API_KEY=<key>
OPENROUTER_API_KEY=<key>
OLLAMA_HOST=http://localhost:11434
LMSTUDIO_URL=http://localhost:1234
BEDROCK_URL=https://sigv4-proxy
```

---

## 🔚 Final Expected Outputs

* CLI executable `grepagent`
* npm package published (`grepagent`)
* GitHub Release `v0.1.0` with binaries
* Optional: Homebrew formula, AUR PKGBUILD, Debian `.deb`

---

## 🪶 License

MIT License © 2025 Your Name

