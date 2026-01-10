import React, { useState } from "react";
import { Input, Button, Link, Checkbox } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../../components/Authentication/BrandLogo";
import SocialLogin from "../../../components/Authentication/SocialLogin";
import colors from "../../../constants/colors";
import illustrationImage from "../../../assets/images/Saly-1.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-illustration">
          <img src={illustrationImage} alt="Student illustration" />
        </div>

        <div className="login-form-wrapper">
          <div className="login-header">
            <BrandLogo />

            <p
              className="text-center mb-8"
              style={{ color: colors.text.secondary }}
            >
              Welcome back! Please login to your account.
            </p>
          </div>
          <div className="login-card">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Username or email address..."
                  value={formData.email}
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
                  Password
                </label>
                <Input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="flat"
                  size="lg"
                  style={{ backgroundColor: colors.background.input }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff
                          style={{ color: colors.text.tertiary }}
                          className="w-5 h-5"
                        />
                      ) : (
                        <Eye
                          style={{ color: colors.text.tertiary }}
                          className="w-5 h-5"
                        />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                  classNames={{
                    label: "text-base",
                  }}
                >
                  <span style={{ color: colors.text.secondary }}>
                    Remember me
                  </span>
                </Checkbox>

                <Link
                  href="#"
                  size="base"
                  style={{ color: colors.primary.main }}
                >
                  Forgot password?
                </Link>
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
                Login
              </Button>

              <SocialLogin text="login" />
            </form>
          </div>
          <div
            className="text-center"
            style={{ width: "100%", maxWidth: "480px" }}
          >
            <span style={{ color: colors.text.secondary }}>
              Don't have an account?{" "}
            </span>
            <Link
              onClick={() => navigate("/register")}
              className="cursor-pointer"
              style={{ color: colors.primary.main }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
