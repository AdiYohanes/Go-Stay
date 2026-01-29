# Implementation Plan: Hotel Booking Enhancement

## Overview

This implementation plan breaks down the hotel booking enhancement into discrete, incremental coding tasks. Each task builds on previous work and includes property-based tests to validate correctness.

### Tech Stack (Latest Versions - Verified)

- **Next.js 16.1.4** with App Router (Server Components, Server Actions)
- **React 19.2.3** with latest hooks and Suspense
- **Supabase** (@supabase/ssr 0.8.0, @supabase/supabase-js 2.91.0)
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** with tw-animate-css
- **shadcn/ui** (Radix UI primitives)
- **Zod 4.3.6** for runtime validation
- **Zustand 5.0.10** for client state
- **React Hook Form 7.71.1** with @hookform/resolvers
- **date-fns 4.1.0** for date manipulation
- **sonner 2.0.7** for toast notifications
- **Framer Motion** (to be added) for animations
- **Vitest + fast-check** (to be added) for testing

### Best Practices Applied

- **Server Components by default** - Client components only when needed (interactivity, hooks)
- **Server Actions** for mutations - Type-safe, progressive enhancement
- **Streaming & Suspense** - Instant loading states, parallel data fetching
- **Route Groups** - Clean URL structure with (auth), (dashboard) groups
- **Colocation** - Components, actions, types organized by feature
- **Optimistic Updates** - Immediate UI feedback with rollback on error
- **Edge Runtime** where applicable for faster response times
- **ISR/SSG** for static content, dynamic for user-specific data
- **Proper error boundaries** at route and component level
- **Accessibility (a11y)** - ARIA labels, keyboard navigation, focus management
- **SEO** - Metadata API, structured data, semantic HTML

## Tasks

- [x] 1. Set up testing infrastructure and enhanced type definitions
  - [x] 1.1 Install and configure Vitest with fast-check for property-based testing
    - Add vitest, @vitest/coverage-v8, fast-check, @testing-library/react, framer-motion to devDependencies
    - Create vitest.config.ts with jsdom environment, path aliases, and React plugin
    - Create src/test/setup.ts with testing-library configuration and MSW for API mocking
    - Configure test scripts in package.json (test, test:coverage, test:watch)
    - _Requirements: 9.1, 9.2_

  - [x] 1.2 Create comprehensive TypeScript type definitions
    - Create src/types/property.types.ts with Property, PropertyFormData, PropertyFilters interfaces
    - Create src/types/booking.types.ts with Booking, BookingWithDetails, CreateBookingInput, BookingPriceCalculation interfaces
    - Create src/types/search.types.ts with SearchParams, SearchResult, AvailabilityCheck interfaces
    - Create src/types/review.types.ts with Review, ReviewWithUser, CreateReviewInput, PropertyRating interfaces
    - Create src/types/notification.types.ts with Notification, NotificationType interfaces
    - Create src/types/cart.types.ts with CartItem, Cart, CartSummary interfaces
    - Create src/types/payment.types.ts with PaymentIntent, PaymentStatus, MidtransResponse interfaces
    - _Requirements: 1.1, 2.1, 3.1, 6.1, 10.1_

- [x] 2. Implement Zod validation schemas and error handling utilities
  - [x] 2.1 Create Zod validation schemas for all entities
    - Create src/lib/validations/property.ts with propertySchema
    - Create src/lib/validations/booking.ts with bookingSchema including date and guest validation
    - Create src/lib/validations/review.ts with reviewSchema (rating 1-5)
    - Create src/lib/validations/search.ts with searchSchema including pagination
    - Create src/lib/validations/auth.ts with loginSchema, registerSchema, passwordResetSchema
    - Create src/lib/validations/cart.ts with cartItemSchema, checkoutSchema
    - _Requirements: 1.7, 2.1, 2.2, 4.1, 6.1, 9.1_

  - [ ]\* 2.2 Write property tests for validation schemas
    - **Property 2: Property Validation Rejects Invalid Input**
    - **Property 4: Booking Date Validation**
    - **Property 5: Booking Guest Capacity Validation**
    - **Property 12: Authentication Validation**
    - **Validates: Requirements 1.7, 2.1, 2.2, 4.1**

  - [x] 2.3 Create error handling utilities and custom error classes
    - Create src/lib/errors.ts with AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError
    - Create src/lib/action-utils.ts with safeAction wrapper and ActionResult type
    - Create src/lib/toast-utils.ts with showError, showSuccess, showLoading helpers
    - _Requirements: 9.2_

