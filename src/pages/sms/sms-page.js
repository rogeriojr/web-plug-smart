import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
const smsFormSchema = z.object({
    phoneNumber: z
        .string()
        .regex(/^\+55\d{10,11}$/, {
        message: "O número deve estar no formato +55 seguido de 10 ou 11 dígitos.",
    })
        .nonempty({ message: "O número de telefone é obrigatório." }),
    message: z
        .string()
        .min(1, { message: "A mensagem não pode estar vazia." })
        .max(160, { message: "A mensagem deve ter no máximo 160 caracteres." }),
});
const SmsSendPage = () => {
    const form = useForm({
        resolver: zodResolver(smsFormSchema),
        defaultValues: {
            phoneNumber: "+55",
            message: "",
        },
    });
    async function onSubmit(data) {
        try {
            const payload = {
                phoneNumber: data.phoneNumber,
                message: data.message,
            };
            await axios.post("/sms/send", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast({
                title: "SMS enviado com sucesso!",
                description: `Mensagem enviada para ${data.phoneNumber}.`,
            });
            form.reset({ phoneNumber: "+55", message: "" });
        }
        catch (error) {
            toast({
                title: "Erro ao enviar SMS",
                description: "Não foi possível enviar a mensagem. Tente novamente.",
                status: "error",
            });
        }
    }
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsx("h1", { className: "text-2xl font-bold inline-block", children: "Envio Personalizado de SMS" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 mb-6", children: [_jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }), _jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { className: "hidden md:block", children: _jsx(BreadcrumbLink, { href: "#", children: "Notifica\u00E7\u00F5es" }) }), _jsx(BreadcrumbSeparator, { className: "hidden md:block" }), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Envio Personalizado de SMS" }) })] }) })] })] }), _jsx(FormProvider, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-8 p-6", children: [_jsx(FormField, { control: form.control, name: "phoneNumber", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "N\u00FAmero de Telefone" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "+55", ...field, className: "border-gray-300 rounded-lg p-3 text-lg", onFocus: (e) => !e.target.value.startsWith("+55") &&
                                                form.setValue("phoneNumber", "+55") }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "message", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Mensagem" }), _jsx(FormControl, { children: _jsx("textarea", { placeholder: "Digite sua mensagem (m\u00E1ximo 160 caracteres)", ...field, className: "border-gray-300 rounded-lg p-3 text-lg w-full h-32 resize-none" }) }), _jsx(FormMessage, {})] })) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", children: "Enviar SMS" }) })] }) })] }));
};
export default SmsSendPage;
