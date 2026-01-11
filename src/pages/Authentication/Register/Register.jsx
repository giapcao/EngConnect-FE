import React, { useState } from "react";
import { Input, Button, Link, Checkbox } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import * as MotionLib from "framer-motion";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import SocialLogin from "../../../components/Authentication/SocialLogin";
import colors from "../../../constants/colors";
import illustrationImage from "../../../assets/images/Saly-10.png";
import "./Register.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Student");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    // Handle registration logic here
    console.log("Registration data:", { ...formData, userType });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <motion.div
          className="register-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={illustrationImage} alt="Student illustration" />
        </motion.div>

        <motion.div
          className="register-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="register-header">
            <BrandLogo />

            <p
              className="text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              Join thousands of learners and tutors worldwide
            </p>
          </div>
          <div className="register-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-base font-medium mb-3"
                  style={{ color: colors.text.primary }}
                >
                  I want to join as:
                </label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 font-medium"
                    style={{
                      backgroundColor:
                        userType === "Student"
                          ? colors.primary.main
                          : colors.background.input,
                      color:
                        userType === "Student"
                          ? colors.text.white
                          : colors.text.secondary,
                    }}
                    onClick={() => setUserType("Student")}
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 font-medium"
                    style={{
                      backgroundColor:
                        userType === "Tutor"
                          ? colors.primary.main
                          : colors.background.input,
                      color:
                        userType === "Tutor"
                          ? colors.text.white
                          : colors.text.secondary,
                    }}
                    onClick={() => setUserType("Tutor")}
                  >
                    Tutor
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    style={{ backgroundColor: colors.background.input }}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    style={{ backgroundColor: colors.background.input }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    style={{ backgroundColor: colors.background.input }}
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-base font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    style={{ backgroundColor: colors.background.input }}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <Checkbox
                  isSelected={agreeToTerms}
                  onValueChange={setAgreeToTerms}
                  size="sm"
                  classNames={{
                    label: "text-sm",
                  }}
                >
                  <span style={{ color: colors.text.secondary }}>
                    I agree to the{" "}
                    <Link
                      href="#"
                      size="sm"
                      style={{ color: colors.primary.main }}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      size="sm"
                      style={{ color: colors.primary.main }}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </Checkbox>
              </div>

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-medium"
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
              >
                Create Account
              </Button>

              <SocialLogin text="sign up" />
            </form>
          </div>
          <div
            className="text-center"
            style={{ width: "100%", maxWidth: "580px" }}
          >
            <span style={{ color: colors.text.secondary }}>
              Already have an account?{" "}
            </span>
            <Link
              onClick={() => navigate("/login")}
              className="cursor-pointer"
              style={{ color: colors.primary.main }}
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
