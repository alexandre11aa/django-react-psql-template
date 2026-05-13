// src/utils/navigate.ts

let navigator: ((path: string) => void) | null = null;

export const setNavigator = (nav: (path: string) => void) => {
  navigator = nav;
};

export const navigateTo = (path: string) => {
  if (navigator) navigator(path);
  else window.location.href = path;
};