- [x] 3. Checkpoint - Ensure validation and error handling tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement database schema and Supabase configuration
  - [x] 4.1 Create enhanced database schema migrations
    - Create SQL migration for enhanced profiles table with role (user/admin), notification_preferences
    - Create SQL migration for enhanced properties table with all fields and constraints
    - Create SQL migration for enhanced bookings table with status, service_fee, and date constraints
    - Create SQL migration for reviews table with booking_id reference and unique constraint
    - Create SQL migration for notifications table
    - Create SQL migration for favorites table with unique constraint (user_id, property_id)
    - Create SQL migration for cart_items table with user_id, property_id, dates, guests
    - Create SQL migration for payments table with booking_id, midtrans_order_id, status
    - Add performance indexes for all tables
    - _Requirements: 1.1, 2.4, 6.1, 10.4_

  - [x] 4.2 Configure Row Level Security (RLS) policies with role-based access
    - Create RLS policies for properties (public read, admin write)
    - Create RLS policies for bookings (user owns, admin all)
    - Create RLS policies for reviews (user owns, public read)
    - Create RLS policies for notifications (user owns only)
    - Create RLS policies for favorites (user owns only)
    - Create RLS policies for cart_items (user owns only)
    - Create RLS policies for payments (user owns, admin read)
    - _Requirements: 4.2, 5.6_

- [x] 5. Implement authentication system with Google OAuth
  - [x] 5.1 Configure Supabase Auth with Google OAuth
    - Configure Google OAuth provider in Supabase dashboard
    - Create src/lib/supabase/auth.ts with auth helper functions
    - Implement signInWithGoogle, signInWithEmail, signUp, signOut functions
    - Implement password reset flow with email
    - _Requirements: 4.1, 4.2, 4.4, 4.6_

  - [x] 5.2 Create authentication pages
    - Create src/app/(auth)/login/page.tsx with email/password and Google login
    - Create src/app/(auth)/register/page.tsx with registration form and Google signup
    - Create src/app/(auth)/forgot-password/page.tsx with email input
    - Create src/app/(auth)/reset-password/page.tsx for password reset
    - Create src/app/(auth)/layout.tsx with centered auth layout
    - Style with clean, minimal design using shadcn/ui
    - _Requirements: 4.1, 4.2, 4.6_

  - [ ]\* 5.3 Write property tests for authentication
    - **Property 13: Authentication Error Security**
    - **Validates: Requirements 4.5**

  - [x] 5.4 Create auth middleware for protected routes
    - Create src/middleware.ts with route protection logic
    - Implement role-based route protection (admin routes)
    - Implement session refresh logic
    - Redirect unauthenticated users to login
    - _Requirements: 4.7, 5.6_

  - [ ]\* 5.5 Write property tests for admin access control
    - **Property 15: Admin Access Control**
    - **Validates: Requirements 5.6**

- [x] 6. Checkpoint - Ensure auth tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement property management server actions
  - [x] 7.1 Create property CRUD server actions
    - Create src/actions/property.ts with createProperty action
    - Implement getProperty, getProperties with pagination
    - Implement updateProperty with validation
    - Implement deleteProperty (soft delete by setting is_active=false)
    - _Requirements: 1.1, 1.3, 1.4, 1.6, 9.3_

  - [ ]\* 7.2 Write property tests for property CRUD operations
    - **Property 1: Property CRUD Round-Trip**
    - **Property 3: Soft-Deleted Properties Excluded from Search**
    - **Validates: Requirements 1.1, 1.3, 1.4, 1.6**

  - [x] 7.3 Implement property image upload functionality
    - Create src/actions/storage.ts with uploadPropertyImages action
    - Implement file type validation (JPEG, PNG, WebP)
    - Implement file size validation (max 5MB)
    - Implement deletePropertyImage action
    - Use optimized image URLs with Supabase transformations
    - _Requirements: 1.2, 9.5_

  - [ ]\* 7.4 Write property tests for file upload validation
    - **Property 22: File Upload Validation**
    - **Validates: Requirements 1.2, 9.5**

