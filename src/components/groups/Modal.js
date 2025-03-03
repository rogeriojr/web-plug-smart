import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
const Modal = () => {
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open" }), _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Are you absolutely sure?" }), _jsx(DialogDescription, { children: "This action cannot be undone. This will permanently delete your account and remove your data from our servers." })] }) })] }));
};
export default Modal;
