/**
   * Custom function to show success snackbar
  *
  */
export function onSuccess(text: string, title: string = "Request Successful") {
  return (useNuxtApp().$snackbar).add({
    type: "success",
    title,
    text,
  });
}

/**
 * Custom function to show info snackbar
 *
 */
export function onInfo(text: string, title: string = "Info") {
  return (useNuxtApp().$snackbar).add({
    type: "info",
    title,
    text,
  });
}

/**
 * Custom function to show info snackbar
 *
 */
export function onWarning(text: string, title: string = "warn") {
  return (useNuxtApp().$snackbar).add({
    type: "warning",
    title,
    text,
  });
}

/**
 * Custom function to show failure snackbar
 *
 */
export function onFailure(text: string, title: string = "Request Failed") {
  return (useNuxtApp().$snackbar).add({
    type: "error",
    title,
    text,
  });
}
