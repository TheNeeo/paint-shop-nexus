
export interface MenuItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

export interface TreeNodeProps {
  item: MenuItem;
  level: number;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  collapsed: boolean;
}

export interface TreeSidebarProps {
  collapsed: boolean;
}
