
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface TreeNodeProps {
  item: any;
  level: number;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  onAction?: (action: string) => void;
  collapsed: boolean;
}

export function TreeNode({ item, level, expandedItems, onToggle, onAction, collapsed }: TreeNodeProps) {
  const location = useLocation();
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path;
  const paddingLeft = collapsed ? "pl-4" : `pl-${4 + level * 4}`;

  const handleClick = () => {
    if (item.action && onAction) {
      onAction(item.action);
    } else if (hasChildren) {
      onToggle(item.id);
    }
  };

  const NodeContent = () => (
    <div
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer group",
        paddingLeft,
        isActive
          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
      )}
      onClick={handleClick}
    >
      {/* Icon with color */}
      <item.icon 
        className={cn(
          "h-5 w-5 transition-colors duration-200",
          isActive 
            ? "text-white" 
            : item.iconColor || "text-slate-400"
        )} 
      />
      
      {/* Title */}
      {!collapsed && (
        <>
          <span className="font-medium text-sm truncate flex-1">{item.title}</span>
          
          {/* Chevron for expandable items */}
          {hasChildren && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="px-2">
      {/* Main Node */}
      {item.path && !item.action ? (
        <Link to={item.path}>
          <NodeContent />
        </Link>
      ) : (
        <NodeContent />
      )}
      
      {/* Children */}
      {hasChildren && isExpanded && !collapsed && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child: any) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              onToggle={onToggle}
              onAction={onAction}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
