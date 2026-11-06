/* ============================================================
   DADOS DO SITE — edite só este arquivo
   ------------------------------------------------------------
   authors:   role "autor" = quem fez o projeto | "parceria" = quem ajudou
   shots:     prints reais (o primeiro aparece primeiro no aparelho)
   device:    "portrait" (celular em pé) | "landscape" (celular deitado)
   fit:       "cover" (preenche a tela) | "contain" (mostra o print inteiro)
   download:  link direto do APK (null = botão "Em breve")
   bg / ink:  cor de fundo e do texto da seção (a página muda de cor no scroll)
   ============================================================ */

window.SITE = {
  course: "Técnico em Informática",
  school: "E.E.E.B. João XXIII",
  links: [
    { label: "Instagram do Técnico", url: "https://www.instagram.com/ti_joaoxxiii/" },
    { label: "Instagram da Escola", url: "https://www.instagram.com/eeebjoaoxxiii/" },
    { label: "GitHub do Técnico", url: "https://github.com/ti-joaoxxiii" }
  ],
  organizer: { name: "Murilo Vieira", gh: "https://github.com/MuriloDPV" }
};

window.PEOPLE = {
  murilo:   { name: "Murilo Vieira", gh: "https://github.com/MuriloDPV" },
  igor:     { name: "Igor Augusto Gamarra", gh: "https://github.com/Igor-maker-1" },
  gabriel:  { name: "Gabriel Zatta" },
  spagnoli: { name: "Murilo Spagnoli" },
  mauri:    { name: "Mauri", gh: "https://github.com/MauriKlein" }
};

window.APPS = [
  {
    id: "shadow-duel",
    name: "Shadow Duel",
    sub: "Remastered",
    kind: "Jogo de luta por turnos em 3D",
    bg: "#120f1f", ink: "#efe9ff", accent: "#b48cff",
    device: "landscape", fit: "cover",
    icon: "assets/shadow-duel/icone.png",
    shots: ["assets/shadow-duel/duelo.jpg"],
    tagline: "Tharion contra Voyna, agora em 3D.",
    desc: "Remake do Shadow Duel, jogo de luta por turnos feito em Java no técnico. A cada turno você escolhe entre ataque, defesa, cura e golpe especial, em 4 fases, cada uma com cenário e luz próprios.",
    features: ["4 fases com luz própria", "Ataque, defesa, cura e especial", "Lutadores em 3D", "Remake do original em Java"],
    tech: ["Godot 4", "Blender", "Android"],
    authors: [{ who: "murilo", role: "autor" }],
    credits: [
      ["Jogo original (Java)", ["igor", "murilo"]],
      ["Orientação no original", ["mauri"]]
    ],
    download: "https://github.com/MuriloDPV/shadow-duel-remake/releases/download/apresentacao-v3.2/ShadowDuel_mobile1.apk",
    downloadNote: "Versão de apresentação · celulares 64 bits com Vulkan",
    links: [
      { label: "Ver gameplay", url: "https://github.com/MuriloDPV/shadow-duel-remake/releases/download/apresentacao-v3.2/shadow-duel-gameplay.mp4" },
      { label: "Código", url: "https://github.com/MuriloDPV/shadow-duel-remake" }
    ]
  },
  {
    id: "enemigo",
    name: "ENEMigo",
    kind: "App de estudo para o ENEM",
    bg: "#3b4cca", ink: "#ffffff", accent: "#ffd43b",
    device: "portrait", fit: "cover",
    icon: "assets/enemigo/lia-icone.svg", iconBg: "#3b4cca", adaptive: true,
    splash: { bg: "#3b4cca", img: "assets/enemigo/lia-comemorando.svg" },
    strip: ["feliz", "comemorando", "neutro", "pensando", "triste"].map(n => `assets/enemigo/lia-${n}.svg`),
    stripLabel: "A Lia, mascote do app, em cinco expressões",
    tagline: "Treino para o ENEM no ritmo de um app de idiomas.",
    desc: "Questões reais de provas anteriores em lições curtas, de 3 a 5 questões. Em Matemática, micro-questões aquecem antes de cada questão do ENEM. Funciona offline e guarda o progresso no celular.",
    features: ["Questões reais do ENEM", "Lições de ~4 minutos", "XP, vidas, ofensiva e conquistas", "Caderno de erros"],
    tech: ["Java", "XML", "Android Studio"],
    authors: [{ who: "spagnoli", role: "autor" }, { who: "murilo", role: "parceria" }],
    download: "https://github.com/MuriloDPV/ENEMigo/releases/download/v1.0-demo/ENEMigo-v1.0-demo.apk",
    downloadNote: "Demo v1.0 · Android 8 ou mais novo",
    links: [{ label: "Código", url: "https://github.com/MuriloDPV/ENEMigo" }]
  },
  {
    id: "boss-rush",
    name: "Boss Rush",
    kind: "Jogo de batalha contra chefes",
    bg: "#1b2240", ink: "#f4e7cb", accent: "#e0a64f",
    device: "landscape", fit: "cover",
    icon: "assets/boss-rush/icone.png",
    shots: ["reino", "planicie", "floresta", "caverna"].map(n => `assets/boss-rush/${n}.webp`),
    strip: ["assets/boss-rush/personagens.webp"],
    stripLabel: "Personagens e chefes em pixel art",
    tagline: "Só chefes. Um atrás do outro.",
    desc: "Batalhas por turnos contra chefes em quatro áreas: planície, floresta, caverna e reino. Derrotar um chefe rende cartas. Perder a luta volta tudo ao início, sem as cartas.",
    features: ["4 áreas e vários chefes", "Espada, escudo, cura e especial", "Cartas que mudam a luta", "Mago e Tanque secretos"],
    tech: ["Java", "Android", "Pixel art"],
    authors: [{ who: "gabriel", role: "autor" }, { who: "murilo", role: "parceria" }],
    download: "https://github.com/MuriloDPV/BossRush/raw/main/BossRush%20APK.apk",
    downloadNote: "Android 7 ou mais novo",
    links: [{ label: "Código", url: "https://github.com/MuriloDPV/BossRush" }]
  },
  {
    id: "aventura-do-moai",
    name: "Aventura do Moai",
    kind: "Jogo de plataforma 2D",
    bg: "#123c4a", ink: "#eaf6f2", accent: "#7fd6ff",
    device: "landscape", fit: "contain", screen: "#000",
    icon: "assets/aventura-do-moai/icone.svg", adaptive: true,
    shots: ["l1", "l2", "l3", "cave", "wave", "ending"].map(n => `assets/aventura-do-moai/${n}.webp`),
    tagline: "O último moai atravessa Rapa Nui atrás dos seus olhos.",
    desc: "Plataforma 2D em pixel art com 3 fases (Rano Raraku, Anakena e Orongo), um mapa secreto, inimigos como picaretas, aves arqueiras e uma tartaruga que se divide em duas, e itens como coco, obsidiana e escudo de moai.",
    features: ["3 fases e 1 mapa secreto", "Inimigos e itens próprios", "Joga no celular ou no navegador", "Pixel art"],
    tech: ["Java", "Android", "HTML5"],
    authors: [{ who: "igor", role: "autor" }, { who: "murilo", role: "parceria" }],
    download: "https://github.com/MuriloDPV/AventuraDoMoai/releases/latest/download/AventuraDoMoai.apk",
    downloadNote: "Android 7 ou mais novo · jogue deitado",
    links: [
      { label: "Jogar no navegador", url: "jogar/aventura-do-moai/", internal: true },
      { label: "Código", url: "https://github.com/MuriloDPV/AventuraDoMoai" }
    ]
  }
];
