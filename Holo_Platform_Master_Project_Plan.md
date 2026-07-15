<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AERO/01 Performance Runner</title>
  <style>
    :root {
      --bg: #f4f4f1;
      --ink: #111111;
      --muted: #727272;
      --line: rgba(17,17,17,.12);
      --card: rgba(255,255,255,.62);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background: var(--bg);
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
    }

    body {
      padding: 24px;
    }

    main {
      width: min(100%, 520px);
      margin: 0 auto;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 64px;
      font-size: 12px;
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    .brand {
      font-weight: 800;
    }

    .index {
      color: var(--muted);
    }

    .hero {
      margin-bottom: 56px;
    }

    .eyebrow {
      font-size: 11px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 14px;
    }

    h1 {
      margin: 0;
      font-size: clamp(44px, 13vw, 72px);
      line-height: .94;
      letter-spacing: -.055em;
      text-transform: uppercase;
    }

    .tagline {
      margin: 22px 0 0;
      max-width: 300px;
      font-size: 16px;
      line-height: 1.5;
      color: var(--muted);
    }

    .product-frame {
      margin: 44px 0;
      aspect-ratio: 4 / 5;
      border-radius: 28px;
      border: 1px solid var(--line);
      background:
        radial-gradient(circle at 50% 40%, rgba(255,255,255,.95), rgba(226,226,222,.8) 70%);
      display: grid;
      place-items: center;
      overflow: hidden;
      position: relative;
    }

    .shoe {
      width: 72%;
      aspect-ratio: 1.65 / 1;
      border-radius: 48% 50% 32% 35%;
      background:
        linear-gradient(145deg, #fafafa 0%, #dededb 46%, #b9b9b5 100%);
      transform: rotate(-12deg);
      box-shadow: 0 34px 60px rgba(0,0,0,.18);
      position: relative;
    }

    .shoe::after {
      content: "";
      position: absolute;
      left: 8%;
      right: 5%;
      bottom: -12%;
      height: 24%;
      border-radius: 50%;
      background: rgba(0,0,0,.11);
      filter: blur(16px);
    }

    .frame-label {
      position: absolute;
      left: 20px;
      bottom: 18px;
      font-size: 10px;
      letter-spacing: .15em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .section {
      padding: 32px 0;
      border-top: 1px solid var(--line);
    }

    .section-number {
      font-size: 10px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
    }

    h2 {
      margin: 0 0 14px;
      font-size: 28px;
      line-height: 1;
      letter-spacing: -.035em;
      text-transform: uppercase;
    }

    .section p {
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
      font-size: 15px;
    }

    .specs {
      margin-top: 18px;
      display: grid;
      gap: 10px;
    }

    .spec {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--line);
      font-size: 12px;
    }

    .spec span:last-child {
      color: var(--muted);
      text-align: right;
    }

    .cta-block {
      margin: 56px 0 24px;
      padding: 34px;
      border-radius: 28px;
      background: var(--ink);
      color: white;
    }

    .cta-block h2 {
      font-size: 36px;
    }

    .cta-block p {
      color: rgba(255,255,255,.58);
      line-height: 1.55;
      margin-bottom: 24px;
    }

    .button {
      display: block;
      width: 100%;
      padding: 17px 20px;
      border-radius: 999px;
      text-align: center;
      text-decoration: none;
      background: white;
      color: var(--ink);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    footer {
      padding: 28px 0 12px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <main>
    <div class="top">
      <div class="brand">AERO/01</div>
      <div class="index">Performance Series / 01</div>
    </div>

    <section class="hero">
      <div class="eyebrow">Performance Runner</div>
      <h1>Engineered<br>for movement.</h1>
      <p class="tagline">
        A lightweight performance system built around control, response and natural motion.
      </p>

      <div class="product-frame">
        <div class="shoe" aria-label="Product placeholder"></div>
        <div class="frame-label">AERO/01 Performance Runner</div>
      </div>
    </section>

    <section class="section">
      <div class="section-number">01 / Fit</div>
      <h2>Adaptive Lockdown</h2>
      <p>
        Engineered lacing geometry distributes tension across the upper for a secure, personalized fit.
      </p>
      <div class="specs">
        <div class="spec"><span>System</span><span>Multi-zone lacing</span></div>
        <div class="spec"><span>Support</span><span>Dynamic midfoot lockdown</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-number">02 / Material</div>
      <h2>Engineered Upper</h2>
      <p>
        Lightweight engineered mesh combines targeted ventilation with structured support.
      </p>
      <div class="specs">
        <div class="spec"><span>Construction</span><span>Engineered mesh</span></div>
        <div class="spec"><span>Function</span><span>Ventilation + support</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-number">03 / Cushioning</div>
      <h2>Responsive Midsole</h2>
      <p>
        Lightweight foam balances impact absorption with a responsive transition through each stride.
      </p>
      <div class="specs">
        <div class="spec"><span>Platform</span><span>Lightweight foam</span></div>
        <div class="spec"><span>Response</span><span>Impact absorption</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-number">04 / Traction</div>
      <h2>High-Traction Outsole</h2>
      <p>
        Strategically placed rubber zones support multidirectional grip and natural movement.
      </p>
      <div class="specs">
        <div class="spec"><span>Compound</span><span>High-abrasion rubber</span></div>
        <div class="spec"><span>Geometry</span><span>Multidirectional traction</span></div>
      </div>
    </section>

    <section class="cta-block">
      <div class="section-number" style="color:rgba(255,255,255,.45)">Continue</div>
      <h2>Go beyond the display.</h2>
      <p>
        Explore product details, available variants and the complete AERO/01 performance system.
      </p>
      <a class="button" href="#">Explore the collection</a>
    </section>

    <footer>
      <span>AERO/01</span>
      <span>HoloExperience Demo</span>
    </footer>
  </main>
</body>
</html>
