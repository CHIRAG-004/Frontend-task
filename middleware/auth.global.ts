export default defineNuxtRouteMiddleware(async (to) => {
  const { handleAuthState } = useAuth();
  const user = UserStore();
  if (!import.meta.server) await handleAuthState();

  const privateRoutes = ["/user/profile"];

  // Check if the user is authenticated
  const isAuthenticated = user.getIsAuthenticated;

  // Redirect logic
  if (privateRoutes.includes(to.path) && !isAuthenticated) {

    return navigateTo("/auth/login");
  }

  if ((to.path === "/auth/login" || to.path === "/auth/register") && isAuthenticated) {

    return navigateTo("/user/profile");
  }
});
