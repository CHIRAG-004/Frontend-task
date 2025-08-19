import {
  categoryStoreHandler,
  serviceStoreHandler,
  userStoreHandler,
} from "~/dummyData/handlers/storeHndlers";


export default defineNuxtPlugin(async () => {
  let db: IDBDatabase | null = null;
  const initializeDatabase = async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("appointmentSystemDB");

      openRequest.onupgradeneeded = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = (event.target as IDBOpenDBRequest).transaction;
        // Create User store
        if (!db.objectStoreNames.contains("User")) {
          const userStore = db.createObjectStore("User", { keyPath: "id" });
          userStore.createIndex("role", "role");
          await userStoreHandler(tx!);
        }

        // Create Appointment store
        if (!db.objectStoreNames.contains("Appointment")) {
          const appointmentStore = db.createObjectStore("Appointment", {
            keyPath: "id",
          });
          appointmentStore.createIndex("status", "status");
        }

        // Create Payment store
        if (!db.objectStoreNames.contains("Payment")) {
          db.createObjectStore("Payment", { keyPath: "id" });
        }

        // Create Review & Rating store
        if (!db.objectStoreNames.contains("ReviewAndRating")) {
          db.createObjectStore("ReviewAndRating", { keyPath: "id" });
        }

        // Create Provider Service store
        if (!db.objectStoreNames.contains("ProviderService")) {
          const providerStore = db.createObjectStore("ProviderService", {
            keyPath: "id",
          });
          providerStore.createIndex("category", "category");
          providerStore.createIndex("subCategory", "subCategory");
          await serviceStoreHandler(tx!);
        }

        //Create Image store
        if (!db.objectStoreNames.contains("Images")) {
          db.createObjectStore("Images", {
            keyPath: "id",
          });
          // await imageStoreHandler(tx!);
        }

        //Create Category store
        if (!db.objectStoreNames.contains("Categories")) {
          db.createObjectStore("Categories", {
            keyPath: "id",
            autoIncrement: true,
          });
          await categoryStoreHandler(tx!);
        }
      };

      openRequest.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;

        resolve(db);
      };

      openRequest.onerror = () => reject(openRequest.error);
    });
  };

  // Initialize database when plugin loads
  try {
    db = await initializeDatabase();
  } catch (error) {
    console.error("IndexedDB initialization failed:", error);
    throw error;
  }

  return {
    provide: {
      db,
    },
  };
});
