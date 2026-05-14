/**
 * Redux Slice для аутентификации администратора
 * 
 * Состояние:
 * @property {Object} email - { value: string, error: boolean }
 * @property {Object} password - { value: string, error: boolean }
 * @property {boolean} loading - Флаг загрузки
 * 
 * Reducers:
 * @function setAuthField - Обновление полей с value (email, password)
 * @function setAuthError - Обновление ошибок полей
 * @function setSimpleField - Обновление простых полей (loading)
 * 
 * Отличия от пользовательской версии:
 * - Нет passwordRep (повтор пароля)
 * - Нет code (код подтверждения)
 * - Нет timer (таймер)
 * - Нет step (шаги)
 * - Нет confOk/persOk (соглашения)
 * - Упрощенная структура только для входа
 * 
 * Проверка hasOwnProperty перед обновлением для безопасности
 * Используется в AuthPage и AuthHooks
 */

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: { value: '', error: false },
        password: { value: '', error: false },

        loading: false,
    },
    reducers: {
        setAuthField: (state, action) => {
            const { field, value } = action.payload;
            if (state.hasOwnProperty(field)) state[field].value = value;
        },
        setAuthError: (state, action) => {
            const { field, error } = action.payload;
            if (state.hasOwnProperty(field)) state[field].error = error;
        },
        setSimpleField: (state, action) => {
            const { field, value } = action.payload;
            if (state.hasOwnProperty(field)) state[field] = value;
        }
    }
});

export const { setAuthField, setAuthError, setSimpleField } = authSlice.actions;

export const authReducer = authSlice.reducer;