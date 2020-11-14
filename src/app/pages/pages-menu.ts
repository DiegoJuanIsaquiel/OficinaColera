import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  { title: 'Início', icon: 'home-outline', link: '/pages/dashboard' },
  { title: 'Administrativo', group: true },
  {
    title: 'Usuários',
    icon: 'people',
    children: [
      { title: 'Listar', link: '/pages/users' },
      { title: 'Criar', link: '/pages/users/create' },
    ],
  },
];
