/**
 * Хуки для управления маршрутизацией (админ-версия)
 * 
 * Компонент ScrollToTop выполняет:
 * 
 * 1. Защита маршрутов (редирект на /auth):
 *    - Проверяет наличие admin и token в глобальном состоянии
 *    - Если admin == null или token == null → перенаправляет на /auth
 *    - Срабатывает при каждом изменении pathname
 * 
 * 2. Прокрутка вверх:
 *    - При каждом изменении pathname прокручивает страницу в начало
 *    - Обеспечивает удобную навигацию между страницами
 * 
 * Отличия от пользовательской версии:
 * - Нет сброса состояния для страниц аутентификации
 * - Простая проверка авторизации (редирект на /auth)
 * - Нет условной прокрутки (всегда прокручивает вверх)
 * 
 * Зависимости: React Router DOM (useLocation, useNavigate), Redux
 */

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ScrollToTop = () => {
    const { admin, token } = useSelector((state) => state.global);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (admin == null || token == null) navigate('/auth')
    }, [pathname, admin, token, navigate])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, dispatch]);
    return null;
}