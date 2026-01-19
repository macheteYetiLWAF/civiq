# CIVIQ Backend Setup Notes

## What's Working

- **User Registration/Login**: Creates real accounts, stores in database
- **Session Management**: Token-based auth with 30-day sessions
- **News Feed**: Aggregates from local PA news sources via RSS
- **XP/Streak Tracking**: Awards XP for signup, daily logins, maintains streaks
- **Database**: All tables created and ready

## What Needs Configuration

### Google Civic Information API

The representatives feature requires the Google Civic Information API to be enabled:

1. Go to: https://console.developers.google.com/apis/api/civicinfo.googleapis.com
2. Make sure you're in the correct project (ID: 128013973688)
3. Click "Enable API"
4. Wait a few minutes for propagation

Once enabled, the Leaders page will show real representatives based on user's ZIP code.

### Database Tables Created

- `civiq_users` - User accounts with auth columns added
- `civiq_sessions` - Auth sessions
- `civiq_user_preferences` - User settings from onboarding
- `civiq_civic_cache` - Cached representative data (24h TTL)
- `civiq_news_cache` - Cached news articles (15min TTL)
- `civiq_xp_log` - XP transaction history

## API Endpoints

All endpoints at `/sud/claude/civiq/api/`

### Auth
- `POST /auth/register.php` - Create account (email, password, zip_code)
- `POST /auth/login.php` - Login (email, password)
- `POST /auth/logout.php` - Logout (requires X-Session-Token header)
- `GET /auth/session.php` - Check current session

### Civic Data
- `GET /civic/representatives.php?address=ZIP` - Get representatives

### News
- `GET /news/feed.php?state=PA&level=all&limit=20` - Get news feed

## React App

Live at: https://fitaf570.com/sud/claude/civiq/app/

Features:
- Real registration creates accounts in database
- Login authenticates against database
- Stack page shows live news from PA sources
- Leaders page will show representatives (once Civic API enabled)
- XP and streak display real user data

## Test Account

- Email: test@example.com
- Password: testpassword123
- ZIP: 18701

---
Last Updated: 2026-01-05
