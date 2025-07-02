import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Headset, 
  ArrowRight, 
  CreditCard, 
  Wallet, 
  PiggyBank,
  Phone,
  MessageSquare,
  FileText,
  MessageCircleHeart,
  Sparkles,
  Cloud,
  BarChart2,
  TrendingUp,
  Building,
  Clock,
  BarChart3,
  Gavel,
  RefreshCw,
  RotateCcw
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import MetaTags from "@/components/layout/meta-tags";
// Using official Erase Debt SA logo
const eraseDebtLogo = "/erase-debt-logo.jpg";
// Using official Erase Debt SA logo for footer
const footerLogo = "/erase-debt-logo.jpg";
const trackApplicationImage = "/erase-debt-logo.svg";
import PennySvgIcon from "@/components/chatbot/PennySvgIcon";
import PennyLogo from "@/components/chatbot/PennyLogo";
const trackApplicationImage2 = "/erase-debt-logo.svg";
const submitQueryImage = "/erase-debt-logo.svg";
const submitQueryMaleImage = "/erase-debt-logo.svg";
const submitQueryMaleImage2 = "/erase-debt-logo.svg";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactFormFallback } from "@/components/ContactFormFallback";
import { CreditCoach } from "@/components/chatbot/CreditCoach";
import TermsNavigation from "@/components/TermsNavigation";

