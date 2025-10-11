import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Check, Shield, Lock, PlayCircle } from 'lucide-react';

export default function DiagnosisHelper() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-page-title">AI Diagnosis Helper</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Advanced AI-powered diagnostic assistance system that analyzes symptoms, patient history, and clinical data to suggest potential diagnoses.
            </p>
            
            <div className="flex gap-4">
              <Button size="lg" data-testid="button-try-now">
                Try Now
              </Button>
              <Button size="lg" variant="outline" data-testid="button-watch-demo">
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Features & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Symptom analysis and pattern recognition</p>
                      <p className="text-sm text-muted-foreground">Advanced algorithms identify symptom patterns and correlations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Differential diagnosis suggestions</p>
                      <p className="text-sm text-muted-foreground">Comprehensive list of possible diagnoses ranked by probability</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Evidence-based recommendations</p>
                      <p className="text-sm text-muted-foreground">Suggestions backed by current medical literature and guidelines</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Drug interaction checker</p>
                      <p className="text-sm text-muted-foreground">Real-time alerts for potential medication interactions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Clinical guideline integration</p>
                      <p className="text-sm text-muted-foreground">Aligned with international clinical practice guidelines</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Real-time decision support</p>
                      <p className="text-sm text-muted-foreground">Instant AI analysis to support clinical decision-making</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Input Data</h3>
                      <p className="text-sm text-muted-foreground">Enter patient symptoms, history, and test results</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">AI Analysis</h3>
                      <p className="text-sm text-muted-foreground">Our AI analyzes data against medical databases</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Get Insights</h3>
                      <p className="text-sm text-muted-foreground">Receive differential diagnoses and recommendations</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Make Decision</h3>
                      <p className="text-sm text-muted-foreground">Use AI insights to support clinical decisions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Reduce diagnostic errors</p>
                      <p className="text-sm text-muted-foreground">AI-powered second opinion to minimize mistakes</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Save time on research</p>
                      <p className="text-sm text-muted-foreground">Instant access to evidence-based information</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Access latest medical knowledge</p>
                      <p className="text-sm text-muted-foreground">Continuously updated with current research</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Improve patient outcomes</p>
                      <p className="text-sm text-muted-foreground">Better diagnoses lead to better treatment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Security */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Pricing</CardTitle>
                <div>
                  <p className="text-3xl font-bold">Free</p>
                  <p className="text-sm text-muted-foreground">for verified doctors</p>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" size="lg" data-testid="button-start-free-trial">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">HIPAA Compliant</p>
                    <p className="text-sm text-muted-foreground">Your data is secure</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-sm text-muted-foreground">Complete privacy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Need custom AI solution?
                </p>
                <Button variant="outline" className="w-full" data-testid="button-contact-us">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
