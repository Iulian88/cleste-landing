
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SHIPPING_COST = 25;
const FREE_SHIPPING_THRESHOLD = 300;



interface CartItem {

  name: string;

  price: number;

  id: number;

  extraKey?: string;

}



interface Review {

  name: string;

  loc: string;

  stars: number;

  title: string;

  body: string;

  package: string;

  date: string;

  helpful: number;

  verified: boolean;

}



const BUNDLES = [

  { name: "Pachet Starter", price: 169, oldPrice: 199 },

  { name: "Pachet Popular", price: 279, oldPrice: 349 },

  { name: "Pachet Pro", price: 399, oldPrice: 499 },

];



const EXTRAS_META: Record<string, { name: string; price: number }> = {

  banda: { name: "Role bandă (5 buc)", price: 39 },

  capse: { name: "Set capse", price: 29 },

};



const AVATAR_COLORS = [

  { bg: "#e8f4e8", color: "#2d5a27" },

  { bg: "#fdf5e6", color: "#c8952a" },

  { bg: "#e6f1fb", color: "#185fa5" },

  { bg: "#fbeaf0", color: "#993556" },

  { bg: "#e1f5ee", color: "#0f6e56" },

  { bg: "#faeeda", color: "#854f0b" },

];



const PACKAGE_LABELS: Record<string, string> = {

  "bundle-starter": "Pachet Starter",

  "bundle-popular": "Pachet Popular",

  "bundle-pro": "Pachet Pro",

};



const INITIAL_REVIEWS: Review[] = [

  {

    name: "Gheorghe M.", loc: "Vrancea", stars: 5,

    title: "Cel mai bun ajutor la vie!",

    body: "Am 2 hectare de viță de vie şi legatul manual îmi lua 3 zile. Cu 3 clești de legat din pachetul Pro am terminat în mai puțin de o zi. Calitate foarte bună, nu s-a stricat nimic.",

    package: "bundle-pro", date: "15 martie 2025", helpful: 24, verified: true,

  },

  {

    name: "Maria D.", loc: "Dolj", stars: 5,

    title: "Perfect pentru roşii şi castraveți",

    body: "Îl folosesc la solarul meu de legume. E rapid, nu taie tulpinile şi banda ține toată vara. Recomand pachetul Popular — ai 2 cleşti şi poți lucra cu cineva în paralel.",

    package: "bundle-popular", date: "2 aprilie 2025", helpful: 18, verified: true,

  },

  {

    name: "Ion P.", loc: "Prahova", stars: 5,

    title: "Calitate germană la preț bun",

    body: "Am mai avut un model ieftin luat de pe net care s-a stricat după prima recoltă. Acesta e cu totul altceva — metalul e gros, articulațiile nu joacă şi capsele intră bine de fiecare dată. Merită banii.",

    package: "bundle-popular", date: "28 martie 2025", helpful: 31, verified: true,

  },

  {

    name: "Florica N.", loc: "Iaşi", stars: 4,

    title: "Bun, dar banda se termină repede",

    body: "Calitatea e excelentă, nu am nicio problemă cu el. Singura observație — am un solar mai mare şi rolele s-au terminat repede. Bine că pot comanda extra separat.",

    package: "bundle-starter", date: "10 aprilie 2025", helpful: 9, verified: true,

  },

  {

    name: "Vasile C.", loc: "Mureş", stars: 5,

    title: "Le-am luat pentru toată familia",

    body: "Am luat 3 bucăți — câte unul pentru mine, fratele meu şi socrul. Am terminat 1,5 hectare de vie în două zile, noroc că nu mai luăm la mână. Livrarea a venit în 4 zile, bine ambalat.",

    package: "bundle-pro", date: "5 mai 2025", helpful: 15, verified: true,

  },

  {

    name: "Elena B.", loc: "Bacău", stars: 5,

    title: "Extraordinar pentru pensionari",

    body: "Am 68 de ani şi legatul mă obosea enorm. Aparatul e uşor, se ține confortabil în mână şi nu mai am dureri. Fiică-mea mi l-a comandat şi îi mulțumesc!",

    package: "bundle-starter", date: "20 aprilie 2025", helpful: 42, verified: true,

  },

  {

    name: "Dumitru A.", loc: "Timiş", stars: 4,

    title: "Livrat rapid, funcționează bine",

    body: "Am primit în 3 zile lucrătoare, ambalat îngrijit. Clestele funcționează perfect, am testat pe roşii. Dau 4 stele doar pentru că aş fi vrut instrucțiuni în română.",

    package: "bundle-popular", date: "1 mai 2025", helpful: 7, verified: false,

  },

  {

    name: "Rodica M.", loc: "Cluj", stars: 5,

    title: "Nu mai pot fără el!",

    body: "Soțul meu zicea că e o jucărie scumpă. După prima zi de lucru la vie a recunoscut singur că a greşit. Am terminat în jumătate din timpul normal. Mai comandăm bandă sigur.",

    package: "bundle-popular", date: "18 mai 2025", helpful: 20, verified: true,

  },

  {

    name: "Nelu G.", loc: "Olt", stars: 5,

    title: "Recomand tuturor agricultorilor",

    body: "Lucrez 5 hectare de legume. Cu 2 clești de legat din pachetul Popular economisesc cel puțin 2 ore pe zi în sezonul de legat. Se amortizează în prima săptămână de utilizare.",

    package: "bundle-popular", date: "12 mai 2025", helpful: 33, verified: true,

  },

];



