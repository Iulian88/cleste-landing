"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SHIPPING_COST = 25;
const FREE_SHIPPING_THRESHOLD = 200;

// Image names for gallery
const IMG = {
  main: "/images/perii-bormasina/67b87abbbf6ef_main_f00dbc6fcc_67b87abbbf797_171b1500.avif",
  img0: "/images/perii-bormasina/67b87abbbf6ef_0_8e91eb2a50_67b87abc00759_92f3156d.avif",
  img1: "/images/perii-bormasina/67b87abbbf6ef_1_7acce788f9_67b87abc1f6b6_926fcbdb.avif",
  img2: "/images/perii-bormasina/67b87abbbf6ef_2_18402bf422_67b87abc414c8_9749ad62.avif",
  howTo: "/images/perii-bormasina/67b87abbbf6ef_3_b0dc79ec2a_67b87abc6a368_ab146775.jpg",
  beforeAfter: "/images/perii-bormasina/67b87abbbf6ef_4_0ebe544f7b_67b87abc9eee6_364bda64.webp",
  img5: "/images/perii-bormasina/67b87abbbf6ef_5_49c04d057b_67b87abcba034_3492d06b.avif",
  dimensions: "/images/perii-bormasina/67b87abbbf6ef_6_69b1865be8_67b87abcd7c1b_9a7668c7.webp",
  img7: "/images/perii-bormasina/67b87abbbf6ef_7_48140a6697_67b87abd00afb_f5bfce71.webp",
};

const GALLERY_IMAGES = [IMG.main, IMG.img0, IMG.img1, IMG.img2, IMG.img5, IMG.img7];

interface CartItem {
  name: string;
  price: number;
  id: number;
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
  { name: "Set Standard", price: 79, oldPrice: 99 },
  { name: "Set Dublu", price: 129, oldPrice: 179 },
];

const AVATAR_COLORS = [
  { bg: "#e8f4e8", color: "#2d5a27" },
  { bg: "#fdf5e6", color: "#c8952a" },
  { bg: "#e6f1fb", color: "#185fa5" },
  { bg: "#fbeaf0", color: "#993556" },
  { bg: "#e1f5ee", color: "#0f6e56" },
  { bg: "#faeeda", color: "#854f0b" },
];

const PACKAGE_LABELS: Record<string, string> = {
  "set-standard": "Set Standard",
  "set-dublu": "Set Dublu",
};

