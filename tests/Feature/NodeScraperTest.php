<?php

namespace Tests\Feature;

use App\Services\NodeScraper;
use Symfony\Component\Process\ExecutableFinder;
use Tests\TestCase;

class NodeScraperTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (!(new ExecutableFinder())->find('node')) {
            $this->markTestSkipped('node is not installed');
        }

        if (!is_dir(base_path('node_modules/playwright'))) {
            $this->markTestSkipped('playwright is not installed (run npm install)');
        }
    }

    public function test_fixture_adapter_returns_tracking_rows(): void
    {
        $rows = (new NodeScraper())->run('fixture', 'MSKU1234567');

        $this->assertNotEmpty($rows);
        $this->assertSame('MSKU1234567', $rows[0]['container']);
        $this->assertSame('Fixture', $rows[0]['source']);
        $this->assertArrayHasKey('place', $rows[0]);
    }

    public function test_unknown_adapter_throws_with_available_adapters(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('no-such-adapter');

        (new NodeScraper())->run('no-such-adapter', 'MSKU1234567');
    }
}
