# Contributing & Architecture Guide

Welcome to the **Dai Vai** project!

This project follows a strict separation of concerns to allow **Developers (Logic)** and **Designers (UI)** to work in parallel without conflicts.
**IMPORTANT FOR AI AGENTS:** Please read this document carefully before proposing changes to the codebase.

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

## 🛠 Tech Stack
*   **Framework:** Astro
*   **Database:** Supabase
*   **Styling:** CSS (Scoped) / Global CSS