const INITIAL_REVIEWS: Review[] = [
  {
    name: "Alina M.", loc: "Cluj", stars: 5,
    title: "Am curățat baia în 10 minute!",
    body: "Rosturile de la gresie erau negre de ani de zile. Am încercat tot — nimic nu mergea. Cu peria asta + bormașina am terminat toată baia în 10 minute. Uimitor.",
    package: "set-dublu", date: "10 februarie 2025", helpful: 38, verified: true,
  },
  {
    name: "Mihai T.", loc: "București", stars: 5,
    title: "Perfecte pentru mașină",
    body: "Le folosesc la curățat jantele și tapițeria mașinii. Intră în orice colț, scot murdăria adânc înfundată. Recomand setul dublu — ai o perie pentru fiecare suprafață.",
    package: "set-dublu", date: "3 martie 2025", helpful: 22, verified: true,
  },
  {
    name: "Irina P.", loc: "Timișoara", stars: 5,
    title: "Cel mai bun ajutor la curățenie generală",
    body: "Îmi fac curățenie generală de două ori pe an și până acum era chin. Acum merg prin toată casa cu bormașina și periile astea — în câteva ore totul e imaculat.",
    package: "set-standard", date: "18 ianuarie 2025", helpful: 14, verified: true,
  },
  {
    name: "Dan V.", loc: "Brașov", stars: 4,
    title: "Funcționează excelent, livrare rapidă",
    body: "Calitate bună, firele nu cad și suportul e rezistent. Am spart o perie anterioară ieftină în 5 minute. Astea au rezistat deja la 3 luni de utilizare intensă.",
    package: "set-standard", date: "25 martie 2025", helpful: 9, verified: true,
  },
  {
    name: "Carmen B.", loc: "Iași", stars: 5,
    title: "Nu mai pot fără ele!",
    body: "Căzile de gresie și faianța din baie arătau îngrozitor. Acum le curăț în 15 minute odată pe săptămână. Soțul meu zice că am făcut investiția anului.",
    package: "set-dublu", date: "5 aprilie 2025", helpful: 47, verified: true,
  },
  {
    name: "Radu A.", loc: "Sibiu", stars: 5,
    title: "Compatibil cu orice bormașină",
    body: "Am testat pe 3 bormașini diferite la mine acasă — merge perfect la toate. Prinderea e solidă, nu vibrează deloc. Mulțumesc pentru livrarea rapidă.",
    package: "set-standard", date: "12 aprilie 2025", helpful: 17, verified: false,
  },
  {
    name: "Mirela G.", loc: "Constanța", stars: 5,
    title: "Gresia din bucătărie arată ca nouă",
    body: "Nu mai reușeam să scot grăsimea din rosturile de la bucătărie. O singură trecere cu peria rotativă și au ieșit impecabile. Merită fiecare leu.",
    package: "set-dublu", date: "20 mai 2025", helpful: 29, verified: true,
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
.problem-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}
.problem-card{background:#fff;border:1px solid #f0d0d0;border-radius:var(--radius);padding:1.25rem;text-align:center}
.problem-icon{font-size:2rem;margin-bottom:0.5rem}
.problem-title{font-weight:600;font-size:14px;color:#c0392b;margin-bottom:0.3rem}
.problem-desc{font-size:13px;color:var(--muted);line-height:1.55}
.solution-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:2rem}
.solution-card{background:var(--green-pale);border:1px solid #c8d4b8;border-radius:var(--radius);padding:1.25rem;text-align:center}
.solution-icon{font-size:2rem;margin-bottom:0.5rem}
.solution-title{font-weight:600;font-size:14px;color:var(--green);margin-bottom:0.3rem}
.solution-desc{font-size:13px;color:var(--muted);line-height:1.55}
.gallery-section{padding:2rem 1.5rem;max-width:800px;margin:0 auto}
.gallery-main{width:100%;max-height:420px;object-fit:contain;border-radius:16px;cursor:pointer;background:#fff;display:block;margin:0 auto}
.gallery-thumbs{display:flex;gap:10px;margin-top:12px;overflow-x:auto;padding-bottom:4px;justify-content:center;flex-wrap:wrap}
.gallery-thumb{width:72px;height:72px;object-fit:cover;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:border-color .15s,transform .15s;flex-shrink:0}
.gallery-thumb.active{border-color:var(--green)}
.gallery-thumb:hover{transform:scale(1.06)}
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
.cart-checkout:disabled{opacity:0.6;cursor:not-allowed}
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
.faq-section{padding:2rem 1.5rem;max-width:720px;margin:0 auto}
.faq-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--green);margin-bottom:1.25rem;text-align:center}
.faq-item{border-bottom:1px solid #e8e8e0;padding:1rem 0}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;font-size:14px;color:var(--text);margin-bottom:0.4rem}
.faq-a{font-size:13.5px;color:var(--muted);line-height:1.65}
.faq-whatsapp{margin-top:1.25rem;font-size:13.5px;color:var(--muted);text-align:center}
.faq-whatsapp a{color:var(--green-light);font-weight:600;text-decoration:none}
.faq-whatsapp a:hover{text-decoration:underline}
.whatsapp-fab{position:fixed;bottom:24px;left:24px;width:52px;height:52px;background:#25D366;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(37,211,102,0.4);z-index:99;transition:transform .15s,box-shadow .15s;text-decoration:none}
.whatsapp-fab:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(37,211,102,0.5)}
.checkout-form{display:flex;flex-direction:column}
.checkout-back{font-size:13px;color:var(--green-light);cursor:pointer;margin-bottom:1rem;display:inline-block}
.checkout-back:hover{text-decoration:underline}
.checkout-note{text-align:center;font-size:11px;color:var(--muted);margin-top:8px}
.order-error{background:#fff0f0;color:#b00020;border:1px solid #f5c0c0;border-radius:8px;padding:8px 12px;font-size:13px;margin-bottom:8px}
.bundle-savings{font-size:13px;font-weight:600;color:var(--green-light);margin-bottom:0.4rem}
.bundle-pct{display:inline-block;background:var(--gold);color:#fff;font-size:11px;font-weight:700;padding:2px 9px;border-radius:10px;margin-bottom:0.75rem;letter-spacing:0.03em}
.bundle-context{font-size:12px;color:var(--muted);margin-bottom:0.75rem;font-style:italic}
.urgency-text{font-size:12px;color:#b05a00;text-align:center;margin-top:8px;font-weight:500}
.hero-descriptor{font-size:14px;color:rgba(255,255,255,0.75);margin:-0.5rem 0 0.75rem;font-style:italic;letter-spacing:0.01em}
.hero-guarantee{font-size:13px;color:rgba(255,255,255,0.7);margin-top:10px;letter-spacing:0.02em}
.shipping-nudge{font-size:12px;margin-top:6px;padding:5px 8px;border-radius:6px}
.shipping-nudge.pending{color:#b05a00;background:#fff8ee}
.shipping-nudge.unlocked{color:var(--green);background:var(--green-pale);font-weight:600}
@media(max-width:600px){.trust-bar{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;padding:0.7rem 1rem;font-size:11px}}
@media(max-width:480px){.whatsapp-fab{width:48px;height:48px;bottom:20px;left:16px}.gallery-main{max-height:280px}}
`;

function firePixel(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const tryFire = (retries = 0) => {
    if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
      (window as unknown as { fbq: (...a: unknown[]) => void }).fbq(...args);
    } else if (retries < 20) {
      setTimeout(() => tryFire(retries + 1), 100);
    }
  };
  tryFire();
}

export default function PeriiBormasina() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifyShow, setNotifyShow] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [allReviews, setAllReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeImg, setActiveImg] = useState(0);

  // Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const router = useRouter();

  useEffect(() => {
    firePixel("track", "ViewContent", {
      content_name: "Perii rotative bormașină",
      content_category: "Curățenie",
      currency: "RON",
      value: 129,
    });
  }, []);

  useEffect(() => {
    const fired = new Set<string>();
    function onScroll() {
      const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct >= 0.5 && !fired.has("50")) {
        fired.add("50");
        firePixel("trackCustom", "ScrollDepth50");
      }
      if (pct >= 0.75 && !fired.has("75")) {
        fired.add("75");
        firePixel("trackCustom", "ScrollDepth75");
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nameRef = useRef<HTMLInputElement>(null);
  const locRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const packageRef = useRef<HTMLSelectElement>(null);

  const cartCount = cart.length;
  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const transport = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + transport;

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

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) {
      setOrderError("Completează toate câmpurile.");
      return;
    }
    setOrderLoading(true);
    setOrderError("");
    try {
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
          product: "perii-bormasina",
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
      const purchaseContents = Object.values(
        cart.reduce<Record<string, { id: string; quantity: number }>>(
          (acc, item) => {
            if (acc[item.name]) acc[item.name].quantity += 1;
            else acc[item.name] = { id: item.name, quantity: 1 };
            return acc;
          },
          {}
        )
      );
      sessionStorage.setItem(
        "fbPurchase",
        JSON.stringify({ value: total, currency: "RON", contents: purchaseContents })
      );
      router.push("/confirmare");
    } catch {
      setOrderError("Eroare de rețea. Încearcă din nou.");
      setOrderLoading(false);
    }
  }

  function scrollBundles() {
    document.getElementById("bundles-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addBundle(idx: number) {
    setCart((prev) => [...prev, { ...BUNDLES[idx], id: Date.now() }]);
    setNotifyShow(true);
    setTimeout(() => setNotifyShow(false), 1800);
    setCartOpen(true);
    firePixel("track", "AddToCart", {
      content_name: BUNDLES[idx].name,
      value: BUNDLES[idx].price,
      currency: "RON",
    });
  }

  function openCheckout() {
    setCheckoutOpen(true);
    firePixel("track", "InitiateCheckout", {
      value: total,
      currency: "RON",
      num_items: cart.length,
    });
  }

  function removeOne(name: string) {
    const ri = [...cart].reverse().findIndex((i) => i.name === name);
    if (ri === -1) return;
    const next = [...cart];
    next.splice(cart.length - 1 - ri, 1);
    setCart(next);
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
      alert("Te rugăm completează toate câmpurile și selectează o notă.");
      return;
    }
    const pkg = packageRef.current?.value ?? "set-dublu";
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
    { label: "5 ★", pct: 82 }, { label: "4 ★", pct: 13 },
    { label: "3 ★", pct: 3 }, { label: "2 ★", pct: 1 }, { label: "1 ★", pct: 1 },
  ];

  const FILTERS = [
    { f: "all", label: "Toate" },
    { f: "5", label: "★★★★★" },
    { f: "4", label: "★★★★" },
    { f: "set-dublu", label: "Set Dublu" },
    { f: "set-standard", label: "Set Standard" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`notify${notifyShow ? " show" : ""}`}>Adăugat în coș!</div>
      <div className={`overlay${cartOpen ? " show" : ""}`} onClick={() => setCartOpen(false)} />

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">Livrare în toată România — Plată la livrare</div>

        <img
          src={IMG.main}
          alt="Set perii rotative pentru bormașină"
          fetchPriority="high"
          style={{
            display: "block",
            width: "90%",
            maxWidth: "600px",
            height: "auto",
            objectFit: "contain",
            borderRadius: "16px",
            margin: "0 auto 2rem",
            background: "#fff",
          }}
        />

        <h1>Curăță murdăria imposibilă <span>în 10 secunde</span> – fără efort</h1>
        <p className="hero-descriptor">Transformă bormașina ta într-o unealtă profesională de curățat</p>
        <p>Rosturi negre, grăsime arsă, calcar persistent — o singură trecere cu peria rotativă și suprafața arată ca nouă. Fără frecat manual, fără oboseală.</p>

        <button className="hero-cta" onClick={scrollBundles}>Alege setul tău</button>
        <button
          className="hero-cta"
          style={{ marginTop: "10px", background: "var(--green)", display: "block", width: "100%", maxWidth: "340px", margin: "10px auto 0" }}
          onClick={() => { addBundle(1); scrollBundles(); }}
        >
          Comandă acum — 129 lei
        </button>

        <div className="hero-guarantee">Retur 30 zile — fără risc</div>
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <span>✓ +300 clienți mulțumiți</span>
        <span>✓ Plată la livrare</span>
        <span>✓ Livrare 3-5 zile</span>
        <span>✓ Garanție 12 luni</span>
      </div>
      <div style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)", padding: "0.6rem 1rem", background: "var(--green-pale)", borderBottom: "1px solid #d8e8d0" }}>
        ✔️ Compatibil cu orice bormașină • 4 tipuri de perii incluse în set
      </div>

      {/* PROBLEM SECTION */}
      <div className="section">
        <div className="section-title">Recunoști aceste probleme?</div>
        <div className="section-sub">Murdăria care nu cedează nicicum la frecat manual</div>
        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">🟫</div>
            <div className="problem-title">Rosturi negre</div>
            <div className="problem-desc">Murdăria intră adânc în rosturile de gresie și nu mai iese cu buretele</div>
          </div>
          <div className="problem-card">
            <div className="problem-icon">🍳</div>
            <div className="problem-title">Grăsime arsă</div>
            <div className="problem-desc">Aragazul și cuptorul acumulează straturi groase de grăsime imposibil de scos</div>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💪</div>
            <div className="problem-title">Frecat manual obositor</div>
            <div className="problem-desc">Ore de curățenie, mâini obosite, rezultate mediocre — un cerc vicios</div>
          </div>
          <div className="problem-card">
            <div className="problem-icon">🚿</div>
            <div className="problem-title">Calcar persistent</div>
            <div className="problem-desc">Cada și chiuveta acumulează calcar care nu se mai curăță cu produse normale</div>
          </div>
        </div>
      </div>

      {/* SOLUTION SECTION */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-title" style={{ fontSize: "1.5rem" }}>Soluția: perii rotative pentru bormașină</div>
        <div className="section-sub">Același efort, de 10× mai rapid</div>
        <div className="solution-grid">
          <div className="solution-card">
            <div className="solution-icon">⚡</div>
            <div className="solution-title">Curățare în secunde</div>
            <div className="solution-desc">Motorul bormașinii face toată munca — tu doar ghidezi peria</div>
          </div>
          <div className="solution-card">
            <div className="solution-icon">🧹</div>
            <div className="solution-title">4 tipuri de perii</div>
            <div className="solution-desc">Perie pentru rosturi, suprafețe plate, colțuri și suprafețe curbe</div>
          </div>
          <div className="solution-card">
            <div className="solution-icon">🔧</div>
            <div className="solution-title">Universal — orice bormașină</div>
            <div className="solution-desc">Tijă hexagonală de 6,35 mm compatibilă cu orice bormașină standard</div>
          </div>
          <div className="solution-card">
            <div className="solution-icon">🏠</div>
            <div className="solution-title">Folosit peste tot</div>
            <div className="solution-desc">Baie, bucătărie, mașină, terasă, pardoseli — un set pentru întreaga casă</div>
          </div>
        </div>
      </div>

      {/* BEFORE/AFTER IMAGE */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", textAlign: "center", marginBottom: "0.75rem" }}>
          Rezultate reale
        </div>
        <img
          src={IMG.beforeAfter}
          alt="Înainte și după curățarea cu perii rotative"
          style={{ display: "block", width: "100%", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
        />
      </div>

      {/* HOW TO USE */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", textAlign: "center", marginBottom: "0.75rem" }}>
          Cum se folosește
        </div>
        <img
          src={IMG.howTo}
          alt="Cum se atașează peria rotativă la bormașină"
          style={{ display: "block", width: "100%", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
        />
      </div>

      {/* GALLERY */}
      <div className="gallery-section">
        <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", textAlign: "center", marginBottom: "0.75rem" }}>
          Galerie produs
        </div>
        <img
          className="gallery-main"
          src={GALLERY_IMAGES[activeImg]}
          alt={`Perii rotative bormașină — imagine ${activeImg + 1}`}
        />
        <div className="gallery-thumbs">
          {GALLERY_IMAGES.map((src, i) => (
            <img
              key={i}
              className={`gallery-thumb${activeImg === i ? " active" : ""}`}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              onClick={() => setActiveImg(i)}
            />
          ))}
        </div>
      </div>

      {/* DIMENSIONS */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <img
          src={IMG.dimensions}
          alt="Dimensiuni perii rotative bormașină"
          style={{ display: "block", width: "100%", borderRadius: "16px", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        />
      </div>

      {/* BUNDLES */}
      <div className="section" id="bundles-section">
        <div className="section-title">Alege setul potrivit</div>
        <div className="section-sub">Plată la livrare — fără risc</div>

        <div className="bundles">
          {/* Set Standard */}
          <div className="bundle-card">
            <div className="bundle-name">{BUNDLES[0].name}</div>
            <div className="bundle-price"><sup>lei</sup>{BUNDLES[0].price}</div>
            <div className="bundle-old">lei {BUNDLES[0].oldPrice}</div>
            <div className="bundle-savings">Economisești {BUNDLES[0].oldPrice - BUNDLES[0].price} lei</div>
            <div className="bundle-pct">-{Math.round((1 - BUNDLES[0].price / BUNDLES[0].oldPrice) * 100)}%</div>
            <div className="bundle-context">1 set complet — ideal pentru testare</div>
            <ul className="bundle-items">
              <li>4 perii rotative (4 dimensiuni)</li>
              <li>Tijă extensie universală 6,35 mm</li>
              <li>Compatibil orice bormașină</li>
            </ul>
            <button type="button" className="add-btn secondary" onClick={() => addBundle(0)}>Adaugă în coș</button>
          </div>

          {/* Set Dublu */}
          <div className="bundle-card featured">
            <div className="popular-badge">Cel mai ales</div>
            <div className="bundle-name">{BUNDLES[1].name}</div>
            <div className="bundle-price"><sup>lei</sup>{BUNDLES[1].price}</div>
            <div className="bundle-old">lei {BUNDLES[1].oldPrice}</div>
            <div className="bundle-savings">Economisești {BUNDLES[1].oldPrice - BUNDLES[1].price} lei</div>
            <div className="bundle-pct">-{Math.round((1 - BUNDLES[1].price / BUNDLES[1].oldPrice) * 100)}%</div>
            <div className="bundle-context">2 seturi — unul pentru baie, unul pentru bucătărie</div>
            <div style={{ fontSize: "12px", color: "var(--green)", fontWeight: 600, textAlign: "center", marginBottom: "4px" }}>
              64,5 lei / set — economisești 50 lei față de Standard × 2
            </div>
            <ul className="bundle-items">
              <li>8 perii rotative (2× 4 dimensiuni)</li>
              <li>2× Tijă extensie universală</li>
              <li>Transport gratuit inclus</li>
            </ul>
            <button type="button" className="add-btn primary" onClick={() => addBundle(1)}>Comandă acum</button>
            <div className="urgency-text">68% din clienți aleg setul dublu</div>
          </div>
        </div>

        <div className="transport-bar">
          <div>
            <div className="t-label">Transport standard (3-5 zile)</div>
            <div className="t-value">{SHIPPING_COST} lei</div>
          </div>
          <div>
            <div className="t-label">Transport gratuit peste {FREE_SHIPPING_THRESHOLD} lei</div>
            <div className="t-value">Gratuit</div>
          </div>
          <div>
            <div className="t-label">Plată la livrare</div>
            <div className="t-value">disponibilă</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <div className="faq-title">Întrebări frecvente</div>

        <div className="faq-item">
          <div className="faq-q">Funcționează cu bormașina mea?</div>
          <div className="faq-a">Da. Periile au tijă hexagonală de 6,35 mm (1/4") — standard universal. Funcționează cu orice bormașină cu mandrina de la 6 mm în sus, inclusiv modele cu fir și cele cu acumulator.</div>
        </div>

        <div className="faq-item">
          <div className="faq-q">Sunt dure și pot zgâria suprafețele?</div>
          <div className="faq-a">Nu. Firele sunt din nylon flexibil, calibrat special pentru a scoate murdăria fără a zgâria faianța, gresia, emailul sau vopsea. Poți folosi cu încredere pe suprafețe delicate.</div>
        </div>

        <div className="faq-item">
          <div className="faq-q">La ce suprafețe le pot folosi?</div>
          <div className="faq-a">Baie (gresie, faianță, cadă, chiuvetă, WC), bucătărie (aragaz, hota, cuptor, plăci), mașina (jante, tapițerie, plastic), terasă și balcon, pardoseli și orice altă suprafață dură.</div>
        </div>

        <div className="faq-item">
          <div className="faq-q">Pot returna dacă nu sunt mulțumit?</div>
          <div className="faq-a">Da. Ai 30 de zile de la livrare să returnezi produsul, fără nicio justificare. Rambursăm integral suma plătită.</div>
        </div>

        <div className="faq-whatsapp">
          Altă întrebare? <a href="https://wa.me/40749397079?text=Salut%21%20Sunt%20interesat%20de%20periile%20rotative%20pentru%20borma%C8%99in%C4%83.%20M%C4%83%20po%C8%9Bi%20ajuta%20cu%20mai%20multe%20detalii%3F" target="_blank" rel="noopener noreferrer">Scrie-ne pe WhatsApp →</a>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <div className="section-header">
          <div className="section-title">Ce spun clienții noștri</div>
          <div className="section-sub">Recenzii reale despre periile rotative</div>
        </div>

        <div className="rating-summary">
          <div className="rating-big">
            <div className="rating-number">4.9</div>
            <div className="rating-stars-big">★★★★★</div>
            <div className="rating-count">din 7 recenzii</div>
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
          <p>Ai cumpărat deja? Lasă o recenzie și ajută alți clienți să aleagă corect.</p>
          <button className="write-btn" onClick={openModal}>Scrie o recenzie</button>
        </div>
      </div>

      <div style={{ height: 100 }} />

      {/* WHATSAPP FAB */}
      <a
        className="whatsapp-fab"
        href="https://wa.me/40749397079?text=Salut%21%20Sunt%20interesat%20de%20periile%20rotative%20pentru%20borma%C8%99in%C4%83.%20M%C4%83%20po%C8%9Bi%20ajuta%20cu%20mai%20multe%20detalii%3F"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactează-ne pe WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.43-2.007A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.27 22.27c-.344.967-1.71 1.768-2.81 2-.754.155-1.737.28-5.05-1.085-4.243-1.726-6.98-6.043-7.19-6.325-.2-.28-1.67-2.22-1.67-4.23s1.06-2.99 1.43-3.4c.371-.41.81-.51 1.08-.51.27 0 .541.003.778.014.25.012.585-.095.916.698.344.82 1.17 2.83 1.27 3.035.1.196.167.427.033.688-.136.26-.203.42-.405.647-.2.227-.422.507-.602.68-.2.192-.41.4-.176.784.234.383 1.04 1.716 2.233 2.78 1.534 1.368 2.826 1.79 3.21 1.99.384.197.607.164.83-.1.22-.26.945-1.1 1.197-1.48.25-.38.5-.317.84-.19.34.127 2.16 1.02 2.53 1.205.37.184.614.277.705.43.09.154.09.894-.254 1.86z"/>
        </svg>
      </a>

      {/* FAB CART */}
      <button className="fab" onClick={() => setCartOpen(true)}>
        <span>Coș</span>
        <span className="fab-badge">{cartCount}</span>
      </button>

      {/* CART PANEL */}
      <div className={`cart-panel${cartOpen ? " open" : ""}`}>
        <div className="cart-header">
          <h3>Coșul tău</h3>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">Coșul este gol</div>
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
                  : <div className="shipping-nudge pending">Mai adaugă {FREE_SHIPPING_THRESHOLD - subtotal} lei pentru transport gratuit</div>
              )}
              <div className="cart-total-row main"><span>Total</span><span>{total} lei</span></div>
              <button
                className="cart-checkout"
                onClick={openCheckout}
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
                <label className="form-label" htmlFor="order-name-perii">Nume și prenume</label>
                <input
                  id="order-name-perii"
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
                <label className="form-label" htmlFor="order-phone-perii">Telefon</label>
                <input
                  id="order-phone-perii"
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
                <label className="form-label" htmlFor="order-address-perii">Adresă livrare</label>
                <textarea
                  id="order-address-perii"
                  className="form-textarea"
                  placeholder="Strada, număr, oraș, județ"
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {orderError && <div className="order-error">{orderError}</div>}

              <button type="submit" className="cart-checkout" disabled={orderLoading}>
                {orderLoading ? "Se trimite..." : "Trimite comanda →"}
              </button>
              <div className="checkout-note">Plată la livrare · Livrare 3-5 zile</div>
            </form>
          )}
        </div>
      </div>

      {/* REVIEW MODAL */}
      <div
        className={`modal-overlay${showModal ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>✕</button>
          <div className="modal-title">Scrie o recenzie</div>
          {submitSuccess ? (
            <div className="success-msg">
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧹</div>
              <h3>Mulțumim pentru recenzie!</h3>
              <p>Recenzia ta va fi verificată și publicată în curând.</p>
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
                <label className="form-label">Set cumpărat</label>
                <select className="form-select" ref={packageRef} defaultValue="set-dublu">
                  <option value="set-standard">Set Standard</option>
                  <option value="set-dublu">Set Dublu</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Titlu recenzie</label>
                <input className="form-input" ref={titleRef} placeholder="Ex: Excelent pentru baie!" />
              </div>
              <div className="form-group">
                <label className="form-label">Recenzia ta</label>
                <textarea className="form-textarea" ref={bodyRef} placeholder="Spune-ne cum te-au ajutat periile rotative..." />
              </div>
              <button className="submit-btn" onClick={submitReview}>Publică recenzia</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
