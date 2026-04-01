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
import { format, addDays, startOfToday, isBefore, parseISO } from 'date-fns';
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  Timestamp,
  onAuthStateChanged,
  signInWithGoogle
} from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
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
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  
  // My Bookings State
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = addDays(startOfToday(), i);
      dates.push({
        value: format(d, 'yyyy-MM-dd'),
        label: format(d, 'EEE'),
        day: format(d, 'dd'),
        month: format(d, 'MMM')
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user bookings when modal is open
  useEffect(() => {
    if (user && showMyBookings) {
      setIsLoadingBookings(true);
      const q = query(
        collection(db, 'appointments'),
        where('uid', '==', user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort client side: descending by date and time
        bookings.sort((a: any, b: any) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateB - dateA;
        });
        setMyBookings(bookings);
        setIsLoadingBookings(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
        setIsLoadingBookings(false);
      });

      return () => unsubscribe();
    }
  }, [user, showMyBookings]);

  // Real-time listener for booked slots on the selected date to show availability
  useEffect(() => {
    if (!bookingData.date) return;

    const q = query(
      collection(db, 'booked_slots'),
      where('date', '==', bookingData.date)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingBookings(slots);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'booked_slots');
    });

    return () => unsubscribe();
  }, [bookingData.date]);

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

    // Check if time is already booked
    if (existingBookings.some(b => b.time === bookingData.time)) {
      setBookingStatus('error');
      setErrorMessage('This exact time is already booked. Please select another time.');
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
      // 1. Create the appointment (private)
      await addDoc(collection(db, 'appointments'), {
        clientName: bookingData.name,
        clientEmail: bookingData.email,
        clientPhone: bookingData.phone,
        serviceId: bookingData.serviceId,
        serviceName: bookingData.serviceName,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        status: 'confirmed',
        reminderSent: false,
        createdAt: Timestamp.now(),
        uid: user?.uid || null
      });

      // 2. Create the public slot record for availability
      await addDoc(collection(db, 'booked_slots'), {
        date: bookingData.date,
        time: bookingData.time
      });

      // 3. Send email notification via backend
      try {
        await fetch('/api/notify-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            service: bookingData.serviceName,
            date: bookingData.date,
            time: bookingData.time,
            notes: bookingData.notes
          }),
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // We don't fail the whole booking if email fails, just log it
      }

      setBookingStatus('success');
      setBookingData({
        name: '',
        email: '',
        phone: '',
        serviceId: '',
        serviceName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '',
        notes: ''
      });
    } catch (error) {
      setBookingStatus('error');
      setErrorMessage('Failed to book appointment. Please try again.');
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {user && (
                  <button 
                    onClick={() => setShowMyBookings(true)}
                    className="text-champagne/80 hover:text-rose-gold transition-colors px-3 py-2 text-sm font-medium uppercase tracking-widest"
                  >
                    My Bookings
                  </button>
                )}
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
              {user && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowMyBookings(true);
                  }}
                  className="text-champagne block px-3 py-4 text-base font-medium border-b border-rose-gold/10 w-full text-left"
                >
                  My Bookings
                </button>
              )}
              <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-rose-gold block px-3 py-4 text-base font-bold">Book Now</a>
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
                    <p className="text-gray-600">Open Daily: 9:00 AM – 9:00 PM</p>
                    <p className="text-sm text-gray-500 italic mt-1">*Hours might differ during holidays</p>
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
                <h4 className="font-serif text-2xl mb-4 italic">Features & Amenities</h4>
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>Onsite services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>Gender-neutral restroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>Restroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>LGBTQ+ friendly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>Transgender safespace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-gold" />
                    <span>Cash-only payments</span>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Select Date</label>
                  <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {availableDates.map((d) => {
                      const isSelected = bookingData.date === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setBookingData({...bookingData, date: d.value, time: ''})}
                          className={`
                            flex-shrink-0 w-20 py-4 rounded-2xl border transition-all snap-start
                            ${isSelected 
                              ? 'bg-rose-gold border-rose-gold text-white shadow-lg scale-105' 
                              : 'bg-white/5 border-white/10 text-white/70 hover:border-rose-gold/50 hover:bg-white/10'
                            }
                          `}
                        >
                          <span className="block text-[10px] uppercase font-bold tracking-tighter opacity-60 mb-1">{d.month}</span>
                          <span className="block text-xl font-serif font-bold mb-1">{d.day}</span>
                          <span className="block text-[10px] uppercase font-bold tracking-widest opacity-60">{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-champagne/60 ml-1">Select Available Time Slot</label>
                    <p className="text-xs text-champagne/40 ml-1 italic">Appointments are available during our regular business hours (9:00 AM - 9:00 PM). Hours might differ during holidays.</p>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {groupedTimeSlots.map((group) => {
                      const isToday = bookingData.date === format(new Date(), 'yyyy-MM-dd');
                      const currentHour = new Date().getHours();
                      const currentMinute = new Date().getMinutes();
                      
                      // Check if all slots in this hour are unavailable
                      const allSlotsUnavailable = group.slots.every(slot => {
                        const [slotH, slotM] = slot.value.split(':').map(Number);
                        const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));
                        const isExactBooked = existingBookings.some(b => b.time === slot.value);
                        return isPast || isExactBooked;
                      });

                      if (allSlotsUnavailable) return null; // Hide the hour group if fully booked/past

                      return (
                        <div key={group.hourLabel} className="space-y-3">
                          <h4 className="text-sm font-bold text-champagne/80 border-b border-white/10 pb-2">{group.hourLabel}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {group.slots.map((slot) => {
                              const isSelected = bookingData.time === slot.value;
                              const isExactBooked = existingBookings.some(b => b.time === slot.value);
                              
                              const [slotH, slotM] = slot.value.split(':').map(Number);
                              const isPast = isToday && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));
                              
                              const isUnavailable = isExactBooked || isPast;
                              
                              return (
                                <button
                                  key={slot.value}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setBookingData({...bookingData, time: slot.value})}
                                  className={`
                                    py-2 rounded-lg text-sm font-medium transition-all border
                                    ${isUnavailable 
                                        ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed line-through decoration-white/20'
                                        : isSelected
                                          ? 'bg-rose-gold border-rose-gold text-white shadow-lg scale-105'
                                          : 'bg-white/10 border-white/10 text-white/70 hover:border-rose-gold/50 hover:bg-white/15'
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
                
                {!user && (
                  <div className="md:col-span-2 text-center mt-4">
                    <p className="text-xs text-champagne/40 uppercase tracking-widest mb-3">Or sign in for faster booking</p>
                    <button 
                      type="button"
                      onClick={signInWithGoogle}
                      className="inline-flex items-center gap-2 text-champagne/80 hover:text-rose-gold transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      Sign in with Google
                    </button>
                  </div>
                )}
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
      {/* My Bookings Modal */}
      <AnimatePresence>
        {showMyBookings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyBookings(false)}
              className="absolute inset-0 bg-soft-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-serif text-soft-black">My Bookings</h3>
                <button 
                  onClick={() => setShowMyBookings(false)}
                  className="p-2 text-gray-400 hover:text-soft-black transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar bg-gray-50/50">
                {isLoadingBookings ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-gold"></div>
                  </div>
                ) : myBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">You don't have any bookings yet.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Upcoming Bookings */}
                    {(() => {
                      const upcoming = myBookings.filter(b => {
                        const bookingDate = new Date(`${b.date}T${b.time}`);
                        return bookingDate >= new Date();
                      });
                      
                      if (upcoming.length === 0) return null;
                      
                      return (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-rose-gold mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Upcoming Appointments
                          </h4>
                          <div className="space-y-4">
                            {upcoming.map(booking => (
                              <div key={booking.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                  <div>
                                    <h5 className="font-serif text-lg text-soft-black mb-1">{booking.serviceName}</h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        {format(parseISO(booking.date), 'MMM dd, yyyy')}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {(() => {
                                          const [h, m] = booking.time.split(':');
                                          const hour = parseInt(h);
                                          const ampm = hour >= 12 ? 'PM' : 'AM';
                                          const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                                          return `${displayHour}:${m} ${ampm}`;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                      {booking.status || 'Pending'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Past Bookings */}
                    {(() => {
                      const past = myBookings.filter(b => {
                        const bookingDate = new Date(`${b.date}T${b.time}`);
                        return bookingDate < new Date();
                      });
                      
                      if (past.length === 0) return null;
                      
                      return (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Past Appointments</h4>
                          <div className="space-y-4 opacity-75">
                            {past.map(booking => (
                              <div key={booking.id} className="bg-white p-5 rounded-2xl border border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                  <div>
                                    <h5 className="font-serif text-lg text-gray-600 mb-1">{booking.serviceName}</h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        {format(parseISO(booking.date), 'MMM dd, yyyy')}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {(() => {
                                          const [h, m] = booking.time.split(':');
                                          const hour = parseInt(h);
                                          const ampm = hour >= 12 ? 'PM' : 'AM';
                                          const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                                          return `${displayHour}:${m} ${ampm}`;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                                      Completed
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
