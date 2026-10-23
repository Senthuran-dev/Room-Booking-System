---
name: Hospitality Excellence
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#43474e'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#73777f'
  outline-variant: '#c3c6cf'
  surface-tint: '#416084'
  primary: '#002645'
  on-primary: '#ffffff'
  primary-container: '#1a3c5e'
  on-primary-container: '#87a7ce'
  inverse-primary: '#a9c9f2'
  secondary: '#875300'
  on-secondary: '#ffffff'
  secondary-container: '#fdb255'
  on-secondary-container: '#714500'
  tertiary: '#242524'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a3b39'
  on-tertiary-container: '#a5a5a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#a9c9f2'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#28496b'
  secondary-fixed: '#ffddb9'
  secondary-fixed-dim: '#ffb964'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#663e00'
  tertiary-fixed: '#e3e2df'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-main:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for a premium room booking experience that balances professional reliability with high-end hospitality warmth. It targets travelers and property managers who value efficiency, clarity, and a sense of "ease." 

The design style is **Corporate Modern with a Tactile touch**. It utilizes a sophisticated, limited color palette and generous whitespace to create a calm, organized atmosphere. Depth is communicated through soft, intentional shadows and a clear container-based hierarchy, ensuring the user feels guided rather than overwhelmed by choices.

## Colors

The palette is anchored by a deep navy to project authority and trust, complemented by a warm amber accent that evokes sunlight and high-quality service. 

- **Primary (#1A3C5E):** Used for core brand elements, primary actions, and structural headers.
- **Accent (#E8A045):** Reserved for highlights, star ratings, and "Warning" states to draw attention without causing alarm.
- **Backgrounds:** The off-white surface (#F8F7F4) reduces glare, while pure white (#FFFFFF) is used for elevated cards to create clear separation.
- **Typography:** Primary text uses a near-black for maximum legibility, while muted text is used for metadata and secondary labels.

## Typography

The design system relies exclusively on **Inter** to maintain a systematic and utilitarian feel. The scale is tight and functional, optimized for data-dense booking interfaces.

- **Headlines:** Use tighter letter-spacing and heavier weights to establish a clear hierarchy.
- **Body Text:** Set at 15px to balance information density with readability.
- **Labels:** Small, uppercase labels are used for category headers or "Overlines" above main titles.
- **Alignment:** Consistent left-alignment is preferred for all booking details to facilitate rapid scanning.

## Layout & Spacing

This design system follows a **Fixed Grid** approach for desktop (max-width 1200px) and a **Fluid Grid** for mobile devices. 

- **Grid:** A 12-column grid is used for desktop layouts, transitioning to a 2-column or single-column stack on mobile.
- **Rhythm:** An 8px (or 4px sub-unit) spacing system ensures vertical rhythm. 
- **Density:** High-density layouts are permitted for search results and booking calendars, while "Property Detail" pages should use expanded spacing (stack-lg) to evoke a sense of luxury.

## Elevation & Depth

Depth is achieved through a combination of **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** #F8F7F4 (Off-white surface).
- **Level 1 (Cards):** #FFFFFF with a soft shadow (0px 2px 8px rgba(0,0,0,0.07)). This is the primary container for room listings and forms.
- **Level 2 (Overlays):** Modals and dropdowns use a slightly more aggressive shadow (0px 4px 16px rgba(0,0,0,0.1)) to sit clearly above the card layer.
- **Interactions:** Cards should subtly lift on hover (shadow becomes 0px 8px 24px rgba(0,0,0,0.1)) to provide tactile feedback.

## Shapes

The shape language is "Rounded," striking a balance between the rigid professional world and the soft comfort of hospitality.

- **Cards:** 10px corner radius provides a distinct, modern container.
- **Interactive Elements:** Buttons and Input fields use an 8px radius to feel precise.
- **Status Indicators:** Full pill-shapes (rounded-full) are reserved for badges and tags to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Navy (#1A3C5E) background, white text. Padding: 12px vertical, 24px horizontal. Transitions to a slightly darker navy on hover.
- **Secondary:** White background with a 1px Navy border and Navy text. Ideal for "Cancel" or "View Details" actions.

### Inputs & Forms
- **Text Fields:** 8px border radius, 1px border (#D1D1D1). On focus, the border changes to Primary Navy with a subtle 2px glow.
- **Checkboxes:** Square with an 4px radius, filling with Navy when checked.

### Status Badges & Tags
- **Status Pills:** Pill-shaped with a light tinted background and dark text (e.g., Confirmed uses a light green background with #2D7D46 text).
- **Room Tags & Amenity Chips:** Pill-shaped tags featuring dedicated Lucide icons and text; used for amenities like "Free WiFi", "Lake View", and "Coffee Maker". In admin management, selected chips highlight with primary fill (`bg-primary text-white`) and custom-created amenities include an inline remove button.
- **Role Badges:** Admin uses blue-tinted pills (bg-blue-100 / text-blue-800); User uses neutral gray pills (bg-gray-100 / text-gray-800).

### Cards
- Standard Room Card: Features a top-aligned image, 10px rounded corners, and the Level 1 shadow. Content should be padded by 20px (stack-lg equivalent) internally.
- KPI Cards (Admin Dashboard): Horizontal layout with a colored icon container (blue, green, purple, orange tints) and vertically stacked label + value.

### Star Ratings
- Displayed using the Accent color (#E8A045). Always paired with a numeric value in parentheses (e.g., ★ 4.8).

### Modals
- **ReviewModal:** Overlay modal for submitting room reviews. Contains a StarRating input, comment textarea, and submit/cancel buttons. Uses Level 2 elevation shadow with a semi-transparent backdrop.
- **Room Preview Modal:** Comprehensive Level 2 elevation modal with backdrop blur for previewing room listings in Manage Rooms. Features an interactive photo gallery/carousel with prev/next arrows and thumbnail strip, key metrics grid (Price, Capacity, Type, Rating), formatted description, amenity icon chips, and direct actions ("Open Live Page", "Edit Room", and "Close").
- **Image Lightbox Modal:** Deep focus full-screen overlay with dark backdrop blur (`bg-black/80`) allowing admins to zoom and inspect room photos in full resolution.

### Confirmation Pages
- **ConfirmBookingPage:** Two-column layout (reservation details + price summary sidebar). Displays check-in/check-out dates, guest count, payment method indicator, itemized price breakdown with 15% tax, and a prominent "Complete Booking" CTA. Success state shows a CheckCircle animation with auto-redirect.