const CSS = `

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

*{margin:0;padding:0;box-sizing:border-box}

:root{

  --green:#2d5a27;--green-light:#4a8a3f;--green-pale:#f0f7ee;

  --gold:#c8952a;--gold-light:#e8b84b;

  --bg:#fafaf7;--text:#1a1a18;--muted:#6b7059;

  --radius:12px;--shadow:0 2px 24px rgba(0,0,0,0.08);

}

body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);font-size:15px;line-height:1.6}

.hero{background:linear-gradient(135deg,#1e3a1a 0%,#2d5a27 60%,#3d7a32 100%);color:#fff;padding:3rem 1.5rem 4rem;text-align:center;position:relative;overflow:hidden}

.hero::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(200,149,42,0.12)}

.hero-badge{display:inline-block;background:var(--gold);color:#fff;font-size:12px;font-weight:600;letter-spacing:0.06em;padding:5px 14px;border-radius:20px;margin-bottom:1.2rem;text-transform:uppercase}

.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:900;line-height:1.15;margin-bottom:1rem;max-width:650px;margin-left:auto;margin-right:auto}

.hero h1 span{color:var(--gold-light)}

.hero p{font-size:1.05rem;opacity:0.88;max-width:480px;margin:0 auto 2rem}

.hero-cta{display:inline-block;background:var(--gold);color:#fff;font-weight:600;font-size:1rem;padding:14px 32px;border-radius:var(--radius);cursor:pointer;border:none;transition:transform .15s,background .15s}

.hero-cta:hover{background:var(--gold-light);transform:translateY(-2px)}

.trust-bar{background:#fff;border-bottom:1px solid #e8e8e0;padding:0.85rem 1rem;display:flex;justify-content:center;gap:2rem;font-size:13px;color:var(--muted);flex-wrap:wrap}

.trust-bar span{display:flex;align-items:center;gap:6px}

.section{padding:3rem 1.5rem;max-width:960px;margin:0 auto}

.section-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;text-align:center;margin-bottom:0.5rem;color:var(--green)}

.section-sub{text-align:center;color:var(--muted);margin-bottom:2.5rem;font-size:0.95rem}

.bundles{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:2rem}

.bundle-card{background:#fff;border:1.5px solid #e0e5d5;border-radius:16px;padding:1.5rem;position:relative;transition:box-shadow .2s,transform .2s;cursor:pointer}

.bundle-card:hover{box-shadow:var(--shadow);transform:translateY(-3px)}

.bundle-card.featured{border:2px solid var(--green);box-shadow:0 6px 36px rgba(45,90,39,0.18);background:var(--green-pale);transform:scale(1.03);overflow:hidden}

.popular-badge{display:block;background:var(--green);color:#fff;font-size:12px;font-weight:700;padding:9px 16px;border-radius:13px 13px 0 0;margin:-1.5rem -1.5rem 1.25rem -1.5rem;text-align:center;letter-spacing:0.05em}

.bundle-name{font-weight:600;font-size:1rem;color:var(--green);margin-bottom:0.25rem}

.bundle-price{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--text);margin:0.5rem 0 0.25rem}

.bundle-price sup{font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:500;vertical-align:top;margin-top:10px;display:inline-block}

.bundle-old{font-size:0.85rem;color:var(--muted);text-decoration:line-through;margin-bottom:0.75rem}

.bundle-items{list-style:none;margin-bottom:1.25rem}

.bundle-items li{font-size:13.5px;color:var(--muted);padding:3px 0;display:flex;align-items:center;gap:8px}

.bundle-items li::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green-light);flex-shrink:0}

.add-btn{width:100%;padding:11px;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.95rem;cursor:pointer;transition:background .15s,transform .1s}

.add-btn:active{transform:scale(0.98)}

.add-btn.primary{background:var(--green);color:#fff}

.add-btn.primary:hover{background:var(--green-light)}

.add-btn.secondary{background:var(--green-pale);color:var(--green)}

.add-btn.secondary:hover{background:#d8ecd4}

.extras-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}

.extra-card{background:#fff;border:1px solid #e0e5d5;border-radius:var(--radius);padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}

.extra-name{font-weight:500;font-size:0.95rem}

.extra-price{font-size:0.85rem;color:var(--green-light);font-weight:600;margin-top:2px}

.qty-control{display:flex;align-items:center;gap:8px;flex-shrink:0}

.qty-btn{width:30px;height:30px;border:1px solid #c8d4b8;background:var(--green-pale);border-radius:8px;cursor:pointer;font-size:1.1rem;font-weight:500;color:var(--green);display:flex;align-items:center;justify-content:center;transition:background .1s}

.qty-btn:hover{background:#c8e0c0}

.qty-num{font-weight:600;min-width:20px;text-align:center;font-size:0.95rem}

.transport-bar{background:var(--green-pale);border:1px solid #c8d4b8;border-radius:var(--radius);padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-top:1.5rem}

.transport-bar .t-label{font-size:0.9rem;color:var(--muted)}

.transport-bar .t-value{font-weight:600;color:var(--green)}

.cart-panel{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:2px solid var(--green-light);box-shadow:0 -4px 24px rgba(0,0,0,0.12);z-index:100;transform:translateY(100%);transition:transform .3s cubic-bezier(.4,0,.2,1)}

.cart-panel.open{transform:translateY(0)}

.cart-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid #e8e8e0}

.cart-header h3{font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--green)}

.cart-close{background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--muted);line-height:1}

.cart-items{padding:1rem 1.5rem;max-height:40vh;overflow-y:auto}

.cart-item{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid #f0f0e8;font-size:14px}

.cart-item-name{font-weight:500;flex:1}

.cart-item-price{font-weight:600;color:var(--green);margin-left:12px}

.cart-item-remove{background:none;border:none;color:#ccc;cursor:pointer;font-size:1.1rem;margin-left:8px;transition:color .1s}

.cart-item-remove:hover{color:#e24b4a}

.cart-footer{padding:1rem 1.5rem}

.cart-total-row{display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:14px}

.cart-total-row.main{font-size:1.1rem;font-weight:600;border-top:1px solid #e0e5d5;padding-top:0.6rem;margin-top:0.4rem}

.cart-checkout{width:100%;margin-top:1rem;padding:14px;background:var(--green);color:#fff;border:none;border-radius:var(--radius);font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;cursor:pointer;transition:background .15s}

.cart-checkout:hover{background:var(--green-light)}

.cart-empty{text-align:center;color:var(--muted);padding:2rem 0;font-size:0.9rem}

.fab{position:fixed;bottom:24px;right:24px;background:var(--green);color:#fff;border:none;border-radius:50px;padding:12px 22px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.95rem;cursor:pointer;box-shadow:0 4px 20px rgba(45,90,39,0.35);z-index:99;display:flex;align-items:center;gap:10px;transition:background .15s,transform .1s}

.fab:hover{background:var(--green-light);transform:translateY(-2px)}

.fab-badge{background:var(--gold);color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;min-width:20px}

.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:99;display:none}

.overlay.show{display:block}

.notify{position:fixed;top:16px;right:16px;background:var(--green);color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;z-index:200;opacity:0;transform:translateY(-10px);transition:all .25s;pointer-events:none}

.notify.show{opacity:1;transform:translateY(0)}

.reviews-section{padding:3.5rem 1.5rem;max-width:960px;margin:0 auto}

.section-header{text-align:center;margin-bottom:2.5rem}

.rating-summary{display:flex;align-items:center;justify-content:center;gap:2.5rem;background:#fff;border:1px solid #e0e5d5;border-radius:16px;padding:1.5rem 2rem;margin-bottom:2.5rem;flex-wrap:wrap}

.rating-big{text-align:center}

.rating-number{font-family:'Playfair Display',serif;font-size:3.5rem;font-weight:700;color:var(--green);line-height:1}

.rating-stars-big{color:var(--gold-light);font-size:1.3rem;margin:4px 0}

.rating-count{font-size:12px;color:var(--muted)}

.rating-bars{flex:1;min-width:200px;max-width:320px}

.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:13px;color:var(--muted)}

.bar-row span:first-child{min-width:32px;text-align:right}

.bar-track{flex:1;height:7px;background:#e8e8e0;border-radius:4px;overflow:hidden}

.bar-fill{height:100%;border-radius:4px;background:var(--gold-light);transition:width .6s ease}

.bar-row span:last-child{min-width:24px;font-size:12px}

.reviews-filter{display:flex;gap:8px;margin-bottom:1.5rem;flex-wrap:wrap}

.filter-btn{padding:7px 16px;border-radius:20px;border:1px solid #d0d8c0;background:#fff;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--muted);cursor:pointer;transition:all .15s}

.filter-btn.active,.filter-btn:hover{background:var(--green);color:#fff;border-color:var(--green)}

.reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.1rem;margin-bottom:1.5rem}

.review-card{background:#fff;border:1px solid #e0e5d5;border-radius:16px;padding:1.25rem;transition:box-shadow .2s,transform .2s;position:relative}

.review-card:hover{box-shadow:0 4px 20px rgba(45,90,39,0.1);transform:translateY(-2px)}

.review-card.verified::after{content:'✓ Cumpărător verificat';position:absolute;top:12px;right:12px;font-size:10px;color:var(--green-light);font-weight:600;background:var(--green-pale);padding:2px 8px;border-radius:10px}

.review-top{display:flex;align-items:center;gap:10px;margin-bottom:0.75rem}

.review-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;flex-shrink:0}

.review-name{font-weight:600;font-size:14px;color:var(--text)}

.review-loc{font-size:12px;color:var(--muted)}

.review-stars{color:var(--gold-light);font-size:14px;margin-bottom:0.5rem;letter-spacing:1px}

.review-title{font-weight:600;font-size:14px;color:var(--green);margin-bottom:0.35rem}

.review-body{font-size:13.5px;color:var(--muted);line-height:1.65}

.review-package{display:inline-block;margin-top:0.75rem;font-size:11px;font-weight:600;color:var(--gold);background:#fdf5e6;border:1px solid #f0d890;padding:3px 10px;border-radius:8px}

.review-date{font-size:11px;color:#bbb;margin-top:8px}

.review-helpful{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid #f0f0e8}

.helpful-label{font-size:12px;color:var(--muted)}

.helpful-btn{background:none;border:1px solid #d8dccb;border-radius:6px;padding:3px 10px;font-size:12px;cursor:pointer;color:var(--muted);transition:all .15s;font-family:'DM Sans',sans-serif}

.helpful-btn:hover{border-color:var(--green);color:var(--green)}

.helpful-btn.liked{background:var(--green-pale);border-color:var(--green-light);color:var(--green)}

.show-more-btn{display:block;margin:0 auto;padding:11px 32px;border:1.5px solid var(--green);background:#fff;color:var(--green);font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.95rem;border-radius:10px;cursor:pointer;transition:all .15s}

.show-more-btn:hover{background:var(--green);color:#fff}

.write-review-bar{background:var(--green-pale);border:1px solid #c8d4b8;border-radius:var(--radius);padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1.5rem;flex-wrap:wrap}

.write-review-bar p{font-size:0.9rem;color:var(--muted);max-width:420px}

.write-btn{padding:10px 22px;background:var(--green);color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.9rem;cursor:pointer;white-space:nowrap;transition:background .15s}

.write-btn:hover{background:var(--green-light)}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}

.modal-overlay.open{opacity:1;pointer-events:all}

.modal{background:#fff;border-radius:20px 20px 0 0;padding:2rem 1.5rem;width:100%;max-width:560px;transform:translateY(40px);transition:transform .3s cubic-bezier(.4,0,.2,1);max-height:90vh;overflow-y:auto}

.modal-overlay.open .modal{transform:translateY(0)}

.modal-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--green);margin-bottom:1.25rem}

.modal-close{float:right;background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--muted);margin-top:-4px}

.star-select{display:flex;gap:8px;margin-bottom:1.25rem}

.star-select span{font-size:2rem;cursor:pointer;color:#ddd;transition:color .1s;user-select:none}

.star-select span.active{color:var(--gold-light)}

.form-group{margin-bottom:1rem}

.form-label{display:block;font-size:13px;font-weight:500;color:var(--text);margin-bottom:5px}

.form-input,.form-textarea,.form-select{width:100%;border:1px solid #d0d8c0;border-radius:8px;padding:9px 12px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);background:#fff;outline:none;transition:border .15s}

.form-input:focus,.form-textarea:focus,.form-select:focus{border-color:var(--green-light)}

.form-textarea{resize:vertical;min-height:100px;line-height:1.6}

.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}

.submit-btn{width:100%;padding:13px;background:var(--green);color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;cursor:pointer;margin-top:0.5rem;transition:background .15s}

.submit-btn:hover{background:var(--green-light)}

.success-msg{text-align:center;padding:2rem 0}

.success-msg h3{font-family:'Playfair Display',serif;color:var(--green);font-size:1.3rem;margin-bottom:0.5rem}

.success-msg p{color:var(--muted);font-size:0.9rem}
@media(max-width:600px){.trust-bar{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;padding:0.7rem 1rem;font-size:11px}}
.bundle-savings{font-size:13px;font-weight:600;color:var(--green-light);margin-bottom:0.4rem}
.bundle-pct{display:inline-block;background:var(--gold);color:#fff;font-size:11px;font-weight:700;padding:2px 9px;border-radius:10px;margin-bottom:0.75rem;letter-spacing:0.03em}
.bundle-context{font-size:12px;color:var(--muted);margin-bottom:0.75rem;font-style:italic}
.urgency-text{font-size:12px;color:#b05a00;text-align:center;margin-top:8px;font-weight:500}
.hero-descriptor{font-size:14px;color:rgba(255,255,255,0.75);margin:-0.5rem 0 0.75rem;font-style:italic;letter-spacing:0.01em}
.hero-guarantee{font-size:13px;color:rgba(255,255,255,0.7);margin-top:10px;letter-spacing:0.02em}
.parts-box{padding:1.5rem;max-width:500px;margin:0 auto 2rem;text-align:center;background:#fff;border:1px solid #e0e5d5;border-radius:var(--radius)}
.parts-box-title{font-size:0.8rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem}
.faq-section{padding:2rem 1.5rem;max-width:720px;margin:0 auto}
.faq-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--green);margin-bottom:1.25rem;text-align:center}
.faq-item{border-bottom:1px solid #e8e8e0;padding:1rem 0}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:14px;color:var(--text);margin-bottom:0.4rem}
.faq-a{font-size:13.5px;color:var(--muted);line-height:1.65}
.shipping-nudge{font-size:12px;margin-top:6px;padding:5px 8px;border-radius:6px}
.shipping-nudge.pending{color:#b05a00;background:#fff8ee}
.shipping-nudge.unlocked{color:var(--green);background:var(--green-pale);font-weight:600}
.aov-hint{font-size:11px;color:var(--muted);margin-top:4px;padding:0 8px}
.consumables-inline{max-width:960px;margin:0 auto;padding:0 1.5rem 2rem}
.consumables-header{font-size:0.8rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem}
.consumables-hint{font-size:13px;color:var(--muted);margin-bottom:1rem}
.bundle-item-img{width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;flex-shrink:0}
.fallback-item-img{width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:10px;flex-shrink:0;opacity:0.85}
.consumable-img{width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:12px;flex-shrink:0}
.consumables-row{display:flex;gap:0.75rem;flex-wrap:wrap}
.consumable-item{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:#fff;border:1px solid #e0e5d5;border-radius:10px;padding:0.65rem 1rem;flex:1;min-width:200px;max-width:340px}
.consumable-info{display:flex;flex-direction:column;gap:2px}
.consumable-name{font-size:13px;font-weight:500;color:var(--text)}
.consumable-price{font-size:12px;color:var(--green-light);font-weight:600}
.checkout-form{display:flex;flex-direction:column}
.checkout-back{font-size:13px;color:var(--green-light);cursor:pointer;margin-bottom:1rem;display:inline-block}
.checkout-back:hover{text-decoration:underline}
.checkout-note{text-align:center;font-size:11px;color:var(--muted);margin-top:8px}
.order-error{background:#fff0f0;color:#b00020;border:1px solid #f5c0c0;border-radius:8px;padding:8px 12px;font-size:13px;margin-bottom:8px}
.cart-checkout:disabled{opacity:0.6;cursor:not-allowed}

`;