- [x] 8. Implement availability checking system (reusable across all screens)
  - [x] 8.1 Create availability checking utility and hook
    - Create src/lib/availability.ts with checkAvailability function
    - Implement date overlap detection logic
    - Return conflicting date ranges when unavailable
    - Create src/hooks/useAvailability.ts hook for real-time availability checks
    - _Requirements: 2.7, 2.8_

  - [ ]\* 8.2 Write property tests for availability checking
    - **Property 7: Booking Availability Check**
    - **Validates: Requirements 2.7, 2.8**

  - [x] 8.3 Create AvailabilityIndicator component
    - Create src/components/booking/AvailabilityIndicator.tsx
    - Show available/unavailable status with visual feedback
    - Display conflicting dates if unavailable
    - Reusable across PropertyCard, PropertyDetails, BookingWidget, Cart
    - _Requirements: 2.7, 2.8_

- [x] 9. Implement booking system server actions
  - [x] 9.1 Create booking price calculation utility
    - Create src/lib/price-calculator.ts with calculateBookingPrice function
    - Implement nights calculation from date range
    - Implement service fee calculation (10% of subtotal)
    - Implement total price calculation
    - _Requirements: 2.3_

  - [ ]\* 9.2 Write property tests for price calculation
    - **Property 6: Booking Price Calculation**
    - **Validates: Requirements 2.3**

  - [x] 9.3 Create booking CRUD server actions
    - Create src/actions/booking.ts with createBooking action
    - Implement getBooking, getUserBookings with property details
    - Implement updateBookingStatus for status transitions
    - Implement cancelBooking action
    - _Requirements: 2.4, 2.5, 2.6_

  - [ ]\* 9.4 Write property tests for booking operations
    - **Property 8: Booking Status Transitions**
    - **Property 9: User Bookings Retrieval**
    - **Validates: Requirements 2.4, 2.5, 2.6**

- [x] 10. Checkpoint - Ensure property and booking tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement favorites system for customers
  - [x] 11.1 Create favorites server actions
    - Create src/actions/favorites.ts with addToFavorites action
    - Implement removeFromFavorites action
    - Implement getUserFavorites with property details
    - Implement checkIsFavorite utility
    - _Requirements: Customer favorites feature_

  - [x] 11.2 Create favorites hook and components
    - Create src/hooks/useFavorites.ts for optimistic updates
    - Create src/components/property/FavoriteButton.tsx with heart animation
    - Integrate FavoriteButton into PropertyCard
    - _Requirements: Customer favorites feature_

- [x] 12. Implement cart system for reservations
  - [x] 12.1 Create cart server actions
    - Create src/actions/cart.ts with addToCart action
    - Implement removeFromCart action
    - Implement updateCartItem (dates, guests)
    - Implement getCart with property details and availability status
    - Implement clearCart action
    - _Requirements: Cart system_

  - [x] 12.2 Create cart store and hooks
    - Create src/store/cart-store.ts with Zustand for cart state
    - Create src/hooks/useCart.ts for cart operations
    - Implement cart item count for header badge
    - _Requirements: Cart system_

  - [x] 12.3 Create cart UI components
    - Create src/components/cart/CartItem.tsx with property preview, dates, price
    - Create src/components/cart/CartSummary.tsx with total calculation
    - Create src/components/cart/CartSheet.tsx for slide-out cart panel
    - Create src/components/cart/CartBadge.tsx for header icon with count
    - Include availability check per item with AvailabilityIndicator
    - _Requirements: Cart system_

  - [x] 12.4 Create cart page
    - Create src/app/cart/page.tsx with full cart view
    - Display all cart items with edit/remove options
    - Show price breakdown and total
    - Add proceed to checkout button
    - Validate all items available before checkout
    - _Requirements: Cart system_

