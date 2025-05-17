export function saveObject(modelName: string, object: object, id?: string) {
  if (!object) {
    throw new Error("Object is null or undefined");
  }
  if (!modelName) {
    throw new Error("Model name is null or undefined");
  }
  const json = JSON.stringify(object);
  const key = `${modelName}:${id || window.crypto.randomUUID()}`;
  localStorage.setItem(key, json);
  return key;
}

export function getObject(modelName: string, id: string) {
  if (!modelName) {
    throw new Error("Model name is null or undefined");
  }
  if (!id) {
    throw new Error("ID is null or undefined");
  }
  const key = `${modelName}:${id}`;
  const json = localStorage.getItem(key);
  if (!json) {
    return null;
  }
  return JSON.parse(json);
}

export function deleteObject(modelName: string, id: string) {
  if (!modelName) {
    throw new Error("Model name is null or undefined");
  }
  if (!id) {
    throw new Error("ID is null or undefined");
  }
  const key = `${modelName}:${id}`;
  localStorage.removeItem(key);
}

export function getAllObjects(modelName: string) {
  if (!modelName) {
    throw new Error("Model name is null or undefined");
  }
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(modelName)
  );
  const objects = keys.map((key) => JSON.parse(localStorage.getItem(key)!));
  return objects;
}

export function clearAllObjects(modelName: string) {
  if (!modelName) {
    throw new Error("Model name is null or undefined");
  }
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(modelName)
  );
  keys.forEach((key) => localStorage.removeItem(key));
}

export function clearAll() {
  localStorage.clear();
}
