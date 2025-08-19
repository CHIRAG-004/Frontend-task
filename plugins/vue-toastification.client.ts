import { SnackbarService, useSnackbar } from "vue3-snackbar";
import "vue3-snackbar/styles";

export default defineNuxtPlugin({
  order: 50,
  name: "snackbar",
  setup: () => {

    useNuxtApp().vueApp.use(SnackbarService);
    const snackbar = useSnackbar();
    return {
      provide: {
        snackbar: snackbar,
      },
    };
  },
});
