# SmartSkillSphere — Full-Stack Architecture & Laravel / MySQL Setup Guide

> **Tagline:** “Learn Smart. Practice Daily. Grow Beyond Limits.”  
> **Brand Palette:** Charcoal Black (`#111214`), Premium Gold (`#C9A45C`), Dark Navy (`#25344A`), Soft White (`#F5F7FA`)

---

## 1. System Overview

SmartSkillSphere is engineered as a unified decoupled learning platform:
- **Frontend SPA:** React 19, TypeScript, Tailwind CSS, Lucide icons, Motion animations.
- **REST API Backend:** Laravel 11/12 (PHP 8.3+) or Express Node.js microservice.
- **Primary Relational Store:** MySQL 8.0+ / PostgreSQL 15+.
- **Authentication:** Laravel Sanctum token-based or HTTP-only stateful session authentication with RBAC (`admin`, `student`, `moderator`).
- **File Storage:** Private disk storage driver (Local `storage/app/private/` or AWS S3 bucket with signed temporary URLs) protecting PDFs and document uploads from direct exposure.

---

## 2. Laravel + MySQL Environment Setup

### Prerequisites
- PHP 8.2 or 8.3 with extensions: `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `gd`
- Composer 2.7+
- MySQL 8.0+
- Node.js 20+ and npm

### Step-by-Step Installation

```bash
# 1. Clone repository & install PHP dependencies
cd backend-api
composer install --no-dev --optimize-autoloader

# 2. Configure Environment
cp .env.example .env
php artisan key:generate

# 3. Configure Database Credentials in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=smartskillsphere_db
# DB_USERNAME=sss_db_user
# DB_PASSWORD=YourStrongSecurePasswordHere

# 4. Run Migrations & Seeders
php artisan migrate --force
php artisan db:seed --class=DatabaseSeeder

# 5. Link Private Storage & Cache Routes
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

## 3. Database Schema Layout

The database includes 24 normalized tables designed for high throughput and zero data anomalies:
1. `users` & `roles` & `permissions` & `role_permissions`
2. `subjects`, `topics`, `exams`
3. `resources`, `resource_versions`, `resource_feedback`
4. `questions`, `question_options`
5. `quiz_sets`, `quiz_questions`, `quiz_attempts`, `quiz_answers`
6. `polls`, `poll_options`, `poll_votes`
7. `mistake_book`, `bookmarks`
8. `current_affairs`, `achievements`, `user_achievements`, `study_progress`
9. `audit_logs`

Raw SQL schema is located in `/database/schema.sql` and executable via:
```bash
mysql -u root -p smartskillsphere_db < database/schema.sql
```

---

## 4. Secure File Upload Architecture

Files uploaded by administrators (PDF, DOCX, PPTX, Images) are subjected to strict server-side validation:
- **MIME Inspection:** Validated via `finfo` byte inspection (`application/pdf`, `application/vnd.openxmlformats-officedocument...`).
- **File Size Cap:** Enforced at 15 MB max.
- **Private Isolation:** Stored in non-public storage directories (`storage/app/private/resources/{resource_id}/`).
- **Signed Download Stream:** Endpoints authenticate student role before streaming the file with `Content-Disposition: inline` or `attachment`. No direct or guessable public static URLs.

---

## 5. Security & RBAC Enforcement

- **No Exposed Secrets:** Database passwords and JWT/Sanctum secret keys remain strictly on the backend.
- **Answer Concealment:** The `/api/quizzes/{id}` endpoint omits `is_correct` flags until the user submits their attempt (`/api/quizzes/{id}/submit`), preventing inspection attacks.
- **Duplicate Vote Prevention:** Polls enforce unique constraints on `(poll_id, user_id)` and IP hash checks for anonymous respondents.
- **Audit Logging:** Every administrative action (file upload, question import, resource deletion) is permanently recorded in `audit_logs`.
