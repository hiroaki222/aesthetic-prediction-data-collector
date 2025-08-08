import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <a href="/contact" className="text-xs text-muted-foreground hover:text-foreground">
              {t('links.contact')}
            </a>
            <a href="https://github.com/hiroaki222/aesthetic-prediction-data-collector/blob/main/LICENSE" className="text-xs text-muted-foreground hover:text-foreground">
              {t('links.license')}
            </a>
            <a href="https://github.com/hiroaki222/aesthetic-prediction-data-collector/blob/main/PRIVACY.md" className="text-xs text-muted-foreground hover:text-foreground">
              {t('links.privacy')}
            </a>
            <a
              href="https://github.com/hiroaki222/aesthetic-prediction-data-collector"
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/icons/github-mark.svg" width="15" height="15" alt={t('links.github')} />
              <span className="sr-only">{t('links.github')}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}