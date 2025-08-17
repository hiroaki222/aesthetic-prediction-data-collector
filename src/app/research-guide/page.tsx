"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Users, Shield, Phone, Mail, AlertTriangle, FilePenLine } from "lucide-react"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Session } from "@supabase/supabase-js"
import { useTranslations } from 'next-intl';

function AgreementButton() {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClient()
  const t = useTranslations('research-guide'); // Ensure the hook is called unconditionally
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [supabase])
  if (session) return null
  return (
    <Button size="lg" asChild className="w-full">
      <Link href="/agreement">
        {t('agreementButton')}
      </Link>
    </Button>
  )
}

export default function ResearchGuidePage() {
  const t = useTranslations('research-guide');
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FilePenLine className="size-4" />
              </div>
              Aesthetic Prediction Data Collector
            </div>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backHome')}
              </Link>
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
            <CardTitle className="text-2xl text-blue-600">研究の目的</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              本研究では，人がアート作品やファッション，風景などを含む様々な視聴覚情報から美的感情をどのように抱くのかの機序解明やそれを自動推定するための人工知能の実現を目指しています．
            </p>
            <p className="leading-relaxed">
              本実験では，心理物理学的計測 (主観評価，反応時間計測)を測定します．加えて，人工統計情報(性別など)と五大性格特性を測定します．
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">実験の方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="leading-relaxed">
                提示された視聴覚刺激に対する主観評価に関するアンケートに回答していただきます．所要時間は概ね20時間程度です．
              </p>
              <p className="leading-relaxed">
                提示される視聴覚刺激は，アート作品の画像，ファッションの画像，風景動画の3種類です．それぞれの刺激は約230サンプルから構成されているため合計700サンプル程度への主観評価が求められます．
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-4 text-blue-800">主観評価について</h4>
              <div className="space-y-3 text-sm">
                <p>
                  主観評価として，アート作品やファッション，映像に対する9項目の美的感情(&quot;好き&quot;や&quot;美しい&quot;など)と1項目の総合的な美的評価をアノテーションしていただきます．
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700 mb-1">美的感情</div>
                    <div className="text-xs text-gray-600">5段階評価</div>
                    <div className="text-xs">&quot;1点=全く感じなかった&quot;〜&quot;5点=とても感じた&quot;</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700 mb-1">総合的な美的評価</div>
                    <div className="text-xs text-gray-600">7段階評価</div>
                    <div className="text-xs">&quot;1点=全く美的でない&quot;〜&quot;7点=とても美的&quot;</div>
                  </div>
                </div>
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-8 w-8" />
                  <AlertDescription className="font-bold text-black p-4 rounded-md">
                    美的感情では，対象のアート作品やファッション，映像が表現しようとしている感情ではなく，このアート作品やファッション，映像を見た際にあなた自身が感じた感情に基づいて答えてください．
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">実験スケジュール</h4>
              <ul className="space-y-2 text-sm">
                <li>• 一回のアノテーションタスクは，一回1時間程度で終えられるように18個のセットに分割されています</li>
                <li>
                  • 集中してアノテーションに取り組んでいただくために，1日で最大でも3セット程度に抑えるようにしてください
                </li>
                <li>• 連続でアノテーションに取り組む場合は，セット間で十分な休憩を取るようにしてください</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">個人情報とデータの取り扱い</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-relaxed">
              個人情報として氏名と連絡先（メールアドレス），および性別と年齢，国籍，教育歴，アート作品/ファッション/写真や動画の経験を収集いたします．取得した個人情報（氏名，連絡先）は，研究目的以外には使用しません．データには番号付けを行うとともに匿名化しますので，専門学会，学術専門誌，学内研究会等を通じて研究発表する際も個人情報は守秘されます．個人情報の保管には万全を期し外部へは漏洩しません．
            </p>

            <p className="leading-relaxed">
              個人情報以外の実験で得られたデータは，研究結果の外部発表後，オープンソースプラットフォーム（Githubなど）を通して，誰でも閲覧・ダウンロード可能な形で公開されます．ただし，公開されるデータは，以下のものに限り，個人情報（氏名，連絡先）が公開されることはありません．
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-800">【一般公開するデータ】</h4>
              <p className="mb-4 text-sm text-gray-600">
                個人を特定できる情報（氏名，連絡先）を除くすべてのデータ（以下参照）
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">1</Badge>
                  <span className="text-sm">刺激に対する主観評価</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2</Badge>
                  <span className="text-sm">性別，年齢，教育歴，国籍，アート作品/ファッション/写真や動画の経験</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3</Badge>
                  <span className="text-sm">心理特性アンケートの回答</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">予測される結果（利益・不利益）について</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              使用する視聴覚刺激は日常生活で通常経験する程度のレベル・照度を持ち，また，呈示も断続的なため，聴力・視力の損失を生じることはありません．また，一回のアノテーションタスクは最長でも連続1時間を超えないものとし，計測の間には十分な休憩をとれるようにします．刺激は，いずれも日常生活で眼にするレベルの刺激であるため，大きな問題は生じないと考えられます，ただし，刺激によっては，多少のストレスや不快感を感じるものも含む可能性がありますが，実験参加者がストレスや不快感を訴えた場合は速やかに実験を中止できます．
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">
              個人情報保護の方法，およびインフォームド・コンセントに関する事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">研究計画への参加は任意です．</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">
                  本説明の段階で実験への参加を取りやめても，また一度同意した後に同意を撤回した場合にも，そのことによって皆さんが不利益を被ることはありません．ただし，実験参加者募集時に，本研究室が虚偽の説明を行ったことが明らかである場合を除いては，実験参加者募集時に示した謝金及び給金は保証されません．途中で参加を取りやめた場合には，実際に実験に参加いただいた時間分の謝金はお支払いいたします．
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">
                  個人情報（名前，連絡先）を研究外の目的に流用することはありません．皆さんの個人情報（名前，連絡先）は，研究代表者（岡田
                  将吾）の研究室で厳重に保管いたします．個人情報以外の実験結果については，オープンソースプラットフォーム，学会，論文，書籍等で発表しますが，この際にいかなる場合においても個人が特定できる形で実験結果を開示することはありません．個人情報については，年齢や性別を統計情報として公開することはありますが，名前や連絡先については，公開することはありません．
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">
                  データの匿名化とデータの保管方法：個人を識別する情報を取り除き，新たに符号または番号を付して，実験後すぐに匿名化し，対応表を作成します．（連結可能匿名化）
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">
                  対応表は研究代表者が保管し，研究代表者以外のコピー・閲覧は禁止します．対応表は『実験データとは別に岡田研究室の』鍵付きの引き出しにて管理します．
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="leading-relaxed text-sm">
                  実験結果の外部発表前であればいつでも自由に実験参加への同意を取り消し，自分の実験結果や個人情報を破棄することが可能です．また，本人から請求があれば，当該データを開示します．実験結果を論文発表や口頭発表などで外部へ発表した後には同意の撤回や実験結果は破棄できませんのでご注意ください．
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            以上の項目をご理解いただき，実験に参加していただける場合は，同意書にチェックと署名をお願いいたします．なお，この説明書はフッター(ページ最下部)から確認できるため，上記の内容や実験に関するお問合せがある場合や，実験後に体調が悪くなった場合などには，以下まで遠慮なくご連絡ください．また，実験の過程上，人権やハラスメントに関して疑問を持った場合は，以下の【被験者の人権についての問い合わせ先】まで遠慮なくご連絡下さい．
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">本件に関する問い合わせ先</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    実験全般に関する問い合わせ先
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>〒923-1292 石川県能美市旭台 1-1</p>
                  <p>北陸先端科学技術大学院大学</p>
                  <p>先端科学技術研究科</p>
                  <p className="font-semibold">研究代表者 岡田将吾 （教授）</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4" />
                    <span>0761-51-1205</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>okada-s@jaist.ac.jp</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    被験者の人権についての問い合わせ先
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>〒 923-1292 石川県能美市旭台1-1</p>
                  <p>北陸先端科学技術大学院大学</p>
                  <p>研究倫理に関する相談員 情報科学担当</p>
                  <p className="font-semibold">担当者 長谷川忍 教授</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4" />
                    <span>0761-51-1215</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>hasegawa@jaist.ac.jp</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex justify-center items-center">
          <AgreementButton />
        </div>
      </div>

      <Footer />
    </div>
  )
}
