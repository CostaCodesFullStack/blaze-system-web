# Blaze System

Blaze System is a Next.js dashboard and marketing site for a Discord automation product aimed at Brazilian communities, fan groups, and role-based servers. The current codebase presents the product, shows subscription plans, and simulates a control panel where a user can choose one of their servers and configure bot behavior such as the verified role and announcement channel.

This repository is currently a front-end prototype. There is no real Discord authentication, backend API, database, or persistent settings layer yet. Most of the application behavior is driven by hardcoded arrays inside the route files, which makes the project ideal as a UI foundation for a future full-stack version.

## 1. Project Overview

The project has two main goals:

- Market the Blaze System product through a polished landing page and pricing page.
- Demonstrate how the management dashboard should work once real Discord server data and bot settings are connected.

From the UI and copy, the product is designed around Discord automation features such as:

- Member verification
- Automated announcements
- Warning and moderation flows
- Attendance tracking
- Modular add-ons like tickets, giveaways, logs, and rankings

Even though these features are presented in the interface, the current repository focuses on the front-end experience rather than live bot logic.

## 2. Technologies Used

### Core stack

- Next.js 16 with the App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- PostCSS with `@tailwindcss/postcss`

### UI and styling

- `lucide-react` for icons
- Google fonts via `next/font` (`Inter` and `Geist Mono`)
- shadcn/ui configuration in `components.json`
- Radix UI packages installed for accessible primitives
- `clsx` + `tailwind-merge` through the `cn()` helper in `lib/utils.ts`
- `tw-animate-css` for animation utilities

### Analytics and utilities

- `@vercel/analytics` for page analytics

### Installed but not actively used in the current pages

The repository also includes several dependencies that appear to come from a broader shadcn/v0 scaffold and are not wired into the current route pages yet, including:

- `react-hook-form`
- `zod`
- `recharts`
- `date-fns`
- `next-themes`
- `sonner`
- multiple Radix/shadcn UI primitives inside `components/ui`

This is important when understanding the project: the dependency list is larger than the set of features currently implemented in the visible app.

## 3. Project Structure

```text
Blaze System/
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ page.tsx
│  ├─ pricing/
│  │  └─ page.tsx
│  └─ dashboard/
│     ├─ layout.tsx
│     ├─ page.tsx
│     └─ [id]/
│        └─ page.tsx
├─ components/
│  ├─ navbar.tsx
│  ├─ footer.tsx
│  ├─ dashboard-sidebar.tsx
│  ├─ theme-provider.tsx
│  └─ ui/
├─ hooks/
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib/
│  └─ utils.ts
├─ public/
├─ styles/
│  └─ globals.css
├─ package.json
├─ next.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
└─ components.json
```

### Main folders and files

#### `app/`

This is the main application folder using the Next.js App Router.

- `app/layout.tsx`
  - Global root layout
  - Loads fonts with `next/font`
  - Imports `app/globals.css`
  - Injects Vercel Analytics
- `app/globals.css`
  - Active global stylesheet
  - Defines the Blaze System visual identity with a forced dark theme and orange accent color
  - Maps CSS variables into Tailwind theme tokens
- `app/page.tsx`
  - Landing page
  - Contains the hero section, product features, main bot categories, modular systems, testimonials, and CTA banners
- `app/pricing/page.tsx`
  - Pricing page
  - Shows three plans (`Básico`, `Pro`, `Elite`) with feature comparisons and CTA buttons
- `app/dashboard/layout.tsx`
  - Dashboard shell
  - Wraps dashboard pages with a fixed left sidebar
- `app/dashboard/page.tsx`
  - Dashboard home
  - Lists the user’s servers and summary metrics
- `app/dashboard/[id]/page.tsx`
  - Dynamic server detail page
  - Simulates bot configuration for a selected server

#### `components/`

- `components/navbar.tsx`
  - Top navigation used on the landing and pricing pages
  - Includes desktop navigation and a mobile menu toggle
- `components/footer.tsx`
  - Shared footer used on the public pages
