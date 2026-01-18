import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiVideo, FiHeadphones, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CounselingPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState<'audio' | 'video'>('video');
  const [booking, setBooking] = useState(false);

  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      setBooking(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Counseling session booked successfully!');
      setSelectedDate('');
      setSelectedTime('');
    } catch (error: any) {
      toast.error('Failed to book session');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-gradient-blue">Private Counseling</h1>
        <p className="text-gray-400">Book a private counseling session with our admin team</p>
      </motion.div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white"
        >
          <FiVideo className="w-8 h-8 text-primary-blue mb-4" />
          <h3 className="text-xl font-bold mb-2">Video Sessions</h3>
          <p className="text-gray-400 text-sm">
            Face-to-face counseling through secure video calls
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-6 border border-accent-white"
        >
          <FiHeadphones className="w-8 h-8 text-primary-blue mb-4" />
          <h3 className="text-xl font-bold mb-2">Audio Sessions</h3>
          <p className="text-gray-400 text-sm">
            Voice-only counseling for privacy and convenience
          </p>
        </motion.div>
      </div>

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-8 border border-accent-white"
      >
        <h2 className="text-2xl font-bold mb-6">Book a Session</h2>

        {/* Session Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Session Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSessionType('video')}
              className={`p-4 rounded-lg border-2 transition-all ${
                sessionType === 'video'
                  ? 'border-primary-blue bg-primary-blue/20'
                  : 'border-accent-white hover:border-primary-blue/50'
              }`}
            >
              <FiVideo className={`w-6 h-6 mb-2 ${sessionType === 'video' ? 'text-primary-blue' : 'text-gray-400'}`} />
              <div className={`font-semibold ${sessionType === 'video' ? 'text-primary-blue' : 'text-gray-400'}`}>
                Video Call
              </div>
            </button>

            <button
              onClick={() => setSessionType('audio')}
              className={`p-4 rounded-lg border-2 transition-all ${
                sessionType === 'audio'
                  ? 'border-primary-blue bg-primary-blue/20'
                  : 'border-accent-white hover:border-primary-blue/50'
              }`}
            >
              <FiHeadphones className={`w-6 h-6 mb-2 ${sessionType === 'audio' ? 'text-primary-blue' : 'text-gray-400'}`} />
              <div className={`font-semibold ${sessionType === 'audio' ? 'text-primary-blue' : 'text-gray-400'}`}>
                Audio Call
              </div>
            </button>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Select Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 bg-background border border-accent-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Time
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? 'border-primary-blue bg-primary-blue/20 text-primary-blue'
                      : 'border-accent-white text-gray-400 hover:border-primary-blue/50'
                  }`}
                >
                  <FiClock className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Book Button */}
        <button
          onClick={handleBookSession}
          disabled={!selectedDate || !selectedTime || booking}
          className="w-full px-6 py-4 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {booking ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Booking...</span>
            </>
          ) : (
            <>
              <FiCheckCircle className="w-5 h-5" />
              <span>Book Counseling Session</span>
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-primary-blue/10 rounded-lg border border-primary-blue/20">
          <p className="text-sm text-gray-300">
            <strong>Note:</strong> Your session will be confirmed via email. Our admin team will reach out to you before the scheduled time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
