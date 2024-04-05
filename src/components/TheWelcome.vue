<script setup lang="ts">
const packages = [
  {
    id: 1,
    name: "Vue",
    icon: "https://api.iconify.design/logos:vue.svg",
    description:
      "An approachable, performant and versatile framework for building web user interfaces.",
    link: "https://vuejs.org/",
  },

  {
    id: 2,
    name: "Pinia",
    icon: "https://api.iconify.design/logos:pinia.svg",
    description:
      "The intuitive store that is type safe, extensible, and modular by design.",
    link: "https://pinia.vuejs.org/",
  },

  {
    id: 3,
    name: "Vue Router",
    icon: "https://api.iconify.design/logos:vue.svg",
    description:
      "The expressive, configurable and convenient routing for Vue.js applications.",
    link: "https://router.vuejs.org/",
  },

  {
    id: 4,
    name: "Eslint",
    icon: "https://api.iconify.design/vscode-icons:file-type-eslint.svg",
    description:
      "ESLint is an open source project that statically analyzes your code to quickly find problems.",
    link: "https://eslint.org/",
  },

  {
    id: 5,
    name: "Vitest",
    icon: "https://api.iconify.design/logos:vitest.svg",
    description:
      "The next generation testing framework powered by Vite. It's fast!",
    link: "https://vitest.dev/",
  },

  {
    id: 6,
    name: "TypeScript",
    icon: "https://api.iconify.design/vscode-icons:file-type-typescript-official.svg",
    description:
      "TypeScript is a strongly typed programming language that builds on JavaScript.",
    link: "https://www.typescriptlang.org/",
  },
  {
    id: 7,
    name: "TailwindCss",
    icon: "https://api.iconify.design/devicon:tailwindcss.svg",
    description:
      "Tailwind CSS is a utility-first CSS framework for rapidly building modern websites.",
    link: "https://tailwindcss.com/",
  },
  {
    id: 8,
    name: "TanStack Vue Query",
    icon: "https://vue-query-next-gen.vercel.app/vue-query.png",
    description:
      "The missing data fetching library for fetching, caching and updating asynchronous data.",
    link: "https://tanstack.com/query/latest/docs/framework/vue/overview",
  },
  {
    id: 9,
    name: "Vercel",
    icon: "https://api.iconify.design/vscode-icons:file-type-vercel.svg",
    description:
      "The Frontend Cloud. Build, scale, and secure a faster, personalized web.",
    link: "https://vercel.com/",
  },
  {
    id: 10,
    name: "Netlify",
    icon: "https://api.iconify.design/vscode-icons:file-type-netlify.svg",
    description:
      "The essential platform for the delivery of exceptional and dynamic web experiences.",
    link: "https://www.netlify.com/",
  },
  {
    id: 10,
    name: "Vue Devtools",
    icon: "https://devtools-next.vuejs.org/logo-mini.svg",
    description:
      "Vue DevTools is a tool designed to enhance the Vue developer experience.",
    link: "https://devtools-next.vuejs.org/",
  },
  {
    id: 11,
    name: "VueUse",
    icon: "https://api.iconify.design/logos:vueuse.svg",
    description:
      "A collection of essential Vue composition utilities based on the composition API.",
    link: "https://vueuse.org/guide/",
  },
];
</script>
<template>
  <main class="grid-container">
    <div class="flex-container">
      <div>
        <img
          src="https://api.iconify.design/logos:vue.svg"
          alt="Vue Logo"
          class="logo"
        />
      </div>

      <div>
        <h2 class="title">Welcome To Create Vue 3 App</h2>
      </div>

      <div class="grid-wrapper">
        <div
          class="package gradient-border"
          v-for="pkg in packages"
          :key="pkg.id"
        >
          <div class="package-inner">
            <a :href="pkg.link" target="_blank" class="package-link">
              <div class="icon-wrapper">
                <img :src="pkg.icon" :alt="pkg.name" class="icon" />
              </div>

              <div>
                <h2 class="package-name">{{ pkg.name }}</h2>
              </div>

              <div>
                <p class="description">
                  {{ pkg.description }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.grid-container {
  display: grid;
  width: 100%;
  min-height: 100vh;
  padding: 10px 0;
  place-items: center;
}

.flex-container {
  display: flex;
  flex-direction: column;
  width: 700px;
  gap: 15px;
  align-items: center;
}

.logo {
  width: 3.5rem;
  height: 3.5rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 40px;
  color: #fff;
}

.grid-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 16px;
  margin-top: 10px;
}

.package-name {
  color: #fff;
}

.package {
  padding: 16px 18px;
  cursor: pointer;
  background-color: #0a0a0a;
  border-radius: 0.75rem;
  border: 0.5px solid #1d1d1d;
}

.package-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.package-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.icon-wrapper {
  display: grid;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: #262626;
  place-items: center;
}

.icon {
  width: 1.75rem;
  height: 1.75rem;
}

.package-name {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 28px;
}

.description {
  font-size: 12.2px;
  color: #d1d5db;
  line-height: 18px;
  font-family: sans-serif;
  text-align: center;
}
</style>
