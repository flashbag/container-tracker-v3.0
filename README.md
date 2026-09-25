# Sea Shipping Lines Parser

Looks up a container number across the tracking pages of major sea shipping
lines. Built on Laravel; scraping is done with Puppeteer.

The core entity is **Company**, with the fields:

- `name` — carrier name
- `adapter` — class of the parsing adapter
- `enabled` — turns the adapter on/off
- `priority` — search order across adapters

## Setup

Requires PHP 8.3+ and Composer.

```bash
composer setup
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
results. To test a single adapter, set `enabled => true` for it (and `false`
for the rest) in `Database\Seeders\CompanySeeder` and re-run the seeder.

All adapters extend the abstract `App\Models\Adapters\BaseAdapter`, which
receives the container number and opens the carrier's tracking page in a
browser.

## Browser automation status

The original PHP↔Node bridge (`nesk/puphpeteer`) is abandoned and incompatible
with PHP 8 and current Puppeteer, so it is no longer a dependency and the PHP
adapters cannot drive a browser right now — `parse:adapter` will throw a clear
error when it reaches an adapter. The scraping layer is being replaced by a
standalone Node service (see the prototypes in `puppeteer/` and `app-node/`);
the carrier adapters' selectors also date from 2020 and need re-verification
against today's carrier sites.

## Node side (`app-node/`)

A separate small Node app (Knex + MySQL) with a work-in-progress BIC
owner-code generator:

```bash
npm install
npm run dev-app-node
```
