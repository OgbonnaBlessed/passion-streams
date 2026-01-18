import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  // FiUpload,
  FiX,
  FiUser,
  // FiHeart,
  // FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { connectService } from "../../services/connectService";
// import { uploadService } from '../../services/uploadService';
import { useAuthStore } from "../../store/authStore";
import FileUpload from "../../components/common/FileUpload";
import type { PassionConnectProfile } from "@/shared/types";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Partial<PassionConnectProfile>>({
    bio: "",
    photos: [],
    interests: [],
    whatYouSeek: "",
    testimonial: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const existingProfile = await connectService.getProfile();
      if (existingProfile) {
        setProfile(existingProfile);
        setEditing(false);
      } else {
        setEditing(true);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await connectService.createOrUpdateProfile(profile);
      toast.success("Profile saved successfully!");
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (response: { url: string }) => {
    setProfile((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), response.url],
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !profile.interests?.includes(newInterest.trim())
    ) {
      setProfile((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests?.filter((i) => i !== interest) || [],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  const growthPercentage = user?.growthPercentage || 0;
  const growthTier = user?.growthTier || "TIER_1";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-gradient-pink">
          Your Profile
        </h1>
        <p className="text-gray-400">
          Create and manage your Passion Connect profile
        </p>
      </motion.div>

      {/* Growth Tier Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-gradient-to-r from-primary-pink/20 to-primary-blue/20 rounded-xl p-6 border border-accent-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FiTrendingUp className="w-6 h-6 text-primary-blue" />
            <div>
              <div className="font-semibold text-lg">Growth Progress</div>
              <div className="text-sm text-gray-400">
                Your journey to finding your match
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient-pink">
              {growthPercentage}%
            </div>
            <div className="text-sm text-gray-400">
              Tier {growthTier.split("_")[1]}
            </div>
          </div>
        </div>
        <div className="w-full h-3 bg-accent-white rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${growthPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-pink"
          />
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-accent-white/50 backdrop-blur-sm rounded-xl p-8 border border-accent-white space-y-6"
      >
        {/* Photos Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Photos
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {profile.photos?.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-accent-white"
                />
                {editing && (
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
            {editing && (!profile.photos || profile.photos.length < 6) && (
              <FileUpload
                onUploadComplete={handlePhotoUpload}
                folder="passion-connect-photos"
                accept="image/*"
                maxSize={5}
              />
            )}
          </div>
          {editing && profile.photos && profile.photos.length >= 6 && (
            <p className="text-sm text-gray-400">Maximum 6 photos allowed</p>
          )}
        </div>

        {/* Bio Section */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            disabled={!editing}
            rows={5}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Interests Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Interests
          </label>
          {editing && (
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="Add an interest..."
                className="flex-1 px-4 py-2 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/80 transition-colors"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {profile.interests?.map((interest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 px-3 py-1 bg-primary-blue/20 text-primary-blue rounded-full"
              >
                <span>{interest}</span>
                {editing && (
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-primary-blue hover:text-primary-pink"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Seek */}
        <div>
          <label
            htmlFor="whatYouSeek"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            What You Seek
          </label>
          <textarea
            id="whatYouSeek"
            value={profile.whatYouSeek}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, whatYouSeek: e.target.value }))
            }
            disabled={!editing}
            rows={3}
            placeholder="Describe what you're looking for in a partner..."
            className="w-full px-4 py-3 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Testimonial */}
        <div>
          <label
            htmlFor="testimonial"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Testimonial (Optional)
          </label>
          <textarea
            id="testimonial"
            value={profile.testimonial || ""}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, testimonial: e.target.value }))
            }
            disabled={!editing}
            rows={3}
            placeholder="Share a testimony or encouragement..."
            className="w-full px-4 py-3 bg-background border border-accent-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-accent-white">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                className="px-6 py-3 bg-accent-white/50 text-white rounded-lg hover:bg-accent-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !profile.bio || !profile.whatYouSeek}
                className="px-6 py-3 bg-gradient-pink text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-pink/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-gradient-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all flex items-center space-x-2"
            >
              <FiUser className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
