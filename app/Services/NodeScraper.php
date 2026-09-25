<?php

namespace App\Services;

use RuntimeException;
use Symfony\Component\Process\Process;

/**
 * Bridge to the Node/Playwright scraping service in scraper/.
 *
 * Runs `node scraper/index.js <adapter> <containerNumber>` and returns the
 * decoded rows. Adapter keys map to files in scraper/adapters/.
 */
class NodeScraper
{
    public const TIMEOUT_SECONDS = 120;

    /**
     * @return array<int, array<string, string>> tracking rows, each tagged with its source
     */
    public function run(string $adapterKey, string $containerNumber): array
    {
        $process = new Process(
            ['node', base_path('scraper/index.js'), $adapterKey, trim($containerNumber)],
            base_path(),
        );
        $process->setTimeout(self::TIMEOUT_SECONDS);

        $process->run();

        $result = json_decode($process->getOutput(), true);

        if (!is_array($result)) {
            throw new RuntimeException(sprintf(
                "Scraper produced no JSON for adapter '%s' (exit code %d): %s",
                $adapterKey,
                $process->getExitCode(),
                trim($process->getErrorOutput()) ?: trim($process->getOutput()),
            ));
        }

        if (!($result['ok'] ?? false)) {
            throw new RuntimeException(sprintf(
                "Scraper adapter '%s' failed: %s",
                $adapterKey,
                $result['error'] ?? 'unknown error',
            ));
        }

        return $result['rows'] ?? [];
    }
}
