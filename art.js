/* Artes geradas em SVG — aparecem dentro da tela do aparelho quando não há print (cover) */
window.ART = {
    chess(a) {
      let sq = "", lit = "";
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const x = c * 36, y = r * 36, light = (r + c) % 2 === 0;
        sq += `<rect x="${x}" y="${y}" width="36" height="36" fill="rgba(255,255,255,${light ? .11 : .035})"/>`;
        if ((r * 3 + c * 5) % 7 === 0) lit += `<rect class="a-lit" style="--d:${r + c}" x="${x + 3}" y="${y + 3}" width="30" height="30" rx="4" fill="${a.accent}"/>`;
      }
      return `<svg viewBox="0 0 400 400" aria-hidden="true">
        <g transform="translate(200 220) scale(.8 .46) rotate(45) translate(-144 -144)">
          <rect x="-8" y="-8" width="304" height="304" rx="10" fill="none" stroke="rgba(255,255,255,.14)"/>
          ${sq}${lit}
          <polyline class="a-dash" points="18,270 90,234 126,162 198,126 234,54 270,18" fill="none" stroke="${a.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g font-family="JetBrains Mono,monospace" font-size="12" fill="rgba(242,239,233,.6)" letter-spacing="1.5">
          <text x="34" y="54">DIA 12 · SEQUÊNCIA</text>
          <text x="366" y="54" text-anchor="end" fill="${a.accent}">+30 PTS</text>
        </g></svg>`;
    },

    sword(a) {
      const map = [
        "..............XX", ".............XWX", "............XWWX", "...........XWWX.",
        "..........XWWX..", ".........XWWX...", "........XWWX....", "..XX...XWWX.....",
        "..XGX.XWWX......", "...XGXWWX.......", "....XGWX........", "...XGXGX........",
        "..XHX.XGX.......", ".XHX...XX.......", "XHHX............", "XXX............."
      ];
      const col = { X: "#4a4d5e", W: "#dfe5f2", G: "#e9c46a", H: a.accent };
      let px = "";
      map.forEach((row, y) => [...row].forEach((ch, x) => {
        if (col[ch]) px += `<rect x="${x * 13}" y="${y * 13}" width="13" height="13" fill="${col[ch]}"/>`;
      }));
      let hp = "";
      for (let i = 0; i < 12; i++) hp += `<rect ${i > 7 ? `class="a-hp" style="--d:${11 - i}"` : ""} x="${80 + i * 20}" y="330" width="16" height="14" fill="${a.accent}"/>`;
      return `<svg viewBox="0 0 400 400" aria-hidden="true" shape-rendering="crispEdges">
        <g opacity=".08" fill="#fff">${Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 40}" y="0" width="1" height="400"/><rect x="0" y="${40 + i * 40}" width="400" height="1"/>`).join("")}</g>
        <g class="a-float" style="transform-origin:200px 180px"><g transform="translate(96 72)">${px}</g></g>
        <rect x="76" y="326" width="248" height="22" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/>
        ${hp}
        <g font-family="JetBrains Mono,monospace" font-size="12" fill="rgba(242,239,233,.6)" letter-spacing="1.5">
          <text x="76" y="314">CHEFE 3/7</text><text x="324" y="314" text-anchor="end" fill="${a.accent}">HP</text>
        </g></svg>`;
    },

    blades(a) {
      const c2 = a.accent2 || "#2dd4bf";
      let rays = "";
      for (let i = 0; i < 12; i++) {
        const ang = i * 30 * Math.PI / 180, r1 = 18, r2 = i % 2 ? 46 : 70;
        rays += `<line x1="${200 + Math.cos(ang) * r1}" y1="${200 + Math.sin(ang) * r1}" x2="${200 + Math.cos(ang) * r2}" y2="${200 + Math.sin(ang) * r2}"/>`;
      }
      const blade = (id, from, to, grad) => `
        <line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="url(#${grad})" stroke-width="7" stroke-linecap="round"/>
        <line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" stroke-linecap="round"/>`;
      return `<svg viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <linearGradient id="gL" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${a.accent}" stop-opacity="0"/><stop offset=".55" stop-color="${a.accent}"/><stop offset="1" stop-color="#fff"/></linearGradient>
          <linearGradient id="gR" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c2}" stop-opacity="0"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="#fff"/></linearGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
        </defs>
        <g filter="url(#blur)" opacity=".55">
          <circle class="a-smoke" cx="120" cy="290" r="80" fill="${a.accent}"/>
          <circle class="a-smoke" cx="290" cy="120" r="70" fill="${c2}" style="animation-delay:-4s"/>
        </g>
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,.07)"/>
        <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,.05)" stroke-dasharray="2 8"/>
        <g class="a-bladeL">${blade("l", [70, 330], [224, 176], "gL")}<rect x="56" y="322" width="34" height="9" rx="2" fill="${a.accent}" transform="rotate(-45 73 326)"/></g>
        <g class="a-bladeR">${blade("r", [330, 330], [176, 176], "gR")}<rect x="310" y="322" width="34" height="9" rx="2" fill="${c2}" transform="rotate(45 327 326)"/></g>
        <circle class="a-ring" cx="200" cy="200" r="60" fill="none" stroke="#fff" stroke-width="2"/>
        <g class="a-spark" stroke="#fff" stroke-width="2.5" stroke-linecap="round">${rays}<circle cx="200" cy="200" r="8" fill="#fff" stroke="none"/></g>
        <text x="200" y="370" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" letter-spacing="4" fill="rgba(242,239,233,.6)">PARRY</text>
      </svg>`;
    },

    quiz(a) {
      const opts = ["A", "B", "C", "D", "E"].map((l, i) => {
        const y = 196 + i * 30, pick = i === 2;
        return `<g>
          <rect x="114" y="${y - 12}" width="172" height="24" rx="12" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,${pick ? .2 : .08})"/>
          <circle ${pick ? 'class="a-pick"' : ""} cx="128" cy="${y}" r="8" fill="transparent" stroke="${pick ? a.accent : "rgba(255,255,255,.3)"}" stroke-width="1.5"/>
          ${pick ? `<path class="a-check" d="M124 ${y} l3 3 l6 -6" fill="none" stroke="#0e0e13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
          <text x="146" y="${y + 4}" font-family="JetBrains Mono,monospace" font-size="11" fill="rgba(242,239,233,.7)">${l}</text>
          <rect x="164" y="${y - 2}" width="${[90, 70, 100, 60, 80][i]}" height="4" rx="2" fill="rgba(255,255,255,.18)"/>
        </g>`;
      }).join("");
      return `<svg viewBox="0 0 400 400" aria-hidden="true">
        <rect x="104" y="92" width="200" height="250" rx="20" fill="#14141b" stroke="rgba(255,255,255,.08)" transform="rotate(-9 200 210)"/>
        <rect x="100" y="86" width="200" height="250" rx="20" fill="#17171f" stroke="rgba(255,255,255,.08)" transform="rotate(5 200 210)"/>
        <g class="a-card">
          <rect x="96" y="76" width="208" height="262" rx="20" fill="#1b1b24" stroke="rgba(255,255,255,.12)"/>
          <rect x="114" y="96" width="172" height="6" rx="3" fill="rgba(255,255,255,.08)"/>
          <rect class="a-bar" x="114" y="96" width="172" height="6" rx="3" fill="${a.accent}"/>
          <text x="114" y="128" font-family="JetBrains Mono,monospace" font-size="10" letter-spacing="1.5" fill="${a.accent}">QUESTÃO 07 · ENEM</text>
          <rect x="114" y="140" width="172" height="6" rx="3" fill="rgba(255,255,255,.28)"/>
          <rect x="114" y="154" width="130" height="6" rx="3" fill="rgba(255,255,255,.28)"/>
          ${opts}
        </g>
        <text class="a-xp" x="318" y="150" text-anchor="end" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="22" fill="${a.accent}">+10 XP</text>
      </svg>`;
    },

    platformer(a) {
      const B = 32;
      let ground = "";
      for (let i = 0; i < 16; i++) ground += `<rect x="${i * B}" y="320" width="${B - 2}" height="${B - 2}" fill="#44403c"/><rect x="${i * B}" y="320" width="${B - 2}" height="8" fill="${a.accent}"/><rect x="${i * B}" y="352" width="${B - 2}" height="${B - 2}" fill="#292524"/>`;
      const stone = (x, y, glow) => glow
        ? `<rect x="${x}" y="${y}" width="30" height="30" fill="#2a3a4a"/><rect x="${x}" y="${y}" width="30" height="30" fill="none" stroke="${a.accent}" stroke-width="2"/><rect x="${x + 11}" y="${y + 11}" width="8" height="8" fill="${a.accent}" transform="rotate(45 ${x + 15} ${y + 15})"/>`
        : `<rect x="${x}" y="${y}" width="30" height="30" fill="#6b7280"/><rect x="${x}" y="${y}" width="30" height="4" fill="#9ca3af"/><rect x="${x + 4}" y="${y + 16}" width="22" height="2" fill="#4b5563"/>`;
      const blocks = [[120, 200, 0], [152, 200, 1], [184, 200, 0], [280, 150, 0], [312, 150, 0]].map(([x, y, g]) => stone(x, y, g)).join("");
      const gems = [[136, 160], [168, 160], [200, 160], [312, 110]].map(([x, y], i) =>
        `<g class="a-bob" style="--d:${i}"><path class="a-coin" style="--d:${i}" d="M${x} ${y - 11} L${x + 8} ${y} L${x} ${y + 11} L${x - 8} ${y} Z" fill="#7dd3fc" stroke="#e0f2fe" stroke-width="1.5"/></g>`).join("");
      return `<svg viewBox="0 0 400 400" aria-hidden="true" shape-rendering="crispEdges">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f3b"/><stop offset=".7" stop-color="#7a4a5a"/><stop offset="1" stop-color="#e08e5b"/></linearGradient></defs>
        <rect width="400" height="400" fill="url(#sky)"/>
        <circle cx="300" cy="250" r="34" fill="#ffd8a8" opacity=".85"/>
        <rect x="0" y="262" width="400" height="60" fill="#1e3a5f"/><rect x="0" y="262" width="400" height="2" fill="rgba(255,255,255,.35)"/>
        <g class="a-cloud" fill="rgba(255,255,255,.55)"><rect x="0" y="70" width="60" height="12"/><rect x="12" y="60" width="36" height="12"/></g>
        <g class="a-cloud" fill="rgba(255,255,255,.4)" style="animation-delay:-14s"><rect x="0" y="110" width="44" height="10"/><rect x="10" y="101" width="24" height="10"/></g>
        <rect x="40" y="256" width="26" height="64" fill="#57534e"/><rect x="36" y="250" width="34" height="10" fill="${a.accent}"/>
        ${blocks}${gems}
        <rect x="0" y="378" width="400" height="22" fill="#292524"/><g class="a-scroll">${ground}</g>
        <g font-family="JetBrains Mono,monospace" font-size="12" fill="rgba(255,255,255,.75)" letter-spacing="1.5">
          <text x="24" y="36">FASE 1-1</text><text x="376" y="36" text-anchor="end">◆ × 24</text>
        </g>
      </svg>`;
    }
  };

