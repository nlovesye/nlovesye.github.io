import type { IDbStoreName } from '@/models';
import { createIDB, createObjectStore } from '@nlovesye/utils';

const objectStoreNames: IDbStoreName[] = ['video_player'];

const idb = createIDB<IDbStoreName>({ name: 'ns', initIDBObjectStore });

function initIDBObjectStore(db: IDBDatabase) {
  objectStoreNames.forEach((storeName) => {
    createObjectStore(db, storeName);
  });
}

export { idb };
