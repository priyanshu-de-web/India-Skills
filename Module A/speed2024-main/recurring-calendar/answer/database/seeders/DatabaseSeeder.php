<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

//        Task::create([
//            "title" => "tomorrow task",
//            "task_date" => "2024-03-24",
//        ]);
//
//        Task::create([
//            "title" => "next task",
//            "task_date" => "2024-04-01",
//        ]);

//        Task::create([
//            "title" => "date 2",
//            "task_date" => "2024-03-01",
//            "recurring_cycle" => 2,
//            "recurring_type" => "D",
//            "recurring_end_date" => "2024-03-29"
//        ]);
//
//        Task::create([
//            "title" => "Week 1",
//            "task_date" => "2024-03-15",
//            "recurring_cycle" => 1,
//            "recurring_type" => "W"
//        ]);

        Task::create([
            "title" => "month 1",
            "task_date" => "2023-12-31",
            "recurring_cycle" => 2,
            "recurring_type" => "M"
        ]);

        Task::create([
            "title" => "Year 1",
            "task_date" => "2024-02-29",
            "recurring_cycle" => 2,
            "recurring_type" => "Y"
        ]);
    }
}
