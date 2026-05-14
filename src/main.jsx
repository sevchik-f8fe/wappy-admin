/**
 * Точка входа в React-приложение (админ-панель)
 * 
 * Выполняет:
 * - Монтирование React-приложения в DOM элемент с id="root"
 * - Подключение глобальной темы Material-UI (ThemeProvider)
 * - Импорт стилей (index.css)
 * 
 * Порядок оберток (от внешней к внутренней):
 * 1. StrictMode - дополнительная проверка кода в development режиме
 * 2. ThemeProvider - MUI тема (фиолетовая цветовая схема)
 * 3. App - корневой компонент приложения
 * 
 * Особенности:
 * - Используется React 18+ (createRoot API)
 * - Тема идентична предыдущей версии (фиолетовые оттенки)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@emotion/react'
import { theme } from './util/theme.js'

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
