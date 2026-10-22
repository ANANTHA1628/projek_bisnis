<?php

namespace App\Http\Controllers;

use App\Services\ExcelReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    public function __construct(
        protected ExcelReportService $excelService
    ) {}

    /**
     * Ekspor laporan Excel (.xlsx) rapi multi-sheet.
     */
    public function exportExcel(Request $request): Response
    {
        $transactions = $request->input('transactions', []);
        $rawMaterials = $request->input('rawMaterials', []);
        $periodInfo = $request->input('periodInfo', []);

        if (empty($transactions)) {
            return response()->json(['message' => 'Data transaksi kosong'], 400);
        }

        $excelBytes = $this->excelService->generate($transactions, $rawMaterials, $periodInfo);
        $filename = 'laporan_posa_'.date('Ymd_His').'.xlsx';

        return response($excelBytes, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Ekspor laporan PDF resmi siap cetak.
     */
    public function exportPdf(Request $request): Response
    {
        $transactions = $request->input('transactions', []);
        $periodInfo = $request->input('periodInfo', []);

        if (empty($transactions)) {
            return response()->json(['message' => 'Data transaksi kosong'], 400);
        }

        $totalOmset = array_sum(array_column($transactions, 'total'));
        $totalTax = array_sum(array_column($transactions, 'tax'));
        $avgTrx = count($transactions) > 0 ? (int) ($totalOmset / count($transactions)) : 0;

        $pdf = Pdf::loadView('reports.sales_pdf', [
            'transactions' => $transactions,
            'periodInfo' => $periodInfo,
            'totalOmset' => $totalOmset,
            'totalTax' => $totalTax,
            'avgTrx' => $avgTrx,
        ])->setPaper('a4', 'portrait');

        $filename = 'laporan_posa_'.date('Ymd_His').'.pdf';

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
