import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, FileSearch, Check, Zap } from 'lucide-react';
import { Link } from 'wouter';

const aiTools = [
  {
    id: 'diagnosis-helper',
    title: 'Diagnosis Helper',
    description: 'AI-powered differential diagnosis assistant. Input symptoms and patient data for evidence-based suggestions.',
    icon: Brain,
    category: 'Clinical',
    available: true,
    features: [
      'Symptom Analysis',
      'Drug Interactions',
      'Clinical Guidelines'
    ]
  },
  {
    id: 'medical-statistics',
    title: 'Medical Statistics Calculator',
    description: 'Advanced statistical analysis for research data. SPSS-like functionality with automated interpretation.',
    icon: Calculator,
    category: 'Research',
    available: true,
    features: [
      'Descriptive Stats',
      'Hypothesis Testing',
      'Regression Analysis'
    ]
  },
  {
    id: 'literature-search',
    title: 'Literature Search AI',
    description: 'Smart literature search across PubMed, Google Scholar, and medical journals with AI-powered summarization.',
    icon: FileSearch,
    category: 'Research',
    available: true,
    features: [
      'Meta-Analysis',
      'Citation Management',
      'Paper Summaries'
    ]
  },
  {
    id: 'automate-npa',
    title: 'Automate NPA',
    description: 'Never miss your Non-Practicing Allowance certificate. Auto-generate and receive NPA certificates monthly via WhatsApp and email.',
    icon: Zap,
    category: 'Automation',
    available: true,
    features: [
      'Auto-Generate Certificates',
      'WhatsApp Delivery',
      'Monthly Scheduling'
    ]
  }
];

export default function AITools() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">AI Tools & Healthcare IT</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Leverage cutting-edge AI for diagnosis assistance, research analytics, and clinical decision support.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <Card key={tool.id} className="flex flex-col" data-testid={`card-tool-${tool.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  {tool.available && (
                    <Badge className="bg-primary text-primary-foreground">Available</Badge>
                  )}
                </div>
                <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Key Features</p>
                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Badge variant="outline" className="text-xs">
                    {tool.category}
                  </Badge>
                  <Link href={`/ai-tools/${tool.id}`}>
                    <Button className="w-full" data-testid={`button-launch-${tool.id}`}>
                      Launch Tool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
