export default defineNuxtPlugin(() => {
  const STORAGE_KEY = 'protectedRoutes';
  const { setProtectedRoutes } = usePagePermissions();

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      setProtectedRoutes(JSON.parse(saved));
    } catch {
      // invalid JSON, keep default
    }
  }
});
