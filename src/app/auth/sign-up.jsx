import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import { motion } from "framer-motion";
import { UserPlus, Mail, Phone, Calendar, MapPin, User, Loader2, Building } from "lucide-react";
import { toast } from "sonner";
import BASE_URL from "@/config/base-url";
import logoLogin from "@/assets/receipt/fts_log.png";
import moment from "moment";

const sliderImages = [
  {
    id: 1,
    title: "Join Our Community",
    description: "Become part of a movement empowering tribal communities through education and development",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Make a Difference",
    description: "Together we can create lasting change and build better futures",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    email: "",
    phone: "",
    user_birthday: "",
    user_add: "",
    user_chapter: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const nameInputRef = useRef(null);

  const loadingMessages = [
    "Creating your account...",
    "Setting up your profile...",
    "Almost done...",
    "Welcome to FTS Champ...",
  ];

  // Auto-focus on name input
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let messageIndex = 0;
    let intervalId;

    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 800);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading]);

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      newErrors.name = "Username can only contain letters, numbers, and underscores";
    }
    
    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    // Birthday validation (optional)
    if (formData.user_birthday) {
      const birthDate = moment(formData.user_birthday);
      const today = moment();
      if (birthDate.isAfter(today)) {
        newErrors.user_birthday = "Birthday cannot be in the future";
      } 
    }
    
  
    // Chapter validation
    if (!formData.user_chapter.trim()) {
      newErrors.user_chapter = "Chapter name is required";
    } else if (formData.user_chapter.length < 3) {
      newErrors.user_chapter = "Chapter name must be at least 3 characters";
    }
    
    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handlePhoneChange = (value) => {
    // Format phone number as user types
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    
    
    handleInputChange('phone', formatted);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the data for API
      const signupData = {
        name: formData.name.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''), // Send only digits
        user_birthday: formData.user_birthday || null,
        user_add: formData.user_add.trim(),
        user_chapter: formData.user_chapter.trim(),
      };
      
      const res = await axios.post(`${BASE_URL}/api/panel-signup`, signupData);
      
      if (res.data.code === 201) {
        toast.success("Account created successfully! An admin will contact you with login credentials.");

          navigate("/");
     
      } else {
        toast.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSubmit(event);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob login-blob-1 bg-purple-300"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 login-blob-2 bg-pink-300"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 login-blob-3 bg-blue-300"></div>
      </div>

      <motion.div
        className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Left Side - Slider */}
        <div className="hidden md:flex flex-col items-center justify-center p-1 w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="w-full h-full"
            >
              {sliderImages.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {slide.title}
                      </h3>
                      <p className="text-white/90">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-transparent"
          >
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="pb-4 md:pb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="flex-shrink-0">
                  <img 
                    src={logoLogin} 
                    className="w-auto h-16 md:h-20" 
                    alt="FTS Champ Logo"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <CardTitle className="text-lg md:text-xl font-bold bg-gradient-to-r from-[var(--team-color)] to-[var(--color-dark)] bg-clip-text text-transparent">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm md:text-base">
                    Fill in your details to request access
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="p-2">
                <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} noValidate>
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Username */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User size={14} />
                          Username *
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Input
                            ref={nameInputRef}
                            id="name"
                            type="text"
                            placeholder="Enter username"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.name ? 'border-red-500' : ''
                            }`}
                            autoComplete="username"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-1">
                        <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Input
                            id="full_name"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            required
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.full_name ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.full_name && (
                            <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail size={14} />
                          Email *
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.email ? 'border-red-500' : ''
                            }`}
                            autoComplete="email"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone size={14} />
                          Phone *
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            required
                            maxLength="10"
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.phone ? 'border-red-500' : ''
                            }`}
                            autoComplete="tel"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Birthday (Optional) */}
                      <div className="space-y-1">
                        <Label htmlFor="user_birthday" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar size={14} />
                          Birthday (Optional)
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Input
                            id="user_birthday"
                            type="date"
                            value={formData.user_birthday}
                            onChange={(e) => handleInputChange('user_birthday', e.target.value)}
                            max={moment().format('YYYY-MM-DD')}
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.user_birthday ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.user_birthday && (
                            <p className="text-red-500 text-xs mt-1">{errors.user_birthday}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Chapter */}
                      <div className="space-y-1">
                        <Label htmlFor="user_chapter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Building size={14} />
                          Chapter *
                        </Label>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Input
                            id="user_chapter"
                            type="text"
                            placeholder="Enter chapter name"
                            value={formData.user_chapter}
                            onChange={(e) => handleInputChange('user_chapter', e.target.value)}
                            required
                            className={`h-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors ${
                              errors.user_chapter ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.user_chapter && (
                            <p className="text-red-500 text-xs mt-1">{errors.user_chapter}</p>
                          )}
                        </motion.div>
                      </div>
                    </div>

                
                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        className="w-full h-10 bg-gradient-to-r from-[var(--team-color)] to-[var(--color-dark)] hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.span
                            key={loadingMessage}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {loadingMessage}
                          </motion.span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <UserPlus size={16} />
                            Request Access
                          </span>
                        )}
                      </Button>
                     
                    </motion.div>
                  </div>
                </form>
                
                {/* Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center"
                >
                  
                  <div className="text-xs text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/")}
                      className="text-[var(--color)] hover:text-[var(--color-dark)] font-medium transition-colors duration-200 hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}