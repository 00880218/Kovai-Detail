import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, CheckCircle, Clock, 
  Download, MapPin, ExternalLink, Loader2,
  TrendingUp, Package, Info
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface Booking {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  vehicle_type: string;
  vehicle_model: string;
  service_type: string;
  address: string;
  lat: number;
  lng: number;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalBookings: number;
  totalCustomers: number;
  todayBookings: number;
  serviceBreakdown: { service_type: string; count: number }[];
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "Kovai_Detail_Bookings.xlsx");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin <span className="text-gold">Dashboard</span></h1>
          <p className="text-white/50">Manage your doorstep detailing business.</p>
        </div>
        <button 
          onClick={downloadExcel}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Bookings', value: stats?.totalBookings, icon: Calendar, color: 'text-blue-400' },
          { label: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'text-purple-400' },
          { label: "Today's Bookings", value: stats?.todayBookings, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Active Services', value: stats?.serviceBreakdown.length, icon: Package, color: 'text-gold' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/50 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Bookings</h2>
          <span className="text-xs text-white/30 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{booking.full_name}</p>
                    <p className="text-xs text-white/50">{booking.phone_number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{booking.vehicle_model}</p>
                    <p className="text-xs text-white/30">{booking.vehicle_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gold px-2 py-1 rounded bg-gold/10">
                      {booking.service_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-white/30" />
                      {booking.preferred_date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Clock className="w-3 h-3" />
                      {booking.preferred_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={`https://www.google.com/maps?q=${booking.lat},${booking.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                    >
                      <MapPin className="w-3 h-3" />
                      View Map
                      <ExternalLink className="w-2 h-2" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${
                        booking.status === 'Completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => alert(`Notes: ${booking.notes || 'No additional notes'}`)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Info className="w-4 h-4 text-white/50" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
