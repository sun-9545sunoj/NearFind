# 📍 NearFind

**NearFind** is a hyperlocal product discovery and delivery platform that connects **customers**, **local retailers**, and **delivery partners** — all within a single installable Android APK.

Built with **React Native (TypeScript)** as part of the Hexara Labs / NearFind internship assessment (48-hour deliverable).

---

## 📋 About the Project

NearFind simulates a complete end-to-end local delivery workflow. A customer can search for everyday products (like Maggi Noodles or Amul Butter), compare prices and availability across 2–3 nearby mock retailers, place an order, and then track it in real time as it moves through the pipeline: **Placed → Accepted → Packed → Ready for Pickup → Picked Up → Delivered**.

All four user roles — Customer, Retailer, Delivery Partner, and Admin — live inside **one single APK** behind a role-switcher home screen. No separate apps, no login required. Tap a role card and you're in.

There is **no backend**. All state is managed locally in-memory using React Context + `useReducer`. The app runs **fully standalone** on any Android device or emulator — no internet, no API keys, no server setup needed.

---

## ✅ Assessment Requirements Covered

### Core Scope (All Required — All Done)

| # | Requirement | Status | Details |
|---|---|---|---|
| 1 | **Customer — Search** product by name | ✅ Done | Full-text search across 8 seeded products |
| 2 | **Customer — View availability** and price across 2–3 mock nearby retailers | ✅ Done | Retailers shown with price, stock count, and distance |
| 3 | **Customer — Place an order** from one retailer | ✅ Done | Quantity picker, price summary, confirmation |
| 4 | **Customer — View live order status** (Placed → Accepted → Packed → Ready → Picked Up → Delivered) | ✅ Done | Real-time status badges in My Orders screen |
| 5 | **Retailer — View incoming orders** | ✅ Done | Pending + completed order lists |
| 6 | **Retailer — Accept or reject** each order | ✅ Done | Accept/Reject buttons with confirmation dialogs |
| 7 | **Retailer — Update order status** (Packed → Ready for Pickup) | ✅ Done | Step-by-step status progression buttons |
| 8 | **Delivery Partner — See "Ready for Pickup" orders** | ✅ Done | Filtered list of available deliveries |
| 9 | **Delivery Partner — Accept an order** | ✅ Done | One-tap claim with customer notification |
| 10 | **Delivery Partner — Mark Picked Up / Delivered** | ✅ Done | Sequential status buttons |

### Edge Cases (All Required — All Handled)

| Edge Case | How It's Handled |
|---|---|
| **Retailer doesn't respond in time** | A 60-second auto-cancel timer starts when an order is placed. If the retailer doesn't accept or reject within 60s, the order is automatically cancelled, stock is restored, and the customer receives a warning notification. |
| **Item is out of stock** | The retailer is still shown in results but greyed out with a red "Out of Stock" badge. The order button is disabled. A server-side guard also rejects the order if stock < quantity. |
| **Order rejected by retailer** | Order status changes to "Rejected", stock is restored to the retailer's inventory, and the customer receives an error notification. |
| **No delivery partner accepts in time** | A 120-second timer starts when order reaches "Ready for Pickup". If no delivery partner accepts, a warning notification is sent to the retailer. The order stays available (not auto-cancelled, since items are already packed). |

### Bonus Scope

| Bonus | Status | Details |
|---|---|---|
| **Admin Panel** | ✅ Done | Lists all system orders with current status, full status history with timestamps, and live statistics (total/active/delivered counts) |
| **In-app notifications** | ✅ Done | Role-targeted slide-down notification banners for order events (acceptance, rejection, auto-cancel, delivery updates) |

### Technical Requirements

| Requirement | Status | Details |
|---|---|---|
| Final deliverable is an installable Android APK | ✅ | Single APK, all roles behind a role switcher |
| Runs standalone on real device or emulator | ✅ | No internet, no backend, no API keys needed |
| No backend required | ✅ | Fully in-memory local state |
| Multiple roles accessible | ✅ | Role-switcher home screen with 4 tappable cards |

---

## 📲 How to Install the APK

### Option A — Pre-built APK (Recommended)

