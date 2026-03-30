/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scissors, 
  Sparkles, 
  Heart, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Palette,
  UserCheck
} from 'lucide-react';

const services = [
  {
    icon: <Scissors className="w-8 h-8" />,
    name: "Hair Artistry",
    description: "Precision cuts, luxury coloring, and professional styling tailored to your unique personality.",
    link: "#booking"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    name: "Skin Rejuvenation",
    description: "Advanced facials and skin treatments designed to restore your natural radiance and glow.",
    link: "#booking"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    name: "Nail Couture",
    description: "Exquisite manicures and pedicures with premium polishes and artistic designs.",
    link: "#booking"
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    name: "Makeup Design",
    description: "Professional makeup application for weddings, events, or your everyday glamorous look.",
    link: "#booking"
  }
];

const testimonials = [
  {
    name: "Maria Santos",
    text: "The best salon experience in Cebu! The staff is incredibly professional and the atmosphere is so luxurious. My hair has never looked better.",
    rating: 5
  },
  {
    name: "James Lee",
    text: "I love how inclusive and welcoming Premiereglow is. As a member of the LGBTQ+ community, I felt completely at home and respected.",
    rating: 5
  },
  {
    name: "Elena Cruz",
    text: "Conveniently located in CityMall. I always drop by for a quick nail service and they never disappoint. 4.9 stars is well-deserved!",
    rating: 5
  }
];

