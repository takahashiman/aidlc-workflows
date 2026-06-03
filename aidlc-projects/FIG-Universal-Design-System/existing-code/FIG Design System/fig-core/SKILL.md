---
name: busapp-design
description: Use this skill to generate well-branded interfaces and assets for バスアプリ (Bus Delay Info), a Japanese mobile-first transit app for Kyoto/Hyogo/Oita/Okinawa commuters. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (`primitives.css`, `assets/`, `preview/`, `ui_kits/busapp/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Use `primitives.css` directly or copy its tokens into your output. Reuse the `ui_kits/busapp/` JSX components as the source of truth for layout and interaction patterns — they are pixel-faithful to the source app.

If working on production code, copy assets and read the rules in README.md to become an expert in designing with this brand. Key invariants:
- All UI copy is in **Japanese**, polite-formal, slightly apologetic.
- Primary brand color is turquoise `#26B7BC` / blue `#38A1DB` (FIG brand). App background is the tri-stop pastel-mint gradient.
- Typography uses the JP system stack (Noto Sans JP fallback). Weights 400–800.
- Iconography is **lucide-react** exclusively, stroke-width 2.
- Cards: `rounded-xl` white surfaces. Pass card: `rounded-[28px]` teal-gradient hero. No emoji.
- Animation is `motion/react` (Framer), expo-out easing, fast and quiet.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a screen, a marketing page, a slide, etc.), ask 3–5 questions to clarify, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
