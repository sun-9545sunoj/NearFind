# 📍 NearFind

> A hyperlocal product discovery and delivery platform — search nearby stores, place orders, and track deliveries in real time.

---

## 📖 Project Overview

**NearFind** is a mobile application that bridges the gap between local retailers and customers by enabling hyperlocal product search, ordering, and last-mile delivery.

### Problem Statement

Customers often struggle to find specific everyday products at nearby stores without physically visiting them. Local retailers lack an accessible digital presence, and delivery logistics for small orders remain fragmented.

### Key Features

| Feature | Description |
|---|---|
| 🔍 **Product Search** | Search across multiple nearby retailers with real-time stock and price visibility |
| 🛒 **Order Placement** | Place orders with quantity selection, price breakdown, and stock validation |
| ⏱️ **Auto-Cancel Timeout** | Orders auto-cancel after 60 seconds if the retailer doesn't respond |
| 📦 **Full Order Lifecycle** | Track orders through: Placed → Accepted → Packed → Ready → Picked Up → Delivered |
| 🔔 **Real-time Notifications** | Role-specific notifications for order updates, warnings, and status changes |
| 📊 **Admin Dashboard** | System-wide overview of all orders, statuses, and order history |
| 🔄 **Stock Management** | Inventory auto-adjusts on order placement, rejection, and cancellation |
| 🚴 **Delivery Assignment** | Delivery partners can accept available orders and update delivery progress |

---

## 📥 Installation (APK)