export default function ClesteLegat() {

  const [cart, setCart] = useState<CartItem[]>([]);

  const [cartOpen, setCartOpen] = useState(false);

  const [extrasQty, setExtrasQty] = useState({ banda: 0, capse: 0 });

  const [notifyShow, setNotifyShow] = useState(false);

  const [currentFilter, setCurrentFilter] = useState("all");

  const [visibleCount, setVisibleCount] = useState(6);

  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const [rating, setRating] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [allReviews, setAllReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);

  const locRef = useRef<HTMLInputElement>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const packageRef = useRef<HTMLSelectElement>(null);



  const cartCount = cart.length;

  const subtotal = cart.reduce((s, i) => s + i.price, 0);

  const transport = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const total = subtotal + transport;

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) {
      setOrderError("Completează toate câmpurile.");
      return;
    }
    setOrderLoading(true);
    setOrderError("");
    try {
      // Group flat cart items by name, adding qty
      const groupedItems = Object.values(
        cart.reduce<Record<string, { name: string; price: number; qty: number }>>(
          (acc, item) => {
            if (acc[item.name]) {
              acc[item.name].qty += 1;
            } else {
              acc[item.name] = { name: item.name, price: item.price, qty: 1 };
            }
            return acc;
          },
          {}
        )
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderName,
          phone: orderPhone,
          address: orderAddress,
          items: groupedItems,
          subtotal,
          transport,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || "Eroare. Încearcă din nou.");
        setOrderLoading(false);
        return;
      }
      router.push("/confirmare");
    } catch {
      setOrderError("Eroare de rețea. Încearcă din nou.");
      setOrderLoading(false);
    }
  }

  const groupedCart = (() => {

    const map = new Map<string, { name: string; price: number; total: number; count: number }>();

    const order: string[] = [];

    for (const item of cart) {

      if (map.has(item.name)) {

        const e = map.get(item.name)!;

        e.count++;

        e.total += item.price;

      } else {

        map.set(item.name, { name: item.name, price: item.price, total: item.price, count: 1 });

        order.push(item.name);

      }

    }

    return order.map((n) => map.get(n)!);

  })();



  function scrollBundles() {

    document.getElementById("bundles-section")?.scrollIntoView({ behavior: "smooth", block: "start" });

  }



  function addBundle(idx: number) {

    setCart((prev) => [...prev, { ...BUNDLES[idx], id: Date.now() }]);

    setNotifyShow(true);

    setTimeout(() => setNotifyShow(false), 1800);

    setCartOpen(true);

  }



  function changeQty(key: "banda" | "capse", delta: number) {

    const newQty = Math.max(0, extrasQty[key] + delta);

    setExtrasQty((prev) => ({ ...prev, [key]: newQty }));

    setCart((prev) => {

      const without = prev.filter((i) => i.extraKey !== key);

      const toAdd: CartItem[] = Array.from({ length: newQty }, (_, i) => ({

        name: EXTRAS_META[key].name,

        price: EXTRAS_META[key].price,

        id: Date.now() + i,

        extraKey: key,

      }));

      return [...without, ...toAdd];

    });

  }



  function removeOne(name: string) {

    const ri = [...cart].reverse().findIndex((i) => i.name === name);

    if (ri === -1) return;

    const next = [...cart];

    next.splice(cart.length - 1 - ri, 1);

    setCart(next);

    setExtrasQty({

      banda: next.filter((i) => i.extraKey === "banda").length,

      capse: next.filter((i) => i.extraKey === "capse").length,

    });

  }



  function toggleLike(key: string) {

    setLiked((prev) => ({ ...prev, [key]: !prev[key] }));

  }



  function openModal() { setShowModal(true); }



  function closeModal() {

    setShowModal(false);

    setTimeout(() => { setSubmitSuccess(false); setRating(0); }, 300);

  }



  function submitReview() {

    const name = nameRef.current?.value.trim() ?? "";

    const loc = locRef.current?.value.trim() ?? "";

    const title = titleRef.current?.value.trim() ?? "";

    const body = bodyRef.current?.value.trim() ?? "";

    if (!rating || !name || !title || !body) {

      alert("Te rugăm completeață toate câmpurile şi selectează o notă.");

      return;

    }

    const pkg = packageRef.current?.value ?? "bundle-popular";

    const date = new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });

    setAllReviews((prev) => [

      { name: name + " (nou)", loc: loc || "România", stars: rating, title, body, package: pkg, date, helpful: 0, verified: false },

      ...prev,

    ]);

    setSubmitSuccess(true);

    setTimeout(() => closeModal(), 2200);

  }



  const filtered =

    currentFilter === "all" ? allReviews

    : currentFilter === "5" ? allReviews.filter((r) => r.stars === 5)

    : currentFilter === "4" ? allReviews.filter((r) => r.stars === 4)

    : allReviews.filter((r) => r.package === currentFilter);



  const shownReviews = filtered.slice(0, visibleCount);



  const BAR_DATA = [

    { label: "5 ★", pct: 77 }, { label: "4 ★", pct: 17 },

    { label: "3 ★", pct: 4 }, { label: "2 ★", pct: 1 }, { label: "1 ★", pct: 1 },

  ];



  const FILTERS = [

    { f: "all", label: "Toate (127)" },

    { f: "5", label: "★★★★★ (98)" },

    { f: "4", label: "★★★★ (21)" },

    { f: "bundle-popular", label: "Pachet Popular" },

    { f: "bundle-pro", label: "Pachet Pro" },

    { f: "bundle-starter", label: "Starter" },

  ];



  return (

    <>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className={`notify${notifyShow ? " show" : ""}`}>Adăugat în coş!</div>

      <div className={`overlay${cartOpen ? " show" : ""}`} onClick={() => setCartOpen(false)} />



      <div className="hero">

        <div className="hero-badge">Livrat în România — Transport rapid</div>

        <img
          src="/images/tapener-hero.jpeg"
          alt="Clește profesional pentru legat plante — în acțiune pe viță de vie"
          style={{
            display: "block",
            width: "90%",
            maxWidth: "700px",
            height: "auto",
            objectFit: "cover",
            borderRadius: "16px",
            margin: "0 auto 2rem",
          }}
        />

        <h1>Leagă vita de vie <span>de 10× mai repede</span> cu clestele profesional de legat</h1>

        <p className="hero-descriptor">Pentru roşii, viță de vie şi orice plantă care are nevoie de sprijin</p>

        <p>Via, roşiile, zmeură — orice rând care înainte îți lua ore se face acum în minute. O singură apăsare: banda şi capsa intră perfect, tulpina nu se răneşte.</p>

        <button className="hero-cta" onClick={scrollBundles}>Alege pachetul tău</button>

        <div className="hero-guarantee">Retur 30 zile — fără risc</div>

      </div>



      <div className="trust-bar">

        <span>✓ +500 clienți mulțumiți</span>

        <span>✓ Plată la livrare</span>

        <span>✓ Livrare 3-5 zile</span>

        <span>✓ Garanție 12 luni</span>

      </div>



      <div className="section" id="bundles-section">

        <div className="section-title">Alege pachetul potrivit</div>

        <div className="section-sub">Cu cât cumperi mai mult, cu atât economiseşti mai mult</div>

        <div className="bundles">

          <div className="bundle-card" onClick={() => addBundle(0)}>

            <div className="bundle-name">Starter</div>

            <div className="bundle-price"><sup>lei</sup>{BUNDLES[0].price}</div>

            <div className="bundle-old">lei {BUNDLES[0].oldPrice}</div>

            <div className="bundle-savings">Economisești {BUNDLES[0].oldPrice - BUNDLES[0].price} lei</div>

            <div className="bundle-pct">-{Math.round((1 - BUNDLES[0].price / BUNDLES[0].oldPrice) * 100)}%</div>

            <div className="bundle-context">Pentru grădina de acasă</div>

            <ul className="bundle-items">

              <li>1 cleste profesional de legat</li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/tape.webp" alt="Rolă bandă de legat" /><span>5 role bandă de legat</span></li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/staples.webp" alt="Capse legat" /><span>1 set capse legat</span></li>

            </ul>

            <button className="add-btn secondary">Adaugă în coş</button>

          </div>

          <div className="bundle-card featured" onClick={() => addBundle(1)}>

            <div className="popular-badge">Cel mai ales</div>

            <div className="bundle-name">Popular</div>

            <div className="bundle-price"><sup>lei</sup>{BUNDLES[1].price}</div>

            <div className="bundle-old">lei {BUNDLES[1].oldPrice}</div>

            <div className="bundle-savings">Economisești {BUNDLES[1].oldPrice - BUNDLES[1].price} lei</div>

            <div className="bundle-pct">-{Math.round((1 - BUNDLES[1].price / BUNDLES[1].oldPrice) * 100)}%</div>

            <div className="bundle-context">Pentru utilizare regulată</div>

            <ul className="bundle-items">

              <li>2 clești de legat</li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/tape.webp" alt="Rolă bandă de legat" /><span>10 role bandă de legat</span></li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/staples.webp" alt="Capse legat" /><span>1 set capse legat</span></li>

            </ul>

            <button className="add-btn primary">Alege pachetul Popular</button>

            <div className="urgency-text">Stoc limitat — cerere ridicată</div>

          </div>

          <div className="bundle-card" onClick={() => addBundle(2)}>

            <div className="bundle-name">Pro — Cel mai bun preț</div>

            <div className="bundle-price"><sup>lei</sup>{BUNDLES[2].price}</div>

            <div className="bundle-old">lei {BUNDLES[2].oldPrice}</div>

            <div className="bundle-savings">Economisești {BUNDLES[2].oldPrice - BUNDLES[2].price} lei</div>

            <div className="bundle-pct">-{Math.round((1 - BUNDLES[2].price / BUNDLES[2].oldPrice) * 100)}%</div>

            <div className="bundle-context">Pentru suprafețe mari</div>

            <ul className="bundle-items">

              <li>3 clești de legat</li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/tape.webp" alt="Rolă bandă de legat" /><span>20 role bandă de legat</span></li>

              <li style={{display:"flex",alignItems:"center"}}><img className="bundle-item-img" src="/images/staples.webp" alt="Capse legat" /><span>3 seturi capse legat</span></li>

            </ul>

            <button className="add-btn secondary">Adaugă în coş</button>

          </div>

        </div>

      </div>



      <div className="consumables-inline">

        <div className="consumables-header">Completează comanda (opțional)</div>

        <div className="consumables-hint">Completează comanda și economisești transportul</div>

        <div className="consumables-row">

          <div className="consumable-item">

            <img className="consumable-img" src="/images/tape.webp" alt="Rolă bandă de legat" />

            <div className="consumable-info">

              <div className="consumable-name">Role bandă de legat (5 buc)</div>

              <div className="consumable-price">{EXTRAS_META.banda.price} lei / set</div>

            </div>

            <div className="qty-control">

              <button className="qty-btn" onClick={() => changeQty("banda", -1)}>−</button>

              <span className="qty-num">{extrasQty.banda}</span>

              <button className="qty-btn" onClick={() => changeQty("banda", 1)}>+</button>

            </div>

          </div>

          <div className="consumable-item">

            <img className="consumable-img" src="/images/staples.webp" alt="Capse legat" />

            <div className="consumable-info">

              <div className="consumable-name">Set capse legat (1 set)</div>

              <div className="consumable-price">{EXTRAS_META.capse.price} lei / set</div>

            </div>

            <div className="qty-control">

              <button className="qty-btn" onClick={() => changeQty("capse", -1)}>−</button>

              <span className="qty-num">{extrasQty.capse}</span>

              <button className="qty-btn" onClick={() => changeQty("capse", 1)}>+</button>

            </div>

          </div>

        </div>

      </div>



      <div className="parts-box">

        <div className="parts-box-title">Ce conține pachetul</div>

        <img
          src="/images/tapener-parts.jpeg"
          alt="Componente cleste de legat plante"
          style={{
            display: "block",
            width: "280px",
            maxWidth: "85%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "12px",
            margin: "0 auto",
          }}
        />

      </div>



      <div className="faq-section">

        <div className="faq-title">Întrebări frecvente</div>

        <div className="faq-item">

          <div className="faq-q">Funcționează şi pe altceva decât viță de vie?</div>

          <div className="faq-a">Da. Orice tulpină între 2 şi 25 mm — roşii, ardei, zmeura, butaşi tineri sau orice altă plantă din grădina ta. Dacă are nevoie de sprijin, îl poți lega cu el.</div>

        </div>

        <div className="faq-item">

          <div className="faq-q">Ce bandă de legat este compatibilă?</div>

          <div className="faq-a">Funcționează cu role standard de bandă, disponibile în orice magazin agricol. Benzile incluse în pachet sunt suficiente pentru început — poți recomanda oricând.</div>

        </div>

        <div className="faq-item">

          <div className="faq-q">Ce se întâmplă dacă se defectează?</div>

          <div className="faq-a">Ne contactezi și trimiți o poză sau un scurt video cu problema — verificăm rapid și, dacă e defect de produs, îți trimitem unul nou sau îți returnăm banii, fără costuri din partea ta.</div>

        </div>

        <div className="faq-item">

          <div className="faq-q">Pot returna dacă nu sunt mulțumit?</div>

          <div className="faq-a">Da. Ai 30 de zile de la livrare să returnezi produsul, fără nicio justificare. Rambursăm integral suma plătită.</div>

        </div>

      </div>



      <div className="reviews-section">

        <div className="section-header">

          <div className="section-title">Ce spun clienții noştri</div>

          <div className="section-sub">Recenzii reale de la fermieri şi grădinari din toată România</div>

        </div>

        <div className="rating-summary">

          <div className="rating-big">

            <div className="rating-number">4.8</div>

            <div className="rating-stars-big">★★★★★</div>

            <div className="rating-count">din 127 recenzii</div>

          </div>

          <div className="rating-bars">

            {BAR_DATA.map((d) => (

              <div className="bar-row" key={d.label}>

                <span>{d.label}</span>

                <div className="bar-track"><div className="bar-fill" style={{ width: d.pct + "%" }} /></div>

                <span>{d.pct}%</span>

              </div>

            ))}

          </div>

        </div>

        <div className="reviews-filter">

          {FILTERS.map(({ f, label }) => (

            <button

              key={f}

              className={`filter-btn${currentFilter === f ? " active" : ""}`}

              onClick={() => { setCurrentFilter(f); setVisibleCount(6); }}

            >{label}</button>

          ))}

        </div>

        <div className="reviews-grid">

          {shownReviews.map((r, i) => {

            const c = AVATAR_COLORS[i % AVATAR_COLORS.length];

            const likedKey = r.name + r.date;

            const isLiked = liked[likedKey] ?? false;

            const initials = r.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

            const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);

            return (

              <div className={`review-card${r.verified ? " verified" : ""}`} key={likedKey + i}>

                <div className="review-top">

                  <div className="review-avatar" style={{ background: c.bg, color: c.color }}>{initials}</div>

                  <div>

                    <div className="review-name">{r.name}</div>

                    <div className="review-loc">{r.loc}</div>

                  </div>

                </div>

                <div className="review-stars">{stars}</div>

                <div className="review-title">{r.title}</div>

                <div className="review-body">{r.body}</div>

                <div className="review-package">{PACKAGE_LABELS[r.package] ?? ""}</div>

                <div className="review-date">{r.date}</div>

                <div className="review-helpful">

                  <span className="helpful-label">Util?</span>

                  <button

                    className={`helpful-btn${isLiked ? " liked" : ""}`}

                    onClick={() => toggleLike(likedKey)}

                  >👍 {r.helpful + (isLiked ? 1 : 0)}</button>

                </div>

              </div>

            );

          })}

        </div>

        {filtered.length > visibleCount && (

          <button className="show-more-btn" onClick={() => setVisibleCount((v) => v + 3)}>

            Arată mai multe recenzii

          </button>

        )}

        <div className="write-review-bar">

          <p>Ai cumpărat deja? Lasă o recenzie şi ajută alți grădinari să aleagă corect.</p>

          <button className="write-btn" onClick={openModal}>Scrie o recenzie</button>

        </div>

      </div>



      <div className="section" style={{ paddingTop: 0 }}>

        <div className="section-title" style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>Ai nevoie de consumabile în plus?</div>

        <div className="section-sub">Adaugă separat oricând</div>

        <div className="extras-grid">

          <div className="extra-card">

            <img className="fallback-item-img" src="/images/tape.webp" alt="Rolă bandă" />

            <div>

              <div className="extra-name">Role bandă de legat (5 buc)</div>

              <div className="extra-price">+{EXTRAS_META.banda.price} lei</div>

            </div>

            <div className="qty-control">

              <button className="qty-btn" onClick={() => changeQty("banda", -1)}>−</button>

              <span className="qty-num">{extrasQty.banda}</span>

              <button className="qty-btn" onClick={() => changeQty("banda", 1)}>+</button>

            </div>

          </div>

          <div className="extra-card">

            <img className="fallback-item-img" src="/images/staples.webp" alt="Capse legat" />

            <div>

              <div className="extra-name">Set capse legat (1 set)</div>

              <div className="extra-price">+{EXTRAS_META.capse.price} lei</div>

            </div>

            <div className="qty-control">

              <button className="qty-btn" onClick={() => changeQty("capse", -1)}>−</button>

              <span className="qty-num">{extrasQty.capse}</span>

              <button className="qty-btn" onClick={() => changeQty("capse", 1)}>+</button>

            </div>

          </div>

        </div>

        <div className="transport-bar">

          <div>

            <div className="t-label">Transport standard (3-5 zile)</div>

            <div className="t-value">{SHIPPING_COST} lei</div>

          </div>

          <div>

            <div className="t-label">Transport gratuit la produse peste {FREE_SHIPPING_THRESHOLD} lei</div>

            <div className="t-value">Gratuit</div>

          </div>

          <div>

            <div className="t-label">Plată la livrare</div>

            <div className="t-value">disponibilă</div>

          </div>

        </div>

      </div>



      <div style={{ height: 100 }} />



      <button className="fab" onClick={() => setCartOpen(true)}>

        <span>Coş</span>

        <span className="fab-badge">{cartCount}</span>

      </button>



      <div className={`cart-panel${cartOpen ? " open" : ""}`}>

        <div className="cart-header">

          <h3>Coşul tău</h3>

          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>

        </div>

        <div className="cart-items">

          {cart.length === 0 ? (

            <div className="cart-empty">Coşul este gol</div>

          ) : (

            groupedCart.map((item) => (

              <div className="cart-item" key={item.name}>

                <span className="cart-item-name">{item.name}{item.count > 1 ? ` ×${item.count}` : ""}</span>

                <span className="cart-item-price">{item.total} lei</span>

                <button className="cart-item-remove" onClick={() => removeOne(item.name)}>×</button>

              </div>

            ))

          )}

        </div>

        <div className="cart-footer">

          {!checkoutOpen ? (
            <>
              <div className="cart-total-row"><span>Produse</span><span>{subtotal} lei</span></div>

              <div className="cart-total-row"><span>Transport</span><span>{transport === 0 ? "Gratuit" : transport + " lei"}</span></div>

              {cart.length > 0 && (
                subtotal >= FREE_SHIPPING_THRESHOLD
                  ? <div className="shipping-nudge unlocked">Ai economisit {SHIPPING_COST} lei — transport gratuit</div>
                  : <>
                      <div className="shipping-nudge pending">Mai adaugă {FREE_SHIPPING_THRESHOLD - subtotal} lei pentru transport gratuit</div>
                      {FREE_SHIPPING_THRESHOLD - subtotal <= 50 && (
                        <div className="aov-hint">Adaugă o rolă de bandă și beneficiezi de transport gratuit</div>
                      )}
                    </>
              )}

              <div className="cart-total-row main"><span>Total</span><span>{total} lei</span></div>

              <button
                className="cart-checkout"
                onClick={() => setCheckoutOpen(true)}
                disabled={cart.length === 0}
              >
                Finalizează comanda →
              </button>
            </>
          ) : (
            <form onSubmit={handleOrderSubmit} className="checkout-form">
              <div className="checkout-back" onClick={() => { setCheckoutOpen(false); setOrderError(""); }}>← Înapoi la coș</div>
              <div className="cart-total-row main" style={{ marginBottom: "1rem" }}><span>Total</span><span>{total} lei</span></div>

              <div className="form-group">
                <label className="form-label" htmlFor="order-name">Nume și prenume</label>
                <input
                  id="order-name"
                  className="form-input"
                  type="text"
                  placeholder="Ion Popescu"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="order-phone">Telefon</label>
                <input
                  id="order-phone"
                  className="form-input"
                  type="tel"
                  placeholder="07xx xxx xxx"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="order-address">Adresă livrare</label>
                <textarea
                  id="order-address"
                  className="form-textarea"
                  placeholder="Strada, număr, oraș, județ"
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {orderError && <div className="order-error">{orderError}</div>}

              <button
                type="submit"
                className="cart-checkout"
                disabled={orderLoading}
              >
                {orderLoading ? "Se trimite..." : "Trimite comanda →"}
              </button>

              <div className="checkout-note">Plată la livrare · Livrare 3-5 zile</div>
            </form>
          )}

        </div>

      </div>



      <div

        className={`modal-overlay${showModal ? " open" : ""}`}

        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}

      >

        <div className="modal">

          <button className="modal-close" onClick={closeModal}>✕</button>

          <div className="modal-title">Scrie o recenzie</div>

          {submitSuccess ? (

            <div className="success-msg">

              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌿</div>

              <h3>Mulțumim pentru recenzie!</h3>

              <p>Recenzia ta va fi verificată şi publicată în curând.</p>

            </div>

          ) : (

            <>

              <div className="form-group">

                <div className="form-label">Nota ta</div>

                <div className="star-select">

                  {[1, 2, 3, 4, 5].map((n) => (

                    <span key={n} className={rating >= n ? "active" : ""} onClick={() => setRating(n)}>★</span>

                  ))}

                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label className="form-label">Prenume</label>

                  <input className="form-input" ref={nameRef} placeholder="Ion" />

                </div>

                <div className="form-group">

                  <label className="form-label">Localitate</label>

                  <input className="form-input" ref={locRef} placeholder="Cluj-Napoca" />

                </div>

              </div>

              <div className="form-group">

                <label className="form-label">Pachet cumpărat</label>

                <select className="form-select" ref={packageRef} defaultValue="bundle-popular">

                  <option value="bundle-starter">Pachet Starter</option>

                  <option value="bundle-popular">Pachet Popular</option>

                  <option value="bundle-pro">Pachet Pro</option>

                </select>

              </div>

              <div className="form-group">

                <label className="form-label">Titlu recenzie</label>

                <input className="form-input" ref={titleRef} placeholder="Ex: Excelent pentru viță de vie!" />

              </div>

              <div className="form-group">

                <label className="form-label">Recenzia ta</label>

                <textarea className="form-textarea" ref={bodyRef} placeholder="Spune-ne cum te-a ajutat tapenierul..." />

              </div>

              <button className="submit-btn" onClick={submitReview}>Publică recenzia</button>

            </>

          )}

        </div>

      </div>

    </>

  );

}

