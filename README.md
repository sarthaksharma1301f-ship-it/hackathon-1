# ⚡ SparkGig — Creator Gig & Appointment Marketplace (Hackathon MVP)

**Category:** Creator Economy  
**Doc Owner:** Sarthak  
**Status:** Hackathon Submission Ready  
**Project Workspace:** `C:\Users\NITRO V15\.creator-gig-marketplace`

---

## 1. Overview & Onboarding Flow

SparkGig connects skilled young creators with clients seeking tailored services. 

### 👤 Real Personal Details Onboarding (No Demo Logins)
- Users and creators enter their genuine personal details:
  - **Full Name**
  - **Email Address**
  - **Phone Number**
  - **Primary Role** (💼 Client, 🎨 Creator, or ⚡ Both)
  - Optional Headline / Skills
- Submitting opens the **Marketplace Home Page** with their session active.

---

## 2. 🏆 Hackathon Decision Points (20 Points)

| Decision Point | Chosen Stance | Defensible Product Rationale ("Why") |
|---|---|---|
| **DP1 — Rejection** | Marked as **Declined** in "My Bookings" (never deleted). Client can immediately re-book the same gig or any other. | A decline reflects creator bandwidth or timing for *that specific request* — not a judgment on the client. Blocking or rate-limiting adds arbitrary friction and risks punishing legitimate re-attempts. |
| **DP2 — Double Booking** | **Allowed** — multiple simultaneous Pending bookings permitted without auto-blocking. | A gig is a *service listing*, not an exclusive calendar slot. Auto-locking upon a single inquiry would freeze marketplace liquidity. The creator dashboard is where triage happens. |
| **DP3 — Discovery** | Ranked **Newest First**. | Transparent, equitable, and easy to explain. "Cheapest first" causes a quality race-to-the-bottom, while "rotation" is opaque. Newest-first rewards active creators who keep offerings fresh. |

---

## 3. Core Features & Tasks

### 3.1 📅 Book an Appointment / Gig (Client)
- Browse active services with keyword search and category filters.
- Click **`📅 Book Appointment →`** on any service.
- Pre-filled with your **Name**, **Email**, and **Phone Number**.
- Select your **Preferred Appointment Date** and **Preferred Time Slot** (*Morning*, *Afternoon*, *Evening*, *Urgent 24h*), plus an optional project message.
- Instant on-screen confirmation modal with Booking ID and `Pending` status.

### 3.2 ➕ Post a Gig (Creator)
- Post a service listing in under 60 seconds (Title, Category, Rate, Description, Turnaround).
- Gigs are set to `Active` immediately and rank at the top of Browse (DP3).

### 3.3 📊 Creator Dashboard
- Displays incoming client appointments with client's **Name**, **Phone Number**, **Email**, **Appointment Date/Slot**, and **Message**.
- Action buttons: **`✓ Accept`** and **`✕ Decline`** (locks further action once clicked).

### 3.4 📋 My Bookings
- Live tracking for the client's booked appointments (`Pending`, `Accepted`, `Declined`).
- If declined, provides a 1-click **`🔄 Re-book this Gig`** button (DP1).

### 3.5 🔄 Switch Account / Sign Out
- Switch between different persons (enter new name, email, and phone) to test both creator and client sides.

---

## 4. How to Open in 1 Go

1. **Option 1 (Double-Click Batch File)**:
   Double-click [`launch_marketplace.bat`](file:///C:/Users/NITRO%20V15/.gemini/antigravity/scratch/creator-gig-marketplace/launch_marketplace.bat) in the project folder.
2. **Option 2 (Direct File Open)**:
   Double-click [`index.html`](file:///C:/Users/NITRO%20V15/.gemini/antigravity/scratch/creator-gig-marketplace/index.html) in Chrome, Edge, or Firefox.
