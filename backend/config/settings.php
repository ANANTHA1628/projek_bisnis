<?php

return [
    'defaults' => [

        // ===== ⚙️ PENGATURAN =====
        'company_name'     => 'Posa Coffee',
        'company_whatsapp' => '',

        // Nomor antrian (reset tiap hari)
        'queue_enabled' => '0',

        // Tipe order (Dine in selalu aktif)
        'order_types' => [
            ['key' => 'dine_in',  'label' => 'Dine in',  'enabled' => true, 'locked' => true],
            ['key' => 'takeaway', 'label' => 'Takeaway', 'enabled' => true, 'locked' => false],
        ],

        // Aplikasi delivery (markup % dari harga menu)
        'delivery_apps' => [
            ['key' => 'gofood',     'label' => 'GoFood',     'enabled' => true,  'markup_percent' => 0],
            ['key' => 'grabfood',   'label' => 'GrabFood',   'enabled' => true,  'markup_percent' => 0],
            ['key' => 'shopeefood', 'label' => 'ShopeeFood', 'enabled' => false, 'markup_percent' => 0],
        ],

        // Persetujuan supervisor (PIN owner/supervisor)
        'approve_manual_discount' => '1',
        'approve_void_item'       => '1',

        // Teks struk
        'receipt_top'    => '',
        'receipt_bottom' => 'Terima kasih sudah mampir ☕',

        'cash_drawer_count' => '1',
        'timezone'          => 'Asia/Jakarta',
        'kitchen_screen'    => '0',
        'qris_image'        => '',

        // Belum ada UI-nya, tapi ada di PRD
        'pb1_percent' => '10',

        // ===== 🎨 TAMPILAN =====
        'theme'               => 'system',
        'bg_tone'             => 'neutral',
        'color_strength'      => 'balanced',
        'main_color'          => '#2563eb',
        'button_color'        => 'same',
        'button_color_custom' => '',
        'text_size'           => 'normal',
        'cart_position'       => 'right',
        'button_size'         => 'standard',
        'logo_path'           => '',
        'show_business_name'  => '1',
        'language'            => 'id',
    ],
];
