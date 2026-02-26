import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Car, Sparkles, ShieldCheck } from 'lucide-react';

const services = [
  {
    id: 'basic-car-wash',
    title: 'BASIC CAR WASH',
    icon: Car,
    features: [
      'Exterior foam wash',
      'Interior vacuuming',
      'Interior towel cleaning',
      'Dashboard polish',
      'Tyre polish',
    ],
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'wash-and-wax',
    title: 'WASH AND WAX',
    icon: Sparkles,
    features: [
      'Basic car wash',
      'Tyre polish',
      'Exterior wax coating',
      'Enhanced gloss finish',
      'Paint protection layer',
    ],
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exterior-decontamination',
    title: 'EXTERIOR DECONTAMINATION',
    icon: ShieldCheck,
    features: [
      'Exterior foam wash',
      'Clay bar treatment',
      'UV protection with Koch Chemie products',
      'Iron removal',
      'Surface smoothing',
    ],
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Services() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-gold">Premium Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Choose from our range of professional detailing packages. 
            We use only the finest products to ensure your vehicle looks its absolute best.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl overflow-hidden card-hover flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center mb-3">
                    <service.icon className="text-black w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <ul className="space-y-4 mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/70">
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm font-medium text-gold mb-6 italic">
                    Price will be discussed over call.
                  </p>
                  <Link 
                    to={`/order?service=${service.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass p-12 rounded-3xl text-center border border-gold/20">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Package?</h3>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            We offer specialized detailing for luxury vehicles, ceramic coatings, and long-term maintenance plans.
          </p>
          <a href="tel:8281427545" className="btn-secondary inline-flex items-center gap-2">
            Call for Custom Quote
          </a>
        </div>
      </div>
    </div>
  );
}
