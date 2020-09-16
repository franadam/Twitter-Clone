export const updateObject = (oldObj, updatedProperties) => {
  return {
    ...oldObj,
    ...updatedProperties,
  };
};
