"use client"

import { useState } from "react"
import {
  Copy,
  RotateCcw,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { SimpleValidationResult } from "@/app/page"

interface StructuredResultsDisplayProps {
  results: SimpleValidationResult
  onReset: () => void
}

interface ParsedResults {
  quick_verdict?: {
    overall_score?: string
    yc_fit?: string
    key_strength?: string
    major_risk?: string
  }
  detailed_evaluation?: {
    problem_solution?: {
      score?: string
      reasoning?: string
    }
    market_opportunity?: {
      score?: string
      reasoning?: string
    }
    traction_validation?: {
      score?: string
      reasoning?: string
    }
    team_execution?: {
      score?: string
      reasoning?: string
    }
    scalability_growth?: {
      score?: string
      reasoning?: string
    }
  }
  competitive_landscape?: {
    similar_yc_companies?: Array<{
      company_name?: string
      batch_year?: string
    }>
    differentiation_analysis?: string
    market_position?: string
    learning_opportunities?: string
  }
  actionable_insights?: {
    strengthen?: string[]
    validate?: string[]
    pivot_consider?: string[]
  }
  yc_ready_pitch?: {
    pitch?: string
  }
}

export default function StructuredResultsDisplay({ results, onReset }: StructuredResultsDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showRawData, setShowRawData] = useState(false)

  // Parse the JSON response
  const parseResults = (): ParsedResults | null => {
    try {
      return JSON.parse(results.response)
    } catch {
      return null
    }
  }

  const parsedData = parseResults()

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(results.response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy results:", err)
    }
  }

  const downloadResults = () => {
    const blob = new Blob([results.response], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `yc-pilot-analysis-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: string) => {
    const numScore = Number.parseInt(score.split("/")[0])
    if (numScore >= 8) return "bg-green-100 text-green-800"
    if (numScore >= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getYCFitColor = (fit: string) => {
    switch (fit.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!parsedData) {
    // Fallback to simple display if parsing fails
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">YC-Pilot Analysis Complete!</h2>
              <p className="text-blue-100">Your startup validation results are ready</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Validation Results</span>
              <div className="flex space-x-2">
                <Button onClick={copyResults} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={downloadResults} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {results.response}
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={onReset} className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Validate Another Idea</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Verdict */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Star className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">YC-Pilot Analysis Complete!</h2>
            <p className="text-blue-100">Your startup validation results are ready</p>
          </div>

          {parsedData.quick_verdict && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{parsedData.quick_verdict.overall_score}</div>
                <div className="text-blue-100 text-sm">Overall Score</div>
              </div>
              <div className="text-center">
                <Badge className={`${getYCFitColor(parsedData.quick_verdict.yc_fit || "")} mb-1`}>
                  {parsedData.quick_verdict.yc_fit}
                </Badge>
                <div className="text-blue-100 text-sm">YC Fit</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-100 mb-1">Key Strength</div>
                <div className="text-xs text-white">{parsedData.quick_verdict.key_strength}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-100 mb-1">Major Risk</div>
                <div className="text-xs text-white">{parsedData.quick_verdict.major_risk}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="evaluation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="pitch">Pitch</TabsTrigger>
        </TabsList>

        {/* Detailed Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-4">
          {parsedData.detailed_evaluation && (
            <div className="grid gap-4">
              {Object.entries(parsedData.detailed_evaluation).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        {key === "problem_solution" && <Target className="h-5 w-5 text-blue-600" />}
                        {key === "market_opportunity" && <TrendingUp className="h-5 w-5 text-green-600" />}
                        {key === "traction_validation" && <Users className="h-5 w-5 text-purple-600" />}
                        {key === "team_execution" && <Users className="h-5 w-5 text-orange-600" />}
                        {key === "scalability_growth" && <TrendingUp className="h-5 w-5 text-indigo-600" />}
                        <span className="capitalize">{key.replace("_", " ")}</span>
                      </div>
                      {value.score && <Badge className={getScoreColor(value.score)}>{value.score}</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{value.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Competitive Landscape Tab */}
        <TabsContent value="competitive" className="space-y-4">
          {parsedData.competitive_landscape && (
            <div className="space-y-4">
              {parsedData.competitive_landscape.similar_yc_companies && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Similar YC Companies</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parsedData.competitive_landscape.similar_yc_companies.map((company, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{company.company_name}</span>
                          <Badge variant="outline">{company.batch_year}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Differentiation Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{parsedData.competitive_landscape.differentiation_analysis}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{parsedData.competitive_landscape.market_position}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{parsedData.competitive_landscape.learning_opportunities}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Actionable Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {parsedData.actionable_insights && (
            <div className="grid gap-4">
              {parsedData.actionable_insights.strengthen && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <TrendingUp className="h-5 w-5" />
                      <span>Strengthen</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parsedData.actionable_insights.strengthen.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {parsedData.actionable_insights.validate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-700">
                      <Target className="h-5 w-5" />
                      <span>Validate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parsedData.actionable_insights.validate.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {parsedData.actionable_insights.pivot_consider && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Consider Pivoting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parsedData.actionable_insights.pivot_consider.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* YC Ready Pitch Tab */}
        <TabsContent value="pitch">
          {parsedData.yc_ready_pitch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Your YC-Ready Pitch</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg text-gray-800 leading-relaxed italic">"{parsedData.yc_ready_pitch.pitch}"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Raw Data Section */}
      <Collapsible open={showRawData} onOpenChange={setShowRawData}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span>Raw Response Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={copyResults} variant="outline" size="sm" className="mr-2">
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button onClick={downloadResults} variant="outline" size="sm" className="mr-2">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Validate Another Idea</span>
        </Button>
      </div>
    </div>
  )
}
