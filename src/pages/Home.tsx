import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Droplets, MapPin, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Car Wash"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Premium Doorstep <br />
              <span className="text-gold-gradient">Car Detailing</span> <br />
              at Your Convenience.
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              We bring professional car and bike wash services directly to your doorstep in Coimbatore. 
              Luxury treatment for your vehicles without leaving your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/order" className="btn-primary text-center">
                Book Now
              </Link>
              <a href="tel:8281427545" className="btn-secondary flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold tracking-widest text-gold uppercase mb-4">About Us</h2>
              <h3 className="text-4xl font-bold mb-6">Redefining Vehicle Care in Coimbatore</h3>
              <div className="space-y-6 text-white/70">
                <p>
                  Kovai Detail is Coimbatore's premier doorstep detailing service. We understand that your time is valuable, 
                  which is why we bring the car wash to you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {[
                    { icon: MapPin, title: "Doorstep Service", desc: "We come to your home or office." },
                    { icon: Shield, title: "Pro Tools", desc: "Professional grade chemicals & tools." },
                    { icon: Clock, title: "Time Saving", desc: "No more waiting at wash centers." },
                    { icon: Droplets, title: "Eco-Conscious", desc: "Water-saving washing methods." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <item.icon className="text-gold w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=1000"
                  alt="Detailing Process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-xl border border-gold/20">
                <p className="text-3xl font-bold text-gold">100%</p>
                <p className="text-sm font-medium">Customer Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16">Why Choose <span className="text-gold">Kovai Detail?</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Detailing Experts",
                desc: "Our team consists of trained professionals who treat every vehicle as their own.",
                img: "https://images.unsplash.com/photo-1552933529-e359b2477252?auto=format&fit=crop&q=80&w=500"
              },
              {
                title: "Premium Chemicals",
                desc: "We use high-quality, international standard chemicals like Koch Chemie for lasting shine.",
                img: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=500"
              },
              {
                title: "Affordable Luxury",
                desc: "Get premium detailing services at competitive prices tailored to your needs.",
                img: "https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden card-hover"
              >
                <img src={feature.img} alt={feature.title} className="w-full h-48 object-cover opacity-60" />
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gold">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Link to="/" className="text-2xl font-bold tracking-tighter text-gold mb-6 block">
                KOVAI <span className="text-white">DETAIL</span>
              </Link>
              <p className="text-white/50 max-w-sm">
                The most trusted doorstep car and bike detailing service in Coimbatore. 
                Bringing the showroom shine to your driveway.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-white/50">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold" />
                  8281427545
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  Coimbatore, Tamil Nadu
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Follow Us</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-colors cursor-pointer">
                  IG
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-colors cursor-pointer">
                  FB
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-white/30 text-sm">
            © {new Date().getFullYear()} Kovai Detail. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
