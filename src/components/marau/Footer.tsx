import { Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";

export function Footer({ logoUrl }: { logoUrl: string }) {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6 mt-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <img
              alt="Marau Agora — logo"
              className="h-12 w-auto object-contain mb-4 bg-background/10 rounded px-2 py-1"
              src={logoUrl}
              loading="lazy"
            />
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
              O Marau Agora é o seu portal de notícias confiável, trazendo informações em tempo real sobre tudo o que acontece
              em Marau e região.
            </p>
            <div className="flex gap-3">
              <a className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors" href="#" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors" href="#" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors" href="#" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">Editorial</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {["Política", "Segurança", "Esporte", "Agronegócio", "Variedades"].map((l) => (
                <li key={l}>
                  <a className="hover:text-primary-foreground transition-colors" href="#">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">Institucional</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {["Quem Somos", "Expediente", "Anuncie Conosco", "Política de Privacidade", "Fale Conosco"].map((l) => (
                <li key={l}>
                  <a className="hover:text-primary-foreground transition-colors" href="#">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">Contato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" aria-hidden="true" />
                Av. Júlio Borella, 1234 - Centro, Marau - RS
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" /> (54) 3342-0000
              </li>
              <li className="flex items-center gap-2">
                <span className="h-4 w-4 inline-block" aria-hidden="true" /> contato@marauagora.com.br
              </li>
              <li className="flex items-center gap-2">
                <span className="h-4 w-4 inline-block" aria-hidden="true" /> (54) 99999-9999 (WhatsApp)
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/70">
          <p>© 2026 Marau Agora. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
