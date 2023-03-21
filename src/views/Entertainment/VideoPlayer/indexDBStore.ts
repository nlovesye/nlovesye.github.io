import type { IDbStoreName } from '@/models';
import { idb } from '@/utils';

const get = async <T>(db: IDBObjectStore, k: string | number) => {
  return new Promise<T>((resolve, reject) => {
    const handle = db.get(k);
    handle.onsuccess = (ev) => {
      resolve((ev.target as IDBRequest<T>).result);
    };
    handle.onerror = reject;
  });
};

export function initIndexDBStore<T extends Record<KeyPath, any>, KeyPath extends string = string>(
  storeName: IDbStoreName,
) {
  const getByKey = async (keyPathValue: KeyPath) => {
    return await idb().then(async (db) => {
      return await get<T>(db.getObjectStore(storeName, 'readonly'), keyPathValue);
    });
  };

  const getData = async () => {
    return await idb().then(async (db) => {
      const store = db.getObjectStore(storeName, 'readonly');
      return new Promise<T[]>((resolve, reject) => {
        const handle = store.getAll();
        handle.onsuccess = (ev) => {
          resolve((ev.target as IDBRequest<T[]>).result);
        };
        handle.onerror = reject;
      });
    });
  };

  async function putData(data: T, k: KeyPath) {
    return await idb()
      .then(async (db) => {
        const store = db.getObjectStore(storeName, 'readwrite');
        return new Promise<T>((resolve, reject) => {
          const handle = store.put(data, k);
          handle.onsuccess = (ev) => {
            resolve((ev.target as IDBRequest<T>).result);
          };
          handle.onerror = reject;
        });
      })
      .catch(() => {});
  }

  async function clearData() {
    return await idb().then(async (db) => {
      const store = db.getObjectStore(storeName, 'readwrite');
      return new Promise<T>((resolve, reject) => {
        const handle = store.clear();
        handle.onsuccess = (ev) => {
          resolve((ev.target as IDBRequest<T>).result);
        };
        handle.onerror = reject;
      });
    });
  }

  const deleteStore = async () => {
    return await idb().then((db) => {
      return db.deleteObjectStore(storeName);
    });
  };

  return { getByKey, getData, putData, clearData, deleteStore };
}
