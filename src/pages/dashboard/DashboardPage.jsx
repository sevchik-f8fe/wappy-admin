/**
 * Главная страница административной панели
 * 
 * Отображает:
 * - Статистику: общее количество пользователей и онлайн
 * - Список пользователей с возможностью удаления
 * - Пагинацию для навигации по списку
 * - Кнопку обновления данных
 * 
 * Функциональность:
 * - Загрузка списка пользователей с пагинацией
 * - Отображение онлайн/оффлайн статуса
 * - Удаление пользователей через ListItem компонент
 * 
 * API вызовы:
 * - POST /ad/get/users - получение списка пользователей (с пагинацией)
 * - POST /ad/get/usersCount - общее количество пользователей
 * - POST /ad/get/usersOnlineCount - количество онлайн пользователей
 * 
 * Состояние Redux:
 * - dashboard: users, count, onlineCount, usersPage, hasMore, loading
 * - global: token, admin
 * 
 * Пагинация:
 * - Кнопки "вперед/назад" для навигации по страницам
 * - Отключение кнопок при достижении границ
 * 
 * Защита:
 * - Требуется авторизация администратора
 * - Редирект на /auth при отсутствии сессии (в routerHooks)
 */

import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { setDashboardField } from "./DashboardSlice";
import { useCallback, useEffect } from "react";
import api from "../../util/axiosConfig";
import { Bounce, toast } from "react-toastify";
import ListItem from "../../components/ListItem";
import { nanoid } from "nanoid";

const DashboardPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const notify = useCallback(() => toast.error("Что-то пошло не так :(", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    }), []);

    const { users, hasMore, count, onlineCount, usersPage, loading } = useSelector((state) => state.dashboard);
    const { token, admin } = useSelector(state => state.global);

    const updateData = async (hasMore, token, page, ad_email, r_token) => {
        dispatch(setDashboardField({ field: 'loading', value: true }))
        const [data, count, on_count] = await Promise.allSettled([
            api.post('/ad/get/users',
                { page, email: ad_email, refreshToken: r_token },
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            ).then(res => {
                return res?.data
            }).catch((err) => {
                notify();
                return null;
            }),

            api.post('/ad/get/usersCount', { email: ad_email, refreshToken: r_token },
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            ).then(res => {
                return res?.data?.count
            }).catch((err) => {
                notify();
                return 0;
            }),

            api.post('/ad/get/usersOnlineCount', { email: ad_email, refreshToken: r_token },
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            ).then(res => res?.data?.on_count).catch((err) => {
                notify();
                return 0;
            })
        ]);

        const usRes = data.status === 'fulfilled' ? data.value : { hasMore: false, users: [] };
        const cRes = count.status === 'fulfilled' ? count.value : 0;
        const ocRes = on_count.status === 'fulfilled' ? on_count.value : 0;
        dispatch(setDashboardField({ field: 'loading', value: false }))
        dispatch(setDashboardField({ field: 'users', value: usRes.users }));
        dispatch(setDashboardField({ field: 'hasMore', value: usRes.hasMore }));
        dispatch(setDashboardField({ field: 'count', value: cRes }));
        dispatch(setDashboardField({ field: 'onlineCount', value: ocRes }));
    }

    useEffect(() => {
        if (admin?.email && token) {
            updateData(hasMore, token, usersPage, admin.email, admin.refreshToken)

        }
    }, [token, admin?.email, usersPage])

    const changePageHandle = (key) => {
        switch (key) {
            case 'prev':
                dispatch(setDashboardField({ field: 'usersPage', value: usersPage - 1 }));
                break;
            case 'next':
                dispatch(setDashboardField({ field: 'usersPage', value: usersPage + 1 }));
                break;
        }
    }

    const fetchUsers = async (token, ad_email, r_token, page) => {
        await api.post('/ad/get/users',
            { page, email: ad_email, refreshToken: r_token },
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
        ).then(res => {
            return res?.data
        }).catch((err) => {
            notify();
            return null;
        })
    }

    useEffect(() => {
        fetchUsers(token, admin?.email, admin?.refreshToken, usersPage)
    }, [usersPage])

    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em',
            p: '1em',
            maxWidth: '80%',
            minWidth: '80%',
            m: '4em auto 2em auto'
        }}>
            <Box
                sx={{
                    backgroundColor: '#2a262eb0',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #D4BBFC',
                    borderRadius: '1em', p: '1em',
                    m: '0em auto 2em auto',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '.5em 1em',
                    justifyContent: 'space-between',
                    gap: '1em',
                    position: 'sticky',
                    top: '2em',
                    zIndex: '10000000',
                }}
            >
                <Typography onClick={() => {
                    if (pathname != '/') navigate('/')
                    else window.scrollTo(0, 0);
                }} sx={{ cursor: 'pointer' }} variant="h2">ваппи <span style={{ color: 'white', fontSize: '.5em' }}>admin</span></Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2em',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
                        <AccountCircleIcon sx={{ color: '#afafafff' }} />
                        <Typography sx={{ color: '#afafafff' }}>{count && count}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
                        <AccountCircleIcon sx={{ color: '#4dca4dff' }} />
                        <Typography sx={{ color: '#4dca4dff' }}>{onlineCount && onlineCount}</Typography>
                    </Box>
                    <Button
                        loading={loading}
                        variant="outlined"
                        onClick={() => updateData(hasMore, token, usersPage, admin.email, admin.refreshToken)}
                    >обновить</Button>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
                // p: '1em 0'
            }}>
                {users?.map((user) => <ListItem kay={nanoid()} user={user} />)}

                <Box
                    sx={{ display: 'flex', gap: '.5em', alignSelf: 'center' }}
                >
                    <Button
                        loading={loading}
                        disabled={usersPage <= 1}
                        variant="outlined"
                        onClick={() => changePageHandle('prev')}
                    >
                        <ChevronLeftIcon />
                    </Button>
                    <Typography
                        sx={{
                            color: '#a27ae2ff',
                            padding: '.5em'
                        }}
                    >{usersPage}</Typography>
                    <Button
                        loading={loading}
                        disabled={!hasMore}
                        variant="outlined"
                        onClick={() => changePageHandle('next')}
                    >
                        <ChevronRightIcon />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;