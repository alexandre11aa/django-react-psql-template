// src/utils/menuType.ts

export interface SubItem {
  titulo: string;
  href: string;
  icone: string;
  allowedRoles?: string[];
}

export interface MenuItem {
  titulo: string;
  href?: string;
  icone: string;
  classe?: string;
  id?: string;
  subitens?: SubItem[];
  allowedRoles?: string[];
}