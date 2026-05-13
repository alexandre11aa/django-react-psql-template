// src/utils/menu.ts

import type { MenuItem } from "../types/menuType";


export const menu: MenuItem[] = [

  {
    titulo: "Tela Inicial",
    href: "/home",
    icone: "bi bi-house-door-fill",
    allowedRoles: ["ADM", "USR"] ,
  },

  {
    titulo: "Ajuda",
    href: "/maintenance",
    icone: "bi bi-question-circle-fill help-icon",
    classe: "help-icon",
    allowedRoles: ["ADM", "USR"] ,
  },

  {
    titulo: "Configurações",
    id: "menuConfiguracoes",
    icone: "bi bi-gear-fill",
    allowedRoles: ["ADM", "USR"] ,
    subitens: [
      { 
        titulo: "Acessos", 
        href: "/manage_user", 
        icone: "bi bi-shield-lock-fill", 
        allowedRoles: ["ADM"] 
      },
      { 
        titulo: "Meu Perfil", 
        href: "/profile_user", 
        icone: "bi bi-person-circle", 
        allowedRoles: ["ADM", "USR"] 
      },
    ]
  },

  {
    titulo: "Logout",
    href: "/logout",
    icone: "bi bi-box-arrow-right",
    classe: "leave-icon",
  }

];

export const menuSuperior = menu.filter(
  (item) => !["Ajuda", "Configurações", "Logout"].includes(item.titulo)
);

export const menuRodape = menu.filter(
  (item) => ["Ajuda", "Configurações", "Logout"].includes(item.titulo)
);