1. Download **`NearFind.apk`** from [GitHub Releases](https://github.com/sunoj-9/NearFind/releases)
2. Transfer to your Android device (or drag into an emulator)
3. Open the file → Tap **Install**
   - If prompted, enable **"Install from unknown sources"** in Settings
4. Open **NearFind** from your app drawer

### Option B — Build from Source

**Prerequisites:**
- Node.js ≥ 22
- JDK 17
- Android SDK (API 35)
- React Native CLI ([environment setup guide](https://reactnative.dev/docs/set-up-your-environment))

```bash
# 1. Clone the repository
git clone https://github.com/sunoj-9/NearFind.git
cd NearFind/NF

# 2. Install dependencies
npm install

# 3a. Run on connected device or emulator (debug mode)
npx react-native run-android

# — OR —

# 3b. Build a release APK
cd android
./gradlew assembleRelease

# The APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎮 How to Switch Between Roles

When you open the app, you land on the **Role Selector** home screen with four large cards:

| Card | Role | What You Can Do |
|---|---|---|
| 🛍️ **Customer** | Customer | Search products, compare retailer prices, place orders, track live status |
| 🏪 **Retailer** | Retailer | View incoming orders, accept/reject, update status (Pack → Ready for Pickup) |
| 🚴 **Delivery** | Delivery Partner | See available orders, accept a delivery, mark Picked Up → Delivered |
| 📊 **Admin** | Admin | View all orders system-wide with status history and timestamps |

**Tap any card** to enter that role's screens. Press the **back button** to return to the role selector and switch roles.

> **Tip:** Since all roles share the same in-memory state, you can place an order as Customer, switch to Retailer to accept it, then switch to Delivery to deliver it — all in one session.

### Recommended Demo Walkthrough

Follow this sequence to see the complete end-to-end flow:

1. **Customer** → Search "Maggi" → See Sharma Kirana (₹14, in stock) and Quick Mart (₹15, out of stock/greyed) → Order 2 packets from Sharma Kirana
2. **Retailer** → New order appears → Accept → Mark Packed → Mark Ready for Pickup
3. **Delivery** → Order appears in available list → Accept → Mark Picked Up → Mark Delivered
4. **Customer** → Open My Orders → Status shows "Delivered" 🎉
5. **Admin** → See the order with full status history and timestamps

---

## 🏗️ Project Structure

```
NF/
├── App.tsx                              # App entry — providers + navigation
├── src/
│   ├── context/
│   │   └── AppContext.tsx               # All state, actions, timers (useReducer)
│   ├── data/
│   │   └── mockData.ts                 # 8 products, 3 retailers, inventory
│   ├── navigation/
│   │   └── RootNavigator.tsx            # Stack navigator with all screens
│   ├── screens/
│   │   ├── RoleSelectorScreen.tsx       # Home — 4 role cards
│   │   ├── customer/
│   │   │   ├── SearchScreen.tsx         # Product search
│   │   │   ├── RetailerResultsScreen.tsx # Price comparison + out-of-stock
│   │   │   ├── PlaceOrderScreen.tsx     # Quantity picker + confirmation
│   │   │   └── MyOrdersScreen.tsx       # Live order tracking
│   │   ├── retailer/
│   │   │   ├── IncomingOrdersScreen.tsx # Pending + completed orders
│   │   │   └── OrderActionsScreen.tsx   # Accept/Reject/Pack/Ready
│   │   ├── delivery/
│   │   │   ├── AvailableOrdersScreen.tsx # Orders ready for pickup
│   │   │   └── ActiveDeliveryScreen.tsx  # PickedUp → Delivered
│   │   └── admin/
│   │       └── AdminPanelScreen.tsx     # System dashboard
│   ├── components/
│   │   ├── StatusBadge.tsx              # Color-coded status labels
│   │   ├── OrderCard.tsx                # Reusable order card
│   │   ├── NotificationBanner.tsx       # Slide-down alerts
│   │   ├── ProductCard.tsx              # Product display card
│   │   └── EmptyState.tsx               # Empty list placeholder
│   └── theme/
│       └── colors.ts                    # Design system tokens
└── android/                             # Native Android build
```

### Key Architecture Choices

- **State:** React Context + `useReducer` — lightweight, no external state libraries
- **Data:** Mock data seeded in `mockData.ts` — 8 products, 3 retailers with varying inventory and prices
- **Timers:** `setTimeout` with `useRef` for auto-cancel (60s) and no-delivery warnings (120s), properly cleaned up on unmount
- **Navigation:** `@react-navigation/native-stack` — one stack for all roles
- **Single APK:** All roles share state, making the demo flow seamless without any backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.86 (TypeScript) |
| Navigation | @react-navigation/native-stack v7 |
| State Management | React Context + useReducer |
| Backend | None — fully local, in-memory |
| Build System | Gradle (Android) + Metro (JS bundler) |
| Min Android | API 24 (Android 7.0) |

---

## 📝 Write-Up

### Tradeoff: In-Memory State vs. Persistent Backend

The biggest tradeoff was choosing pure in-memory state (`useReducer`) over a persistent backend like Firebase or SQLite. This means all orders and inventory reset when the app restarts. I made this choice deliberately — it keeps the demo self-contained with zero setup friction (no API keys, no network dependency, no backend to deploy), and it lets evaluators test edge cases repeatedly by simply restarting the app. For a 48-hour assessment where the APK must "install and run standalone," eliminating external dependencies was the pragmatic call.

### What I'd Do Next

With more time, I would add: **(1)** AsyncStorage or SQLite persistence so orders survive restarts, **(2)** push notifications via Firebase Cloud Messaging instead of in-app banners, **(3)** a real-time sync layer (Firestore or WebSockets) so multiple devices running different roles see updates instantly, and **(4)** maps integration for delivery tracking with live location. I'd also add proper authentication, unit tests, and accessibility labels throughout.

---

## 📄 License

This project was built as part of the NearFind / Hexara Labs internship assessment.
