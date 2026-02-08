import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Building2,
  Factory,
  ChevronRight,
  ChevronDown,
  Cpu,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TreeNode {
  id: string;
  name: string;
  type: "organization" | "location" | "area" | "asset";
  children?: TreeNode[];
}

interface LocationTreeNodeProps {
  node: TreeNode;
  depth?: number;
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  searchQuery: string;
  matchingIds: Set<string>;
  onSelect: (node: TreeNode) => void;
  onToggle: (nodeId: string) => void;
  onRename: (node: TreeNode) => void;
  onAddChild: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case "organization":
      return <Building2 className="h-4 w-4 text-primary" />;
    case "location":
      return <MapPin className="h-4 w-4 text-muted-foreground" />;
    case "area":
      return <Factory className="h-4 w-4 text-muted-foreground" />;
    case "asset":
      return <Cpu className="h-4 w-4 text-muted-foreground" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const canHaveChildren = (type: string) => {
  return type !== "asset";
};

export const LocationTreeNode = ({
  node,
  depth = 0,
  expandedNodes,
  selectedNodeId,
  searchQuery,
  matchingIds,
  onSelect,
  onToggle,
  onRename,
  onAddChild,
  onDelete,
}: LocationTreeNodeProps) => {
  const { t, isRTL } = useLanguage();
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const isMatch = matchingIds.has(node.id);

  // If searching and this node is not in matching set, hide it
  if (searchQuery && !isMatch) return null;

  // Highlight matching text
  const renderName = () => {
    if (!searchQuery) return node.name;
    const idx = node.name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return node.name;
    return (
      <>
        {node.name.slice(0, idx)}
        <mark className="bg-primary/30 text-foreground rounded-sm px-0.5">{node.name.slice(idx, idx + searchQuery.length)}</mark>
        {node.name.slice(idx + searchQuery.length)}
      </>
    );
  };

  return (
    <div>
      <div className="flex items-center group">
        <button
          onClick={() => {
            onSelect(node);
            if (hasChildren) onToggle(node.id);
          }}
          className={`flex-1 flex items-center gap-2 py-1.5 px-2 rounded-md text-sm transition-colors hover:bg-accent ${
            isSelected ? "bg-primary/10 text-primary" : ""
          }`}
          style={{ [isRTL ? "paddingRight" : "paddingLeft"]: `${depth * 16 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          {getNodeIcon(node.type)}
          <span className="truncate flex-1 text-start">{renderName()}</span>
        </button>
        {/* Context menu - only for non-organization */}
        {node.type !== "organization" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-40">
              <DropdownMenuItem onClick={() => onRename(node)}>
                <Pencil className="h-3.5 w-3.5" />
                {t("rename")}
              </DropdownMenuItem>
              {canHaveChildren(node.type) && (
                <DropdownMenuItem onClick={() => onAddChild(node)}>
                  <Plus className="h-3.5 w-3.5" />
                  {t("addChild")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(node)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {hasChildren && isExpanded && node.children!.map((child) => (
        <LocationTreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedNodes={expandedNodes}
          selectedNodeId={selectedNodeId}
          searchQuery={searchQuery}
          matchingIds={matchingIds}
          onSelect={onSelect}
          onToggle={onToggle}
          onRename={onRename}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
