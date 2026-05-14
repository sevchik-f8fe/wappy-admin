/**
 * Redux Slice для глобального состояния (админ-версия)
 * 
 * Состояние:
 * @property {Object|null} admin - данные администратора (null по умолчанию)
 * @property {string|null} token - JWT токен аутентификации (null по умолчанию)
 * 
 * Отличия от пользовательской версии:
 * - Используется 'admin' вместо 'user'
 * - Нет поля 'dialog'
 * - Упрощенная структура для административной панели
 * 
 * Reducers:
 * @function setGlobalData - Универсальный reducer для обновления любого поля
 *   Принимает { field, value } и обновляет state[field] = value
 * 
 * Экспорт: actions (setGlobalData) и reducer (globalReducer)
 */

import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        admin: null,
        token: null
    },
    reducers: {
        setGlobalData: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
    }
});

export const { setGlobalData } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;