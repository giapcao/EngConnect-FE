import React, { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Globe,
  Clock,
  TrendingUp,
} from "lucide-react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { colors } from "../../constants/colors";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

// Import images
import heroImage from "../../assets/images/poster.png";
import avatarDylan from "../../assets/images/avatar-dylan.png";
import avatarKaius from "../../assets/images/avatar-kaius.png";
import avatarEira from "../../assets/images/avatar-eira.png";
import avatarZane from "../../assets/images/avatar-zane.png";
import avatarSelene from "../../assets/images/avatar-selene.png";
import avatarTalon from "../../assets/images/avatar-talon.png";
import tutorProfile1 from "../../assets/images/tutor-profile-1.png";
import tutorProfile2 from "../../assets/images/tutor-profile-2.png";
import tutorProfile3 from "../../assets/images/tutor-profile-3.png";

const Home = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Dylan Field",
      role: "CEO at Figma",
      quote:
        "EngConnect transformed my English learning journey. The tutors are incredibly patient and the lessons are perfectly tailored to my needs.",
      avatar: avatarDylan,
      rating: 5,
    },
    {
      id: 2,
      name: "Kaius Moreau",
      role: "Marketing Specialist",
      quote:
        "The flexibility and quality of tutors are unmatched. I can learn anytime that fits my busy schedule.",
      avatar: avatarKaius,
      rating: 5,
    },
    {
      id: 3,
      name: "Eira Nolan",
      role: "Freelance Writer",
      quote:
        "I achieved my language goals faster than expected. The AI-powered feedback is a game changer!",
      avatar: avatarEira,
      rating: 5,
    },
    {
      id: 4,
      name: "Zane Thorne",
      role: "Project Manager",
      quote:
        "A truly personalized learning journey. Every lesson feels like it was made just for me.",
      avatar: avatarZane,
      rating: 5,
    },
    {
      id: 5,
      name: "Selene Hart",
      role: "Graphic Designer",
      quote:
        "Highly recommend for anyone serious about learning. The platform is intuitive and the results speak for themselves.",
      avatar: avatarSelene,
      rating: 5,
    },
    {
      id: 6,
      name: "Talon Rowe",
      role: "Accountant",
      quote:
        "Exceptional value for the quality of education. Best investment I've made in myself.",
      avatar: avatarTalon,
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Tutors",
      description:
        "Learn from certified native speakers with years of teaching experience",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description:
        "Book lessons 24/7 that fit perfectly into your busy lifestyle",
    },
    {
      icon: BookOpen,
      title: "Custom Curriculum",
      description:
        "Personalized learning paths designed around your specific goals",
    },
    {
      icon: Award,
      title: "Affordable Pricing",
      description:
        "Premium quality education at prices that won't break the bank",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ backgroundColor: colors.background.page }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  backgroundColor: colors.background.primaryLight,
                  color: colors.primary.main,
                }}
              >
                AI-Powered Learning Platform
              </span>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ color: colors.text.primary }}
              >
                Master English with{" "}
                <span style={{ color: colors.primary.main }}>
                  Expert Tutors
                </span>
              </h1>

              <p
                className="text-lg mb-8 max-w-xl leading-relaxed"
                style={{ color: colors.text.secondary }}
              >
                Connect with certified tutors for personalized 1-on-1 lessons.
                Learn at your own pace with AI-assisted feedback and achieve
                fluency faster than ever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  radius="full"
                  className="font-semibold text-lg px-8 h-14"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/register")}
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Start Learning Free
                </Button>
                <Button
                  size="lg"
                  radius="full"
                  className="font-semibold text-lg px-8 h-14"
                  style={{
                    backgroundColor: colors.primary.lightest,
                    color: colors.text.main,
                  }}
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[
                    { src: avatarDylan, name: "Dylan" },
                    { src: avatarKaius, name: "Kaius" },
                    { src: avatarEira, name: "Eira" },
                    { src: avatarZane, name: "Zane" },
                  ].map((avatar) => (
                    <img
                      key={avatar.name}
                      src={avatar.src}
                      alt="Student"
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: colors.background.light }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`star-${star}`}
                        className="w-4 h-4"
                        fill={colors.state.warning}
                        color={colors.state.warning}
                      />
                    ))}
                    <span
                      className="ml-2 font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      4.9
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Loved by 10,000+ students
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <img
                src={heroImage}
                alt="Online learning interface"
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Why Choose{" "}
              <span style={{ color: colors.primary.main }}>EngConnect?</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Experience the future of language learning with our innovative
              platform designed for your success
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card
                  className="h-full hover:border-primary transition-colors shadow-none"
                  style={{
                    backgroundColor: colors.background.light,
                  }}
                >
                  <CardBody className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                      }}
                    >
                      <feature.icon
                        className="w-6 h-6"
                        style={{ color: colors.primary.main }}
                      />
                    </div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: colors.text.secondary }}>
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              How It <span style={{ color: colors.primary.main }}>Works</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Get started in minutes and begin your journey to fluency
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                icon: Globe,
                title: "Find Your Tutor",
                description:
                  "Browse our diverse community of certified tutors and find the perfect match for your learning style",
              },
              {
                step: "02",
                icon: Clock,
                title: "Book a Lesson",
                description:
                  "Choose a convenient time slot from your tutor's availability and book instantly",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Start Learning",
                description:
                  "Join your live video lesson, practice with AI tools, and track your progress",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary.main }}
                  >
                    <item.icon
                      className="w-8 h-8"
                      style={{ color: colors.text.white }}
                    />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: colors.background.light,
                      color: colors.primary.main,
                      border: `2px solid ${colors.primary.main}`,
                    }}
                  >
                    {item.step}
                  </div>
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {item.title}
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Meet Our{" "}
              <span style={{ color: colors.primary.main }}>Top Tutors</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Learn from experienced educators passionate about your success
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah Chen",
                specialty: "Business English",
                rating: 5,
                lessons: 1200,
                image: tutorProfile1,
                flag: "🇺🇸",
              },
              {
                name: "James Wilson",
                specialty: "IELTS Preparation",
                rating: 4.9,
                lessons: 980,
                image: tutorProfile2,
                flag: "🇬🇧",
              },
              {
                name: "Emma Taylor",
                specialty: "Conversational English",
                rating: 5,
                lessons: 1500,
                image: tutorProfile3,
                flag: "🇦🇺",
              },
            ].map((tutor) => (
              <motion.div key={tutor.name} variants={itemVariants}>
                <Card
                  className="overflow-hidden shadow-none"
                  style={{
                    backgroundColor: colors.background.light,
                  }}
                >
                  <CardBody className="p-0">
                    <div className="relative">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="w-full h-56 object-cover"
                      />
                      <span
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: colors.background.light,
                          color: colors.text.primary,
                        }}
                      >
                        {tutor.flag} Native
                      </span>
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.name}
                      </h3>
                      <p
                        className="font-medium mb-3"
                        style={{ color: colors.primary.main }}
                      >
                        {tutor.specialty}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-4 h-4"
                            fill={colors.state.warning}
                            color={colors.state.warning}
                          />
                          <span
                            className="font-semibold"
                            style={{ color: colors.text.primary }}
                          >
                            {tutor.rating}
                          </span>
                        </div>
                        <span style={{ color: colors.text.secondary }}>
                          {tutor.lessons}+ lessons
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button
              variant="bordered"
              size="lg"
              radius="full"
              className="font-semibold px-8"
              style={{
                borderColor: colors.primary.main,
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              View All Tutors
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 px-6 md:px-12 overflow-hidden"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              What Our{" "}
              <span style={{ color: colors.primary.main }}>Students Say</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Join thousands of satisfied learners who've achieved their goals
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex-shrink-0 w-80"
                >
                  <Card
                    className="h-full shadow-none"
                    style={{
                      backgroundColor: colors.background.gray,
                      borderColor: colors.border.light,
                    }}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                          <Star
                            key={`rating-star-${testimonial.id}-${i}`}
                            className="w-4 h-4"
                            fill={colors.state.warning}
                            color={colors.state.warning}
                          />
                        ))}
                      </div>
                      <p
                        className="leading-relaxed mb-6"
                        style={{ color: colors.text.secondary }}
                      >
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: colors.text.primary }}
                          >
                            {testimonial.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((testimonial, index) => (
              <button
                key={`dot-${testimonial.id}`}
                onClick={() => setActiveTestimonial(index)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    index === activeTestimonial
                      ? colors.primary.main
                      : colors.border.medium,
                  width: index === activeTestimonial ? "24px" : "8px",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.primary.main }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ color: colors.text.white }}
            >
              Ready to Start Your Journey?
            </h2>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto opacity-90"
              style={{ color: colors.text.white }}
            >
              Join thousands of students who are already improving their English
              with EngConnect. Your first lesson is free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                radius="full"
                className="font-semibold text-lg px-10 h-14"
                style={{
                  backgroundColor: colors.background.light,
                  color: colors.primary.main,
                }}
                onPress={() => navigate("/register")}
              >
                Get Started Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