1. **Download** the APK from the [Releases](https://github.com/sun-9545sunoj/NearFind/releases) page (or [direct link](<APK_DOWNLOAD_LINK>))
2. **Enable Unknown Sources**: Go to `Settings → Security → Install Unknown Apps` and allow your browser
3. **Install**: Open the downloaded `.apk` file and tap **Install**
4. **Launch**: Open **NearFind** from your app drawer

> **Requirements:** Android 7.0 (API 24) or higher

---

## 🛠️ Running from Source

### Prerequisites

- **Node.js** ≥ 22.11.0
- **JDK** 17+
- **Android SDK** with build tools
- **Android Emulator** or a physical device with USB debugging enabled

### Setup

```bash
# Clone the repository
git clone https://github.com/sun-9545sunoj/NearFind.git
cd NearFind

# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android (in a separate terminal)
npm run android
```

### Building Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎭 Role Switching

NearFind uses an **in-app role selector** on the home screen — no login or credentials required.

### Available Roles

| Role | Entry Screen | Capabilities |
|---|---|---|
| 🛍️ **Customer** | Product Search | Search products, compare retailers, place orders, track order status |
| 🏪 **Retailer** | Incoming Orders | View incoming orders, accept/reject, pack items, mark as ready for pickup |
| 🚴 **Delivery Partner** | Available Deliveries | Browse available orders, accept delivery, update pickup and delivery status |
| 📊 **Admin** | Admin Panel | View all orders across the system, inspect full status history per order |

### How to Switch

Tap the **← back** button to return to the role selector from any role's screen and choose a different role.

> **Note:** All roles share the same global state — an order placed as a Customer will immediately appear in the Retailer's incoming orders queue.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── EmptyState.tsx       # Empty list placeholder
│   ├── NotificationBanner.tsx # Role-specific notification alerts
│   ├── OrderCard.tsx        # Order summary card
│   ├── ProductCard.tsx      # Product display card
│   └── StatusBadge.tsx      # Color-coded order status badge
├── context/             # Global state management
│   └── AppContext.tsx       # useReducer-based store + actions
├── data/                # Mock data layer
│   └── mockData.ts          # Products, retailers & inventory seed data
├── navigation/          # Navigation configuration
│   └── RootNavigator.tsx    # Stack navigator with all routes
├── screens/             # Role-specific screen components
│   ├── RoleSelectorScreen.tsx
│   ├── customer/
│   │   ├── SearchScreen.tsx
│   │   ├── RetailerResultsScreen.tsx
│   │   ├── PlaceOrderScreen.tsx
│   │   └── MyOrdersScreen.tsx
│   ├── retailer/
│   │   ├── IncomingOrdersScreen.tsx
│   │   └── OrderActionsScreen.tsx
│   ├── delivery/
│   │   ├── AvailableOrdersScreen.tsx
│   │   └── ActiveDeliveryScreen.tsx
│   └── admin/
│       └── AdminPanelScreen.tsx
└── theme/               # Design tokens
    └── colors.ts            # Colors, spacing, typography & border radius
```

---

## 🏗️ Architecture

### State Management

- **React Context API + `useReducer`** — A single `AppProvider` wraps the entire app, providing a centralized store with typed actions and dispatch
- **No external state library** — Keeps the bundle lean; all state is managed via a pure reducer function

### Navigation

- **React Navigation v7** with a `NativeStackNavigator`
- Single stack with role-based screen grouping (Customer, Retailer, Delivery, Admin)

### Data Layer

- **Mock local data** — Products, retailers, and inventory are seeded from `mockData.ts`
- **No backend/API** — All state is in-memory; suitable for demo and assessment purposes
- **Timer-based automation** — Auto-cancel (60s) and no-delivery warnings (120s) use `setTimeout` refs

### Reusable Components

All shared UI elements (`OrderCard`, `StatusBadge`, `NotificationBanner`, `EmptyState`, `ProductCard`) are isolated in `src/components/` and accept props for customization.

### Separation of Concerns

```
UI Layer        →  screens/ + components/     (presentation)
State Layer     →  context/AppContext.tsx      (business logic + reducer)
Data Layer      →  data/mockData.ts           (seed data)
Navigation      →  navigation/RootNavigator   (routing)
Design Tokens   →  theme/colors.ts            (visual constants)
```

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React Native 0.86 |
| **Language** | TypeScript |
| **State Management** | React Context API + useReducer |
| **Navigation** | React Navigation 7 (Native Stack) |
| **UI** | React Native core components (no external UI kit) |
| **Safe Area Handling** | react-native-safe-area-context |
| **Screen Optimization** | react-native-screens |
| **Build System** | Gradle + Metro Bundler |
| **JS Engine** | Hermes |
| **Min Android SDK** | API 24 (Android 7.0) |

---

## 📌 Assumptions

- **No backend server** — All data is mocked locally; the app simulates a full order lifecycle using in-memory state
- **Single device, multiple roles** — The app is designed for demo purposes where one user can switch between all four roles on the same device
- **No authentication** — Role selection is done via an in-app selector; there is no login/signup flow
- **No persistent storage** — App state resets on every fresh launch (no AsyncStorage or database)
- **Fixed retailer data** — Retailer locations, distances, and initial inventory are hardcoded in seed data
- **Auto-cancel timeout** — If a retailer does not accept/reject an order within **60 seconds**, it is automatically cancelled and stock is restored
- **Delivery warning** — If no delivery partner accepts an order within **120 seconds** of it being marked "Ready for Pickup", a warning notification is generated

---

## ⚠️ Known Limitations

| Limitation | Future Improvement |
|---|---|
| No persistent storage | Integrate AsyncStorage or SQLite for data persistence across app restarts |
| No real authentication | Add Firebase Auth or JWT-based login with role-based access control |
| No real location/maps | Integrate Google Maps API for actual geolocation and distance calculation |
| No push notifications | Add Firebase Cloud Messaging (FCM) for real push notifications |
| No payment integration | Integrate Razorpay/Stripe for actual order payments |
| Mock data only | Connect to a REST API or Firebase Firestore backend |
| No image assets | Add product and retailer images instead of emoji placeholders |
| Android only | Extend to iOS with minimal changes (React Native is cross-platform) |

---

## 📄 License

This project is developed as part of an internship assessment and is not intended for commercial distribution.

---

<p align="center">
  Built with ❤️ using React Native
</p>
