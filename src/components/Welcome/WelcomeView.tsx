import React from 'react';
// Removed motion import
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Shield,
  Layers,
  Star,
  Zap,
} from 'lucide-react';

interface WelcomeViewProps {
  onGetStarted: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Intuitive Task Board',
      description: 'Visualize workflow with drag-and-drop ease.',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Keep your team synced and productive.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Instant progress tracking across devices.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your project data is safe and always accessible.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50M+', label: 'Tasks Completed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      text: "This tool has transformed how our team collaborates. It's intuitive and powerful!",
      author: "Priyanshu Chawda",
      role: "Product Manager",
      rating: 5
    },
    {
      text: "The best project management solution we've used. The UI is beautiful and functional.",
      author: "Madhura Mule",
      role: "Tech Lead",
      rating: 5
    },
    {
      text: "Game-changer for our remote team. Everything we need in one place.",
      author: "Aditya Gayal",
      role: "Operations Director",
      rating: 5
    }
  ];

  // Removed unused itemVariants and containerVariants

  return (
    // Removed motion background elements
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20">
          {/* Removed motion wrapper */}
          <div className="flex items-center gap-2">
            <Layers className="w-8 h-8 text-primary" />
            {/* Use solid primary color for better visibility */}
            <h1 className="text-2xl font-bold text-primary"> 
              Project Hub
            </h1>
          </div>
          {/* Removed motion wrapper */}
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-primary/90 text-primary-foreground rounded-md hover:bg-primary transition-all shadow-lg hover:shadow-primary/25"
            // Removed motion props
          >
            Get Started
          </button> {/* Corrected closing tag */}
        </nav>

        {/* Hero Section */}
        {/* Removed motion wrapper */}
        <div className="text-center mb-32">
          {/* Removed motion wrapper */}
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground">
            <span> {/* Removed gradient spans */}
              Manage Projects,
            </span>
            <br />
            <span> {/* Removed gradient spans */}
              Masterfully.
            </span>
          </h2>
          {/* Removed motion wrapper */}
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10">
            Your ultimate command center for seamless project management.
            Elevate team collaboration and deliver exceptional results.
          </p>
          {/* Removed motion wrapper */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            // Removed motion props
          >
            Launch Your Board
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Stats Section */}
        {/* Removed motion wrapper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
          {stats.map((stat) => ( // Removed unused index parameter
            // Removed motion wrapper
            <div
              key={stat.label}
              className="text-center p-6 glass-effect rounded-lg"
              // Removed motion props
            >
              {/* Removed motion wrapper */}
              <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                {stat.value}
              </h3>
              {/* Removed motion wrapper */}
              <p className="text-foreground/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        {/* Removed motion wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map(feature => (
            // Removed motion wrapper
            <div
              key={feature.title}
              // Removed motion props
              className="glass-effect p-8 rounded-xl shadow-soft-xl hover:shadow-soft-2xl transition-all duration-300 border border-primary/10"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              {/* Ensure feature title has good contrast */}
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3> 
               {/* Use slightly less muted foreground */}
              <p className="text-foreground/80">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        {/* Removed motion wrapper */}
        <div className="mb-32">
          {/* Removed motion wrapper */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Loved by Teams Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              // Removed motion wrapper
              <div
                key={testimonial.author}
                // Removed motion props
                className="glass-effect p-8 rounded-xl relative"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                 {/* Ensure testimonial text has good contrast */}
                <p className="text-lg mb-6 text-card-foreground/90">{testimonial.text}</p>
                <div>
                   {/* Ensure author name has good contrast */}
                  <p className="font-semibold text-card-foreground">{testimonial.author}</p>
                   {/* Use slightly less muted foreground */}
                  <p className="text-foreground/80">{testimonial.role}</p> 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {/* Removed motion wrapper */}
        <div className="text-center py-32 glass-effect rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
           {/* Use slightly less muted foreground */}
          <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of teams already using Project Hub to achieve their goals.
          </p>
          {/* Removed motion wrapper */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            // Removed motion props
          >
            Start Free Trial
            <Zap className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform duration-300" />
          </button> {/* Corrected closing tag */}
        </div> {/* Corrected closing tag */}
      </div>
    </div>
  );
};

export default WelcomeView;
