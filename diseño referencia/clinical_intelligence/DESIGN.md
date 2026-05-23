---
name: Clinical Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a3d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7b6c'
  outline-variant: '#bccbb9'
  surface-tint: '#006e2f'
  primary: '#006e2f'
  on-primary: '#ffffff'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#4ae176'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#565e74'
  on-tertiary: '#ffffff'
  tertiary-container: '#a4abc4'
  on-tertiary-container: '#383f54'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  gutter: 24px
  section-gap: 64px
---

## Brand & Style

The design system is rooted in the intersection of clinical precision and proactive wellness. It targets health-conscious professionals and medical practitioners who require immediate, AI-driven insights without cognitive overload.

The visual style is **Minimalist Modern SaaS** with a **Glassmorphic** layer. It emphasizes high signal-to-noise ratios, utilizing generous white space to reduce stress and soft translucent surfaces to suggest depth and technological sophistication. The aesthetic should feel "breathable," sterile but welcoming, and undeniably high-tech.

## Colors

The palette is designed to evoke growth and technical reliability. 

- **Primary (Healthy Green):** Used for "positive" health markers, primary actions, and success states.
- **Secondary (Tech Blue):** Reserved for AI-driven features, data visualizations, and secondary interactions.
- **Backgrounds:** A crisp white is the primary canvas, while `#F9FAFB` (Light Gray) is used to differentiate dashboard panels and container backgrounds.
- **Typography/Depth:** Use `#0F172A` for high-contrast headlines and `#64748B` for secondary metadata.

## Typography

This design system uses a dual-font approach to balance approachability with utility. 

**Plus Jakarta Sans** is used for headlines and display text. Its soft, rounded terminals make nutritional data feel less clinical and more encouraging. **Inter** is the workhorse for all functional UI, body text, and data tables, providing maximum legibility at small sizes.

Large display sizes use negative letter spacing to feel "tighter" and more editorial. Label styles should be used for button text and category chips, often in all-caps for the `label-sm` variant.

## Layout & Spacing

The system follows an **8px linear scale**. 

The dashboard uses a **12-column fluid grid** for desktop, collapsing to a **single-column fluid layout** for mobile. 
- **Sidebars:** Fixed at 280px for navigation.
- **Main Content:** Centered with a max-width of 1440px.
- **Margins:** 40px on desktop to allow the "minimalist" aesthetic to breathe; 20px on mobile for space efficiency.

Vertical spacing between dashboard widgets should be consistent at 24px (3 units) to maintain a structured, systematic feel.

## Elevation & Depth

Visual hierarchy is established through **Glassmorphism** and **Ambient Shadows**.

1.  **Level 0 (Base):** The main background (`#F9FAFB`).
2.  **Level 1 (Cards):** White background with a 1px border of `#E5E7EB` and a soft, highly diffused shadow (0px 4px 20px rgba(0,0,0,0.03)).
3.  **Level 2 (Overlays/Glass):** Translucent white (Opacity 70%) with a 12px backdrop blur and a 1px semi-transparent white border. Used for navigation bars and floating action panels.
4.  **Level 3 (Modals):** High-contrast shadow (0px 20px 50px rgba(0,0,0,0.1)) to draw focus.

Avoid heavy dark shadows; depth should feel like light passing through layers of clean glass.

## Shapes

The shape language is friendly and organic. 

- **Base Radius (0.5rem):** Standard buttons, input fields, and small UI elements.
- **Large Radius (1rem):** Primary dashboard cards and feature containers.
- **Extra Large Radius (1.5rem):** Hero sections, promotional banners, and global modal containers.

Graphs and progress indicators should use rounded stroke caps to maintain consistency with the border radii of the containers they inhabit.

## Components

- **Buttons:** Primary buttons use a solid Healthy Green fill with white text. Secondary buttons use a ghost style (Tech Blue border and text) or a soft blue tint background.
- **Cards:** Dashboard widgets must use the Level 1 elevation. Titles inside cards use `label-md` in secondary text color.
- **Input Fields:** Soft gray backgrounds (`#F3F4F6`) that transition to a white background with a 2px Tech Blue border on focus.
- **Circular Progress:** Use a thick stroke (8px+) with rounded ends. The "track" should be a light 10% opacity version of the "indicator" color.
- **Chips:** Small, pill-shaped tags used for nutritional categories (e.g., "High Protein," "Low Carb"). These use 10% opacity backgrounds of the primary or secondary colors with full-opacity text.
- **Navigation:** A vertical sidebar on desktop with icons using a 2px stroke weight. Active states are indicated by a 4px vertical "pill" marker on the left edge.