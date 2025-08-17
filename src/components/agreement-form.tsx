"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface ChecklistSection {
  title: string
  items: ChecklistItem[]
}

export function AgreementForm({ onAgree }: { onAgree: () => void }) {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: "研究計画の概要に関する事項",
      items: [
        { id: "purpose", text: "研究の目的，意義", checked: false },
        { id: "data", text: "提供する情報，データ等", checked: false },
      ],
    },
    {
      title: "個人情報保護の方法に関する事項",
      items: [
        { id: "collection", text: "個人情報の収集が，研究目的，研究計画に照らして必要であること", checked: false },
        { id: "anonymization", text: "提供を受けたデータ等処理の匿名化の方法又は匿名化できない理由", checked: false },
        { id: "storage", text: "データの保管・管理について適切になされること", checked: false },
      ],
    },
    {
      title: "侵襲および安全管理に関する事項",
      items: [{ id: "burden", text: "予想される苦痛，負担等", checked: false }],
    },
    {
      title: "インフォームド・コンセントに関する事項",
      items: [
        { id: "voluntary", text: "研究計画への参加は任意であること", checked: false },
        {
          id: "no-disadvantage",
          text: "研究計画に参加に同意しないことにより不利益な対応を受けないこと",
          checked: false,
        },
        {
          id: "withdrawal",
          text: "研究計画に参加に同意した後でも，実験結果の外部発表前であればいつでも文書により同意を撤回できること",
          checked: false,
        },
        { id: "public-data", text: "個人情報(氏名，連絡先)以外の収集されたデータが一般公開されること", checked: false },
        { id: "disclosure", text: "本人から請求があれば，当該データを開示すること", checked: false },
        { id: "no-penalty", text: "同意を撤回しても，そのことにより何ら不利益を蒙らないこと", checked: false },
        { id: "data-disposal", text: "同意を撤回した場合，提供されたデータ等は廃棄されること", checked: false },
        { id: "publication", text: "研究成果の発表の方法について，学会発表，論文発表の予定", checked: false },
        { id: "compensation", text: "研究計画参加に対して謝礼を支払うこと", checked: false },
      ],
    },
  ])
  const [showError, setShowError] = useState(false)
  const [signature, setSignature] = useState("")

  const handleCheckboxChange = (sectionIndex: number, itemIndex: number) => {
    setSections((prev) =>
      prev.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
            ...section,
            items: section.items.map((item, iIdx) =>
              iIdx === itemIndex ? { ...item, checked: !item.checked } : item,
            ),
          }
          : section,
      ),
    )
    setShowError(false)
  }

  const allItemsChecked = sections.every((section) => section.items.every((item) => item.checked))
  const isFormValid = allItemsChecked && signature.trim() !== ""
  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0)
  const checkedItems = sections.reduce((acc, section) => acc + section.items.filter((item) => item.checked).length, 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">研究参加同意書</h1>
          <Card className="">
            <CardContent className="pt-6">
              <div className="space-y-2 text-left">
                <p className="font-medium">北陸先端科学技術大学院大学</p>
                <p>所属：先端科学技術研究科</p>
                <p>研究責任者名：岡田 将吾 殿</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">研究概要</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              私は，『視聴覚刺激に対する美的評価アノテーション』の研究・実験の実施について，説明書を用いて説明を受け，
              研究計画の目的，意義，方法，個人情報保護の方法，安全管理での配慮などについて十分理解しましたので，
              計画に参加し，求められた私個人に係る情報，データ等を提供することに同意いたします．
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              説明を受けて理解した項目
            </CardTitle>
            <CardDescription>理解できた項目にチェックを入れてください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="font-semibold text-lg text-primary">
                  {sectionIndex + 1}. {section.title}
                </h3>
                <div className="space-y-3 pl-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => handleCheckboxChange(sectionIndex, itemIndex)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm leading-relaxed cursor-pointer ${item.checked ? "text-foreground" : "text-muted-foreground"
                          }`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {showError && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>すべての項目にチェックを入れてから同意してください。</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <label htmlFor="signature" className="">署名欄</label>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <input
              id="signature"
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="氏名を入力"
              className="w-full border rounded px-3 py-2"
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={onAgree} size="lg" className="px-8 py-3 text-lg" disabled={!isFormValid}>
            {allItemsChecked ? "同意して続行" : `残り ${totalItems - checkedItems} 項目を確認してください`}
          </Button>
        </div>
      </div>
    </div>
  )
}
