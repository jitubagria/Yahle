import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, Check, Shield, Lock, PlayCircle } from 'lucide-react';

export default function LiteratureSearch() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-page-title">Literature Search AI</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Smart literature search across PubMed, Google Scholar, and medical journals with AI-powered summarization and citation management.
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
                      <p className="font-medium">Meta-analysis tools</p>
                      <p className="text-sm text-muted-foreground">Systematic review and meta-analysis support</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Citation management</p>
                      <p className="text-sm text-muted-foreground">Organize and format citations automatically</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Paper summaries</p>
                      <p className="text-sm text-muted-foreground">AI-generated abstracts and key findings</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Multi-database search</p>
                      <p className="text-sm text-muted-foreground">Search PubMed, Google Scholar, and more simultaneously</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Evidence grading</p>
                      <p className="text-sm text-muted-foreground">Automatic quality assessment of research papers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Smart recommendations</p>
                      <p className="text-sm text-muted-foreground">AI suggests relevant papers based on your research</p>
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
                      <h3 className="font-semibold mb-1">Enter Query</h3>
                      <p className="text-sm text-muted-foreground">Input your research question or keywords</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">AI Search</h3>
                      <p className="text-sm text-muted-foreground">Our AI searches across multiple medical databases</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Review Results</h3>
                      <p className="text-sm text-muted-foreground">Get summarized papers with key findings</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Export Citations</h3>
                      <p className="text-sm text-muted-foreground">Download citations in any format (APA, MLA, Vancouver)</p>
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
                    <FileSearch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Save research time</p>
                      <p className="text-sm text-muted-foreground">Find relevant papers 10x faster</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileSearch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Stay updated</p>
                      <p className="text-sm text-muted-foreground">Access the latest medical research</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileSearch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Better literature reviews</p>
                      <p className="text-sm text-muted-foreground">Comprehensive and organized research</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileSearch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Quality publications</p>
                      <p className="text-sm text-muted-foreground">Evidence-based citations strengthen your work</p>
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
                  <FileSearch className="w-8 h-8 text-primary" />
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
