# Sea Shipping Lines Parser

Looks up a container number across the tracking pages of major sea shipping
lines. Built on Laravel; scraping is done with Puppeteer.

The core entity is **Company**, with the fields:

- `name` — carrier name
- `adapter` — a Node scraper adapter key (a file in `scraper/adapters/`), or a
  legacy PHP adapter class for carriers not yet ported
- `enabled` — turns the adapter on/off
- `priority` — search order across adapters

## Setup

Requires PHP 8.3+, Composer, and Node 18+.

```bash
composer setup
npm install
```

This installs dependencies, creates `.env`, generates the app key, and runs
migrations (SQLite by default; set the `DB_*` variables in `.env` for MySQL).

Seed the carriers and their BIC owner-code prefixes:

```bash
php artisan db:seed
```

## Usage

```bash
php artisan parse:adapter {container_number}
```

The command runs every enabled adapter in priority order and prints the merged
results. To run a single Node adapter directly (bypassing the database):

```bash
php artisan parse:adapter MSKU1234567 --adapter=fixture
```

To test a single carrier through the database, set `enabled => true` for it
(and `false` for the rest) in `Database\Seeders\CompanySeeder` and re-run the
seeder.

## Scraping architecture

Scraping runs in a standalone Node/Playwright service in `scraper/`. PHP
invokes it through `App\Services\NodeScraper`, which shells out to:

```bash
node scraper/index.js <adapter> <containerNumber> [--headed] [--screenshot=<path>] [--timeout=<ms>]
```

and reads one JSON object from stdout. Each adapter is a module in
`scraper/adapters/` exporting `name` and `async track(page, containerNumber)`
returning an array of rows (`type`, `date`, `event`, `place`); the CLI tags
each row with its `source`. The `fixture` adapter drives a local HTML page and
exists so the full PHP → Node → browser pipeline can be tested hermetically
(see `tests/Feature/NodeScraperTest.php`). Set `SCRAPER_CHROMIUM_PATH` to use
a system-provided Chromium instead of Playwright's downloaded browsers.

### Migration status

Carriers are being ported from the old `nesk/puphpeteer` PHP adapters (that
bridge is abandoned and PHP 8-incompatible; the legacy classes under
`app/Models/Adapters/` remain only as the selector-flow reference and throw if
run). Ported so far: **COSCO** and **Maersk** — translated 1:1 from the 2020
selectors and **not yet verified against the carriers' current sites**. The
remaining carriers still carry their legacy class name in the `companies`
table until ported.

## Node side (`app-node/`)

A separate small Node app (Knex + MySQL) with a work-in-progress BIC
owner-code generator:

```bash
npm install
npm run dev-app-node
```
