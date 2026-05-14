/**
 * Страница авторизации администратора
 * 
 * Одностраничная форма входа:
 * - Поле email (с валидацией)
 * - Поле пароля (с валидацией)
 * - Кнопка "далее" для входа
 * 
 * Особенности:
 * - Без двухфакторной аутентификации
 * - Без регистрации (только существующие админы)
 * - После успешного входа → редирект на главную (/)
 * 
 * API вызовы:
 * - POST /ad/auth - аутентификация администратора
 *   Возвращает: { admin, token }
 * 
 * Валидация:
 * - fieldsOk: email и пароль валидны и не пустые
 * 
 * Состояние Redux:
 * - auth: email, password, loading
 * - global: admin, token (устанавливаются после входа)
 * 
 * Безопасность:
 * - JWT токен сохраняется в зашифрованном sessionStorage
 * - CSRF защита через axiosConfig
 */

import { useDispatch, useSelector } from "react-redux";
import { useEmailHandle, usePasswordHandle } from "./AuthHooks";
import { useMemo } from "react";
import AuthContainer from "../../components/AuthContainer";
import { Box, Button } from "@mui/material";
import { AuthField } from "../../components/AuthField";
import { setSimpleField } from "./AuthSlice";
import api from "../../util/axiosConfig";
import { setGlobalData } from "../../util/globalSlice";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const AuthPage = () => {
    const dispatch = useDispatch();
    const { email, password, loading } = useSelector((state) => state.auth);
    const emailHandle = useEmailHandle();
    const passwordHandle = usePasswordHandle();
    const navigate = useNavigate();
    const notify = () => toast.error("Что-то пошло не так :(", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
    const fieldsOk = useMemo(() => {
        return !password.error &&
            !email.error &&
            email.value.length > 0 &&
            password.value.length > 0;
    }, [password.error, email.error, email.value, password.value]);

    const setAdmin = async (data) => {
        dispatch(setSimpleField({ field: 'loading', value: true }));

        await api.post('/ad/auth', data, { headers: { 'Content-Type': 'application/json' } })
            .then(res => res.data)
            .then((data) => {
                dispatch(setGlobalData({ field: 'admin', value: data.admin }))
                dispatch(setGlobalData({ field: 'token', value: data.token }))
                return data;
            })
            .then((data) => {
                navigate('/');
                return data
            })
            .catch((err) => {
                notify();
            })
            .finally(() => {
                dispatch(setSimpleField({ field: 'loading', value: false }))
            });
    }

    return (
        <AuthContainer>
            <Box component='form' sx={{ mt: '1em', flex: 1, display: 'flex', flexDirection: 'column', gap: '1em' }}>
                <AuthField
                    onchange={emailHandle}
                    value={email.value}
                    error={email.error}
                    label="эл. почта"
                    type="email"
                    placeholder="wappy@yandex.ru"
                />
                <AuthField
                    onchange={passwordHandle}
                    value={password.value}
                    error={password.error}
                    label="пароль"
                    type="password"
                />
                <Box sx={{ display: 'flex', justifyContent: 'end', minWidth: '100%' }}>
                    <Button
                        disabled={!fieldsOk || loading}
                        loading={loading}
                        variant="outlined"
                        onClick={() => setAdmin({ email: email.value, password: password.value })}
                    >
                        далее
                    </Button>
                </Box>
            </Box>
        </AuthContainer>
    );
};

export default AuthPage;