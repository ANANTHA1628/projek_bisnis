<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date')->index();
            $table->timestamp('clock_in')->nullable();
            $table->timestamp('clock_out')->nullable();
            $table->string('type', 30)->default('shift'); // 'shift', 'lembur', 'harian'
            $table->enum('status', ['hadir', 'terlambat', 'izin', 'sakit', 'alpa'])->default('hadir');
            $table->text('notes')->nullable();
            $table->string('location_in', 100)->nullable();
            $table->string('location_out', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
