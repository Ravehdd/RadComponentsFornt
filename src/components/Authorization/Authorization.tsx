import classes from "./Authorization.module.css"
import { useDispatch } from "react-redux"
import { authenticationSlice } from "../../store/authentication.slice"
import { useAppSelector } from "../../store/store"
import { useRef} from "react"
export default function Authorization() {
    const isAuthenticated = useAppSelector(authenticationSlice.selectors.selectIsAuthenticated)
    const dispatch = useDispatch()

    const login = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const loginData = { username: login.current?.value, password: pass.current?.value }
        await fetch("http://127.0.0.1:8000/auth/token/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
            }
            return response.json(); // Получаем ответ сервера в формате JSON
        })
        .then((data) => {
            console.log("data", data)
            if (data.auth_token) {
                console.log("Auth.jsx/handleSubmit", data.auth_token)
                localStorage.setItem('authToken', data.auth_token);
                localStorage.setItem('isAuthenticated', 'true');
                dispatch(authenticationSlice.actions.setIsAuthenticated({isAuthenticated: true}));
                window.location.href = "/"
                // dispatch(authenticationSlice.actions.setAuthorizationToken({authorizationToken: data.auth_token}));
                // dispatch(authenticationSlice.actions.setIsAuthenticated({isAuthenticated: true}));
            }
            // Здесь вы можете обработать полученные данные
        })
        .catch((error) => {
            console.error("There was an error!", error);
            
            // Обработка ошибок
        });
    }
    console.log("Auth.jsx", isAuthenticated)
    return (
        <div className="flex flex-col items-center justify-center mt-[5rem]">
            <form className={classes.loginForm} onSubmit={(e) => handleSubmit(e)}>
                <h1 className="text-[#f5f5f5] text-3xl" >Вход</h1>
                <input type="text" ref={login} placeholder="login" className="loginControl m-[1rem]"/>
                <input type="password" ref={pass} placeholder="password" className="loginControl m-[1rem]"/>
                <button className={classes.loginButton}>Войти</button>

            </form>
            {isAuthenticated && <h1 className="text-[#f5f5f5] text-3xl">Вы вошли в аккаунт</h1>}
        </div>
    )
}       