/**
 * Icons used to visualize an issue priority, from the lowest to the highest priority.
 * Gropius priorities are template defined, only their numerical `value` is comparable across
 * templates, so the icon is derived from that value.
 */
const priorityIcons = ["mdi-chevron-down", "mdi-equal", "mdi-chevron-up", "mdi-chevron-double-up"];

/**
 * Selects the icon visualizing an issue priority.
 *
 * @param value the `value` of the issue priority
 * @returns the mdi icon name
 */
export function issuePriorityIcon(value: number): string {
    const index = Math.min(Math.max(Math.round(value), 0), priorityIcons.length - 1);
    return priorityIcons[index];
}
