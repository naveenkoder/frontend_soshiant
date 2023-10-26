export const findParent = (routes, id, list = []) => {
  const parent = routes.find((i) => i.id === id)?.parent;
  if (parent === undefined) return list;
  else {
    list.push(parent);
    return findParent(routes, parent, list);
  }
};
export const findParentName = (routes, id) => {
  const parent = routes.find((i) => String(i.id) === String(id))?.parent;
  const parentName = routes.find((i) => String(i.id) === String(parent))?.name;
  return parentName;
};

export const findUniqueId = (routes, id) => {
  const parent = routes.find((i) => String(i.id) === String(id))?.parent;
  const uniqueId = routes.find((i) => String(i.id) === String(parent))?.unique_id;
  return uniqueId;
};

function findChildren(routes, id) {
  const descendants = [];
  for (const route of routes) {
    if (route.parent.toString() === id.toString()) {
      descendants.push(route.id);
      descendants.push(...findChildren(routes, route.id));
    }
  }
  return descendants;
}

export const SearchRoute = (routes, value) => {
  if (value === "") return routes;
  const foundItems = routes
    .filter((i) => i.name.toLowerCase().includes(value.toLowerCase()))
    .map((i) => i.id);
  const children = foundItems.map((id) => findChildren(routes, id)).flat();
  const parents = foundItems.map((id) => findParent(routes, id)).flat();
  const treeItems = foundItems.concat(parents).concat(children);
  return routes.filter((i) => treeItems.includes(i.id));
};
