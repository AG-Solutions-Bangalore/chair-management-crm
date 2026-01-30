import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  emailInputRef,
  handleSubmit,
  isLoading,
  loadingMessage,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-white to-transparent"
    >
      <div className="flex items-center gap-1 p-2 rounded-md mb-8 ">
        <img
          // src="https://aia.in.net/crm/public/assets/images/logo/new_retina_logos.webp"
          alt="Chair Logo"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-2">
          Welcome back
        </h1>
        <p className="text-dark/20 text-lg mb-10">Comfort Meets Design</p>
      </motion.div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-dark mb-2">
              Username
            </label>
            <motion.input
              ref={emailInputRef}
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-dark text-dark placeholder-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-dark mb-2">
              Password
            </label>
            <div className="relative group">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-dark text-dark placeholder-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[12px] text-primary transition-colors p-1"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-2 text-right"
          >
            <Link
              to="/forgot-password"
              className="text-sm text-primary/80 hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>
          <Button className="w-full py-3" type="submit" disabled={isLoading}>
            {isLoading ? (
              <motion.span
                key={loadingMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {loadingMessage}
              </motion.span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
