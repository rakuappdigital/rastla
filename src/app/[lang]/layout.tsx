import { LangProvider } from "@/components/LangProvider";
import { locales } from "@/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return <LangProvider lang={lang}>{children}</LangProvider>;
}
