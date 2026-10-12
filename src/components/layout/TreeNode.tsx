import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
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
  const isActive = !!item.path && location.pathname === item.path;
  const isParentActive =
    hasChildren &&
    item.children.some((c: any) => c.path && location.pathname === c.path);

  const handleClick = () => {
    if (item.action && onAction) {
      onAction(item.action);
    } else if (hasChildren) {
      onToggle(item.id);
    }
  };

  // Resolve icon color (supports tailwind class OR raw hex/css color)
  const iconColorRaw: string | undefined = item.iconColor;
  const isTailwindColor = iconColorRaw?.startsWith("text-");
  const iconStyle =
    iconColorRaw && !isTailwindColor ? { color: iconColorRaw } : undefined;

  const NodeContent = () => (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200",
        collapsed && level === 0 ? "justify-center py-2.5 px-2 mx-2" : "py-2.5 px-3",
        isActive
          ? "bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/20"
          : isParentActive
          ? "bg-slate-700/40 text-white"
          : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
      )}
      onClick={handleClick}
      title={collapsed && level === 0 ? item.title : undefined}
    >
      {/* Active indicator bar (left) */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white/90" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200",
          collapsed && level === 0 ? "h-9 w-9" : "h-8 w-8",
          isActive
            ? "bg-white/15 ring-1 ring-white/30"
            : "bg-slate-800/60 group-hover:bg-slate-700/70 ring-1 ring-slate-700/50"
        )}
      >
        <item.icon
          className={cn(
            "h-[18px] w-[18px] transition-colors",
            isActive
              ? "text-white"
              : isTailwindColor
              ? iconColorRaw
              : !iconColorRaw
              ? "text-slate-300"
              : ""
          )}
          style={!isActive ? iconStyle : undefined}
        />
      </div>

      {/* Title */}
      {(!collapsed || level > 0) && (
        <div className="flex items-center justify-between w-full min-w-0">
          <span
            className={cn(
              "truncate flex-1 text-sm",
              isActive ? "font-semibold" : "font-medium"
            )}
          >
            {item.title}
          </span>

          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-2 flex-shrink-0 transition-transform duration-200",
                isExpanded ? "rotate-0 text-cyan-300" : "-rotate-90 text-slate-500"
              )}
            />
          )}
        </div>
      )}

      {/* Tooltip for collapsed root items */}
      {collapsed && level === 0 && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-slate-700 group-hover:opacity-100 transition-opacity">
          {item.title}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(level === 0 ? "px-2" : "px-0")}>
      {item.path && !item.action ? (
        <Link to={item.path}>
          <NodeContent />
        </Link>
      ) : (
        <NodeContent />
      )}

      {/* Children group container */}
      {hasChildren && isExpanded && !collapsed && (
        <div className="mt-1 mb-2 ml-4 pl-3 border-l border-slate-700/60 space-y-0.5">
          {item.children.map((child: any) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              onToggle={onToggle}
              onAction={onAction}
              collapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
