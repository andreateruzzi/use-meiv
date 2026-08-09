# User Requests Log

| Date | Request | Status |
| :--- | :--- | :--- |
| 2026-05-20 | Migrate to Vercel hosting. Implement a "tandem journey" navigation: horizontal transitions between sections triggered by a right arrow, featuring an animated black tandem icon with the couple. | Done |
| 2026-05-20 | Clean up GitHub repo (remove workflows, prototypes, temp files). Fix "white page" issue on Vercel by removing incorrect `base` path in vite.config.ts. | Done |
| 2026-06-22 | Add custom RSVP component wired to Google Apps Script Web App for direct population into Google Sheets. | Done |
| 2026-06-22 | Generate custom, luxury line-art sketches for both Castello Visconteo and Chiesa di Ca' Granda, replacing Unsplash placeholders and integrating them with CSS blend modes. | Done |
| 2026-06-22 | Update cover page photo to IMG_6493.jpg and link the RSVP button to the new form section. | Done |

- **Hosting:** Vercel
- **Domini Acquistati:**
    - `mariavittoriandrea.click` (Sola cerimonia)
    - `mariavittoriandrea.website` (Cerimonia + Ricevimento)
    - *Soluzione implementata:* Un unico progetto Vercel che legge `window.location.hostname` per mostrare automaticamente la versione corretta (bypassando la Landing Page in produzione).
