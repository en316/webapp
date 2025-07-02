export interface MenuOption {
  id: string | number;
  label: string;
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  children?: MenuOption[];
  data?: any;
}