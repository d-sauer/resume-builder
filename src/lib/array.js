/** Move an item within an array, clamping at the ends. Shared by the editors. */
export function move(list, index, by) {
  const target = index + by
  if (target < 0 || target >= list.length) return
  const [item] = list.splice(index, 1)
  list.splice(target, 0, item)
}
