import { useState, useMemo, useCallback } from "react";
import { PanelLayout } from "@/layouts/PanelLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import { LocationTreeNode, type TreeNode } from "@/components/locations/LocationTreeNode";
import { LocationDetailPanel } from "@/components/locations/LocationDetailPanel";
import { AddNodeDialog } from "@/components/locations/AddNodeDialog";
import { RenameNodeDialog } from "@/components/locations/RenameNodeDialog";
import { DeleteNodeDialog } from "@/components/locations/DeleteNodeDialog";
import { toast } from "sonner";

const initialTree = (): TreeNode => ({
  id: "org-root",
  name: "Paapeli Corp",
  type: "organization",
  children: [],
});

// Collect all node ids that match search or are ancestors of matches
const collectMatchingIds = (node: TreeNode, query: string): Set<string> => {
  const result = new Set<string>();
  const walk = (n: TreeNode): boolean => {
    const selfMatch = n.name.toLowerCase().includes(query.toLowerCase());
    let childMatch = false;
    if (n.children) {
      for (const child of n.children) {
        if (walk(child)) childMatch = true;
      }
    }
    if (selfMatch || childMatch) {
      result.add(n.id);
      return true;
    }
    return false;
  };
  walk(node);
  return result;
};

// Find a node by id
const findNode = (root: TreeNode, id: string): TreeNode | null => {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
};

// Deep clone + transform
const mapTree = (root: TreeNode, fn: (node: TreeNode) => TreeNode | null): TreeNode | null => {
  const mapped = fn(root);
  if (!mapped) return null;
  if (mapped.children) {
    mapped.children = mapped.children
      .map((c) => mapTree(c, fn))
      .filter(Boolean) as TreeNode[];
  }
  return mapped;
};

let nextId = 1;

const Locations = () => {
  const { t, isRTL } = useLanguage();
  const [tree, setTree] = useState<TreeNode>(initialTree);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["org-root"]));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addParentType, setAddParentType] = useState<TreeNode["type"] | null>(null);
  const [addParentId, setAddParentId] = useState<string | null>(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<TreeNode | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TreeNode | null>(null);

  const matchingIds = useMemo(
    () => (searchQuery ? collectMatchingIds(tree, searchQuery) : new Set<string>()),
    [tree, searchQuery]
  );

  // Auto-expand matching nodes when searching
  useMemo(() => {
    if (searchQuery && matchingIds.size > 0) {
      setExpandedNodes((prev) => new Set([...prev, ...matchingIds]));
    }
  }, [matchingIds, searchQuery]);

  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // Add node
  const handleAdd = (name: string, type: "location" | "area" | "asset") => {
    const newNode: TreeNode = {
      id: `node-${Date.now()}-${nextId++}`,
      name,
      type,
      children: type === "asset" ? undefined : [],
    };

    setTree((prev) => {
      const parentId = addParentId || "org-root";
      const updated = JSON.parse(JSON.stringify(prev)) as TreeNode;
      const parent = findNode(updated, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(newNode);
      }
      return updated;
    });

    setExpandedNodes((prev) => new Set([...prev, addParentId || "org-root"]));
    toast.success(t("success"));
  };

  // Rename node
  const handleRename = (newName: string) => {
    if (!renameTarget) return;
    setTree((prev) => {
      const updated = JSON.parse(JSON.stringify(prev)) as TreeNode;
      const node = findNode(updated, renameTarget.id);
      if (node) node.name = newName;
      return updated;
    });
    if (selectedNode?.id === renameTarget.id) {
      setSelectedNode({ ...renameTarget, name: newName });
    }
    toast.success(t("success"));
  };

  // Delete node
  const handleDelete = () => {
    if (!deleteTarget) return;
    setTree((prev) => {
      const updated = mapTree(JSON.parse(JSON.stringify(prev)), (n) =>
        n.id === deleteTarget.id ? null : n
      );
      return updated || initialTree();
    });
    if (selectedNode?.id === deleteTarget.id) {
      setSelectedNode(null);
    }
    setDeleteDialogOpen(false);
    toast.success(t("deleted"));
  };

  // Top-level add button
  const handleTopAddClick = () => {
    setAddParentId("org-root");
    setAddParentType("organization");
    setAddDialogOpen(true);
  };

  // Context menu: add child
  const handleAddChild = (node: TreeNode) => {
    setAddParentId(node.id);
    setAddParentType(node.type);
    setAddDialogOpen(true);
  };

  // Context menu: rename
  const handleRenameClick = (node: TreeNode) => {
    setRenameTarget(node);
    setRenameDialogOpen(true);
  };

  // Context menu: delete
  const handleDeleteClick = (node: TreeNode) => {
    setDeleteTarget(node);
    setDeleteDialogOpen(true);
  };

  return (
    <PanelLayout pageTitle={t("locations")}>
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">{t("locationsSubtitle")}</p>
      </div>
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Left: Tree */}
        <Card className="w-80 shrink-0 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{t("allLocations")}</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleTopAddClick}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search
                className="absolute top-2.5 h-4 w-4 text-muted-foreground"
                style={{ [isRTL ? "right" : "left"]: 8 }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="h-9 text-sm"
                style={{ [isRTL ? "paddingRight" : "paddingLeft"]: 32 }}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1 px-2 pb-2">
            <LocationTreeNode
              node={tree}
              expandedNodes={expandedNodes}
              selectedNodeId={selectedNode?.id || null}
              searchQuery={searchQuery}
              matchingIds={matchingIds}
              onSelect={setSelectedNode}
              onToggle={toggleExpand}
              onRename={handleRenameClick}
              onAddChild={handleAddChild}
              onDelete={handleDeleteClick}
            />
          </ScrollArea>
        </Card>

        {/* Right: Details */}
        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <LocationDetailPanel node={selectedNode} />
          </ScrollArea>
        </Card>
      </div>

      {/* Dialogs */}
      <AddNodeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        parentType={addParentType}
        onAdd={handleAdd}
      />
      <RenameNodeDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={renameTarget?.name || ""}
        onRename={handleRename}
      />
      <DeleteNodeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        nodeName={deleteTarget?.name || ""}
        onConfirm={handleDelete}
      />
    </PanelLayout>
  );
};

export default Locations;
