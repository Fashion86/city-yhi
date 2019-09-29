import {FuseNavigation} from '@fuse/types';

export const adminNavigation: FuseNavigation[] = [
  {
    id: 'menu',
    title: 'Menu',
    translate: 'NAV.APPLICATIONS',
    type: 'group',
    icon: 'apps',
    children: [
      // {
      //   id: 'analytics',
      //   title: 'Dashboard',
      //   type: 'item',
      //   icon: 'group',
      //   url: '/admin/analytics'
      // },
      {
        id: 'sms',
        title: 'SMS Feed',
        type: 'item',
        icon: 'textsms',
        url: '/admin/smshistory'
      },

      {
        id: 'permanent-cohorts',
        title: 'Cohort SMS',
        type: 'item',
        icon: 'group_work',
        url: '/admin/permanent-cohorts'
      }
    ]
  },
];
