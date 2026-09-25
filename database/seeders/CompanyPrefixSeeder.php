<?php

namespace Database\Seeders;

use App\Models\{Company, CompanyPrefix};
use Illuminate\Database\Seeder;

class CompanyPrefixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $companiesPrefixes = [
            "APL" => [
                "APH",
                "API",
                "APL",
                "APR",
                "APZ",
            ],

            "CMA CGM" => [
                "AMC",
                "ANN",
                "APZ",
                "BEA",
                "BMO",
                "CGH",
                "CGM",
                "CGT",
                "CMA",
                "CMN",
                "CNC",
                "CAI",
                "CAX",
                "CRX",
                "ECM",
                "FCI",
                "GES",
                "GLD",
                "INK",
                "SEG",
                "TCL",
                "TCN",
                "TGH",
                "TLL",
                "TRH",
                "TRI",
                "XIN",
            ],

            "CONTAINERSHIPS" => [
                "CSF",
                "CSO",
            ],

            "COSCO" => [
                "BCG",
                "BEA",
                "CBH",
                "CCL",
                "CSL",
                "CSN",
                "FCI",
                "GES",
                "MAG",
                "SEG",
                "TCL",
                "TEM",
                "TLL",
            ],

            "CSCL" => [
                "CCL",
                "CSL",
                "CSC",
            ],

            "EVERGREEN" => [
                "BMO",
                "DRY",
                "DRY",
                "EGH",
                "EIS",
                "EIT",
                "EMC",
                "EMC",
                "GES",
                "HMC",
                "MAG",
                "TCN",
                "TEM",
                "TGB",
                "TGH",
            ],

            "HAMBURG SUD" => [
                "CAD",
                "SUD"
            ],

            "HAPAG LLOYD" => [
                "AZL",
                "CAC",
                "CAS",
                "CLG",
                "CMU",
                "CPS",
                "CSQ",
            ],

            "HYUNDAI" => [
                "HDM",
            ],

            "K-LINE" => [
                "AKL",
                "TTN"
            ],

            "MAERSK" => [
                "ACT",
                "AJC",
                "APM",
                "BSL",
                "CSS",
                "CAX",
                "INK",
                "MRK",
                "MRS",
                "MSK",
                "PON",
                "UES",
            ],

            "MSC" => [
                "AMF",
                "BMO",
                "CAI",
                "CAR",
                "CAX",
                "CLH",
                "CRS",
                "CRX",
                "DFO",
                "DRY",
                "FCI",
                "FSC",
                "GES",
                "GLD",
                "INK",
                "MED",
                "MSC",
                "SEG",
                "SZL",
                "TCL",
                "TCN",
                "TEM",
                "TGH",
                "TRL",
                "TTN",
                "UES",
                "XIN",
            ],

            "NYK" => [
                "NYK"
            ],

            "OOCL" => [
                "OOL"
            ],

            "SAFMARINE" => [
                "CMB",
            ],

            "SINOKOR" => [
                "SKL",
                "TCK"
            ],

            "YANG MING" => [
                "TEM",
                "TRH",
                "YML",
                "YMM",
            ],

            "ZIM" => [
                "CRS",
                "TLL",
                "ZCS"
            ]
        ];

        foreach ($companiesPrefixes as $companyName => $prefixes) {

            $companyModel = Company::where('name', $companyName)->first();

            if (!$companyModel) {
                continue;
            }

            $companyPrefixes = $companyModel->prefixes;

            foreach ($prefixes as $prefix) {

                $prefixExists = $companyPrefixes->where('prefix', $prefix)->count();

                if (!$prefixExists) {

                    $prefixModel = new CompanyPrefix(['prefix' => $prefix]);

                    $companyModel->prefixes()->save($prefixModel);

                }
            }

        }
    }
}
