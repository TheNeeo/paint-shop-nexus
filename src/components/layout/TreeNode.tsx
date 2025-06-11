
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
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {hasChildren && !collapsed && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
          
          {(!hasChildren || collapsed) && (
            <div className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </div>
          )}
          
          {hasChildren && !collapsed && (
            <div className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </div>
          )}
          
          {!collapsed && (
            <span className="truncate text-sm font-medium">{item.title}</span>
          )}
        </div>
        
        {/* Hover indicator */}
        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r" />
      </div>

      {/* Children */}
      {!collapsed && hasChildren && (
        <AnimatePresence>
          {isExpanded && (
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
    </div>
  );
};
