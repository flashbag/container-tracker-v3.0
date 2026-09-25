<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Adapters\BaseAdapter;
use App\Services\NodeScraper;

use Illuminate\Console\Command;

class ParseAdapterCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parse:adapter {container_number} {--adapter= : Run a single Node scraper adapter (e.g. "fixture") instead of the enabled companies}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search for a container number across all enabled shipping line adapters';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(NodeScraper $scraper)
    {
        $containerNumber = $this->argument('container_number');

        if ($adapterKey = $this->option('adapter')) {
            return $this->runSingleNodeAdapter($scraper, $adapterKey, $containerNumber);
        }

        $companiesEnabled = Company::where('enabled', true)->orderBy('priority', 'asc')->get();

        $this->info("Container No. {$containerNumber}");

        $this->info("Has " . $companiesEnabled->count() . " companies with enabled adapter");

        $mergedData = [];

        foreach ($companiesEnabled as $company) {

            $this->info("Searching through '$company->name' adapter");

            try {
                $data = $this->runAdapter($scraper, $company->adapter, $containerNumber);
            } catch (\Throwable $e) {
                $this->error("Adapter '$company->name' failed: " . $e->getMessage());
                continue;
            }

            if (!empty($data)) {
                $this->info("Found data!");
                print_r($data);

                $mergedData = array_merge($mergedData, $data);
            }

            echo PHP_EOL;
        }

        if (empty($mergedData)) {
            $this->info("Nothing found...");
        } else {
            $this->info("Search finished! Collected " . count($mergedData) . " rows");
            $this->info("Merged data from sources:");

            print_r($mergedData);
        }

    }

    /**
     * Companies carry either a Node adapter key (e.g. "cosco", a file in
     * scraper/adapters/) or, for carriers not yet ported, a legacy PHP
     * adapter class name.
     */
    protected function runAdapter(NodeScraper $scraper, string $adapter, string $containerNumber): array
    {
        if (!class_exists($adapter)) {
            return $scraper->run($adapter, $containerNumber);
        }

        /** @var BaseAdapter $legacyAdapter */
        $legacyAdapter = new $adapter($containerNumber);
        $legacyAdapter->processToTracking();

        return $legacyAdapter->getData();
    }

    protected function runSingleNodeAdapter(NodeScraper $scraper, string $adapterKey, string $containerNumber): int
    {
        $this->info("Container No. {$containerNumber}");
        $this->info("Running Node adapter '{$adapterKey}'");

        try {
            $data = $scraper->run($adapterKey, $containerNumber);
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        if (empty($data)) {
            $this->info("Nothing found...");
        } else {
            print_r($data);
        }

        return self::SUCCESS;
    }
}
