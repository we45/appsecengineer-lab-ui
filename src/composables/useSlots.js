export function useSlots(slots, filters = []) {
  return Object.keys(slots)
    .filter((ele) => !ele.startsWith('_') && !filters.includes(ele))
    .map((ele) => {
      return {
        name: ele
      }
    })
}