export default function HomePage() {
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth provider not available");
  }
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={eraseDebtLogo} alt="Erase Debt SA Logo" className="h-10 object-contain" style={{maxWidth: '220px'}} />
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/contact">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/submit-ticket">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Query
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/track-ticket">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Track Query
                </Link>
              </Button>

              {user ? (
                <Button asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/auth">
                      <Users className="h-4 w-4 mr-2" />
                      Staff Login
                    </Link>
                  </Button>
                  <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/super-admin">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Super Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned without contact form */}
      <div className="relative bg-gradient-to-r from-[#2680b3] to-[#3d4f58]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Erase Debt SA Client Support
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Application tracking made simple. Get administrative support and track the progress of your application through our dedicated client support platform.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-[#2680b3] hover:bg-blue-50">
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-[#3d4f58] text-white border-white hover:bg-[#3d4f58]/80">
                <Link href="/submit-ticket">
                  Submit a Query
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-[#3d4f58] text-white border-white hover:bg-[#3d4f58]/80">
                <Link href="/track-ticket">
                  Track Your Query
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-[#3d4f58]">
                <Link href="/auth">
                  Staff Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Section - Moved to its own section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Your Query</h2>
            <p className="text-gray-600 mb-6">
              Fill in the form below to submit your query. A customer service representative will contact you as soon as possible. 
              You'll receive an email with a reference number that you can use to track the progress of your query at any time.
            </p>
            <ContactFormFallback />
          </div>
        </div>
      </div>

      {/* Hero Features Section with Side Images */}
      <div className="py-16 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Dedicated Support for Your Debt Clearance Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our Client Care Hub provides you with everything needed to track and resolve your queries with Erase Debt SA.
            </p>
          </div>
          
          {/* Submit a query section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900">Submit a Query</h3>
                <p className="mt-4 text-gray-700">
                  Tell us about your situation, and our team will call you back to discuss your needs and provide personalized support.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Quick and easy online submission</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Personal callback from our support team</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Comprehensive support throughout your application</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="bg-[#2680b3] hover:bg-[#2680b3]/90">
                    <Link href="/submit-ticket">Submit a Query</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl order-1 md:order-2">
              <img 
                src={submitQueryImage} 
                alt="Submit a Query - Our team will call you back" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Client Portal Section */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Client Portal</h3>
            <p className="text-gray-600 mb-6 text-center">
              Track your service progress and queries in one place. Enter your South African ID number below.
            </p>
            
            <div className="max-w-2xl mx-auto">
              {/* Client Lookup Form embedded directly in the home page */}
              <div className="p-6 bg-white rounded-lg border">
                <h4 className="text-xl font-semibold mb-4">Track Your Service</h4>
                <p className="text-gray-600 mb-4">Enter your South African ID number to view your service details and payment history</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      South African ID Number
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      placeholder="13 digit ID number"
                      className="w-full p-2 border rounded-md"
                      maxLength={13}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => window.location.href = `/track-service?idNumber=${(document.getElementById('idNumber') as HTMLInputElement)?.value}`}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Look Up Service
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('idNumber') as HTMLInputElement;
                        if (input) input.value = '8804015196086';
                      }}
                    >
                      Try Demo (Test ID: 8804015196086)
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-xl font-semibold mb-2">Track Your Query</h4>
                  <p className="text-gray-600 mb-4">Follow up on your submitted queries</p>
                  <Button asChild className="w-full">
                    <Link href="/track-query">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Track Query Status
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-xl font-semibold mb-2">Submit New Query</h4>
                  <p className="text-gray-600 mb-4">Need help? Submit a new support query</p>
                  <Button asChild className="w-full">
                    <Link href="/submit-query">
                      <MessageCircleHeart className="mr-2 h-4 w-4" />
                      Submit a Query
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* We're just a click away */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={submitQueryMaleImage} 
                alt="We're Just a Click Away - Support When You Need It" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900">We're Just a Click Away</h3>
                <p className="mt-4 text-gray-700">
                  Our support team is ready to provide assistance and answer any questions you may have about our services.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Assistance with existing applications</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Immediate response to urgent inquiries</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Personalized guidance for your situation</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="bg-[#2680b3] hover:bg-[#2680b3]/90">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Section */}
      <div className="py-16 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Restore Your Credit Score
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive credit bureau clearance services are designed to help you reclaim your financial health.
            </p>
          </div>
          
          {/* Credit Score Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900">Clear Your Name. Restore Your Score.</h3>
                <p className="mt-4 text-gray-700">
                  We specialize in identifying and removing incorrect listings from your credit report, helping you improve your credit score and financial standing.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Expert analysis of your credit report</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Strategic removal of incorrect listings</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Tailored solutions for your unique situation</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="bg-[#2680b3] hover:bg-[#2680b3]/90">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl order-1 md:order-2">
              <img 
                src={submitQueryMaleImage2} 
                alt="Improve your credit score with Erase Debt SA" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>



      {/* Credit Coach Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-100 to-emerald-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              NEW FEATURE
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Penny, Your Credit Coach
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get friendly, educational guidance on credit scores, budgeting, and financial planning with our AI-powered credit coach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg border border-emerald-100">
                <div className="flex items-center mb-6">
                  <PennySvgIcon size={48} />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">Penny</h3>
                    <p className="text-emerald-600">Your Personal Credit Coach</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Looking to improve your financial literacy? Penny is here to help you understand:
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Credit scores and reports</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Budgeting and expense management</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Debt repayment strategies</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Savings and spending habits</p>
                  </li>
                </ul>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/credit-coach">
                      Chat with Penny
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                    <Link href="/financial-education">
                      Interactive Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-emerald-100 h-[400px] flex flex-col">
              <div className="flex items-center p-3 border-b">
                <PennySvgIcon size={40} />
                <div className="ml-3">
                  <h3 className="font-semibold">Penny</h3>
                  <p className="text-xs text-gray-500">Credit Coach</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-start">
                  <div className="mr-2">
                    <PennySvgIcon size={32} />
                  </div>
                  <div className="bg-gray-200 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hi there! I'm Penny, your Credit Coach. How can I help you today?</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-end">
                  <div className="bg-emerald-600 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">How can I improve my credit score?</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center ml-2">
                    <span className="text-emerald-600 text-sm font-semibold">You</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-2">
                    <PennySvgIcon size={32} />
                  </div>
                  <div className="bg-gray-200 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Great question! Here are some key ways to improve your credit score:</p>
                    <p className="text-sm mt-2">1. Pay all bills on time</p>
                    <p className="text-sm">2. Reduce credit card balances</p>
                    <p className="text-sm">3. Avoid applying for new credit frequently</p>
                    <p className="text-sm">4. Check your credit report for errors</p>
                    <p className="text-sm mt-2">Would you like more specific information about any of these steps?</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t flex items-center">
                <span className="text-sm text-gray-500 italic">Chat preview - Try it out now!</span>
                <Button asChild size="sm" className="ml-auto bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/credit-coach">Start chatting</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Application Section */}
      <div className="py-16 bg-gray-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Track Your Application Progress
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated on your application status and receive the support you need throughout the process.
            </p>
          </div>
          
          {/* First Track Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900">Track Your Application. Get Support. Clear Your Name.</h3>
                <p className="mt-4 text-gray-700">
                  Our tracking system allows you to monitor your application's progress in real-time. Stay informed at every step of your journey toward financial freedom.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Real-time application status updates</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Direct communication with your assigned agent</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Secure and confidential communication</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="bg-[#2680b3] hover:bg-[#2680b3]/90">
                    <Link href="/track-ticket">Track Your Query</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl order-1 md:order-2">
              <img 
                src={trackApplicationImage} 
                alt="Track Your Application. Get Support. Clear Your Name." 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Mobile Support Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={trackApplicationImage2} 
                alt="Expert Support Team Ready to Help - Erase Debt SA" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900">Expert Support at Your Fingertips</h3>
                <p className="mt-4 text-gray-700">
                  Our support team is available to assist you with your application. Get personalized help via phone, email, or through our online portal.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Mobile-friendly tracking system</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Video support options available</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">Instant notifications on application updates</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="bg-[#2680b3] hover:bg-[#2680b3]/90">
                    <Link href="/submit-ticket">Get Started Today</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Animation Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Visualize Your Credit Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our interactive credit score simulator helps you understand how different financial decisions impact your credit health over time.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <BarChart2 className="h-7 w-7 text-amber-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Credit Score Simulator</h3>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    New
                  </span>
                </div>
                
                <p className="text-gray-700 mb-6">
                  See how your credit score changes based on your financial decisions. Our interactive simulator shows you:
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="ml-3 text-gray-700">Impact of on-time payments</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="ml-3 text-gray-700">Effects of credit utilization</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="ml-3 text-gray-700">Benefits of debt reduction</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="ml-3 text-gray-700">Personalized improvement tips</p>
                  </li>
                </ul>
                
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/credit-score">
                    Try the Simulator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Credit score gauge visualization */}
                  <div className="absolute inset-0 rounded-full border-[20px] border-gray-200 opacity-30"></div>
                  <div className="absolute inset-0 rounded-full border-[20px]" 
                    style={{ 
                      borderColor: '#7cb342', 
                      clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 0 30%)',
                    }}>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold">720</div>
                    <div className="text-lg font-medium mt-1" style={{ color: '#7cb342' }}>Good</div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span>Improving</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2680b3]">
        <div className="w-full max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Need help with your application?</span>
            <span className="block text-blue-200">Contact our support team today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button asChild className="bg-white text-[#2680b3] hover:bg-blue-50" size="lg">
                <Link href="/submit-ticket">
                  Submit a Query
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Service Terms and Information
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              View detailed terms and conditions for each of our services. All our processes adhere to the National Credit Act and relevant regulations.
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <h4 className="font-semibold text-lg mb-4">Service Terms & Conditions</h4>
            <TermsNavigation />
            
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex gap-3">
                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Important Note:</h3>
                  <p className="text-gray-700 mt-1">
                    Erase Debt SA is not a Financial Service Provider and does not offer financial advice. 
                    Our services are administrative in nature, focusing on providing support with credit bureau 
                    records and applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#3d4f58]">
        <div className="w-full max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-b border-gray-600 pb-8">
            <div className="flex items-center">
              <img src={footerLogo} alt="Erase Debt SA Logo" className="h-12 object-contain rounded" style={{maxWidth: '240px'}} />
              <span className="ml-3 text-xl font-bold text-white">Client Care Hub</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-base text-gray-300">
                &copy; {new Date().getFullYear()} Erase Debt SA. All rights reserved.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Erase Debt SA is not a Financial Service Provider.
              </p>
              <p className="mt-2 text-sm text-blue-400">
                erasedebtsa.net
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Service Terms</h4>
              <TermsNavigation compact className="text-gray-300" showTitle={false} />
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/submit-ticket" className="text-gray-300 hover:text-white text-sm">
                    Submit a Query
                  </Link>
                </li>
                <li>
                  <Link href="/track-ticket" className="text-gray-300 hover:text-white text-sm">
                    Track Your Query
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white text-sm">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Credit Coach Chatbot */}
      <CreditCoach />
    </div>
  );
}
