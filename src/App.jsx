/**
 * Корневой компонент приложения (админ-панель)
 * 
 * Отвечает за:
 * - Настройку маршрутизации (React Router)
 * - Подключение Redux store и PersistGate для сохранения состояния
 * - Глобальные компоненты (ToastContainer для уведомлений)
 * - Защиту маршрутов через ScrollToTop
 * 
 * Структура маршрутов:
 * 1. / - DashboardPage (главная страница с медиа-контентом)
 * 2. /auth - AuthPage (страница авторизации)
 * 3. * - ErrorPage (404 ошибка)
 * 
 * Особенности:
 * - Упрощенная версия без Header/Footer (вероятно встроены в страницы)
 * - Только административный доступ (admin вместо user)
 * - Маршрут /auth объединяет вход и регистрацию
 * 
 * Зависимости: React Router, Redux, Redux Persist, React Toastify
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import React from 'react'; // for tests

import { ToastContainer, Bounce } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

import { ScrollToTop } from "./util/routerHooks";
import { store, persistor } from "./util/persist";
import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    <ScrollToTop />
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        draggable
                        theme="dark"
                        transition={Bounce}
                    />
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="*" element={<ErrorPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                    </Routes>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;