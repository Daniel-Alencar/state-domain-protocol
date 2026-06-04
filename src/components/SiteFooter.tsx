import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-12 border-t border-border/60 bg-background/80 px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-signal text-lg">◬</span>
              <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                Protocolo Soberano de Harmonia Quântica
              </span>
            </div>
            <p className="text-sm text-foreground/90">Protocolo de Transformação de Vida</p>
            <p className="text-xs text-muted-foreground">
              Treinamento Empresarial de Alta Performance
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-mono text-tracked text-[10px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Início</Link>
            <Link to="/a-ciencia-do-protocolo" className="hover:text-foreground">A Ciência</Link>
            <Link to="/treinamento-maestria-frequencial" className="hover:text-foreground">Treinamento</Link>
            <Link to="/como-utilizar" className="hover:text-foreground">Como Utilizar</Link>
            <Link to="/termos-de-uso" className="hover:text-foreground">Termos de Uso</Link>
            <Link to="/lgpd" className="hover:text-foreground">LGPD</Link>
          </nav>
        </div>

        <div className="border-t border-border/40 pt-5 text-[11px] leading-relaxed text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Todos os direitos reservados ao{" "}
            <span className="text-foreground/90">Instituto Venditti — Educação, Moda e Empreendedorismo</span>.
          </p>
          <p className="mt-1">CNPJ 62.170.498/0001-98</p>
        </div>
      </div>
    </footer>
  );
}
