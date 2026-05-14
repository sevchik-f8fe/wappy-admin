/**
 * Поле ввода для формы авторизации администратора
 * 
 * Обертка над Material-UI TextField с предустановленными стилями:
 * - Размер: small
 * - Цвет текста: #F2EBFB (светлый)
 * - Динамический цвет边框 (primary/error)
 * - Полная ширина (minWidth: 100%)
 * 
 * Props:
 * @param {string} help - Текст подсказки/ошибки (helperText)
 * @param {string} label - Заголовок поля
 * @param {boolean} error - Флаг ошибки
 * @param {string} value - Значение поля
 * @param {function} onchange - Обработчик изменения
 * @param {string} type - Тип поля (text, password, email)
 * @param {string} placeholder - Плейсхолдер
 * 
 * Идентичен пользовательской версии, используется в админ-панели
 */

import React from 'react'; //for tests

import { TextField } from "@mui/material";

export const AuthField = ({ help, label, error, value, onchange, type, placeholder }) => {
    return (
        <TextField
            size="small"
            value={value}
            onChange={onchange}
            sx={{ minWidth: '100%' }}
            type={type}
            variant="outlined"
            label={label}
            placeholder={placeholder}
            color={error ? 'error' : 'primary'}
            error={error}
            helperText={help}
            InputProps={{
                style: {
                    color: '#F2EBFB',
                },
            }}
        />
    );
}