// Shared UI Components for consistent page design across the application
// Based on Product Activity page patterns

export { PageHeader } from "./PageHeader";
export { StatsCard } from "./StatsCard";
export { StatsGrid } from "./StatsGrid";
export { PageFilters } from "./PageFilters";
export { PageFooter } from "./PageFooter";
export { PageContainer } from "./PageContainer";
export { AnimatedTable, AnimatedTableRow } from "./AnimatedTable";

/**
 * UI Framework Documentation
 * ==========================
 * 
 * This framework provides reusable components based on the Product Activity page design.
 * All components support multiple color themes and include Framer Motion animations.
 * 
 * Available Colors:
 * - green (default)
 * - blue
 * - purple
 * - orange
 * - coral (rose-based)
 * - teal
 * - red
 * 
 * Animation Patterns:
 * 1. Entry animations: fade-in with y-translate (opacity: 0, y: 20 -> opacity: 1, y: 0)
 * 2. Staggered delays: index * 0.1 for list items
 * 3. Hover effects: scale, y-translate, glow shadows
 * 4. Icon animations: rotate on hover, pulse/wiggle for attention
 * 5. Spring transitions for badges and interactive elements
 * 
 * Component Structure for Pages:
 * ```tsx
 * <AppLayout>
 *   <PageContainer isLoading={isLoading} gradientFrom="from-green-50">
 *     <PageHeader
 *       title="Page Title"
 *       icon={SomeIcon}
 *       breadcrumbs={[{ label: "Module" }, { label: "Page", isCurrentPage: true }]}
 *       itemCount={items.length}
 *       itemLabel="items"
 *       accentColor="green"
 *       onRefresh={handleRefresh}
 *       onExport={handleExport}
 *       onAdd={handleAdd}
 *       addButtonLabel="Add New Item"
 *     />
 *     
 *     <StatsGrid stats={statsConfig} columns={4} />
 *     
 *     <PageFilters
 *       searchTerm={searchTerm}
 *       onSearchChange={setSearchTerm}
 *       filters={[
 *         { type: "select", placeholder: "Category", value: category, onChange: setCategory, options: [...] },
 *         { type: "checkbox", label: "Featured Only", checked: featured, onChange: setFeatured, activeBadge: "Active" }
 *       ]}
 *       accentColor="green"
 *     />
 *     
 *     <AnimatedTable headers={<>...</>}>
 *       {items.map((item, index) => (
 *         <AnimatedTableRow key={item.id} index={index}>
 *           ...
 *         </AnimatedTableRow>
 *       ))}
 *     </AnimatedTable>
 *     
 *     <PageFooter
 *       currentPage={page}
 *       totalPages={totalPages}
 *       totalItems={totalItems}
 *       itemsPerPage={10}
 *       onPageChange={setPage}
 *       itemLabel="products"
 *       accentColor="green"
 *     />
 *   </PageContainer>
 * </AppLayout>
 * ```
 * 
 * Color Theme Assignments (from memory):
 * - Update Stock: Vista Blue (#96A3CC)
 * - Invoice Generate: Champagne Pink (#F4DDCB)
 * - Sales Report: Lion (#A8884D)
 * - Inventory Report: Xanthous (#ECBB48)
 * - Profit/Loss Report: Rosy Brown (#BF8B85)
 * - Periodic Reports: Pale Purple (#E3D8F1)
 * - Product Activity: Green theme
 */
