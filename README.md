# 🚵 Downhill Domination

Landing page interativa para uma plataforma de mountain bike downhill, com cena 3D imersiva, iluminação cinematográfica e animações fluidas.

> 🔗 **Preview:** https://mountain-bike-domination-landing-pa.vercel.app *(em desenvolvimento)*

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js)
![Three.js](https://img.shields.io/badge/Three.js-0.177-black?style=flat&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38BDF8?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat&logo=vite)

---

## Funcionalidades

- **Cena 3D interativa** — modelo de mountain bike renderizado com Three.js, iluminação com rim lights cyan/laranja e controle de câmera via mouse e giroscópio
- **Post-processing cinematográfico** — ACES Filmic tone mapping, Unreal Bloom e SMAA antialiasing via EffectComposer
- **HDRI environment** — mapa panorâmico girando continuamente como fundo e source de reflexos nos materiais metálicos
- **Layout responsivo** — enquadramento adaptativo para mobile, tablet e desktop com câmera posicionada dinamicamente
- **Customizador de bike** — seleção de componentes com especificações técnicas (suspensão, freios, câmbio, rodas)
- **Trilhas** — listagem de 6 trilhas com filtro por dificuldade (Iniciante / Intermediário / Expert)
- **Estatísticas** — 50+ trilhas, 10K+ riders, 2000m de vertical, 25+ eventos pro

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3 + TypeScript |
| 3D Engine | Three.js 0.177 |
| Build | Vite 6.3 |
| Estilo | Tailwind CSS 4 |
| Animação | GSAP 3.13 |
| Ícones | Heroicons + PrimeIcons |

---

## Instalação

```bash
npm install
```

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento HTTPS (acessível na rede local)
npm run build        # Build de produção com type-check
npm run preview      # Preview do build local
npm run type-check   # Validação TypeScript
npm run lint         # ESLint com auto-fix
npm run format       # Formatação com Prettier
```

> **Nota:** o servidor de dev sobe com HTTPS via certificado auto-assinado (`@vitejs/plugin-basic-ssl`). Ao acessar pelo celular, aceite o aviso de segurança do browser para que o giroscópio funcione.

---

## Estrutura

```
src/
├── components/
│   ├── home/
│   │   ├── HeroSection.vue        # Cena 3D principal, câmera e iluminação
│   │   ├── CustomizeBike.vue      # Customizador de componentes da bike
│   │   ├── TrailHighlights.vue    # Listagem de trilhas com filtro
│   │   └── StatsSection.vue       # Métricas e estatísticas
│   └── ui/
│       └── TrailCard.vue          # Card individual de trilha
├── composables/
│   └── sceneManager.ts            # Wrapper em torno de THREE.Scene
├── libs/
│   └── threejs/
│       ├── core/
│       │   └── engine3d.ts        # Loop de animação (rAF) e ciclo de vida
│       └── objects/               # Loaders de modelos GLB
│           ├── bike/
│           └── terrain2/
├── types/                         # Trail, TrailDifficulty
├── assets/
│   └── main.css                   # Tema e variáveis de cor (Tailwind @theme)
└── views/
    └── HomePage.vue               # Composição das seções da landing page
```

---

## Arquitetura 3D

### Engine

O `Engine3d` gerencia o loop de animação via `requestAnimationFrame` e o ciclo de vida do renderer. Expõe um callback `onFrame` para lógica customizada por frame (controles, post-processing, animações):

```
Engine3d (rAF loop)
└── onFrame callback
    ├── OrbitControls.update()
    ├── backgroundRotation (HDRI girando)
    └── EffectComposer.render()
```

### Pipeline de renderização

```
RenderPass → UnrealBloomPass → OutputPass (ACES) → SMAAPass
```

| Pass | Função |
|---|---|
| `RenderPass` | Renderiza a cena em HDR linear |
| `UnrealBloomPass` | Glow sutil nos reflexos especulares (threshold 0.88, strength 0.35) |
| `OutputPass` | ACES Filmic tone mapping + conversão de color space |
| `SMAAPass` | Antialiasing morfológico no resultado LDR final |

### Iluminação

| Luz | Cor | Função |
|---|---|---|
| Key light | `#d0e8ff` branco-frio | Iluminação base com shadow map 2048px |
| Rim cyan | `#00e5ff` | Contorno elétrico por trás-esquerda |
| Rim laranja | `#ff5500` | Contra-rim quente por trás-direita |
| Fill | `#1a3060` azul escuro | Evita sombras 100% pretas |

### Câmera responsiva

A posição da câmera é ajustada dinamicamente via `lerp` no evento de resize:

| Breakpoint | Comportamento |
|---|---|
| `< 768px` | Texto no topo, bike enquadrada na metade inferior |
| `768–1023px` | Tablet: mesma lógica do mobile, câmera mais próxima |
| `≥ 1024px` | Desktop: bike à direita do texto, câmera interpolada até 1590px |

---

## Assets 3D

| Arquivo | Descrição |
|---|---|
| `mountain_bike.glb` | Modelo principal da bike |
| `cliff.glb` | Terreno/penhasco |
| `environment.hdr` | HDRI panorâmico para fundo e reflexos |
| `landscape1.jpg` | Fallback de fundo caso o HDRI não carregue |

---

## Paleta de cores

| Token | Valor | Uso |
|---|---|---|
| Primary (cyan) | `rgb(0, 211, 242)` | Cor primária da brand, CTAs, destaques |
| Black Light | `#0f1523` | Background de cards e painéis |
| Black Light 2 | `#1f2837` | Background secundário |
| Green | `#4ade80` | Gradientes, dificuldade iniciante |
| Orange | `#fb923c` | Acento de velocidade/adrenalina |
