import type { DbStoreName } from '@/models';
import setupDB from '@/utils/indexDB';

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
  storeName: DbStoreName,
) {
  const getByKey = async (keyPathValue: KeyPath) => {
    return await setupDB().then(async (db) => {
      return await get<T>(db.getStore(storeName, 'readonly'), keyPathValue);
    });
  };

  const getData = async () => {
    return await setupDB().then(async (db) => {
      const store = db.getStore(storeName, 'readonly');
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
    return await setupDB()
      .then(async (db) => {
        const store = db.getStore(storeName, 'readwrite');
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
    return await setupDB().then(async (db) => {
      const store = db.getStore(storeName, 'readwrite');
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
    return await setupDB().then((db) => {
      return db.deleteStore(storeName);
    });
  };

  return { getByKey, getData, putData, clearData, deleteStore };
}
