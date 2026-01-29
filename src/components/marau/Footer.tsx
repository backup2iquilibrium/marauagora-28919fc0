import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer({ logoUrl }: { logoUrl: string }) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 rounded p-1">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Marau Agora</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              O portal de notícias que conecta Marau ao mundo, sempre com ética e responsabilidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-6">Editorial</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/categoria/cidade" className="hover:text-blue-400 transition-colors">Cidade</Link></li>
              <li><Link to="/categoria/esportes" className="hover:text-blue-400 transition-colors">Esportes</Link></li>
              <li><Link to="/categoria/policia" className="hover:text-blue-400 transition-colors">Polícia</Link></li>
              <li><Link to="/categoria/politica" className="hover:text-blue-400 transition-colors">Política</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-6">Institucional</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/quem-somos" className="hover:text-blue-400 transition-colors">Quem Somos</Link></li>
              <li><Link to="/expediente" className="hover:text-blue-400 transition-colors">Expediente</Link></li>
              <li><Link to="/contato" className="hover:text-blue-400 transition-colors">Contato</Link></li>
              <li><Link to="/vagas" className="hover:text-blue-400 transition-colors">Trabalhe Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-6">Social</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 Marau Agora. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
