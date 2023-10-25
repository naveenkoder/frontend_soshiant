export const findChildren = (routes = [], id, list = []) => {
  const children = routes.filter((i) => String(i.parent) === String(id));
  if (children.length === 0) return list;
  else {
    list = list.concat(children).flat();
    return findChildren(routes, children, list);
  }
};
