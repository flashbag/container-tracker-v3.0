<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $companies = [
            [
                "name" => "APL",
                "adapter" => "App\Models\Adapters\ParseAdapterApl",
                "enabled" => false,
            ],
            [
                "name" => "CMA CGM",
                "adapter" => "App\Models\Adapters\ParseAdapterCmaCgm",
                "enabled" => false,
            ],
            [
                "name" => "CONTAINERSHIPS",
                "adapter" => "App\Models\Adapters\ParseAdapterContainerships",
                "enabled" => false,
            ],
            [
                "name" => "COSCO",
                "adapter" => "cosco",
                "enabled" => true,
                "priority" => 3
            ],
            [
                "name" => "CSCL",
                "adapter" => "App\Models\Adapters\ParseAdapterCscl",
                "enabled" => false,
            ],
            [
                "name" => "EVERGREEN",
                "adapter" => "App\Models\Adapters\ParseAdapterEvergreen",
                "enabled" => false,
            ],
            [
                "name" => "HAMBURG SUD",
                "adapter" => "App\Models\Adapters\ParseAdapterHamburgSud",
                "enabled" => false,
            ],
            [
                "name" => "HAPAG LLOYD",
                "adapter" => "App\Models\Adapters\ParseAdapterHapagLloyd",
                "enabled" => false,
            ],
            [
                "name" => "HYUNDAI",
                "adapter" => "App\Models\Adapters\ParseAdapterHyundai",
                "enabled" => false,
            ],
            [
                "name" => "K-LINE",
                "adapter" => "App\Models\Adapters\ParseAdapterKLine",
                "enabled" => false,
            ],
            [
                "name" => "MAERSK",
                "adapter" => "maersk",
                "enabled" => false,
            ],
            [
                "name" => "MSC",
                "adapter" => "App\Models\Adapters\ParseAdapterMsc",
                "enabled" => false,
            ],
            [
                "name" => "NYK",
                "adapter" => "App\Models\Adapters\ParseAdapterNyk",
                "enabled" => false,
            ],
            [
                "name" => "OOCL",
                "adapter" => "App\Models\Adapters\ParseAdapterOocl",
                "enabled" => false,
                "priority" => 2
            ],
            [
                "name" => "SAFMARINE",
                "adapter" => "App\Models\Adapters\ParseAdapterSafmarine",
                "enabled" => false,
            ],
            [
                "name" => "SINOKOR",
                "adapter" => "App\Models\Adapters\ParseAdapterSinokor",
                "enabled" => false,
            ],
            [
                "name" => "YANG MING",
                "adapter" => "App\Models\Adapters\ParseAdapterYangMing",
                "enabled" => false,
                "priority" => 1
            ],
            [
                "name" => "ZIM",
                "adapter" => "App\Models\Adapters\ParseAdapterZim",
                "enabled" => false,
            ],
        ];


        $hamburgSuedOld = Company::where('name', 'HAMBURG SUED')->first();

        if ($hamburgSuedOld) {
            $hamburgSuedOld->prefixes->each->delete();
            $hamburgSuedOld->delete();
        }

        foreach ($companies as $company) {

            Company::updateOrCreate(
                [ 'name' => $company['name'] ],
                $company
            );

        }
    }
}
