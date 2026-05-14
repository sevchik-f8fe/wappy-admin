/**
 * Компонент отображения пользователя в списке (админ-панель)
 * 
 * Отображает:
 * - Email пользователя и ID в аккордеоне
 * - Статистику: дата регистрации, последняя активность, избранное, загрузки
 * - Кнопку удаления пользователя
 * 
 * Props:
 * @param {Object} user - Объект пользователя с полями:
 *   - email, _id, createdAt, updatedAt, favorites, historyLoad, refreshToken
 * 
 * Функциональность:
 * - Аккордеон раскрывается/закрывается по клику
 * - Удаление пользователя через API /ad/delete
 * - Обновление списка после удаления (deleteUserFromList)
 * 
 * API вызовы:
 * - POST /ad/delete - удаление пользователя
 *   Параметры: email (админа), us_email (пользователя), refreshToken
 * 
 * Безопасность:
 * - Требуется авторизация администратора (Bearer token)
 */

import { Box, Accordion, AccordionDetails, AccordionSummary, Typography, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserFromList, setDashboardField } from "../pages/dashboard/DashboardSlice";
import api from "../util/axiosConfig";
import { Bounce, toast } from "react-toastify";

const ListItem = ({ user }) => {
    const [expanded, setExpanded] = useState(false);
    const { token, admin } = useSelector(state => state.global);
    const { loading } = useSelector(state => state.dashboard);
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

    const deleteUser = async (token, email, ad_email, r_token) => {
        dispatch(setDashboardField({ field: 'loading', value: true }))

        await api.post('/ad/delete', { email: ad_email, us_email: email, refreshToken: r_token }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
            .then(res => res.data)
            .then((data) => {
                dispatch(deleteUserFromList({ email }))
            })
            .catch((err) => {
                notify();
            })
            .finally(() => {
                dispatch(setDashboardField({ field: 'loading', value: false }))
            });
    }

    return (
        <Accordion sx={{ backgroundColor: 'transparent', border: '1px solid #a27ae2ff', borderRadius: '.5em', boxShadow: '0' }} expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary
                sx={{
                    display: 'flex', alignItems: 'center'
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                id={nanoid()}
            >
                <Typography sx={{ userSelect: 'text', width: '33%', flexShrink: 0 }}>
                    {user.email}
                </Typography>
                <Typography sx={{ userSelect: 'text', color: '#a27ae2ff', padding: '.3em .5em', borderRadius: '.5em', backgroundColor: '#a27ae223' }}>{user._id}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
                <Typography>
                    дата регистрации: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
                <Typography>
                    последняя активность: {new Date(user.updatedAt).toLocaleDateString()}
                </Typography>
                <Typography>
                    понравившихся: {user.favorites.length}
                </Typography>
                <Typography>
                    загрузок: {user.historyLoad.length}
                </Typography>
                <Button
                    loading={loading}
                    variant="outlined"
                    onClick={() => deleteUser(token, user.email, admin.email, admin.refreshToken)}
                >
                    <DeleteIcon />
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default ListItem;