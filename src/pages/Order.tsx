import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Calendar, Clock, MapPin, Car, Info, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 11.0168,
  lng: 76.9558 // Coimbatore
};

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    vehicleType: 'Car',
    vehicleModel: '',
    serviceType: searchParams.get('service')?.replace(/-/g, ' ').toUpperCase() || 'BASIC CAR WASH',
    address: '',
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setFormData({
        ...formData,
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/bookings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-3xl text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-white/60 mb-8">
            Thank you for choosing Kovai Detail. We will call you shortly to discuss the pricing and confirm your appointment.
          </p>
          <p className="text-sm text-gold">Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-3xl border border-white/10"
        >
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Book Your Service</h1>
            <p className="text-white/50">Fill in the details below to schedule your doorstep detailing.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                <Info className="w-5 h-5" />
                Customer Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle & Service
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Vehicle Type</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW M3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Service Type</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="BASIC CAR WASH">BASIC CAR WASH</option>
                  <option value="WASH AND WAX">WASH AND WAX</option>
                  <option value="EXTERIOR DECONTAMINATION">EXTERIOR DECONTAMINATION</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Location
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Full Address</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={13}
                    onClick={onMapClick}
                    options={{
                      styles: [
                        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                        // ... more dark styles could be added
                      ]
                    }}
                  >
                    <Marker position={{ lat: formData.lat, lng: formData.lng }} />
                  </GoogleMap>
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-white/5">
                    <Loader2 className="animate-spin text-gold" />
                  </div>
                )}
              </div>
              <p className="text-xs text-white/30">Click on the map to pin your exact location.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/50 mb-2">Additional Notes</label>
              <textarea
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-gold outline-none transition-all"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
              </button>
              <p className="text-center text-xs text-white/30 mt-4">
                By confirming, you agree to our terms of service. Price will be discussed over call.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