- [x] 13. Implement Midtrans payment gateway integration
  - [x] 13.1 Set up Midtrans configuration
    - Create src/lib/midtrans.ts with Midtrans client configuration
    - Configure server key and client key from environment variables
    - Implement createTransaction function for Snap token
    - _Requirements: Payment gateway_

  - [x] 13.2 Create payment server actions
    - Create src/actions/payment.ts with initiatePayment action
    - Implement createMidtransTransaction for cart checkout
    - Implement handlePaymentNotification for webhook
    - Implement getPaymentStatus action
    - _Requirements: Payment gateway_

  - [x] 13.3 Create checkout flow
    - Create src/app/checkout/page.tsx with order summary
    - Integrate Midtrans Snap popup for payment
    - Handle payment success/failure/pending states
    - Create bookings from cart items on successful payment
    - Clear cart after successful payment
    - _Requirements: Payment gateway_

  - [x] 13.4 Create payment webhook handler
    - Create src/app/api/payment/notification/route.ts for Midtrans webhook
    - Verify webhook signature
    - Update payment and booking status based on notification
    - Send confirmation notifications
    - _Requirements: Payment gateway, 10.1_

  - [x] 13.5 Create payment status pages
    - Create src/app/checkout/success/page.tsx with success animation
    - Create src/app/checkout/pending/page.tsx for pending payments
    - Create src/app/checkout/failed/page.tsx with retry option
    - _Requirements: Payment gateway_

- [x] 14. Checkpoint - Ensure cart and payment flow works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Implement search and filter functionality
  - [x] 15.1 Create search server action with filtering
    - Create src/actions/search.ts with searchProperties action
    - Implement location filter with partial text matching (case-insensitive)
    - Implement date range filter with availability check
    - Implement guest count filter (max_guests >= guests)
    - Implement price range filter (min/max)
    - Implement amenities filter (contains all selected)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 15.2 Implement search result sorting and pagination
    - Add sorting by price_asc, price_desc, rating, newest, relevance
    - Implement cursor-based pagination with page and limit
    - Return total count, totalPages, hasMore in results
    - _Requirements: 3.6, 9.3_

  - [ ]\* 15.3 Write property tests for search functionality
    - **Property 10: Search Filter Correctness**
    - **Property 11: Search Result Sorting**
    - **Property 21: Pagination Correctness**
    - **Validates: Requirements 3.1-3.6, 9.3**

- [x] 16. Implement review system
  - [x] 16.1 Create review server actions
    - Create src/actions/review.ts with createReview action
    - Implement getPropertyReviews with user details
    - Implement updateReview action (preserves created_at)
    - Implement deleteReview action
    - Implement calculatePropertyRating utility
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [x] 16.2 Implement review eligibility checking
    - Create checkReviewEligibility function
    - Verify user has completed booking at property
    - Return appropriate error if ineligible
    - _Requirements: 6.4_

  - [ ]\* 16.3 Write property tests for review system
    - **Property 17: Review CRUD Round-Trip**
    - **Property 18: Review Average Calculation**
    - **Property 19: Review Eligibility Check**
    - **Validates: Requirements 6.1, 6.3, 6.4, 6.5**

- [x] 17. Implement notification system
  - [x] 17.1 Create notification server actions
    - Create src/actions/notification.ts with createNotification action
    - Implement getUserNotifications with pagination
    - Implement markAsRead action
    - Implement markAllAsRead action
    - Implement getUnreadCount utility
    - _Requirements: 10.4, 10.5_

  - [x] 17.2 Create notification triggers for booking events
    - Implement sendBookingConfirmation function
    - Implement sendBookingCancellation function (user + admin)
    - Implement sendBookingReminder function
    - Integrate triggers with booking and payment actions
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]\* 17.3 Write property tests for notification system
    - **Property 23: Notification Creation on Booking Events**
    - **Property 24: Notification Read Status Management**
    - **Validates: Requirements 10.1, 10.2, 10.4, 10.5**

- [x] 18. Checkpoint - Ensure search, review, notification tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Implement admin dashboard server actions
  - [x] 19.1 Create admin dashboard data fetching actions
    - Create src/actions/admin.ts with getDashboardMetrics action
    - Implement getAdminBookings with filtering (status, date range, property)
    - Implement getAdminProperties with pagination
    - Implement updateBookingStatus for admin
    - Implement getAdminPayments for payment overview
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 19.2 Implement analytics calculations
    - Create getBookingTrends function (bookings over time)
    - Create getRevenueStats function (total, by period)
    - Create getOccupancyRates function
    - _Requirements: 5.5_

  - [ ]\* 19.3 Write property tests for admin dashboard
    - **Property 16: Admin Dashboard Metrics Accuracy**
    - **Validates: Requirements 5.1, 5.5**

