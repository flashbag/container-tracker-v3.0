<?php

namespace Tests\Feature;

use App\Models\Company;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyPrefixLookupTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeders_populate_companies_and_prefixes(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThan(0, Company::count());
        $this->assertNotNull(Company::where('name', 'MAERSK')->first());
        $this->assertGreaterThan(0, Company::where('name', 'MAERSK')->first()->prefixes->count());
    }

    public function test_owner_is_resolved_by_container_number_prefix(): void
    {
        $this->seed(DatabaseSeeder::class);

        $owner = Company::getOwnerByContainerNumber('MSKU1234567');

        $this->assertNotNull($owner);
        $this->assertSame('MAERSK', $owner->name);
    }

    public function test_unknown_prefix_returns_null(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertNull(Company::getOwnerByContainerNumber('QQQ1234567'));
    }
}
