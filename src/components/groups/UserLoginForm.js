import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/contexts/user.context";
import logo from "@/assets/icon.png";
// Esquema de validação Zod para o formulário
const schema = z.object({
    email: z
        .string()
        .email({ message: "Digite um endereço de e-mail válido" })
        .min(3, { message: "O e-mail deve ter pelo menos 3 caracteres" }),
    password: z
        .string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});
const UserLoginForm = () => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { login } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    // Função onSubmit que chama a função de login do contexto
    const onSubmit = async (data) => {
        try {
            setErrorMessage(null);
            await login(data.email, data.password);
            setSuccessMessage("Usuário autenticado com sucesso!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000); // Redireciona após 2 segundos
        }
        catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (_jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center bg-gray-100 px-8", children: [_jsx("div", { className: "flex items-center justify-center w-32 h-32 rounded-lg", children: _jsx("img", { src: logo, alt: "Logo", className: "object-cover w-24 h-24 rounded-md" }) }), _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-2xl font-bold", children: "Acesso \u00E0 plataforma" }), _jsx(CardDescription, { children: "Coloque as informa\u00E7\u00F5es de acesso" })] }), _jsxs(CardContent, { children: [errorMessage && (_jsx("div", { className: "mb-4 text-red-500 text-center", children: errorMessage })), successMessage && (_jsx("div", { className: "mb-4 text-green-500 text-center", children: successMessage })), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "grid gap-4", children: [_jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { className: "grid gap-2", children: [_jsx(FormLabel, { htmlFor: "email", children: "E-mail" }), _jsx(FormControl, { children: _jsx(Input, { id: "email", placeholder: "Digite seu e-mail", ...field, className: "mt-1 block w-full" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "password", render: ({ field }) => (_jsxs(FormItem, { className: "grid gap-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FormLabel, { htmlFor: "password", children: "Senha" }), _jsx(Link, { to: "#", className: "ml-auto inline-block text-sm underline", children: "Esqueceu a senha?" })] }), _jsx(FormControl, { children: _jsx(Input, { id: "password", type: "password", placeholder: "Digite sua senha", ...field, className: "mt-1 block w-full" }) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", children: "Entrar" })] }) })] })] })] }));
};
export default UserLoginForm;
