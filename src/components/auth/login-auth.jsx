import { LOGIN } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { setCredentials } from "@/store/auth/authSlice";
import { setCompanyDetails } from "@/store/auth/companySlice";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import BackgroundSVG from "./background-svg";
import Carousel from "./carousel";
import LoginForm from "./login-form";
// import DecorativeSVG from "./decorative-svg";
const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Comfort Meets Design",
    description:
      "Ergonomically designed chairs that provide comfort and support for everyday use.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1616628182501-9f5b3cda2d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Crafted for Every Space",
    description:
      "Stylish chairs that blend seamlessly into homes, offices, and modern interiors.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Quality You Can Trust",
    description:
      "Durable materials and thoughtful craftsmanship built to last for years.",
  },
];

export default function AuthUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const emailInputRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { trigger: login, loading: isLoading } = useApiMutation();
  const dispatch = useDispatch();

  const loadingMessages = [
    "Setting things up...",
    "Checking credentials...",
    "Preparing dashboard...",
    "Almost there...",
  ];

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  useEffect(() => {
    if (!isLoading) return;
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const res = await login({
        url: LOGIN.postLogin,
        method: "post",
        data: formData,
      });
      if (res?.code === 200) {
        const { UserInfo, version, year } = res;

        if (!UserInfo || !UserInfo.token) {
          toast.error("Login Failed: No token received.");
          return;
        }

        dispatch(
          setCredentials({
            token: UserInfo.token,
            user: UserInfo.user,
            version: version?.version_panel,
            currentYear: year?.current_year,
            tokenExpireAt: UserInfo.token_expires_at,
          }),
        );
        dispatch(setCompanyDetails(res.company_details));
      } else {
        toast.error(res.message || "Login Failed: Unexpected response.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCarouselChange = (direction) => {
    setAutoRotate(false);
    if (direction === "left") {
      setTestimonialIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    } else {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
    setTimeout(() => setAutoRotate(true), 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <BackgroundSVG />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white shadow-2xl">
          <Carousel
            testimonials={testimonials}
            testimonialIndex={testimonialIndex}
            handleCarouselChange={handleCarouselChange}
          />
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            emailInputRef={emailInputRef}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
        </div>
      </motion.div>
    </div>
  );
}
