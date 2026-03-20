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

- **Cena 3D interativa** — modelo de mountain bike renderizado com Three.js, iluminação com rim lights cyan/laranja e rotação de câmera via mouse e giroscópio
- **Post-processing cinematográfico** — ACES Filmic tone mapping, Unreal Bloom e SMAA antialiasing via EffectComposer
- **Skydome animado** — fundo panorâmico girando continuamente para dar vida à cena
- **Customizador de bike** — seleção de componentes com especificações técnicas (suspensão, freios, câmbio, rodas)
- **Trilhas** — listagem de 6 trilhas com sistema de filtro por dificuldade (Iniciante / Intermediário / Expert)
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
npm run dev          # Servidor de desenvolvimento (com acesso em rede)
npm run build        # Build de produção com type-check
npm run preview      # Preview do build local
npm run type-check   # Validação TypeScript
npm run lint         # ESLint com auto-fix
npm run format       # Formatação com Prettier
```

---

## Estrutura

```
src/
├── components/
│   ├── home/
│   │   ├── HeroSection.vue        # Cena 3D principal
│   │   ├── CustomizeBike.vue      # Customizador de componentes
│   │   ├── TrailHighlights.vue    # Listagem de trilhas com filtro
│   │   └── StatsSection.vue       # Métricas e estatísticas
│   ├── ui/
│   │   └── TrailCard.vue
│   └── controllers/
│       └── ObjectController.vue   # Painel de debug para objetos 3D
├── composables/
│   └── sceneManager.ts            # Wrapper reativo em torno de THREE.Scene
├── libs/
│   └── threejs/
│       ├── core/
│       │   └── engine3d.ts        # Loop de animação e ciclo de vida da engine
│       ├── entities/              # ECS: Entity, Transform, Graphic, Physic
│       ├── interfaces/
│       │   └── stage_interface.ts
│       ├── objects/               # Loaders de modelos GLB
│       └── scenes/
│           └── stage1.ts
├── types/                         # Trail, TrailDifficulty
├── views/
│   └── HomePage.vue
└── router/
    └── index.ts
```

---

## Arquitetura 3D

### Engine (ECS)

O engine 3D usa um padrão **Entity Component System** customizado:

```
Engine3d (rAF loop)
└── Entity
    ├── TransformationComponent  — position / rotation / scale
    ├── GraphicComponent         — Three.js Object3D + sync com transform
    └── PhysicComponent          — simulação de velocidade linear
```

O `Engine3d` expõe um callback `onFrame` para lógica customizada por frame (controles, composer, animações).

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
| Key light | `#d0e8ff` branco-frio | Iluminação base, shadow map 2048px |
| Rim cyan | `#00e5ff` | Contorno elétrico por trás-esquerda |
| Rim laranja | `#ff5500` | Contra-rim quente por trás-direita |
| Fill | `#1a3060` azul escuro | Evita sombras 100% pretas |

---

## Assets 3D

| Arquivo | Tamanho | Descrição |
|---|---|---|
| `mountain_bike.glb` | 16.5 MB | Modelo principal da bike |
| `cliff.glb` | 23 MB | Terreno/penhasco |
| `landscape1.jpg` | — | Textura do skydome rotacionando |

---

## Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| Cyan | `#22d3ee` | Cor primária da brand, CTAs, destaques |
| Green | `#4ade80` | Gradientes, secundário |
| Orange | `#fb923c` | Acento de velocidade/adrenalina |
| Black | `#000000` | Background principal |
