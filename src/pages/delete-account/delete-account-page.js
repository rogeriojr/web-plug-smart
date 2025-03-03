import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import logo from "@/assets/icon.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const AccountDeletion = () => {
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            // Simulação de requisição para exclusão de conta
            const response = await fetch("/api/delete-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, reason }),
            });
            if (response.ok) {
                setSuccessMessage("Solicitação enviada com sucesso. Sua conta será excluída em breve.");
                setEmail("");
                setReason("");
            }
            else {
                throw new Error("Falha ao enviar a solicitação. Tente novamente mais tarde.");
            }
        }
        catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (_jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center bg-gray-100 px-8", children: [_jsx("div", { className: "flex items-center justify-center w-32 h-32 rounded-lg", children: _jsx("img", { src: logo, alt: "Logo", className: "object-cover w-24 h-24 rounded-md" }) }), _jsxs(Card, { className: "w-full max-w-3xl", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-2xl font-bold", children: "Solicita\u00E7\u00E3o de Exclus\u00E3o de Conta" }), _jsx(CardDescription, { children: "Preencha os campos abaixo para solicitar a exclus\u00E3o de sua conta." })] }), _jsxs(CardContent, { className: "space-y-4", children: [successMessage && (_jsx("div", { className: "text-green-500 text-center mb-4", children: successMessage })), errorMessage && (_jsx("div", { className: "text-red-500 text-center mb-4", children: errorMessage })), _jsxs("form", { className: "grid gap-4", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "E-mail" }), _jsx(Input, { id: "email", type: "email", placeholder: "Digite seu e-mail", className: "mt-1 block w-full", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reason", className: "block text-sm font-medium text-gray-700", children: "Motivo da Exclus\u00E3o" }), _jsx(Input, { id: "reason", type: "text", placeholder: "Descreva o motivo da solicita\u00E7\u00E3o", className: "mt-1 block w-full", value: reason, onChange: (e) => setReason(e.target.value) })] }), _jsx(Button, { type: "submit", className: "w-full", children: "Enviar Solicita\u00E7\u00E3o" })] })] })] })] }));
};
export default AccountDeletion;
