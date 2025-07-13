import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePenLine } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">

        <div className="flex items-center gap-2 self-center font-medium text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FilePenLine className="size-5" />
          </div>
          Aesthetic Prediction Data Collector
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Get started with your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <a href="/signin">Sign In</a>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href="/signup">Sign Up</a>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Takahara Hiroaki. All rights reserved.
        </div>
      </div>
    </div>
  )
}
