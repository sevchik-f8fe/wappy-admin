/**
 * Контейнер для формы авторизации администратора
 * 
 * Особенности:
 * - Стеклянный эффект (backdropFilter: blur)
 * - Фиолетовая граница и скругленные углы
 * - Фиксированная ширина 80% (нет мобильной адаптации)
 * - Логотип "ваппи admin" с навигацией на главную
 * - Всегда отображается Divider (в отличие от пользовательской версии)
 * 
 * Props:
 * @param {ReactNode} children - Дочерние элементы (поля формы, кнопки)
 * 
 * Отличия от пользовательской версии:
 * - Нет ссылки для переключения между страницами
 * - Добавлен бейдж "admin" в логотип
 * - Нет адаптивной ширины (всегда 80%)
 * - Всегда показывает Divider
 */

import React from 'react'; //for test
import { Box, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthContainer = ({ children }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{
            backgroundColor: '#2a262eb0',
            backdropFilter: 'blur(10px)',
            border: '1px solid #D4BBFC',
            borderRadius: '1em', p: '1em',
            maxWidth: '80%',
            minWidth: '80%',
            m: '4em auto 2em auto'
        }}>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Typography onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} gutterBottom variant="h2">ваппи <span style={{ color: 'white', fontSize: '.5em' }}>admin</span></Typography>
            </Box>

            <Divider />
            {children}
        </Box>
    );
}

export default AuthContainer;