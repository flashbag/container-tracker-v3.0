<?php /** @noinspection ALL */

namespace App\Models\Adapters;

use Nesk\Puphpeteer\Puppeteer;

abstract class BaseAdapter
{
    public $url;
    public $adapterName;
    public $containerNumber;

    protected $browser;
    protected $page;

    public function __construct(string $containerNumber)
    {
        $this->containerNumber = trim($containerNumber);

        $this->openPage();
    }

    /**
     *
     */
    public function openPage()
    {
        if (!class_exists(Puppeteer::class)) {
            throw new \RuntimeException(
                'The nesk/puphpeteer browser bridge is not installed. It is abandoned and incompatible ' .
                'with PHP 8 / current Puppeteer; the scraping layer is being replaced by a Node service ' .
                '(see README, "Browser automation status").'
            );
        }

        $puppeteer = new Puppeteer();
        $this->browser = $puppeteer->launch([
            'headless' => false,
            'log_browser_console' => true,
            'ignoreHTTPSErrors' => true,
            'args' => ['--no-sandbox', '--disable-setuid-sandbox'],
            'defaultViewport' => [
                'width' => 1200,
                'height' => 600
            ]
        ]);

        $this->page = $this->browser->newPage();
        $this->page->goto($this->url, [
            'waitUntil' => 'networkidle2'
        ]);
    }

    public function makeScreenshot()
    {
        $this->page->screenshot([
            'path' => 'screenshot-' . $this->adapterName . '.png'
        ]);
    }

    protected function appendAdapterName(array $data)
    {
        if (!empty($data)) {
            foreach ($data as $key => $row) {
                $data[$key]['source'] = $this->adapterName;
            }
        }

        return $data;
    }

    protected function debug($var)
    {
        $type = gettype($var);
        $dt = date('Y-m-d H:i:s');

        $string = $dt . ' [ debug: ' .  $this->adapterName . ' ] ';

        if ($type == 'array') {
            $string .= 'ARRAY: '.  json_encode($var);
        } else if ($type == 'string') {
            $string .= $var;
        } else {
            $string .= var_dump($var);
        }

        $string .= PHP_EOL;

        echo $string;
    }

    abstract public function processToTracking();
    abstract public function getData();
}
