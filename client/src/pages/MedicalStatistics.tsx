import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Check, Shield, Lock, PlayCircle } from 'lucide-react';

export default function MedicalStatistics() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-page-title">Medical Statistics Calculator</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Advanced statistical analysis for research data with SPSS-like functionality and automated interpretation for medical professionals.
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
                      <p className="font-medium">Descriptive statistics</p>
                      <p className="text-sm text-muted-foreground">Mean, median, mode, standard deviation, and variance calculations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Hypothesis testing</p>
                      <p className="text-sm text-muted-foreground">t-tests, ANOVA, chi-square, and other statistical tests</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Regression analysis</p>
                      <p className="text-sm text-muted-foreground">Linear, logistic, and multiple regression models</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Survival analysis</p>
                      <p className="text-sm text-muted-foreground">Kaplan-Meier curves and Cox proportional hazards</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Data visualization</p>
                      <p className="text-sm text-muted-foreground">Automated charts, graphs, and publication-ready figures</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Automated interpretation</p>
                      <p className="text-sm text-muted-foreground">Plain language explanations of statistical results</p>
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
                      <h3 className="font-semibold mb-1">Upload Data</h3>
                      <p className="text-sm text-muted-foreground">Import your research data in CSV, Excel, or SPSS format</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Select Analysis</h3>
                      <p className="text-sm text-muted-foreground">Choose the statistical test or analysis method</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Get Results</h3>
                      <p className="text-sm text-muted-foreground">Receive statistical output with visualizations</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Export Findings</h3>
                      <p className="text-sm text-muted-foreground">Download results in publication-ready format</p>
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
                    <Calculator className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">No statistical expertise needed</p>
                      <p className="text-sm text-muted-foreground">User-friendly interface for medical professionals</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calculator className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Save analysis time</p>
                      <p className="text-sm text-muted-foreground">Automated calculations and visualizations</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calculator className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Publication-ready output</p>
                      <p className="text-sm text-muted-foreground">Results formatted for journals and presentations</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calculator className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ensure accuracy</p>
                      <p className="text-sm text-muted-foreground">Validated algorithms for reliable results</p>
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
                  <Calculator className="w-8 h-8 text-primary" />
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
