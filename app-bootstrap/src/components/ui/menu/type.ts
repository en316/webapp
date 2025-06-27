export interface MenuItem {
  id: string | number;
  label: string;
  children?: MenuItem[];
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  data?: any;
}