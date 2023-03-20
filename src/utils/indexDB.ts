import { INDEX_NAME } from '@/config';
import type { DbStoreName } from '@/models';

interface InitDBInfo {
  name: string;
  version: number;
  timeout: number;
}

interface DB extends IDBDatabase {
  deleteStore: (storeName: string) => boolean;
  getStore: (storeName: string, mode: IDBTransactionMode) => IDBObjectStore;
}

interface InitDBFn {
  (version?: number): Promise<IDBDatabase>;
}

const DB_VERSION = 1;

// 初始化indexdb
function createInitDB(
  options: Pick<InitDBInfo, 'name'> & Partial<Omit<InitDBInfo, 'name'>>,
): InitDBFn {
  const { version = DB_VERSION, timeout = 1500, name } = options;
  // 初始化 打开数据库请求
  let reqOpenDB: IDBOpenDBRequest | null;
  let timer: NodeJS.Timeout;

  return (coverVersion?: number) =>
    new Promise((resolve, reject) => {
      const indexedDB = compatIndexedDB();

      if (!reqOpenDB) {
        reqOpenDB = indexedDB.open(name, coverVersion ?? version);
      }

      reqOpenDB.onsuccess = (ev) => {
        const db = (ev.currentTarget as IDBOpenDBRequest).result;
        reqOpenDB = null;
        resolve(db); // 数据库对象
      };

      reqOpenDB.onerror = (ev) => {
        reqOpenDB = null;
        reject((ev.target as IDBOpenDBRequest).error);
      };

      reqOpenDB.onupgradeneeded = (ev) => {
        const db = (ev.currentTarget as IDBOpenDBRequest).result;
        reqOpenDB = null;
        createAllStore(db);
        resolve(db);
      };

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        reject('Request IndexDB Timeout');
      }, timeout);
    });
}

const initDB = createInitDB({ name: INDEX_NAME });

// 创建store(ObjectStore)
const createStore = (
  db: IDBDatabase,
  storeName: string,
  keyPathOptions?: IDBObjectStoreParameters,
  indexList?: {
    name: string;
    options?: IDBIndexParameters;
  }[],
) => {
  // `createStore` must be called when the database is `onupgradeneeded` or `onversionchange`.
  if (db.objectStoreNames.contains(storeName)) {
    return false;
  }
  const store = db.createObjectStore(storeName, keyPathOptions);
  indexList?.forEach(({ name, options }) => {
    store.createIndex(name, name, options);
  });
  return store;
};

// 删除store(ObjectStore)
const deleteStore = (db: IDBDatabase, storeName: string) => {
  if (!db.objectStoreNames.contains(storeName)) {
    return false;
  }
  db.deleteObjectStore(storeName);
  console.info(`[indexedDB] Store ${storeName} is deleted!`);
  return true;
};

// 建立事务获取store(ObjectStore)
const getStore = (db: IDBDatabase, storeName: string, mode: IDBTransactionMode) => {
  let tx: IDBTransaction;
  try {
    tx = db.transaction(storeName, mode);
  } catch (err) {
    throw new Error(`[IndexDB] Store named ${storeName} cannot be found in the database`);
  }
  return tx.objectStore(storeName);
};

const setupDB = (() => {
  let _db: DB | null;

  const addDBFcn = (db: DB) => {
    db.deleteStore = (storeName) => deleteStore(db as IDBDatabase, storeName);
    db.getStore = (storeName, mode) => getStore(db as IDBDatabase, storeName, mode);
  };

  const addDBListener = (db: DB) => {
    // `addDBListener` must be called when the database is opened.
    db.onerror = (ev) => console.error(ev.target);
    db.onversionchange = (ev) => {
      _db = ev.currentTarget as DB;
      addDBFcn(_db);
      createAllStore(_db);
    };
    db.onabort = () => {
      _db = null;
    };
    db.onclose = () => {
      _db = null;
    };
  };

  return async () => {
    if (_db) {
      return _db;
    }
    return await initDB().then((db) => {
      const iDb = db as DB;
      addDBFcn(iDb);
      _db = iDb;
      addDBListener(iDb);
      window.onbeforeunload = () => iDb.close();
      return iDb;
    });
  };
})();

export default setupDB;

/**
 * @description 兼容浏览器
 * @returns {IDBFactory}
 */
function compatIndexedDB(): IDBFactory {
  return window.indexedDB;
}

function createAllStore(db: IDBDatabase) {
  const names: DbStoreName[] = ['video_player'];
  names.forEach((name) => {
    createStore(db, name);
  });
}
