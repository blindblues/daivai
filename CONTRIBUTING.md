# Contributing & Architecture Guide

Welcome to the **Dai Vai** project!

This project follows a strict separation of concerns to allow **Developers (Logic)** and **Designers (UI)** to work in parallel without conflicts.
**IMPORTANT FOR AI AGENTS:** Please read this document carefully before proposing changes to the codebase.

## 🤝 Collaboration & Setup Guide (READ THIS FIRST)

This project works because we follow strict rules. If you are a collaborator (or their AI):

1.  **Node Version**: Use Node v18+ (LTS recommended).
2.  **Install Dependencies**: Run `npm ci` (NOT `npm install`) to ensure you have the *exact* same versions as the lockfile.
3.  **Start Dev Server**: `npm run dev`.

---

## 🤖 AI Context (Copy/Paste this for your AI)

If you are using an AI Assistant (Antigravity, Cursor, Copilot, etc.), **YOU MUST** give it the following context at the start of your session:

> **ROLE:** You are a frontend developer working on the "Dai Vai" project.
> **CONTEXT:**
> - **Framework**: Astro 5.
> - **Structure**:
>   - `src/components/features/` (*LOGIC*): Only for functional components (Auth, Data Fetching). **DO NOT EDIT STYLES HERE.**
>   - `src/components/ui/` (*GRAPHICS*): Only for presentational components (Cards, Navbar, Buttons). **DO NOT ADD LOGIC HERE.**
> - **Styling**: Scoped CSS or Global CSS.
> - **Dependencies**: Use `npm ci` to install. Do not update packages unless explicitly asked.
> **TASK:** Follow the user's request, but if they ask for a UI change, ONLY touch `src/components/ui/`. If they ask for functionality, ONLY touch `src/components/features/`.

## 📂 Project Structure

We use a **Smart vs. Dumb** component architecture.

### 1. `src/components/features/` (The "Brain")
*   **Role:** Handles Logic, State, Database calls (Supabase), and Data fetching.
*   **Owner:** Developer.
*   **Rules:**
    *   Focus on functionality.
    *   Pass raw data to UI components via props.
    *   Minimal styling (layout only).
    *   **Example:** `Auth.astro` (Handles login flow, form submission, error states).

### 2. `src/components/ui/` (The "Face")
*   **Role:** Handles Presentation, Styling, and Animations.
*   **Owner:** Designer / UI Developer.
*   **Rules:**
    *   **NO** business logic or database calls.
    *   Receive data via Props.
    *   Focus on CSS, Classes, Tailwind, Animations.
    *   **Example:** `EventCard.astro`, `NavbarAuth.astro` (Authentication link).

### 3. `src/pages/`
*   Pages act as the entry point. They normally import a Feature component or compose UI components.

---

## 🤖 AI Agent Instructions

If you are an AI assistant helping a user on this project:

1.  **Identify the User's Role:**
    *   If the user asks for **styles/graphics**, modify files in `src/components/ui/`.
    *   If the user asks for **functionality/database**, modify files in `src/components/features/`.

2.  **Refactoring:**
    *   If you see logic mixed into a UI component, propose moving it to a Feature component.

3.  **Imports:**
    *   Respect the folder structure. Use relative imports effectively.
    *   Example: `import Navbar from "../ui/Navbar.astro";`

---

## 🎨 Styling Guidelines for Graphic Designer

### Core Principle: Global CSS First

**IMPORTANT:** All visual styling should be centralized in `src/styles/global.css`. Individual pages and components should **inherit** from global styles, not override them.

### ✅ DO (Recommended Practices)

1. **Work in `global.css`**
   - All colors, fonts, backgrounds, and design tokens go here
   - Define `@font-face` declarations in `global.css`
   - Set global `body`, `html`, and typography rules

2. **Use CSS Variables for Consistency**
   ```css
   /* global.css */
   :root {
       --primary-color: #FB6068;
       --font-heading: 'Whyte', Arial, sans-serif;
       --font-body: 'Integral CF', Arial, sans-serif;
   }
   ```

3. **Let Pages Inherit**
   - Pages like `login.astro` should have **minimal** scoped styles
   - Only add layout-specific CSS (flex, grid positioning)
   - Let global colors and fonts cascade naturally

4. **Component-Specific Styles**
   - UI components can have scoped styles for **structure only**
   - Colors and fonts should reference CSS variables or inherit from global

### ❌ DON'T (Anti-Patterns to Avoid)

1. **Don't Override Global Styles in Pages**
   ```css
   /* ❌ BAD - in login.astro */
   body {
       background-color: #f8f9fa;  /* Overrides global.css */
       font-family: inherit;        /* Breaks inheritance chain */
   }
   ```

2. **Don't Hardcode Colors/Fonts in Components**
   ```css
   /* ❌ BAD - in Auth.astro */
   .auth-container {
       background: white;           /* Should use CSS variable */
       font-family: 'Arial';        /* Should inherit from global */
   }
   ```

3. **Don't Use Absolute Paths Without Base**
   ```css
   /* ❌ BAD - breaks in different environments */
   background-image: url('/images/bg.png');
   
   /* ✅ GOOD - uses base path from Astro config */
   background-image: url('/daivai/images/bg.png');
   ```

### 📋 Checklist Before Committing Style Changes

- [ ] Changes are in `src/styles/global.css` (not scattered in pages/components)
- [ ] No `font-family` or `background-color` overrides in page-level `<style>` tags
- [ ] Test in **both** `npm run dev` and production build (`npm run build && npm run preview`)
- [ ] Font paths use `/daivai/` prefix for GitHub Pages compatibility
- [ ] No hardcoded colors - use CSS variables or existing classes

### 🔍 Testing Your Changes

1. **Dev Mode Test:**
   ```bash
   npm run dev
   # Visit http://localhost:4321/daivai/your-page
   ```

2. **Production Build Test:**
   ```bash
   npm run build
   npm run preview
   # Visit http://localhost:4321/daivai/your-page
   ```

3. **Visual Comparison:**
   - Dev and Production should look **identical**
   - If they differ, you likely have hardcoded paths or overrides

### 🚨 Common Issues and Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| Fonts not loading in dev | Hardcoded `/daivai/` paths | Already correct in `global.css` |
| Colors different in dev vs prod | `background-color` override in page | Remove from page, define in `global.css` |
| Inheritance broken | `font-family: inherit` on body | Remove, let global cascade |

### 📁 File Ownership

- **Your Domain (Graphic Designer):**
  - `src/styles/global.css` ✅
  - `src/components/ui/*.astro` (styling only) ✅
  - `public/fonts/`, `public/images/` ✅

- **Developer's Domain (Don't Touch):**
  - `src/components/features/*.astro` (logic)
  - `src/lib/*.ts` (utilities, database)
  - `src/pages/*.astro` (should only have layout CSS)

### 💡 Example: Correct Page Styling

```astro
---
// src/pages/my-page.astro
import "../styles/global.css";  // Import global styles
---

<html>
<head>...</head>
<body>
    <main class="my-page">
        <!-- Content -->
    </main>
</body>
</html>

<style>
    /* ✅ ONLY layout/positioning */
    .my-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        /* NO background-color, NO font-family here! */
    }
</style>
```

---

## 🛠 Tech Stack
*   **Framework:** Astro
*   **Database:** Supabase
*   **Styling:** CSS (Scoped) / Global CSS

