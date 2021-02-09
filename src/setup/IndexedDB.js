/* eslint-disable import/prefer-default-export */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { openDB } from 'idb';

const DATABASE_NAME = 'swgoh_counters';
const DATABASE_VERSION = 2;

/**
 * Initialize the IndexedDB.
 * see https://developers.google.com/web/ilt/pwa/lab-indexeddb
 * for information as to why we use switch w/o breaks for migrations.
 * add to the database version and add a switch case each time you need to
 * change migrations
 */
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  async upgrade(db, oldVersion, newVersion, transaction) {
    switch (oldVersion) {
      case 0:
        // a placeholder case so that the switch block will
        // execute when the database is first created
        // (oldVersion is 0)
      case 1:
        await db.createObjectStore('counterStubs', { keyPath: 'id' }, { unique: true });
        await db.createObjectStore('counters', { keyPath: 'id' }, { unique: true });
        // transaction.objectStore('counterStubs');
        // store.createIndex('counterVersion', 'counterVersion');
        // store.createIndex('rightSquadStubs', ['rightSquadStubs']);
    }
  },
});

class DBService {
  get(tablespace, key) {
    return dbPromise.then(
      getDB => getDB
        .transaction(tablespace)
        .objectStore(tablespace)
        .get(key),
    ).catch((error) => {
      console.error(error);
    });
  }

  getAll(tablespace, indexName, index = []) {
    return dbPromise.then(
      getAllDB => getAllDB
        .transaction(tablespace)
        .objectStore(tablespace)
        .index(indexName)
        .getAll(index),
    ).catch((error) => {
      console.error(error);
    });
  }

  put(tablespace, object, key = null) {
    return dbPromise.then((putDB) => {
      if (key) {
        return putDB
          .transaction(tablespace, 'readwrite')
          .objectStore(tablespace)
          .put(object, key);
      }
      return putDB
        .transaction(tablespace, 'readwrite')
        .objectStore(tablespace)
        .put(object);
    }).catch((error) => {
      console.error(error);
    });
  }

  delete(tablespace, key) {
    return dbPromise.then(
      deleteDB => deleteDB
        .transaction(tablespace, 'readwrite')
        .objectStore(tablespace)
        .delete(key),
    ).catch((error) => {
      console.error(error);
    });
  }

  deleteAll(tablespace) {
    return dbPromise.then(
      deleteAllDB => deleteAllDB
        .transaction(tablespace, 'readwrite')
        .objectStore(tablespace)
        .clear(),
    ).catch((error) => {
      console.error(error);
    });
  }
}

export const IDBService = new DBService();
