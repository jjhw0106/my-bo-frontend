<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-[hsl(var(--border))] glass-effect hidden md:flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-[hsl(var(--border))]">
        <span class="font-bold text-xl text-[hsl(var(--primary))]">Dashboard</span>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <div class="p-2 rounded hover:bg-[hsl(var(--accent))] cursor-pointer">Overview</div>
        <div class="p-2 rounded hover:bg-[hsl(var(--accent))] cursor-pointer">Settings</div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col">
      <!-- Top Navbar -->
      <header class="h-16 border-b border-[hsl(var(--border))] glass-effect flex items-center px-6 sticky top-0 z-50 justify-between">
        <h2 class="font-semibold">Page Title</h2>
        <div class="w-8 h-8 rounded-full bg-[hsl(var(--primary))]"></div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
