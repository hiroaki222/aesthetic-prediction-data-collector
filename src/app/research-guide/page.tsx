"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Clock, Users, Shield, Phone, Mail, AlertTriangle, FilePenLine, MessageCircleWarning, ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { createClient } from "@/utils/supabase/client"
import type { Session } from "@supabase/supabase-js"
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";

function AgreementButton() {
  const [session, setSession] = useState<Session | null>(null)
  const [fromHome, setFromHome] = useState<boolean>(false)
  const supabase = createClient()
  const t = useTranslations('research-guide');
  const searchParams = useSearchParams()

  useEffect(() => {
    const formData = searchParams.get('fromHome')
    setFromHome(formData === 'true')
    const agreed = document.cookie.includes('agreementAgreed=true')
    if (agreed) { setFromHome(false) }
  }, [searchParams])
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [supabase])
  if (session || !fromHome) return null
  return (
    <Button size="lg" asChild className="w-full">
      <Link href="/agreement">
        {t('agreementButton')}
      </Link>
    </Button>
  )
}


export default function ResearchGuidePage() {
  const [isJaistStudent, setIsJaistStudent] = useState<boolean>(false);
  const t = useTranslations('research-guide');

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.['email'] && user?.['email'].endsWith('@jaist.ac.jp')) {
        setIsJaistStudent(true);
      }
    })()
  }, [])
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FilePenLine className="size-4" />
              </div>
              {t('appTitle')}
            </div>
            <Button
              onClick={() => { router.push('/'); }}>
              <ArrowLeft />
              <a>{t('backHome')}</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('header.title')}</h1>
          <p className="text-xl text-muted-foreground">{t('header.description')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{t('stats.time.title')}</div>
              <div className="text-sm text-muted-foreground">{t('stats.time.value')}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">{t('stats.samples.title')}</div>
              <div className="text-sm text-muted-foreground">{t('stats.samples.value')}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">{t('stats.protection.title')}</div>
              <div className="text-sm text-muted-foreground">{t('stats.protection.value')}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">{t('sections.purpose.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">{t('sections.purpose.paragraph1')}</p>
            <p className="leading-relaxed">{t('sections.purpose.paragraph2')}</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">{t('sections.method.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="leading-relaxed">{t('sections.method.paragraph1')}</p>
              <p className="leading-relaxed">{t('sections.method.paragraph2')}</p>
              <p className="leading-relaxed">{t('sections.method.paragraph3')}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-4 text-blue-800">{t('sections.evaluation.title')}</h4>
              <div className="space-y-3 text-sm">
                <p>{t('sections.evaluation.description')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700 mb-1">{t('sections.evaluation.item1.title')}</div>
                    <div className="text-xs text-gray-600">{t('sections.evaluation.item1.scale')}</div>
                    <div className="text-xs">{t('sections.evaluation.item1.detail')}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700 mb-1">{t('sections.evaluation.item2.title')}</div>
                    <div className="text-xs text-gray-600">{t('sections.evaluation.item2.scale')}</div>
                    <div className="text-xs">{t('sections.evaluation.item2.detail')}</div>
                  </div>
                </div>
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-8 w-8" />
                  <AlertDescription className="font-bold text-black p-4 rounded-md">
                    {t('sections.evaluation.alert')}
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('sections.schedule.title')}</h4>
              <ul className="space-y-2 text-sm">
                <li>• {t('sections.schedule.items.0')}</li>
                <li>• {t('sections.schedule.items.1')}</li>
                <li>• {t('sections.schedule.items.2')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">{t('sections.dataHandling.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-relaxed">{t('sections.dataHandling.paragraph1')}</p>
            <p className="leading-relaxed">{t('sections.dataHandling.paragraph2')}</p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-800">{t('sections.publicData.title')}</h4>
              <p className="mb-4 text-sm text-gray-600">{t('sections.publicData.description')}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">1</Badge>
                  <span className="text-sm">{t('sections.publicData.items.0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2</Badge>
                  <span className="text-sm">{t('sections.publicData.items.1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3</Badge>
                  <span className="text-sm">{t('sections.publicData.items.2')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">{t('sections.predictedResults.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{t('sections.predictedResults.paragraph')}</p>
          </CardContent>
        </Card>

        {isJaistStudent ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">{t('for-jaist.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{t('for-jaist.paragraph1')}</p>
              <p className="leading-relaxed">{t('for-jaist.paragraph2')}</p>
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="font-bold mb-2">【アノテーションに関する注意事項】</div>
                <p className="mb-2">
                  本実験では，動画・アート作品画像・ファッション画像といった多様な刺激に対して，美的感情や総合的な評価をお願いしています．
                </p>
                <p className="mb-2">
                  とくに動画刺激については 1サンプルあたり約1分の長さがあり，実際に視聴していただくことを前提として謝金を算出しております．
                </p>
                <p className="mb-2">
                  短時間で十分に確認せずに評価を行うことは，研究の信頼性を損なうだけでなく，真剣に取り組んでいただいている他の参加者のご協力に対しても不公平となります．
                </p>
                <p className="mb-2">
                  また，アート作品やファッション画像に関しても，提示された刺激を丁寧に確認し，ご自身の感覚に基づいて誠実に判断していただきますようお願いいたします．
                </p>
                <p>
                  不適切なアノテーションが確認された場合には，該当部分の再アノテーションをお願いする可能性があります．研究の趣旨をご理解いただき，誠実なご協力を改めてお願い申し上げます．
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            {t('sections.alertNote')}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">{t('sections.contacts.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {t('sections.contacts.general.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{t('sections.contacts.general.addressLines.0')}</p>
                  <p>{t('sections.contacts.general.addressLines.1')}</p>
                  <p>{t('sections.contacts.general.addressLines.2')}</p>
                  <p className="font-semibold">{t('sections.contacts.general.addressLines.3')}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4" />
                    <span>{t('sections.contacts.general.phone')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{t('sections.contacts.general.email')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('sections.contacts.humanRights.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{t('sections.contacts.humanRights.addressLines.0')}</p>
                  <p>{t('sections.contacts.humanRights.addressLines.1')}</p>
                  <p>{t('sections.contacts.humanRights.addressLines.2')}</p>
                  <p className="font-semibold">{t('sections.contacts.humanRights.addressLines.3')}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4" />
                    <span>{t('sections.contacts.humanRights.phone')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{t('sections.contacts.humanRights.email')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-pink-50 border-pink-200 mt-8">
              <CardHeader>
                <CardTitle className="text-lg text-pink-800 flex items-center gap-2">
                  <MessageCircleWarning className="h-5 w-5" />
                  {t('sections.contacts.developer.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{t('sections.contacts.developer.description')}</p>
                <Button className="bg-pink-600 mt-2 hover:bg-pink-700">
                  <Link href="/contact" className="text-white no-underline">
                    {t('sections.contacts.developer.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="w-full flex justify-center items-center">
          <Suspense fallback={null}>
            <AgreementButton />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  )
}
