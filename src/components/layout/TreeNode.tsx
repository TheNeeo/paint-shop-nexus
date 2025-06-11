
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeNodeProps } from "./types";

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level,
  expandedItems,
  onToggle,
  collapsed,
}) => {
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.id);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all duration-200 relative group rounded-lg mx-2",
          "hover:bg-slate-700/50 hover:text-cyan-400",
          level === 0 ? "text-white font-medium" : "text-slate-300",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: collapsed ? "12px" : `${level * 16 + 12}px` }}
        title={collapsed ? item.title : undefined}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Always show icons */}
          <div className="w-4 h-4 flex-shrink-0">
            {item.icon}
          </div>
          
          {/* Show chevron for expandable items when not collapsed */}
          {hasChildren && !collapsed && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
          
          {/* Show title only when not collapsed */}
          {!collapsed && (
            <span className="truncate text-sm font-medium">{item.title}</span>
          )}
        </div>
        
        {/* Hover indicator */}
        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r" />
        
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-600">
            {item.title}
            {hasChildren && (
              <div className="text-xs text-slate-300 mt-1">
                {item.children?.map(child => child.title).join(", ")}
              </div>
            )}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-slate-800"></div>
          </div>
        )}
      </div>

      {/* Children - Show even in collapsed state on hover/click */}
      {hasChildren && (
        <AnimatePresence>
          {(isExpanded && !collapsed) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {item.children?.map((child) => (
                <TreeNode
                  key={child.id}
                  item={child}
                  level={level + 1}
                  expandedItems={expandedItems}
                  onToggle={onToggle}
                  collapsed={collapsed}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Special collapsed state sub-menu on hover */}
      {collapsed && hasChildren && (
        <div className="absolute left-full top-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-lg min-w-48 p-2">
            <div className="text-cyan-400 font-medium text-sm mb-2 px-2">{item.title}</div>
            {item.children?.map((child) => (
              <div
                key={child.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-700 rounded cursor-pointer"
              >
                <div className="w-4 h-4 flex-shrink-0">
                  {child.icon}
                </div>
                <span>{child.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
