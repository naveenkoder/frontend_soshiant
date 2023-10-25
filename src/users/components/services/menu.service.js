function findDescendants(id, routes, processedNodes = {}) {
  const descendants = [];
  for (const route of routes) {
    if (
      route.parent.toString() === id.toString() &&
      !processedNodes[route.id]
    ) {
      descendants.push(route);
      processedNodes[route.id] = true;
      descendants.push(...findDescendants(route.id, routes, processedNodes));
    }
  }
  return descendants;
}

export function tree(menu, access = [], parent = 0, name = "Features") {
  const children = menu.filter(
    (item) => item.parent.toString() === parent.toString() && item.period === ""
  );
  const descendants = findDescendants(parent, menu);
  const Res = {};
  Res.title = name;
  Res.key = parent.toString();

  const hasAccess = access.map(String).includes(parent.toString());
  const features = descendants.filter((item) => item.period !== "");

  const someChildrenHaveAccess = features.some((item) =>
    access.map(String).includes(item.id.toString())
  );
  const isNotFeature = features.length > 0;
  Res.disabled = !hasAccess;
  Res.selectable = descendants.every(i => i.period !== "");
  if (someChildrenHaveAccess && isNotFeature) {
    Res.disabled = false;
  }
  const res = [];
  for (const child of children) {
    if (child.top_ten)
      res.push({
        title: child.name,
        key: child.id,
        disabled: !access.map(String).includes(parent.toString()),
      });
    else res.push(tree(menu, access, child.id, child.name));
  }
  Res.children = res;
  return Res;
}