- [x] 20. Implement UI components - Property management
  - [x] 20.1 Create PropertyCard component with animations
    - Create src/components/property/PropertyCard.tsx
    - Implement image carousel with Framer Motion transitions
    - Add hover scale and shadow animations
    - Display price, location, rating, amenities preview
    - Integrate FavoriteButton and AvailabilityIndicator
    - Add "Add to Cart" button with date/guest selection popover
    - _Requirements: 1.6, 7.2, 8.5_

  - [x] 20.2 Create PropertyForm component for admin
    - Create src/components/property/PropertyForm.tsx
    - Implement form fields for all property data
    - Add image upload with drag-and-drop
    - Add amenity selection with predefined list + custom
    - Implement form validation with error display
    - _Requirements: 1.1, 1.2, 1.5, 1.7_

  - [x] 20.3 Create PropertyGallery component
    - Create src/components/property/PropertyGallery.tsx
    - Implement image grid with lightbox modal
    - Add Framer Motion entrance animations
    - Support keyboard navigation in lightbox
    - Lazy load images for performance
    - _Requirements: 1.6, 7.3_

  - [x] 20.4 Create PropertyDetails component
    - Create src/components/property/PropertyDetails.tsx
    - Display all property information with sections
    - Show amenities with icons
    - Display host information
    - Include AvailabilityIndicator for selected dates
    - _Requirements: 1.6_

- [x] 21. Implement UI components - Booking and reservation
  - [x] 21.1 Create BookingWidget component (reusable reservation form)
    - Create src/components/booking/BookingWidget.tsx
    - Implement date picker with calendar UI
    - Add guest selector with increment/decrement
    - Display price breakdown with animations
    - Integrate AvailabilityIndicator
    - Add "Reserve" button that adds to cart
    - Implement responsive layout (sidebar desktop, sticky footer mobile)
    - _Requirements: 2.1, 2.2, 2.3, 7.6, 8.6_

  - [x] 21.2 Create BookingCard component
    - Create src/components/booking/BookingCard.tsx
    - Display booking summary with property image
    - Show dates, guests, status with status badge
    - Add cancel button with confirmation modal
    - Show payment status
    - _Requirements: 2.5, 2.6_

  - [x] 21.3 Create BookingConfirmation component
    - Create src/components/booking/BookingConfirmation.tsx
    - Display success animation with Framer Motion
    - Show booking details summary
    - Add navigation to bookings page
    - _Requirements: 2.4, 7.6_

- [x] 22. Implement UI components - Search and filter
  - [x] 22.1 Create SearchBar component with responsive variants
    - Create src/components/search/SearchBar.tsx
    - Implement hero variant (expanded, prominent)
    - Implement compact variant (header, minimal)
    - Add mobile modal expansion on tap
    - Include location, date range, guest inputs
    - _Requirements: 3.1, 8.4_

  - [x] 22.2 Create SearchFilters component
    - Create src/components/search/SearchFilters.tsx
    - Implement price range slider
    - Add amenity checkboxes
    - Add sort dropdown
    - Implement mobile filter sheet
    - _Requirements: 3.4, 3.5, 3.6_

  - [x] 22.3 Create SearchResults component with animations
    - Create src/components/search/SearchResults.tsx
    - Implement AnimatedList for staggered property cards
    - Add skeleton loaders during loading
    - Display empty state with suggestions
    - Add pagination controls
    - _Requirements: 3.7, 7.1, 7.4_

- [x] 23. Checkpoint - Ensure UI components render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 24. Implement UI components - Reviews and ratings
  - [x] 24.1 Create ReviewCard component
    - Create src/components/review/ReviewCard.tsx
    - Display user avatar, name, date
    - Show star rating with visual stars
    - Display comment with read more for long text
    - _Requirements: 6.2_

  - [x] 24.2 Create ReviewForm component
    - Create src/components/review/ReviewForm.tsx
    - Implement star rating selector with hover preview
    - Add comment textarea with character count
    - Show validation errors
    - Add submit animation
    - _Requirements: 6.1, 7.6_

  - [x] 24.3 Create ReviewList component
    - Create src/components/review/ReviewList.tsx
    - Display average rating with distribution chart
    - List reviews with staggered animations
    - Add load more pagination
    - _Requirements: 6.2, 6.3, 7.1_

