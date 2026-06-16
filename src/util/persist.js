/**
 * Конфигурация Redux Persist для сохранения состояния (админ-версия)
 * 
 * Особенности:
 * - Хранилище: sessionStorage (данные живут до закрытия вкладки)
 * - Ключ хранилища: "admin" (вместо "user")
 * - Шифрование: AES-шифрование с использованием encryptTransform
 * - Ключ шифрования: из переменной окружения VITE_CRYPTO_KEY
 * 
 * Persist конфигурация:
 * - key: "admin" - ключ для хранения
 * - version: 1 - версия схемы данных
 * - storage: sessionStorage - тип хранилища
 * 
 * Обработка ошибок:
 * - onError: автоматическая очистка хранилища при ошибках дешифрования
 * 
 * Объединенные редюсеры:
 * - global (persisted), auth, dashboard
 * 
 * Отключена сериализуемость для поддержки несериализуемых значений
 */

import sessionStorage from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { globalReducer } from "./globalSlice";
import { authReducer } from "../pages/auth/AuthSlice";
import { dashboardReducer } from "../pages/dashboard/DashboardSlice";

const persistConfig = {
    key: "admin",
    version: 1,
    storage: sessionStorage,
    transforms: [
        encryptTransform({
            secretKey: '019a1d16-0ca4-7555-a814-bb733993cde7',
            onError: function (error) {
                if (error.message.includes("decrypt")) {
                    sessionStorage.removeItem("persist:user");
                }
            },
        }),
    ],
};

const persistedReducer = persistReducer(persistConfig, globalReducer);

export const store = configureStore({
    reducer: {
        global: persistedReducer,
        auth: authReducer,
        dashboard: dashboardReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);