"use client";

const CSS = `
.mvx-home {
  --accent: #00c9a7;
  --bg: #ffffff;
  --panel: #fafafa;
  --card: #ffffff;
  --card-border: #ededed;
  --divider: #f2f2f2;
  --text: #0a0a0a;
  --text-mut: #555555;
  --icon-bg: #e6faf7;
  --muted: #bbbbbb;
  --hl-text: #ffffff;
  --primary-text: #ffffff;
  --chip-bg: #f4f4f4;
  --chip-border: #ececec;
  --doc-bg: #0b1929;
  --doc-text: #ffffff;
  --doc-mut: rgba(255,255,255,0.55);
  --doc-border: rgba(255,255,255,0.1);
  --doc-card: rgba(255,255,255,0.05);
}
.mvx-card { transition: transform .3s cubic-bezier(.2,.85,.25,1), box-shadow .3s ease, border-color .3s ease; }
.mvx-card:hover { transform: translateY(-5px); border-color: var(--accent) !important; box-shadow: 0 18px 40px rgba(0,0,0,.08); }
.mvx-chip { transition: transform .25s cubic-bezier(.2,.85,.25,1), border-color .25s ease, color .25s ease; cursor: default; }
.mvx-chip:hover { transform: translateY(-3px); border-color: var(--accent) !important; color: var(--accent) !important; }
`;

let injected = false;

export function useLandingStyles() {
  if (typeof document !== "undefined" && !injected) {
    const tag = document.createElement("style");
    tag.setAttribute("data-mvx-landing", "");
    tag.textContent = CSS;
    document.head.appendChild(tag);
    injected = true;
  }
}