- [x] 25. Implement UI components - Notifications
  - [x] 25.1 Create NotificationBell component
    - Create src/components/notification/NotificationBell.tsx
    - Display unread count badge with animation
    - Open dropdown/sheet on click
    - _Requirements: 10.4_

  - [x] 25.2 Create NotificationList component
    - Create src/components/notification/NotificationList.tsx
    - Display notifications with timestamps
    - Show read/unread visual distinction
    - Add mark as read functionality
    - Implement staggered entrance animations
    - _Requirements: 10.4, 10.5, 7.1_

- [x] 26. Implement animation utilities and components
  - [x] 26.1 Create animation wrapper components
    - Create src/components/ui/AnimatedList.tsx with stagger support
    - Create src/components/ui/FadeIn.tsx for fade entrance
    - Create src/components/ui/SlideIn.tsx for slide entrance
    - Create src/components/ui/ScaleIn.tsx for scale entrance
    - _Requirements: 7.1, 7.3_

  - [x] 26.2 Create loading state components
    - Create src/components/ui/Skeleton.tsx with shimmer animation
    - Create src/components/ui/PropertyCardSkeleton.tsx
    - Create src/components/ui/BookingWidgetSkeleton.tsx
    - Create src/components/ui/Spinner.tsx with rotation animation
    - _Requirements: 7.4, 7.6_

  - [ ]\* 26.3 Write property tests for loading states
    - **Property 25: Loading State Display**
    - **Validates: Requirements 7.4, 7.6**

  - [x] 26.4 Create page transition wrapper
    - Create src/components/ui/PageTransition.tsx
    - Implement fade and slide transitions between pages
    - Configure AnimatePresence for exit animations
    - _Requirements: 7.7_

  - [x] 26.5 Create scroll-based animation components
    - Create src/components/ui/ParallaxHero.tsx for hero sections
    - Create src/components/ui/RevealOnScroll.tsx for content sections
    - Use Framer Motion useScroll and useTransform hooks
    - _Requirements: 7.5_

- [x] 27. Implement responsive layout components
  - [x] 27.1 Create responsive navigation with cart
    - Create src/components/layout/Header.tsx with responsive nav
    - Implement hamburger menu for mobile
    - Implement full navigation for desktop
    - Add user menu dropdown with profile/bookings/logout
    - Add CartBadge and NotificationBell to header
    - _Requirements: 8.7_

  - [x] 27.2 Create responsive property grid
    - Create src/components/layout/PropertyGrid.tsx
    - Implement responsive columns (1 mobile → 6 large desktop)
    - Use Tailwind responsive classes
    - _Requirements: 8.5_

  - [ ]\* 27.3 Write property tests for responsive grid
    - **Property 26: Responsive Grid Columns**
    - **Validates: Requirements 8.5**

  - [x] 27.4 Create responsive booking layout
    - Create src/components/layout/BookingLayout.tsx
    - Implement sticky footer on mobile
    - Implement sidebar on desktop
    - _Requirements: 8.6_

- [x] 28. Checkpoint - Ensure animation and responsive tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 29. Implement customer-facing pages
  - [x] 29.1 Create home page with hero and featured properties
    - Update src/app/page.tsx with ParallaxHero
    - Add SearchBar hero variant
    - Display featured properties with PropertyGrid
    - Add call-to-action sections
    - _Requirements: 3.1, 7.5_

  - [x] 29.2 Create property listing page
    - Create src/app/properties/page.tsx
    - Integrate SearchBar, SearchFilters, SearchResults
    - Implement URL-based filter state
    - Add page metadata
    - _Requirements: 3.1, 3.6, 3.7_

  - [x] 29.3 Create property detail page
    - Create src/app/properties/[id]/page.tsx
    - Integrate PropertyGallery, PropertyDetails, BookingWidget, ReviewList
    - Implement server-side data fetching
    - Add structured data for SEO
    - Include AvailabilityIndicator and Reserve button
    - _Requirements: 1.6, 2.1, 6.2_

  - [x] 29.4 Create customer profile page
    - Create src/app/profile/page.tsx
    - Display user information with edit form
    - Show notification preferences toggles
    - Add password change section
    - Display account statistics (bookings count, reviews count)
    - _Requirements: 4.3_

  - [x] 29.5 Create customer bookings page
    - Create src/app/bookings/page.tsx
    - Display user's bookings with BookingCard components
    - Add filtering by status (upcoming, completed, cancelled)
    - Implement empty state
    - Show payment status per booking
    - _Requirements: 2.5_

  - [x] 29.6 Create customer favorites page
    - Create src/app/favorites/page.tsx
    - Display favorited properties with PropertyGrid
    - Add remove from favorites option
    - Show availability status for each property
    - Implement empty state with CTA to browse properties
    - _Requirements: Customer favorites feature_

