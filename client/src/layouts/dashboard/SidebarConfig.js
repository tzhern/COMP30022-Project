import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Home',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Customer',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Order',
    path: '/dashboard/order',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Product',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  }
];

export default sidebarConfig;
