import { defineStore } from "pinia";
import type { User } from "~/services/dataBase/schema/schemaTypes";

export const UserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    allUser: [] as User[],
    isAuthenticated: false,
  }),
  actions: {
    // Update the setUser action to accept a User object
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    async setAllUser() {
      this.allUser = (await useAuth().getAllExistingUsers()) as User[];
    },

    updateUserDetails(newDetails: Partial<User>) {
      if (!this.user) return;
      this.user = { ...this.user, ...newDetails } as User;
      this.allUser = this.allUser.map((user) =>
        user.id == this.user?.id ? { ...user, ...newDetails } : user
      );
    },

    // Clear the user state
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
  getters: {
    getUser: (state) => state.user,
    getUserById: (state) => {
      return (id: string) => state.allUser.find((user) => user.id == id);
    },

    getIsAuthenticated: (state) => state.isAuthenticated,

    getUserRole: (state) => state.user?.role,
    getUserFullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : null,
  },
});
