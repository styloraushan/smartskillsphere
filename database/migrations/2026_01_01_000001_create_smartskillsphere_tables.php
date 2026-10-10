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
        // Roles & Permissions
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->foreignUuid('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignUuid('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        // Users
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('role_id')->constrained('roles');
            $table->string('name', 150);
            $table->string('email', 255)->unique();
            $table->string('password');
            $table->text('avatar_url')->nullable();
            $table->string('target_exam', 150)->nullable();
            $table->unsignedInteger('streak_count')->default(0);
            $table->unsignedBigInteger('xp_points')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('email');
            $table->index('xp_points');
        });

        // Subjects & Topics
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150)->unique();
            $table->string('slug', 150)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150)->unique();
            $table->string('slug', 150)->unique();
            $table->string('icon', 100)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('topics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('slug', 150);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['subject_id', 'slug']);
        });

        // Resources & Versions
        Schema::create('resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->foreignUuid('exam_id')->nullable()->constrained('exams')->nullOnDelete();
            $table->foreignUuid('created_by_user_id')->constrained('users');
            $table->string('title', 255);
            $table->text('description');
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced']);
            $table->enum('file_type', ['pdf', 'docx', 'pptx', 'image']);
            $table->unsignedBigInteger('file_size_bytes');
            $table->text('file_storage_path');
            $table->text('thumbnail_url')->nullable();
            $table->enum('visibility', ['published', 'draft', 'archived'])->default('published');
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('download_count')->default(0);
            $table->unsignedInteger('upvotes')->default(0);
            $table->unsignedInteger('downvotes')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('subject_id');
            $table->index('visibility');
            $table->index('is_featured');
        });

        Schema::create('resource_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->text('file_storage_path');
            $table->unsignedBigInteger('file_size_bytes');
            $table->string('file_name', 255);
            $table->text('changelog')->nullable();
            $table->foreignUuid('uploaded_by_user_id')->constrained('users');
            $table->timestamp('uploaded_at')->useCurrent();

            $table->unique(['resource_id', 'version_number']);
        });

        // Questions & Options
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->foreignUuid('exam_id')->nullable()->constrained('exams')->nullOnDelete();
            $table->enum('difficulty', ['Easy', 'Medium', 'Hard']);
            $table->text('question_text');
            $table->text('explanation');
            $table->decimal('marks', 5, 2)->default(2.00);
            $table->decimal('negative_marks', 5, 2)->default(0.50);
            $table->foreignUuid('created_by_user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('question_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->string('option_key', 10);
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('order_index')->default(0);
        });

        // Quizzes & Attempts
        Schema::create('quiz_sets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->enum('difficulty', ['Easy', 'Medium', 'Hard']);
            $table->unsignedInteger('duration_minutes')->default(15);
            $table->decimal('passing_score', 5, 2)->default(40.00);
            $table->boolean('is_live')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->foreignUuid('created_by_user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->foreignUuid('quiz_id')->constrained('quiz_sets')->cascadeOnDelete();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->unsignedInteger('order_index')->default(0);
            $table->primary(['quiz_id', 'question_id']);
        });

        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('quiz_id')->constrained('quiz_sets')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->decimal('score_obtained', 6, 2)->default(0.00);
            $table->decimal('total_possible_marks', 6, 2);
            $table->decimal('accuracy_percentage', 5, 2)->default(0.00);
            $table->unsignedInteger('correct_count')->default(0);
            $table->unsignedInteger('incorrect_count')->default(0);
            $table->unsignedInteger('unattempted_count')->default(0);
            $table->unsignedInteger('time_spent_seconds')->default(0);
            $table->enum('status', ['in_progress', 'completed', 'timed_out'])->default('in_progress');
        });

        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('attempt_id')->constrained('quiz_attempts')->cascadeOnDelete();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->foreignUuid('selected_option_id')->nullable()->constrained('question_options')->nullOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->boolean('is_marked_for_review')->default(false);
            $table->unsignedInteger('time_spent_seconds')->default(0);
            $table->timestamp('answered_at')->useCurrent();

            $table->unique(['attempt_id', 'question_id']);
        });

        // Polls
        Schema::create('polls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('created_by_user_id')->constrained('users');
            $table->text('question');
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->boolean('is_multi_choice')->default(false);
            $table->boolean('is_anonymous')->default(false);
            $table->enum('visibility', ['public', 'voters_only', 'after_end'])->default('public');
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->timestamp('starts_at')->useCurrent();
            $table->timestamp('ends_at');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('poll_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('poll_id')->constrained('polls')->cascadeOnDelete();
            $table->string('option_text', 255);
            $table->unsignedInteger('order_index')->default(0);
        });

        Schema::create('poll_votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('poll_id')->constrained('polls')->cascadeOnDelete();
            $table->foreignUuid('option_id')->constrained('poll_options')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('voted_at')->useCurrent();

            $table->unique(['poll_id', 'option_id', 'user_id']);
        });

        // Mistake Book & Bookmarks
        Schema::create('mistake_book', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->text('user_notes')->nullable();
            $table->boolean('is_mastered')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'question_id']);
        });

        Schema::create('bookmarks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('target_type', ['resource', 'question', 'quiz', 'current_affair']);
            $table->string('target_id', 36);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['user_id', 'target_type', 'target_id']);
        });

        // Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100);
            $table->string('entity_type', 100);
            $table->string('entity_id', 36);
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('bookmarks');
        Schema::dropIfExists('mistake_book');
        Schema::dropIfExists('poll_votes');
        Schema::dropIfExists('poll_options');
        Schema::dropIfExists('polls');
        Schema::dropIfExists('quiz_answers');
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quiz_sets');
        Schema::dropIfExists('question_options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('resource_versions');
        Schema::dropIfExists('resources');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('users');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
