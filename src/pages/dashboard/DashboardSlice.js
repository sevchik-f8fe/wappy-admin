/**
 * Redux Slice для управления дашбордом администратора
 * 
 * Состояние:
 * @property {Array} users - Список пользователей
 * @property {number} count - Общее количество пользователей
 * @property {number} onlineCount - Количество онлайн пользователей
 * @property {number} usersPage - Текущая страница пагинации
 * @property {boolean} loading - Флаг загрузки
 * @property {boolean} hasMore - Флаг наличия следующих страниц
 * 
 * Reducers:
 * @function setDashboardField - Универсальное обновление любого поля
 *   Принимает { field, value }
 * 
 * @function deleteUserFromList - Удаление пользователя из списка
 *   Принимает { email } и фильтрует массив users
 *   (оптимистичное обновление без повторного запроса)
 * 
 * Используется в DashboardPage и ListItem
 */

import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        users: [],
        count: 0,
        onlineCount: 0,
        usersPage: 1,
        loading: false,
        hasMore: true,
    },
    reducers: {
        setDashboardField: (state, action) => {
            const { field, value } = action.payload;

            state[field] = value;
        },
        deleteUserFromList: (state, action) => {
            const { email } = action.payload;
            const newList = state.users.filter(elem => elem.email != email)
            state.users = newList;
        },
    }
});

export const { setDashboardField, deleteUserFromList } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;