# StayEase - Client (Frontend)

The frontend application for the StayEase Room Booking System, built with **React 19**, **Vite 8**, **Tailwind CSS 3**, and **Zustand 5** for state management.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.6 | Component-based UI library |
| Vite | 8.0.12 | Lightning-fast HMR & bundling |
| Tailwind CSS | 3.4.19 | Utility-first CSS framework |
| Zustand | 5.0.14 | Lightweight global state management |
| Axios | 1.17.0 | HTTP client with JWT interceptors |
| React Router DOM | 7.17.0 | Declarative client-side routing |
| Lucide React | 1.18.0 | Modern icon library |
| react-datepicker | 9.1.0 | Calendar-based date selection |

## Available Scripts

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Project Structure

```
src/
├── main.jsx                    # React 19 createRoot entry
├── App.jsx                     # BrowserRouter wrapper
├── index.css                   # Tailwind directives + component classes
├── App.css                     # Additional styles
│
├── router/
│   ├── AppRouter.jsx           # All route definitions + layout
│   └── ProtectedRoute.jsx      # Auth guard + admin-only check
│
├── store/
│   ├── useAuthStore.js         # Zustand: user, token, setAuth, logout, initAuth
│   └── useBookingStore.js      # Zustand: search criteria state
│
├── services/
│   ├── api.js                  # Axios instance + request/response interceptors
│   ├── auth.service.js         # login, register, getMe, updateProfile
│   ├── room.service.js         # getRooms, getRoomById, createRoom, updateRoom, deleteRoom
│   ├── booking.service.js      # createBooking, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus
│   ├── review.service.js       # createReview
│   ├── analytics.service.js    # getAnalytics (admin dashboard KPIs)
│   └── user.service.js         # getUsers, updateUserRole, deleteUser (admin)
│
├── components/
│   ├── shared/
│   │   ├── Navbar.jsx          # Responsive nav with auth-aware menu
│   │   ├── Footer.jsx          # 4-column footer layout
│   │   ├── StarRating.jsx      # Interactive/read-only star rating
│   │   └── ReviewModal.jsx     # Modal for submitting room reviews
│   ├── auth/
│   │   ├── LoginForm.jsx       # Login form with error handling
│   │   └── RegisterForm.jsx    # Register with password confirmation
│   ├── rooms/
│   │   ├── FilterBar.jsx       # Search: dates, guests, type, price range
│   │   ├── RoomCard.jsx        # Room preview card
│   │   └── RoomGallery.jsx     # Image carousel with dot navigation
│   └── bookings/
│       ├── BookingForm.jsx     # Booking: date pick, price calc, reserve
│       └── BookingCard.jsx     # Booking history with status badges
│
└── pages/
    ├── HomePage.jsx            # Hero section + search bar
    ├── RoomsPage.jsx           # Room grid listing with filters
    ├── RoomDetailPage.jsx      # Room detail: gallery, amenities, booking
    ├── ConfirmBookingPage.jsx  # Booking confirmation with tax calculation
    ├── BookingPage.jsx         # User's booking list
    ├── ProfilePage.jsx         # Profile editor
    ├── NotFoundPage.jsx        # 404 error page
    └── admin/
        ├── AdminDashboard.jsx  # KPI cards + quick actions
        ├── ManageRooms.jsx     # Room CRUD table
        ├── ManageBookings.jsx  # Booking management table
        └── ManageUsers.jsx     # User role & account management
```

## Client-Side Routes

| Path | Component | Auth | Description |
|---|---|---|---|
| `/` | `HomePage` | ❌ | Landing page with hero + search |
| `/rooms` | `RoomsPage` | ❌ | Room listing with filters |
| `/rooms/:id` | `RoomDetailPage` | ❌ | Room detail with gallery + booking form |
| `/rooms/:id/book` | `ConfirmBookingPage` | 🔐 | Booking confirmation + tax calculation |
| `/login` | `LoginForm` | ❌ | User login |
| `/register` | `RegisterForm` | ❌ | User registration |
| `/profile` | `ProfilePage` | 🔐 | User profile management |
| `/bookings` | `BookingPage` | 🔐 | User's booking history |
| `/admin/dashboard` | `AdminDashboard` | 👑 | Admin analytics dashboard |
| `/admin/rooms` | `ManageRooms` | 👑 | Room CRUD management |
| `/admin/bookings` | `ManageBookings` | 👑 | Booking status management |
| `/admin/users` | `ManageUsers` | 👑 | User role & account management |
| `*` | `NotFoundPage` | ❌ | 404 error page |

> **Legend:** ❌ = Public &nbsp;|&nbsp; 🔐 = Authenticated User &nbsp;|&nbsp; 👑 = Admin Only

## Environment Variables

Create a `.env` file in the `/client` root:

```env
VITE_API_URL=http://localhost:5000/api/v1
```
