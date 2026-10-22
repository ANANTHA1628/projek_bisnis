<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan POS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #1e293b;
            font-size: 11px;
            margin: 0;
            padding: 15px;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .subtitle {
            font-size: 10px;
            color: #64748b;
        }
        .kpi-container {
            width: 100%;
            margin-bottom: 20px;
        }
        .kpi-box {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 10px;
            text-align: center;
            border-radius: 4px;
        }
        .kpi-label {
            font-size: 9px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
        }
        .kpi-val {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 4px;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.data-table th {
            background-color: #1e293b;
            color: #ffffff;
            font-weight: bold;
            padding: 6px 8px;
            font-size: 9px;
            text-align: left;
        }
        table.data-table td {
            padding: 6px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 9.5px;
        }
        tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            font-style: italic;
        }
        .total-row {
            background-color: #e2e8f0 !important;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">POSA - SISTEM KASIR & MANAJEMEN BISNIS</div>
        <div class="subtitle">
            Laporan Penjualan Transaksi &bull;
            Periode: {{ $periodInfo['startDate'] ?? '-' }} s/d {{ $periodInfo['endDate'] ?? '-' }}
        </div>
    </div>

    <!-- KPI Summary Grid -->
    <table class="kpi-container">
        <tr>
            <td width="25%" style="padding-right: 5px;">
                <div class="kpi-box">
                    <div class="kpi-label">Total Omset</div>
                    <div class="kpi-val">Rp {{ number_format($totalOmset, 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="25%" style="padding: 0 5px;">
                <div class="kpi-box">
                    <div class="kpi-label">Total Transaksi</div>
                    <div class="kpi-val">{{ count($transactions) }} Trx</div>
                </div>
            </td>
            <td width="25%" style="padding: 0 5px;">
                <div class="kpi-box">
                    <div class="kpi-label">Rata-rata / Trx</div>
                    <div class="kpi-val">Rp {{ number_format($avgTrx, 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="25%" style="padding-left: 5px;">
                <div class="kpi-box">
                    <div class="kpi-label">Total Pajak PB1</div>
                    <div class="kpi-val">Rp {{ number_format($totalTax, 0, ',', '.') }}</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Transactions Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="4%" class="text-center">No</th>
                <th width="18%">ID Transaksi</th>
                <th width="14%" class="text-center">Waktu</th>
                <th width="18%">Pelanggan</th>
                <th width="12%" class="text-center">Metode</th>
                <th width="20%">Item</th>
                <th width="14%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $idx => $t)
                @php
                    $itemsArr = [];
                    foreach ($t['items'] ?? [] as $it) {
                        $itemsArr[] = ($it['name'] ?? '') . ' (x' . ($it['quantity'] ?? 1) . ')';
                    }
                    $itemsStr = implode(', ', $itemsArr);
                    if (strlen($itemsStr) > 30) {
                        $itemsStr = substr($itemsStr, 0, 28) . '...';
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $idx + 1 }}</td>
                    <td>{{ $t['id'] ?? $t['invoice_number'] ?? '-' }}</td>
                    <td class="text-center">{{ $t['date'] ?? '' }} {{ $t['time'] ?? '' }}</td>
                    <td>{{ $t['customer'] ?? '-' }}</td>
                    <td class="text-center">{{ $t['method'] ?? '-' }}</td>
                    <td>{{ $itemsStr ?: '-' }}</td>
                    <td class="text-right">Rp {{ number_format($t['total'] ?? 0, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="6" class="text-right">GRAND TOTAL</td>
                <td class="text-right">Rp {{ number_format($totalOmset, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Dicetak secara otomatis dari sistem POSA (Laravel & SQLite Backend) &bull; Sah tanpa tanda tangan basah.
    </div>
</body>
</html>
