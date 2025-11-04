import { ArrowRight, MessageSquare, Search, BarChart3, Sparkles, TrendingUp, Filter, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50">
    //   {/* Navigation */}
    //    <Navbar/>
       <>
      {/* Hero Section */}
      <section className=" px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Reddit Intelligence</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Turn Reddit into your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                  growth engine
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                AI-powered monitoring, smart keyword tracking, and automated comment suggestions that turn Reddit conversations into real business opportunities.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-8 py-6 rounded-xl"
              >
                Request Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Dashboard Preview Card */}
            <div className="relative">
              <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Reddit Intelligence</h3>
                        <p className="text-xs text-gray-500">Live monitoring dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">+127% engagement</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Keyword Alerts</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">3 new</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">AI Suggestions</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Ready</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">#Music</Badge>
                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">Amin</Badge>
                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">UI</Badge>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                      <Badge className="bg-purple-600 text-white hover:bg-purple-600">Personal</Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 pt-2">
                      <Eye className="w-4 h-4" />
                      <span>Monitoring 247 subreddits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to spot<br />and act on opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Track what matters, discover what&apos;s next, and respond with AI — all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Keyword Tracking */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Keyword tracking</h3>
                <p className="text-gray-600">
                  Follow exact brand, competitor, and category keywords. Get alerted when they appear in new Reddit threads.
                </p>
              </CardContent>
            </Card>

            {/* Auto Keyword Extraction */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <Badge className="absolute top-4 right-4 bg-purple-100 text-purple-700 hover:bg-purple-100">New</Badge>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Auto keyword extraction</h3>
                <p className="text-gray-600">
                  Let AI surface emerging topics automatically so you never miss a timely conversation.
                </p>
              </CardContent>
            </Card>

            {/* Reddit Monitoring */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Reddit monitoring</h3>
                <p className="text-gray-600">
                  Watch target subreddits for relevant posts and comments as they happen — no manual searching.
                </p>
              </CardContent>
            </Card>

            {/* AI Comment Suggestions */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI comment suggestions</h3>
                <p className="text-gray-600">
                  Receive context-aware reply drafts tuned to your voice and goals. Approve and post fast.
                </p>
              </CardContent>
            </Card>

            {/* Dashboard & Alerts */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Dashboard & alerts</h3>
                <p className="text-gray-600">
                  Prioritized inbox, trends over time, and notifications that keep your team in the loop.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                A dashboard built for speed and clarity
              </h2>
              <p className="text-xl text-gray-600">
                Scan trending posts, prioritize outreach, and approve AI-suggested replies in seconds. No more lost chaos or manual keyword searches — just a clean inbox for Reddit opportunities.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></div>
                  <span className="text-gray-700">Prioritized inbox and threads</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></div>
                  <span className="text-gray-700">Thread context and sentiment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></div>
                  <span className="text-gray-700">Team invite and handoff</span>
                </li>
              </ul>
            </div>

            {/* Dashboard Card */}
            <Card className="bg-white shadow-2xl border-0">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Reddit Intelligence</h3>
                      <p className="text-xs text-gray-500">Live monitoring dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button size="sm" variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" /> Live updates
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Filter className="w-3 h-3 mr-1" /> Filter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">23</div>
                    <div className="text-sm text-emerald-600 font-medium">+12% Rush today</div>
                    <div className="text-xs text-gray-500 mt-1">Alerts</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">127%</div>
                    <div className="text-sm text-purple-600 font-medium">+4% this week</div>
                    <div className="text-xs text-gray-500 mt-1">Growth</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">247</div>
                    <div className="text-xs text-gray-500 mt-1">Monitored</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Recent Alerts</h4>
                    <Button variant="link" className="text-purple-600 text-sm p-0">View all</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="border border-purple-100">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">#startup</Badge>
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Amin</Badge>
                          <span className="text-xs text-gray-500">r/entrepreneur</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          &quot;Looking for a Reddit monitoring tool for my startup &quot;
                        </p>
                        <p className="text-xs text-gray-600">
                          One is asking about Reddit marketing tools that improved their...
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">2h ago • 3 comments • 12 upvotes</span>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-7">Reply</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-100">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">#ai</Badge>
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Freelancers</Badge>
                          <span className="text-xs text-gray-500">r/SaaS</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                           &quot;AI-powered social media monitoring - any recommendations? &quot;
                        </p>
                        <p className="text-xs text-gray-600">
                          Looking for tools to showcase an AI capabilities, help commercial...
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">5h ago • 8 comments • 24 upvotes</span>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-7">Reply</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-900">AI Suggestions</span>
                          </div>
                          <Badge className="bg-purple-600 text-white hover:bg-purple-600">2 ready</Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          We&apos;ve generated personalized replies for the top opportunities. Review and approve to engage.
                        </p>
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white flex-1 h-7">
                            Browse Suggestions
                          </Button>
                          <Button size="sm" variant="outline" className="h-7">Customize</Button>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 pt-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+23% this week</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Reddit Intelligence</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start tracking conversations that convert
          </h2>
          
          <p className="text-xl text-purple-100 mb-10">
            Access to keyword tracking, subreddit monitoring, and AI comment suggestions.
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl"
          >
            Schedule Demo <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
       
    </>
  );
}