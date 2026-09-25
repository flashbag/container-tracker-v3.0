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
                "adapter" => "apl",
                "enabled" => false,
            ],
            [
                "name" => "CMA CGM",
                "adapter" => "cma-cgm",
                "enabled" => false,
            ],
            [
                "name" => "CONTAINERSHIPS",
                "adapter" => null,
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
                "adapter" => null,
                "enabled" => false,
            ],
            [
                "name" => "EVERGREEN",
                "adapter" => null,
                "enabled" => false,
            ],
            [
                "name" => "HAMBURG SUD",
                "adapter" => "hamburg-sud",
                "enabled" => false,
            ],
            [
                "name" => "HAPAG LLOYD",
                "adapter" => "hapag-lloyd",
                "enabled" => false,
            ],
            [
                "name" => "HYUNDAI",
                "adapter" => "hyundai",
                "enabled" => false,
            ],
            [
                "name" => "K-LINE",
                "adapter" => "kline",
                "enabled" => false,
            ],
            [
                "name" => "MAERSK",
                "adapter" => "maersk",
                "enabled" => false,
            ],
            [
                "name" => "MSC",
                "adapter" => "msc",
                "enabled" => false,
            ],
            [
                "name" => "NYK",
                "adapter" => null,
                "enabled" => false,
            ],
            [
                "name" => "OOCL",
                "adapter" => "oocl",
                "enabled" => false,
                "priority" => 2
            ],
            [
                "name" => "SAFMARINE",
                "adapter" => null,
                "enabled" => false,
            ],
            [
                "name" => "SINOKOR",
                "adapter" => null,
                "enabled" => false,
            ],
            [
                "name" => "YANG MING",
                "adapter" => "yang-ming",
                "enabled" => false,
                "priority" => 1
            ],
            [
                "name" => "ZIM",
                "adapter" => "zim",
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
