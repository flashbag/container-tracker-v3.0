<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Adapters\BaseAdapter;

use Illuminate\Console\Command;

class ParseAdapterCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parse:adapter {container_number}';

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
    public function handle()
    {
        $containerNumber = $this->argument('container_number');

        $companiesEnabled = Company::where('enabled', true)->orderBy('priority', 'asc')->get();

        $this->info("Container No. {$containerNumber}");

        $this->info("Has " . $companiesEnabled->count() . " companies with enabled adapter");

        $mergedData = [];

        foreach ($companiesEnabled as $company) {

            $this->info("Searching through '$company->name' adapter");

            /** @var BaseAdapter $adapter */
            $adapter = (new $company->adapter($containerNumber));
            $adapter->processToTracking();

            $data = $adapter->getData();

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
}