- `components/dashboard-sidebar.tsx`
  - Fixed navigation sidebar used in dashboard routes
  - Displays a mock user profile block and links to dashboard sections
- `components/theme-provider.tsx`
  - Wrapper around `next-themes`
  - Present in the repo but not currently used by the app layout
- `components/ui/`
  - Large local UI library generated from shadcn patterns
  - Most of these components are not used in the current page implementations yet

#### `hooks/`

- `hooks/use-mobile.ts`
  - Small responsive helper hook
- `hooks/use-toast.ts`
  - Toast state implementation inspired by react-hot-toast
  - Not currently connected to the visible pages

#### `lib/`

- `lib/utils.ts`
  - Provides the `cn()` utility for merging Tailwind class names

#### `public/`

Contains static assets such as icons, placeholders, and app images.

#### `styles/globals.css`

This file looks like an earlier or alternative global stylesheet. The active app imports `app/globals.css`, so `styles/globals.css` is currently redundant.

## 4. How the Application Works

### High-level flow

The current application flow is:

1. The user lands on `/` and sees the product presentation.
2. They can navigate to `/pricing` to compare plans.
3. They can open `/dashboard` to view a list of Discord servers.
4. Selecting a server takes them to `/dashboard/[id]`, where bot settings are configured for that specific server.

There is no real authentication step yet. The navigation uses links and mock user/server data to simulate the final experience.

### Public pages

#### Landing page: `app/page.tsx`

The landing page is a marketing page for the Blaze System product. It is built from static arrays rendered into sections:

- `features`
  - Verification, announcements, warnings, and attendance
- `mainBots`
  - Bot variants for different community types such as fan groups, FiveM servers, factions, and corporations
- `additionalSystems`
  - Tickets, giveaways, logs, and ranking modules
- `stats`
  - Quick product value indicators like uptime and setup speed

This page uses:

- `Navbar` at the top
- a multi-section `main` area
- `Footer` at the bottom

The CTAs mainly point users to `/dashboard` or to Discord.

#### Pricing page: `app/pricing/page.tsx`

The pricing page defines a static `plans` array and renders three cards:

- `Básico`
- `Pro`
- `Elite`

Each plan includes:

- price and billing period
- short description
- included features
- missing features where applicable
- CTA button linking to `/dashboard`

The `Pro` plan is visually highlighted as the recommended option.

### Dashboard behavior

#### Dashboard shell: `app/dashboard/layout.tsx`

All dashboard pages share a two-column layout:

- a fixed left sidebar (`DashboardSidebar`)
- a content area on the right (`main`)

The layout uses `ml-64` to offset the main content by the sidebar width, so the current dashboard is primarily optimized for desktop.

#### Dashboard sidebar: `components/dashboard-sidebar.tsx`

The sidebar is the persistent navigation inside the dashboard. It contains:

- brand/logo section
- a mock user card with username and Discord email
- navigation links
- logout link back to `/`

The visible menu entries are:

- `/dashboard` for the server list
- `/pricing` for plan comparison
- `/dashboard/settings` as a settings link

Important note: there is no `app/dashboard/settings/page.tsx` route in the current project, so that sidebar link is a placeholder and would lead to a missing page.

#### Dashboard home: `app/dashboard/page.tsx`

This page is the first dashboard screen and acts as the server selector. It defines a local `servers` array with four mock Discord servers. Each server object contains:

- `id`
- `name`
- `members`
- `plan`
- `icon`
- `color`

The page renders two main areas:

- Stats bar
  - Total number of servers
  - Total member count across all servers
  - Number of active plans
- Server card grid
  - One card per server
  - Displays server icon, member count, current plan, and a `Gerenciar` action

Clicking `Gerenciar` routes the user to `/dashboard/[id]` for that specific server.

#### Server configuration page: `app/dashboard/[id]/page.tsx`

This is the main dashboard logic screen. It is a client component because it uses React state.

##### What it does

The page simulates per-server bot configuration through:

