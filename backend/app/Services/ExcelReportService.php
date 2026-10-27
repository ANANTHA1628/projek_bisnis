<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelReportService
{
    /**
     * Menghasilkan file Excel (.xlsx) multi-sheet dari data transaksi dan bahan.
     */
    public function generate(array $transactions, ?array $rawMaterials = null, ?array $periodInfo = null): string
    {
        $spreadsheet = new Spreadsheet;

        $headerColor = '1E293B';
        $zebraColor = 'F8FAFC';
        $kpiCardColor = 'EFF6FF';

        // -------------------------------------------------------------
        // SHEET 1: RINGKASAN & KPI
        // -------------------------------------------------------------
        $ws1 = $spreadsheet->getActiveSheet();
        $ws1->setTitle('Ringkasan');
        $ws1->setShowGridLines(true);

        $ws1->setCellValue('A1', 'LAPORAN KEUANGAN & PENJUALAN');
        $ws1->getStyle('A1')->getFont()->setBold(true)->setSize(16)->getColor()->setARGB('0F172A');

        $period = $periodInfo ? "Periode: {$periodInfo['startDate']} s/d {$periodInfo['endDate']}" : 'Periode: Keseluruhan';
        $ws1->setCellValue('A2', $period);
        $ws1->getStyle('A2')->getFont()->setItalic(true)->setSize(10)->getColor()->setARGB('64748B');

        $totalOmset = array_sum(array_column($transactions, 'total'));
        $totalTrx = count($transactions);
        $avgTrx = $totalTrx > 0 ? (int) ($totalOmset / $totalTrx) : 0;
        $totalTax = array_sum(array_column($transactions, 'tax'));
        $totalCost = array_sum(array_column($transactions, 'cost'));
        $grossProfit = $totalOmset - $totalTax - $totalCost;

        $ws1->setCellValue('A4', 'METRIK KUNCI');
        $ws1->getStyle('A4')->getFont()->setBold(true)->setSize(12);

        $kpis = [
            ['Total Omset Bruto', $totalOmset],
            ['Total Transaksi Selesai', $totalTrx],
            ['Rata-rata per Transaksi', $avgTrx],
            ['Total Pajak PB1 (10%)', $totalTax],
            ['Estimasi HPP Bahan', $totalCost],
            ['Estimasi Laba Kotor', $grossProfit],
        ];

        $row = 5;
        foreach ($kpis as [$label, $val]) {
            $ws1->setCellValue("A{$row}", $label);
            $ws1->setCellValue("B{$row}", $val);

            $ws1->getStyle("A{$row}:B{$row}")->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB($kpiCardColor);

            $ws1->getStyle("A{$row}:B{$row}")->getBorders()->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('CBD5E1');

            if ($label !== 'Total Transaksi Selesai') {
                $ws1->getStyle("B{$row}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
            }
            $ws1->getStyle("B{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $row++;
        }

        // Breakdown Metode Bayar
        $ws1->setCellValue('D4', 'METODE PEMBAYARAN');
        $ws1->getStyle('D4')->getFont()->setBold(true)->setSize(12);

        $ws1->setCellValue('D5', 'Metode');
        $ws1->setCellValue('E5', 'Jml Trx');
        $ws1->setCellValue('F5', 'Nominal');
        $ws1->getStyle('D5:F5')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($headerColor);
        $ws1->getStyle('D5:F5')->getFont()->setBold(true)->getColor()->setARGB('FFFFFF');

        $methodTotals = [];
        foreach ($transactions as $t) {
            $m = $t['method'] ?? 'Lainnya';
            if (! isset($methodTotals[$m])) {
                $methodTotals[$m] = ['count' => 0, 'total' => 0];
            }
            $methodTotals[$m]['count']++;
            $methodTotals[$m]['total'] += ($t['total'] ?? 0);
        }

        $mRow = 6;
        foreach ($methodTotals as $method => $d) {
            $ws1->setCellValue("D{$mRow}", $method);
            $ws1->setCellValue("E{$mRow}", $d['count']);
            $ws1->setCellValue("F{$mRow}", $d['total']);
            $ws1->getStyle("F{$mRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
            $ws1->getStyle("D{$mRow}:F{$mRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('E2E8F0');
            $mRow++;
        }

        // -------------------------------------------------------------
        // SHEET 2: DAFTAR TRANSAKSI
        // -------------------------------------------------------------
        $ws2 = $spreadsheet->createSheet();
        $ws2->setTitle('Transaksi');
        $ws2->setShowGridLines(true);

        $trxHeaders = ['No', 'ID Transaksi', 'Tanggal', 'Jam', 'Pelanggan', 'Meja', 'Tipe', 'Metode', 'Subtotal', 'Pajak PB1', 'Total'];
        $colIdx = 1;
        foreach ($trxHeaders as $th) {
            $ws2->setCellValue([$colIdx, 1], $th);
            $colIdx++;
        }
        $ws2->getStyle('A1:K1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($headerColor);
        $ws2->getStyle('A1:K1')->getFont()->setBold(true)->getColor()->setARGB('FFFFFF');
        $ws2->getRowDimension(1)->setRowHeight(24);

        $tRow = 2;
        foreach ($transactions as $idx => $t) {
            $ws2->setCellValue([1, $tRow], $idx + 1);
            $ws2->setCellValueExplicit([2, $tRow], (string) ($t['id'] ?? $t['invoice_number'] ?? '-'), DataType::TYPE_STRING);
            $ws2->setCellValueExplicit([3, $tRow], (string) ($t['date'] ?? '-'), DataType::TYPE_STRING);
            $ws2->setCellValueExplicit([4, $tRow], (string) ($t['time'] ?? '-'), DataType::TYPE_STRING);
            $ws2->setCellValue([5, $tRow], $t['customer'] ?? '-');
            $ws2->setCellValue([6, $tRow], $t['table'] ?? '-');
            $ws2->setCellValue([7, $tRow], $t['orderType'] ?? $t['order_type'] ?? '-');
            $ws2->setCellValue([8, $tRow], $t['method'] ?? '-');
            $ws2->setCellValue([9, $tRow], $t['subtotal'] ?? 0);
            $ws2->setCellValue([10, $tRow], $t['tax'] ?? 0);
            $ws2->setCellValue([11, $tRow], $t['total'] ?? 0);

            if ($tRow % 2 === 0) {
                $ws2->getStyle("A{$tRow}:K{$tRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($zebraColor);
            }
            $ws2->getStyle("C{$tRow}:D{$tRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $ws2->getStyle("I{$tRow}:K{$tRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
            $ws2->getStyle("A{$tRow}:K{$tRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('E2E8F0');
            $tRow++;
        }

        // Summary Row Transaksi
        if ($tRow > 2) {
            $lastData = $tRow - 1;
            $ws2->setCellValue("H{$tRow}", 'TOTAL');
            $ws2->getStyle("H{$tRow}")->getFont()->setBold(true);
            $ws2->setCellValue("I{$tRow}", "=SUM(I2:I{$lastData})");
            $ws2->setCellValue("J{$tRow}", "=SUM(J2:J{$lastData})");
            $ws2->setCellValue("K{$tRow}", "=SUM(K2:K{$lastData})");
            $ws2->getStyle("I{$tRow}:K{$tRow}")->getFont()->setBold(true);
            $ws2->getStyle("I{$tRow}:K{$tRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
        }

        // -------------------------------------------------------------
        // SHEET 3: RINCIAN ITEM TERJUAL
        // -------------------------------------------------------------
        $ws3 = $spreadsheet->createSheet();
        $ws3->setTitle('Detail Item');
        $ws3->setShowGridLines(true);

        $itemHeaders = ['ID Transaksi', 'Tanggal', 'Nama Produk', 'Qty', 'Harga Satuan', 'Subtotal Item'];
        $c = 1;
        foreach ($itemHeaders as $ih) {
            $ws3->setCellValue([$c, 1], $ih);
            $c++;
        }
        $ws3->getStyle('A1:F1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($headerColor);
        $ws3->getStyle('A1:F1')->getFont()->setBold(true)->getColor()->setARGB('FFFFFF');

        $iRow = 2;
        foreach ($transactions as $t) {
            $tid = $t['id'] ?? $t['invoice_number'] ?? '-';
            $tDate = $t['date'] ?? '-';
            foreach ($t['items'] ?? [] as $item) {
                $qty = $item['quantity'] ?? 1;
                $price = $item['price'] ?? 0;
                $subtotal = $qty * $price;

                $ws3->setCellValueExplicit([1, $iRow], (string) $tid, DataType::TYPE_STRING);
                $ws3->setCellValueExplicit([2, $iRow], (string) $tDate, DataType::TYPE_STRING);
                $ws3->setCellValue([3, $iRow], $item['name'] ?? '-');
                $ws3->setCellValue([4, $iRow], $qty);
                $ws3->setCellValue([5, $iRow], $price);
                $ws3->setCellValue([6, $iRow], $subtotal);

                if ($iRow % 2 === 0) {
                    $ws3->getStyle("A{$iRow}:F{$iRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($zebraColor);
                }
                $ws3->getStyle("B{$iRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $ws3->getStyle("E{$iRow}:F{$iRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
                $ws3->getStyle("A{$iRow}:F{$iRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('E2E8F0');
                $iRow++;
            }
        }

        // -------------------------------------------------------------
        // SHEET 4: STOK BAHAN BAKU (opsional)
        // -------------------------------------------------------------
        if (! empty($rawMaterials)) {
            $ws4 = $spreadsheet->createSheet();
            $ws4->setTitle('Stok Bahan');
            $ws4->setShowGridLines(true);

            $matHeaders = ['Nama Bahan', 'Sisa Stok', 'Satuan', 'Harga Rata-rata', 'Batas Min', 'Status'];
            $c = 1;
            foreach ($matHeaders as $mh) {
                $ws4->setCellValue([$c, 1], $mh);
                $c++;
            }
            $ws4->getStyle('A1:F1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($headerColor);
            $ws4->getStyle('A1:F1')->getFont()->setBold(true)->getColor()->setARGB('FFFFFF');

            $mRow = 2;
            foreach ($rawMaterials as $mat) {
                $stock = $mat['stock'] ?? 0;
                $minStock = $mat['minStock'] ?? $mat['min_stock'] ?? 0;
                $status = $stock <= $minStock ? 'Menipis' : 'Aman';

                $ws4->setCellValue([1, $mRow], $mat['name'] ?? '-');
                $ws4->setCellValue([2, $mRow], $stock);
                $ws4->setCellValue([3, $mRow], $mat['unit'] ?? '-');
                $ws4->setCellValue([4, $mRow], $mat['avgPrice'] ?? $mat['avg_price'] ?? 0);
                $ws4->setCellValue([5, $mRow], $minStock);
                $ws4->setCellValue([6, $mRow], $status);

                if ($status === 'Menipis') {
                    $ws4->getStyle("A{$mRow}:F{$mRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FEE2E2');
                } elseif ($mRow % 2 === 0) {
                    $ws4->getStyle("A{$mRow}:F{$mRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($zebraColor);
                }
                $ws4->getStyle("D{$mRow}")->getNumberFormat()->setFormatCode('"Rp "#,##0');
                $ws4->getStyle("A{$mRow}:F{$mRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('E2E8F0');
                $mRow++;
            }
        }

        // Auto width for all sheets dengan margin minimum agar tidak '###' / 'XXXX'
        foreach ($spreadsheet->getAllSheets() as $sheet) {
            foreach ($sheet->getColumnIterator() as $col) {
                $colIndex = $col->getColumnIndex();
                $sheet->getColumnDimension($colIndex)->setAutoSize(true);
            }
            $sheet->calculateColumnWidths();
            foreach ($sheet->getColumnIterator() as $col) {
                $colIndex = $col->getColumnIndex();
                $currentWidth = $sheet->getColumnDimension($colIndex)->getWidth();
                // Beri ruang ekstra minimal 14 untuk kolom tanggal/ID agar tidak sempit di Excel
                if ($currentWidth < 14) {
                    $sheet->getColumnDimension($colIndex)->setAutoSize(false);
                    $sheet->getColumnDimension($colIndex)->setWidth(max(14, $currentWidth + 3));
                } else {
                    $sheet->getColumnDimension($colIndex)->setAutoSize(false);
                    $sheet->getColumnDimension($colIndex)->setWidth($currentWidth + 2);
                }
            }
        }

        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'posa_excel_');
        $writer->save($tempFile);

        $contents = file_get_contents($tempFile);
        @unlink($tempFile);

        return $contents;
    }
}
