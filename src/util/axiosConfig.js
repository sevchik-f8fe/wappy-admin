/**
 * Настройка Axios-клиента для HTTP-запросов к API (админ-версия)
 * 
 * Особенности:
 * - Base URL: http://127.0.0.1:3000
 * - Автоматическая отправка cookies (withCredentials: true)
 * - Таймаут запросов: 5 секунд
 * - CSRF-защита с автоматическим обновлением токенов
 * 
 * Механизм CSRF:
 * - Получение токена при инициализации (getCsrfToken)
 * - Интерсептор запросов: добавляет x-csrf-token и x-csrf-token-id
 * - Интерсептор ответов: обновляет токены из заголовков
 * - Обработка 403: автоматическое обновление токена и повтор запроса
 *   (с защитой от бесконечного цикла через флаг _retry)
 * 
 * Экспортируемые функции:
 * - getCsrfToken: получение CSRF-токена с сервера
 * - setCsrfToken: ручная установка токена
 * - getCurrentCsrfToken: получение текущего токена
 */

import axios from 'axios';

const api = axios.create({
    baseURL: 'https://wappy.online',
    withCredentials: true,
    timeout: 5000,
});

export default api;