- a back link to `/dashboard`
- a header with the selected server name
- a license status panel
- a settings form for role and channel selection
- a save button with temporary success feedback

##### How the selected server works

The route receives `params.id` from the URL and uses it to:

- look up the server name from a `serverNames` object
- decide whether the license is active

The logic is simple:

- servers `1`, `2`, and `3` are treated as active
- server `4` is treated as expired

This creates two different dashboard states:

- Active license
  - green status card
  - save button enabled
- Expired license
  - destructive status card
  - `Renovar` link to `/pricing`
  - save button disabled

##### Form logic

The form uses local component state:

- `role`
- `channel`
- `saved`

The available options are also hardcoded:

- roles such as `@Verificado`, `@Membro`, `@Torcedor`, `@VIP`
- channels such as `#anúncios`, `#geral`, `#verificação`, `#eventos`

Instead of using a library select component, the page implements a local `CustomSelect` component with:

- internal open/close state
- selected option lookup
- option buttons rendered in a dropdown panel

When the user submits the form:

- the default submit event is prevented
- `saved` becomes `true`
- the button label changes to success state
- after 2.5 seconds the button returns to the default label

There is no API call and no persistence, so the configuration resets on reload.

### Dashboard summary

If you want to understand the dashboard quickly, this is the current behavior:

- `/dashboard` is a server list and overview screen.
- `/dashboard/[id]` is a mock server settings page.
- state is local to the component.
- plan/license behavior is simulated from the route id.
- there is no backend, storage, Discord OAuth, or bot sync yet.

## 5. How to Run the Project Locally

### Prerequisites

- Node.js 20 or newer recommended
- npm

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

### Available scripts

- `npm run dev` - starts the Next.js development server
- `npm run build` - creates the production build
- `npm run start` - runs the production server
- `npm run lint` - intended to lint the project

Note: the `lint` script exists in `package.json`, but the repository does not currently include an ESLint dependency/configuration, so linting setup appears incomplete.

## 6. Environment Variables

At the moment, the application does not reference any environment variables in the codebase.

What exists today:

- `.env*.local` is ignored in `.gitignore`
- there is no `process.env` usage in the app routes or shared components

This means you can run the current project locally without creating an `.env.local` file.

## 7. Future Improvements

Based on the current implementation, these are the most valuable next steps:

### Product and data

- Replace hardcoded arrays in `app/page.tsx`, `app/pricing/page.tsx`, and `app/dashboard/page.tsx` with data from a CMS, API, or database.
- Add real Discord OAuth login and fetch the authenticated user’s actual servers.
- Persist server configuration changes from `app/dashboard/[id]/page.tsx` to a backend.
- Connect the dashboard to real bot status, license records, and Discord channels/roles.

### Dashboard UX

- Implement the missing `/dashboard/settings` page or remove the placeholder sidebar link.
- Make the dashboard layout responsive on smaller screens; the fixed sidebar and `ml-64` content offset are desktop-first.
- Replace the custom dropdown with reusable accessible UI components from `components/ui`.
- Add loading, empty, and error states for server lists and settings pages.

### Code quality and maintainability

- Reuse the existing `components/ui` primitives instead of custom one-off controls where appropriate.
- Remove unused scaffolding or document which generated components are intentionally kept for future work.
- Add a real linting setup and optionally formatting rules.
- Add tests for page rendering, route behavior, and dashboard form interactions.
- Consider removing `typescript.ignoreBuildErrors` from `next.config.mjs` once the app is production-ready.

### Architecture

- Introduce API routes or server actions for configuration updates.
- Add validation with the already installed `zod` and `react-hook-form`.
- Use charts, toasts, and richer UI modules that are already installed but not yet leveraged.
- Add role-based permissions, audit logs, and more complete server management flows.

## Current State in One Sentence

Blaze System is a well-styled Next.js front-end prototype for a Discord bot management platform, with a clear marketing site and a simulated server dashboard that is ready to be connected to real authentication, storage, and bot data.
