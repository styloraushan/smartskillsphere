<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with SmartSkillSphere baseline data.
     */
    public function run(): void
    {
        // 1. Roles
        $adminRoleId = (string) Str::uuid();
        $studentRoleId = (string) Str::uuid();
        $modRoleId = (string) Str::uuid();

        DB::table('roles')->insert([
            ['id' => $adminRoleId, 'name' => 'admin', 'description' => 'Academic Directorate & Faculty Admin', 'created_at' => now()],
            ['id' => $studentRoleId, 'name' => 'student', 'description' => 'Aspirants & Enrolled Students', 'created_at' => now()],
            ['id' => $modRoleId, 'name' => 'moderator', 'description' => 'Content Reviewer & Moderator', 'created_at' => now()],
        ]);

        // 2. Initial Admin User
        $adminUserId = (string) Str::uuid();
        DB::table('users')->insert([
            'id' => $adminUserId,
            'role_id' => $adminRoleId,
            'name' => 'Academic Directorate',
            'email' => 'admin@smartskillsphere.com',
            'password' => bcrypt('AdminSecret2026!'),
            'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            'target_exam' => 'Faculty Oversight',
            'streak_count' => 42,
            'xp_points' => 12800,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Initial Student User
        $studentUserId = (string) Str::uuid();
        DB::table('users')->insert([
            'id' => $studentUserId,
            'role_id' => $studentRoleId,
            'name' => 'Guest',
            'email' => 'inforaushan03@gmail.com',
            'password' => bcrypt('StudentSecret2026!'),
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            'target_exam' => 'Campus Placements & GATE CS',
            'streak_count' => 14,
            'xp_points' => 3450,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Subjects
        $subAptId = (string) Str::uuid();
        $subTechId = (string) Str::uuid();
        $subLrId = (string) Str::uuid();

        DB::table('subjects')->insert([
            ['id' => $subAptId, 'name' => 'Quantitative Aptitude', 'slug' => 'quantitative-aptitude', 'icon' => 'Calculator', 'description' => 'Arithmetic, Algebra, Geometry and Modern Math'],
            ['id' => $subTechId, 'name' => 'Technical Practice', 'slug' => 'technical-practice', 'icon' => 'Code2', 'description' => 'Data Structures, OS, DBMS and Computer Networks'],
            ['id' => $subLrId, 'name' => 'Logical Reasoning', 'slug' => 'logical-reasoning', 'icon' => 'Compass', 'description' => 'Syllogisms, Blood Relations, Puzzles & Critical Thinking'],
        ]);
    }
}
