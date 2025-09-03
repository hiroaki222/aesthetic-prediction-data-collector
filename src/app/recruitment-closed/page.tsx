import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, } from "lucide-react";

export default function RecruitmentClosedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="text-center border-2 border-red-200 bg-red-50/50">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-red-800 mb-2">
              研究参加者の募集を終了いたしました
            </CardTitle>
            <CardDescription className="text-lg text-red-700">
              本研究への多数のご応募をいただきありがとうございました
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}