const features = [
  {
    icon: <Star className="w-6 h-6 text-rose-gold" />,
    title: "Expert Stylists",
    description: "Our team consists of highly trained professionals with years of experience in the beauty industry."
  },
  {
    icon: <Heart className="w-6 h-6 text-rose-gold" />,
    title: "Inclusive Space",
    description: "We pride ourselves on being an LGBTQ+ friendly sanctuary where everyone is celebrated."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-rose-gold" />,
    title: "Premium Products",
    description: "We use only the finest, high-end products to ensure the best results for your hair and skin."
  },
  {
    icon: <MapPin className="w-6 h-6 text-rose-gold" />,
    title: "Convenient Location",
    description: "Located at the heart of Cebu in CityMall Bacalso, making luxury beauty accessible."
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-soft-black/90 backdrop-blur-md border-b border-rose-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <span className="text-2xl font-serif font-bold text-champagne tracking-wider">PREMIEREGLOW</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#about" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">About</a>
                <a href="#services" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Services</a>
                <a href="#reviews" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Reviews</a>
                <a href="#location" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Location</a>
                <a href="#booking" className="bg-rose-gold text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-deep-rose transition-all glow-effect">Book Now</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-champagne hover:text-rose-gold p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-soft-black border-b border-rose-gold/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">About</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Services</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Reviews</a>
              <a href="#location" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Location</a>
              <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-rose-gold block px-3 py-4 text-base font-bold">Book Now</a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Salon Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-luxury-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif text-champagne mb-6 tracking-tight">
              Premiereglow <span className="italic block md:inline">Centrale</span>
            </h1>
            <p className="text-xl md:text-2xl text-champagne/90 font-light mb-10 tracking-[0.2em] uppercase">
              Where Every Look Becomes a Statement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#booking" className="bg-rose-gold text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-deep-rose transition-all glow-effect">
                Book an Appointment
              </a>
              <a href="#services" className="border border-champagne text-champagne px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-champagne hover:text-soft-black transition-all">
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>

        {/* Animated Glow Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-rose-gold/20 to-transparent blur-3xl pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                Crafting Beauty with <span className="italic text-rose-gold">Elegance and Care</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Located on the 2nd Floor of CityMall Bacalso, Premiereglow Centrale is more than just a salon; it's a sanctuary of self-expression. We believe that beauty is personal, and our mission is to provide a premium experience that celebrates your individuality.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                As a proudly LGBTQ+ friendly establishment, we foster an inclusive environment where everyone feels seen, respected, and pampered. Our commitment to excellence is reflected in our 4.9-star rating and the smiles of our loyal clients across Cebu.
              </p>
              
              <div className="flex flex-wrap gap-8 items-center pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex text-rose-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <span className="font-bold text-soft-black">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-gold" />
                  <span className="font-bold text-soft-black">LGBTQ+ Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-rose-gold" />
                  <span className="font-bold text-soft-black">Cebu-Based</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000" 
                  alt="Stylist at work" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-champagne rounded-2xl -z-10 hidden lg:block"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-champagne/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-serif mb-4">Our Signature Services</motion.h2>
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.1 }}
              className="w-24 h-1 bg-rose-gold mx-auto mb-6"
            ></motion.div>
            <motion.p 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Discover our curated range of beauty treatments designed to enhance your natural features and provide ultimate relaxation.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-rose-gold/5"
              >
                <div className="text-rose-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-serif mb-4">{service.name}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {service.description}
                </p>
                <a 
                  href={service.link} 
                  className="inline-flex items-center text-rose-gold font-bold text-xs uppercase tracking-widest hover:text-deep-rose transition-colors"
                >
                  Book Now <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-soft-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif mb-12 text-champagne">Why Premiereglow?</h2>
              <div className="space-y-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-gold/20 flex items-center justify-center border border-rose-gold/30">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif mb-2 text-champagne/90">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              className="relative lg:h-[600px]"
            >
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4 mt-12">
                  <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" alt="Salon Detail" className="rounded-2xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
                  <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=400" alt="Salon Detail" className="rounded-2xl w-full h-80 object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=400" alt="Salon Detail" className="rounded-2xl w-full h-80 object-cover" referrerPolicy="no-referrer" />
                  <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400" alt="Salon Detail" className="rounded-2xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-gold/10 blur-[100px] pointer-events-none"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Client Love</h2>
            <div className="w-24 h-1 bg-rose-gold mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                className="bg-champagne/10 p-10 rounded-3xl border border-champagne/20 relative"
              >
                <div className="flex text-rose-gold mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-gold/20 flex items-center justify-center font-bold text-rose-gold">
                    {testimonial.name[0]}
                  </div>
                  <span className="font-bold text-soft-black">{testimonial.name}</span>
                </div>
                <MessageSquare className="absolute top-8 right-8 w-12 h-12 text-rose-gold/5" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours Section */}
      <section id="location" className="py-24 bg-champagne/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Visit Our Sanctuary</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <MapPin className="w-6 h-6 text-rose-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-gray-600">2nd Floor, CityMall Bacalso, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <Clock className="w-6 h-6 text-rose-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-600">Open Daily: 10:00 AM – 9:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <Phone className="w-6 h-6 text-rose-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Contact</h3>
                    <p className="text-gray-600">0998 258 4178</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-8 bg-white rounded-2xl shadow-sm border border-rose-gold/10">
                <h4 className="font-serif text-2xl mb-4 italic">Ready to glow?</h4>
                <p className="text-gray-600 mb-6">We're located in a prime spot at CityMall Bacalso, easily accessible with ample parking for your convenience.</p>
                <a href="#booking" className="text-rose-gold font-bold uppercase tracking-widest text-sm flex items-center hover:text-deep-rose transition-colors">
                  Get Directions <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.617834468641!2d123.882414175841!3d10.292323968615364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999663737920b%3A0x7d06987f6e3c563e!2sCityMall%20Bacalso!5e0!3m2!1sen!2sph!4v1711765000000!5m2!1sen!2sph" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking / Contact CTA Section */}
      <section id="booking" className="py-24 bg-soft-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 {...fadeIn} className="text-4xl md:text-6xl font-serif mb-6 text-champagne">Ready to Glow?</motion.h2>
            <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="text-xl text-champagne/70 font-light">Book Your Appointment Today</motion.p>
          </div>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10"
          >
            <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Name</label>
                <input type="text" placeholder="Your Full Name" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Phone</label>
                <input type="tel" placeholder="09XX XXX XXXX" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Service</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white/70">
                  <option className="bg-soft-black">Select a Service</option>
                  <option className="bg-soft-black">Hair Artistry</option>
                  <option className="bg-soft-black">Skin Rejuvenation</option>
                  <option className="bg-soft-black">Nail Couture</option>
                  <option className="bg-soft-black">Makeup Design</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Preferred Date</label>
                <input type="date" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white/70" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Message</label>
                <textarea rows={4} placeholder="Any special requests or details?" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30"></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button className="w-full bg-rose-gold text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-deep-rose transition-all glow-effect text-lg">
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-soft-black text-white pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <span className="text-3xl font-serif font-bold text-champagne tracking-wider block mb-4">PREMIEREGLOW</span>
              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                Elevating beauty standards in Cebu through expert artistry and an inclusive, luxury experience.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-gold transition-colors border border-white/10">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-gold transition-colors border border-white/10">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-gold transition-colors border border-white/10">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-champagne font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-rose-gold transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-rose-gold transition-colors">Our Services</a></li>
                <li><a href="#reviews" className="hover:text-rose-gold transition-colors">Testimonials</a></li>
                <li><a href="#location" className="hover:text-rose-gold transition-colors">Find Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-champagne font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-rose-gold" /> 0998 258 4178</li>
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-rose-gold mt-1" /> CityMall Bacalso, Cebu City</li>
                <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-gold" /> LGBTQ+ Friendly</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-500 tracking-widest uppercase">
            <p>&copy; {new Date().getFullYear()} Premiereglow Centrale. All rights reserved. | Crafted with Elegance in Cebu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
