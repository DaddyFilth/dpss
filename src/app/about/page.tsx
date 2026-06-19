import { Shield, Zap, Users, Target, Globe, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About AI Dropship
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionizing dropshipping with AI-powered automation, intelligent customer targeting, and automated social media management.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            AI Dropship is building the future of e-commerce automation. We leverage artificial intelligence to automate lead generation, identify winning products, target ideal customers, and manage social media marketing - all on autopilot. Our goal is to make dropshipping accessible, profitable, and scalable for entrepreneurs worldwide.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Powered by AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-500 mb-4" />
                <CardTitle>Automation Center</CardTitle>
                <CardDescription>
                  Automated lead generation, email sequences, and social media posting run on autopilot 24/7.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>AI Customer Finder</CardTitle>
                <CardDescription>
                  Identify exactly where your target customers hang out and how to reach them with AI-powered targeting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Product Intelligence</CardTitle>
                <CardDescription>
                  AI analyzes market trends, competition, and demand to identify winning products automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Multi-Platform Selling</CardTitle>
                <CardDescription>
                  Connect your store's social media accounts and post products across Instagram, TikTok, Pinterest, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>Content Generation</CardTitle>
                <CardDescription>
                  AI generates social media content, product descriptions, and marketing copy tailored to each platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-red-500 mb-4" />
                <CardTitle>Admin Control</CardTitle>
                <CardDescription>
                  Complete admin dashboard to manage automations, view analytics, and control your entire store from one place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">85+</div>
              <div className="text-gray-600">Curated Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">6</div>
              <div className="text-gray-600">Customer Personas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">5+</div>
              <div className="text-gray-600">Social Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Automation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Built With Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next.js 15</CardTitle>
                <CardDescription>React framework with App Router</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Neon PostgreSQL</CardTitle>
                <CardDescription>Serverless PostgreSQL database</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NextAuth.js</CardTitle>
                <CardDescription>Authentication with OAuth providers</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prisma ORM</CardTitle>
                <CardDescription>Type-safe database access</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stripe</CardTitle>
                <CardDescription>Payment processing</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OpenAI</CardTitle>
                <CardDescription>AI-powered content generation</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Start building your AI-powered dropshipping store today with automated customer acquisition and intelligent product management.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/products"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </a>
            <a
              href="/auth/signup"
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}