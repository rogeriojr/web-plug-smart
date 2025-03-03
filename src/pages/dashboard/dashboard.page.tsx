import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/icon.png";

const DashboardPage = () => {
  return (
    <>
      <header className="flex flex-col h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Bem-vindo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center p-4 gap-6 bg-muted/50">
        {/* Logo */}
        <div className="w-32 h-32">
          <img src={logo} alt="Logo" className="object-contain" />
        </div>

        {/* Mensagem de Boas-Vindas */}
        <h1 className="text-3xl font-bold text-primary text-center">
          Bem-vindo ao Painel de Controle!
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          Explore as funcionalidades do sistema usando o menu lateral.
        </p>
      </div>
    </>
  );
};

export default DashboardPage;