- [x] 30. Implement admin dashboard pages
  - [x] 30.1 Create admin dashboard overview page
    - Create src/app/admin/page.tsx
    - Display key metrics cards with animations
    - Show booking trends chart
    - Show revenue chart
    - Display recent bookings and payments
    - _Requirements: 5.1, 5.5_

  - [x] 30.2 Create admin property management page
    - Create src/app/admin/properties/page.tsx
    - List all properties with edit/delete actions
    - Add create property button
    - Implement pagination
    - _Requirements: 5.4_

  - [x] 30.3 Create admin property form page
    - Create src/app/admin/properties/new/page.tsx
    - Create src/app/admin/properties/[id]/edit/page.tsx
    - Integrate PropertyForm component
    - Handle create and update flows
    - _Requirements: 1.1, 1.3_

  - [x] 30.4 Create admin booking management page
    - Create src/app/admin/bookings/page.tsx
    - List all bookings with filters
    - Add status update functionality
    - Implement date range filter
    - Show payment status
    - _Requirements: 5.2, 5.3_

  - [x] 30.5 Create admin payments page
    - Create src/app/admin/payments/page.tsx
    - List all payments with status
    - Show payment details modal
    - Filter by status (success, pending, failed)
    - _Requirements: Payment gateway_

- [x] 31. Implement API input validation and error responses
  - [x] 31.1 Create API route handlers with validation
    - Create src/app/api/properties/route.ts with Zod validation
    - Create src/app/api/bookings/route.ts with Zod validation
    - Create src/app/api/reviews/route.ts with Zod validation
    - Implement structured error responses with HTTP status codes
    - _Requirements: 9.1, 9.2_

  - [ ]\* 31.2 Write property tests for API validation
    - **Property 20: API Input Validation**
    - **Validates: Requirements 9.1, 9.2**

- [x] 32. Implement ErrorBoundary and global error handling
  - [x] 32.1 Create ErrorBoundary component
    - Create src/components/ErrorBoundary.tsx
    - Implement error UI with retry button
    - Add error logging
    - _Requirements: 9.2_

  - [x] 32.2 Create error pages
    - Create src/app/error.tsx for runtime errors
    - Create src/app/not-found.tsx for 404 errors
    - Style with consistent design
    - _Requirements: 9.2_

- [ ] 33. Final integration and wiring
  - [x] 33.1 Wire up all components in pages
    - Connect server actions to UI components
    - Implement optimistic updates where appropriate
    - Add loading states to all data fetching
    - _Requirements: 7.4, 7.6_

  - [x] 33.2 Implement global state with Zustand
    - Create src/store/auth-store.ts for auth state
    - Create src/store/search-store.ts for search filters
    - Create src/store/notification-store.ts for notification state
    - Update src/store/cart-store.ts with persistence
    - _Requirements: 4.7_

  - [x] 33.3 Add toast notifications for user feedback
    - Integrate sonner toast library
    - Add success toasts for CRUD operations
    - Add error toasts for failures
    - Add payment status toasts
    - _Requirements: 7.6_

  - [x] 33.4 Performance optimization
    - Implement dynamic imports for heavy components
    - Add image optimization with next/image
    - Configure proper caching headers
    - Implement React Suspense boundaries
    - _Requirements: Efficient code_

- [x] 34. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite with coverage report
  - Verify all property-based tests pass with 100+ iterations
  - Test complete user flow: browse → search → add to cart → checkout → payment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All property tests must run minimum 100 iterations as specified in the design

### Best Practices Checklist

- [ ] All components use TypeScript strict mode
- [ ] Server Components by default, 'use client' only when necessary
- [ ] Server Actions for all mutations (forms, CRUD operations)
- [ ] Zod validation on both client and server
- [ ] Proper loading.tsx and error.tsx at route level
- [ ] Suspense boundaries for streaming
- [ ] Optimistic updates with useOptimistic hook
- [ ] Proper ARIA labels and keyboard navigation
- [ ] Mobile-first responsive design
- [ ] Image optimization with next/image and blur placeholders
- [ ] Proper caching strategies (revalidate, tags)
- [ ] Environment variables properly typed and validated
