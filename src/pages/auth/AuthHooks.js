/**
 * Хуки для валидации полей авторизации администратора
 * 
 * Хуки:
 * 
 * 1. useEmailHandle - обработка email
 *    - Разрешены: буквы, цифры, _, @, .
 *    - Валидация: формат email и длина ≤ 320
 *    - Обновляет Redux состояние (email.value и email.error)
 * 
 * 2. usePasswordHandle - обработка пароля
 *    - Разрешены: буквы, цифры, спецсимволы (!@#$?%&{}_)
 *    - Валидация: длина 8-64 символа
 *    - Автоматический trim
 * 
 * Отличия от пользовательской версии:
 * - Нет usePasswordRepHandle (повтор пароля)
 * - Нет useCodeHandle (код подтверждения)
 * - Нет useTimer (таймер)
 * - Упрощенная версия только для входа
 * 
 * Используется в AuthPage
 */

import { useDispatch } from "react-redux";
import { setAuthError, setAuthField } from "./AuthSlice";

export const useEmailHandle = () => {
    const dispatch = useDispatch();

    const emailHandle = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_@.]/g, "");
        dispatch(setAuthField({ field: 'email', value }));

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(value) || value.length > 320) {
            dispatch(setAuthError({ field: 'email', error: true }));
        } else {
            dispatch(setAuthError({ field: 'email', error: false }));
        }
    };

    return emailHandle;
}

export const usePasswordHandle = () => {
    const dispatch = useDispatch();

    const passwordHandle = (e) => {
        dispatch(setAuthField({ field: 'password', value: e.target.value.replace(/[^a-zA-Z0-9!@#$?%&{}_]/g, "").trim() }))

        if (e.target.value.length < 8 || e.target.value.length > 64) {
            dispatch(setAuthError({ field: 'password', error: true }))
        } else {
            dispatch(setAuthError({ field: 'password', error: false }))
        }
    }

    return passwordHandle;
}