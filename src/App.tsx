/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  UserCheck,
  Calendar as CalendarIcon,
  Loader2,
  AlertCircle,
  Eye,
  Droplets
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const services = [
  {
    icon: <Palette className="w-8 h-8" />,
    name: "Acrylic nails",
    description: "Durable and beautiful nail extensions with custom designs.",
    link: "#booking"
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    name: "Balayage",
    description: "Hand-painted highlights for a natural, sun-kissed look.",
    link: "#booking"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    name: "Body waxing",
    description: "Smooth and long-lasting hair removal for various body areas.",
    link: "#booking"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    name: "Brazilian waxing",
    description: "Complete and professional hair removal for the bikini area.",
    link: "#booking"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    name: "Eyelash extensions",
    description: "Enhance your eyes with fuller, longer, and natural-looking lashes.",
    link: "#booking"
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    name: "Hair extensions",
    description: "Add length and volume to your hair with premium extensions.",
    link: "#booking"
  },
  {
    icon: <Scissors className="w-8 h-8" />,
    name: "Hairstyling",
    description: "Professional styling for everyday elegance or special occasions.",
    link: "#booking"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    name: "Lash lift",
    description: "A semi-permanent treatment that gives your natural lashes an upward curl.",
    link: "#booking"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    name: "Pedicure",
    description: "Relaxing foot care, nail shaping, and polish application.",
    link: "#booking"
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    name: "Shampoo & conditioning",
    description: "Deep cleansing and nourishing treatments for healthy hair.",
    link: "#booking"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    name: "Waxing",
    description: "Quick and effective hair removal services.",
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

const branches = [
  {
    id: 'centrale',
    name: 'Premiereglow Centrale',
    location: '2nd Floor, CityMall Bacalso, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu',
    rating: 4.9,
    reviews: 12,
    hours: 'Open until 9 PM daily',
    contact: '0998 258 4178',
    image: 'https://images.unsplash.com/photo-1521590832167-7bfc17484d20?auto=format&fit=crop&q=80',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.5564356453!2d123.894!3d10.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDE4JzAwLjAiTiAxMjPCsDUzJzM4LjQiRQ!5e0!3m2!1sen!2sph!4v1600000000000!5m2!1sen!2sph'
  },
  {
    id: 'banilad',
    name: 'Premiereglow Banilad',
    location: '2nd Floor, Gaisano Country Mall, Gov. M. Cuenco Ave, Cebu City, 6000 Cebu',
    rating: 3.7,
    reviews: 3,
    hours: 'Open until 8 PM daily',
    contact: '0998 258 4178',
    facebook: 'facebook.com',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.364567!2d123.908!3d10.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzI0LjAiTiAxMjPCsDU0JzI4LjgiRQ!5e0!3m2!1sen!2sph!4v1600000000000!5m2!1sen!2sph'
  },
  {
    id: 'south',
    name: 'Premiereglow South',
    location: '2nd Floor, South Town Center, Talisay, 6045 Cebu',
    rating: 4.7,
    reviews: 12,
    hours: 'Open until 8 PM daily',
    contact: '0998 258 4178',
    image: 'https://images.unsplash.com/photo-1516975080661-418052bc0a56?auto=format&fit=crop&q=80',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.2!2d123.84!3d10.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDE1JzAwLjAiTiAxMjPCsDUwJzI0LjAiRQ!5e0!3m2!1sen!2sph!4v1600000000000!5m2!1sen!2sph'
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
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    branchId: 'centrale',
    branchName: 'Premiereglow Centrale',
    serviceId: '',
    serviceName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Map Tab State
  const [activeMapTab, setActiveMapTab] = useState('centrale');

  const groupedTimeSlots = useMemo(() => {
    const groups: { hourLabel: string; slots: { value: string; label: string }[] }[] = [];
    for (let i = 9; i <= 20; i++) {
      const ampm = i >= 12 ? 'PM' : 'AM';
      const displayHour = i > 12 ? i - 12 : i;
      const hourSlots = [];
      for (let m of [0, 15, 30, 45]) {
        const timeString = `${i.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const label = `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
        hourSlots.push({ value: timeString, label });
      }
      groups.push({
        hourLabel: `${displayHour}:00 ${ampm}`,
        slots: hourSlots
      });
    }
    return groups;
  }, []);

  const handleBookingSubmit = (e: any) => {
    e.preventDefault();
    if (!bookingData.serviceId || !bookingData.time) {
      setBookingStatus('error');
      setErrorMessage('Please select a service and time slot.');
      return;
    }
    
    // Validate time is within store hours (09:00 to 20:59)
    const [hours, minutes] = bookingData.time.split(':').map(Number);
    if (hours < 9 || hours > 20) {
      setBookingStatus('error');
      setErrorMessage('Please select a time within our open hours (9:00 AM - 9:00 PM).');
      return;
    }

    // Check if time is in the past
    const isToday = bookingData.date === format(new Date(), 'yyyy-MM-dd');
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const [selectedHourStr, selectedMinuteStr] = bookingData.time.split(':');
    const selectedHour = parseInt(selectedHourStr);
    const selectedMinute = parseInt(selectedMinuteStr);

    if (isToday && (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute <= currentMinute))) {
      setBookingStatus('error');
      setErrorMessage('This time has already passed. Please select a future time.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    setIsSubmitting(true);
    setBookingStatus('idle');
    setShowConfirmation(false);

    try {
      const templateParams = {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        branch: bookingData.branchName,
        service: bookingData.serviceName,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes
      };

      const emailJsPayload = {
        service_id: 'YOUR_EMAILJS_SERVICE_ID',
        template_id: 'YOUR_EMAILJS_TEMPLATE_ID',
        user_id: 'YOUR_EMAILJS_PUBLIC_KEY',
        template_params: templateParams
      };

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailJsPayload)
        });

        if (!response.ok) {
          console.warn('EmailJS not configured or failed, but proceeding with success UI as requested.');
        }
      } catch (e) {
        console.warn('EmailJS fetch failed, proceeding with success UI as requested.', e);
      }

      setBookingStatus('success');
      setBookingData({
        name: '',
        email: '',
        phone: '',
        branchId: bookingData.branchId,
        branchName: bookingData.branchName,
        serviceId: '',
        serviceName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '',
        notes: ''
      });
      setTimeout(() => setBookingStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setBookingStatus('error');
      setErrorMessage('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showFloatingBook, setShowFloatingBook] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowFloatingBook(true);
      } else {
        setShowFloatingBook(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Book Now Button */}
      <AnimatePresence>
        {showFloatingBook && (
          <motion.a
            href="#branches"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-rose-gold text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group glow-effect"
          >
            <CalendarIcon className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold uppercase tracking-widest text-xs">
              Book Now
            </span>
          </motion.a>
        )}
      </AnimatePresence>

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
                <a href="#branches" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Branches</a>
                <a href="#services" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Services</a>
                <a href="#reviews" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Reviews</a>
                <a href="#location" className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest">Location</a>
                <a href="#branches" className="bg-rose-gold text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-deep-rose transition-all glow-effect">Book Now</a>
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
              <a href="#branches" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Branches</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Services</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Reviews</a>
              <a href="#location" onClick={() => setIsMenuOpen(false)} className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10">Location</a>
              <a href="#branches" onClick={() => setIsMenuOpen(false)} className="text-rose-gold block px-3 py-4 text-base font-bold">Book Now</a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.postimg.cc/sfb3nNdx/storefront.jpg" 
            alt="Premiereglow Storefront" 
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a 
                href="#branches" 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(183, 110, 121, 0.4)", "0 0 40px rgba(183, 110, 121, 0.8)", "0 0 20px rgba(183, 110, 121, 0.4)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-rose-gold text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-deep-rose transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Book an Appointment
              </motion.a>
              <a href="#services" className="border border-champagne text-champagne px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-champagne hover:text-soft-black transition-all flex items-center justify-center">
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

      {/* Branches Section */}
      <section id="branches" className="py-24 bg-champagne/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full border border-rose-gold/30 text-rose-gold text-[10px] uppercase font-bold tracking-[0.3em] mb-6"
            >
              Our Locations
            </motion.div>
            <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Choose Your <span className="italic text-rose-gold">Branch</span>
            </motion.h2>
          </div>

          {/* Branch Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {branches.map((branch, index) => {
              const isSelected = bookingData.branchId === branch.id;
              return (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setBookingData({ ...bookingData, branchId: branch.id, branchName: branch.name });
                    setActiveMapTab(branch.id);
                  }}
                  className={`relative cursor-pointer rounded-3xl overflow-hidden bg-white transition-all duration-300 group ${
                    isSelected 
                      ? 'ring-2 ring-rose-gold shadow-[0_0_30px_rgba(183,110,121,0.3)] -translate-y-2' 
                      : 'hover:shadow-xl hover:-translate-y-1 border border-rose-gold/10'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-20 bg-rose-gold text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className="h-48 relative overflow-hidden">
                    <img src={branch.image} alt={branch.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-soft-black/90 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-6 text-2xl font-serif text-white">{branch.name}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-rose-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-soft-black">{branch.rating}</span>
                      <span className="text-sm text-gray-500">({branch.reviews} reviews)</span>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-rose-gold flex-shrink-0 mt-0.5" />
                        <span>{branch.location}</span>
                      </div>
                      <div className="flex gap-3">
                        <Clock className="w-4 h-4 text-rose-gold flex-shrink-0 mt-0.5" />
                        <span>{branch.hours}</span>
                      </div>
                      <div className="flex gap-3">
                        <Phone className="w-4 h-4 text-rose-gold flex-shrink-0 mt-0.5" />
                        <span>{branch.contact}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-gold">
                      <Heart className="w-4 h-4" />
                      LGBTQ+ Friendly
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Map Tabs */}
          <motion.div {...fadeIn} className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-xl border border-rose-gold/10">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
              {branches.map(branch => (
                <button
                  key={`tab-${branch.id}`}
                  onClick={() => setActiveMapTab(branch.id)}
                  className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                    activeMapTab === branch.id
                      ? 'bg-rose-gold text-white shadow-lg'
                      : 'bg-champagne/10 text-soft-black hover:bg-champagne/30'
                  }`}
                >
                  {branch.name.replace('Premiereglow ', '')}
                </button>
              ))}
            </div>
            <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-champagne/20">
              {branches.map(branch => (
                <iframe
                  key={`map-${branch.id}`}
                  src={branch.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: activeMapTab === branch.id ? 'block' : 'none' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking / Contact CTA Section */}
      <section id="booking" className="py-32 bg-soft-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-gold/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-gold/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full border border-rose-gold/30 text-rose-gold text-[10px] uppercase font-bold tracking-[0.3em] mb-6"
            >
              Exclusive Experience
            </motion.div>
            <motion.h2 {...fadeIn} className="text-5xl md:text-7xl font-serif mb-6 text-champagne leading-tight">
              Ready to <span className="italic text-rose-gold">Glow?</span>
            </motion.h2>
            <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="text-xl text-champagne/70 font-light max-w-2xl mx-auto">
              Secure your spot at Premiereglow Centrale and let our experts transform your look.
            </motion.p>
          </div>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-2xl p-8 md:p-16 rounded-[2.5rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          >
            {bookingStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-rose-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-rose-gold" />
                </div>
                <h3 className="text-3xl font-serif text-champagne mb-4">Booking Confirmed!</h3>
                <p className="text-champagne/70 mb-8">We've received your request. Our team will contact you shortly to confirm your slot.</p>
                <button 
                  onClick={() => setBookingStatus('idle')}
                  className="bg-rose-gold text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-deep-rose transition-all"
                >
                  Book Another
                </button>
              </motion.div>
            ) : (
              <form className="grid md:grid-cols-2 gap-6" onSubmit={handleBookingSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    placeholder="Your Full Name" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    placeholder="your@email.com" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Phone</label>
                  <input 
                    required
                    type="tel" 
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                    placeholder="09XX XXX XXXX" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Branch</label>
                  <select 
                    required
                    value={bookingData.branchId}
                    onChange={(e) => {
                      const branch = branches.find(b => b.id === e.target.value);
                      setBookingData({...bookingData, branchId: e.target.value, branchName: branch?.name || ''});
                      setActiveMapTab(e.target.value);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white/70"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-soft-black">{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Service</label>
                  <select 
                    required
                    value={bookingData.serviceName}
                    onChange={(e) => setBookingData({...bookingData, serviceName: e.target.value, serviceId: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white/70"
                  >
                    <option value="" className="bg-soft-black">Select a Service</option>
                    {services.map((s, i) => (
                      <option key={i} value={s.name} className="bg-soft-black">{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Date</label>
                  <input 
                    required
                    type="date" 
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                  />
                </div>
                
                <div className="md:col-span-2 space-y-6">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold/80 ml-1">Select Time Slot</label>
                    <p className="text-[10px] text-champagne/40 ml-1 uppercase tracking-widest">Business Hours: 9:00 AM - 9:00 PM</p>
                  </div>
                  <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {groupedTimeSlots.map((group) => {
                      const isToday = bookingData.date === format(new Date(), 'yyyy-MM-dd');
                      const currentHour = new Date().getHours();
                      const currentMinute = new Date().getMinutes();
                      
                      // Check if all slots in this hour are unavailable
                      const allSlotsUnavailable = group.slots.every(slot => {
                        const [slotH, slotM] = slot.value.split(':').map(Number);
                        const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));
                        return isPast;
                      });

                      if (allSlotsUnavailable) return null; // Hide the hour group if fully booked/past

                      return (
                        <div key={group.hourLabel} className="space-y-4">
                          <h4 className="text-[10px] font-bold text-champagne/40 uppercase tracking-[0.2em] flex items-center gap-3">
                            <span>{group.hourLabel}</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {group.slots.map((slot) => {
                              const isSelected = bookingData.time === slot.value;
                              
                              const [slotH, slotM] = slot.value.split(':').map(Number);
                              const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));
                              
                              const isUnavailable = isPast;
                              
                              return (
                                <button
                                  key={slot.value}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setBookingData({...bookingData, time: slot.value})}
                                  className={`
                                    py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300
                                    ${isSelected 
                                      ? 'bg-rose-gold border-rose-gold text-white shadow-[0_5px_15px_rgba(183,110,121,0.2)] scale-[1.02]' 
                                      : isUnavailable
                                        ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed line-through'
                                        : 'bg-white/5 border-white/10 text-champagne/70 hover:border-rose-gold/40 hover:bg-white/[0.08]'
                                    }
                                  `}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Message (Optional)</label>
                  <textarea 
                    rows={3} 
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any special requests or details?" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-rose-gold transition-colors text-white placeholder:text-white/30"
                  ></textarea>
                </div>

                {bookingStatus === 'error' && (
                  <div className="md:col-span-2 flex items-center gap-2 text-rose-500 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                <div className="md:col-span-2 pt-4">
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-rose-gold text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-deep-rose transition-all glow-effect text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
                
              </form>
            )}
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmation(false)}
              className="absolute inset-0 bg-soft-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-rose-gold/10 rounded-full flex items-center justify-center mb-6">
                  <CalendarIcon className="w-8 h-8 text-rose-gold" />
                </div>
                <h3 className="text-2xl font-serif text-soft-black mb-2">Confirm Your Appointment</h3>
                <p className="text-gray-500 text-sm mb-8">Please review your booking details before confirming.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Service</span>
                    <span className="font-serif text-soft-black">{bookingData.serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Date</span>
                    <span className="font-serif text-soft-black">{format(parseISO(bookingData.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Time</span>
                    <span className="font-serif text-soft-black">
                      {(() => {
                        if (!bookingData.time) return '';
                        const [h, m] = bookingData.time.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                        return `${displayHour}:${m} ${ampm}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Client</span>
                    <span className="font-serif text-soft-black">{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</span>
                    <span className="font-serif text-soft-black">{bookingData.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-soft-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmBooking}
                    className="bg-rose-gold text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-deep-rose transition-all shadow-lg shadow-rose-gold/20"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
