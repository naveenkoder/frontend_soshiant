export function getParentsName(routes, id) {
    const parentNames = [];

    const getParentName = (currentId) => {
      const item = routes.find((dataItem) => {
        return String(dataItem.id) === String(currentId);
      });
      if (item) {
        parentNames.unshift(item.name); // Add the parent name to the beginning of the array
        if (item.parent !== 0) {
          getParentName(item.parent); // Recursively call getParentName with the parent id
        }
      }
    };

    getParentName(id);
    return parentNames;
  }