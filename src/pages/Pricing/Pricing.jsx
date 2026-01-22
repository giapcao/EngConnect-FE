import {
  Button,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import paymentImage from "../../assets/illustrations/payment.avif";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  const plans = [
    {
      name: t("pricing.plans.starter.name"),
      description: t("pricing.plans.starter.description"),
      price: "$29",
      period: t("pricing.plans.perMonth"),
      features: t("pricing.plans.starter.features", { returnObjects: true }),
      buttonText: t("pricing.plans.starter.button"),
      popular: false,
    },
    {
      name: t("pricing.plans.professional.name"),
      description: t("pricing.plans.professional.description"),
      price: "$89",
      period: t("pricing.plans.perMonth"),
      features: t("pricing.plans.professional.features", {
        returnObjects: true,
      }),
      buttonText: t("pricing.plans.professional.button"),
      popular: true,
    },
    {
      name: t("pricing.plans.enterprise.name"),
      description: t("pricing.plans.enterprise.description"),
      price: t("pricing.plans.enterprise.price"),
      period: "",
      features: t("pricing.plans.enterprise.features", { returnObjects: true }),
      buttonText: t("pricing.plans.enterprise.button"),
      popular: false,
    },
  ];

  const faqs = t("pricing.faqs.items", { returnObjects: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
        style={{
          background:
            theme === "dark"
              ? colors.background.page
              : "linear-gradient(to bottom, #FFFFFF, #DBEAFE)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <h1
                className="text-4xl sm:text-5xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t("pricing.hero.title")}
              </h1>
              <p
                className="text-lg max-w-xl"
                style={{ color: colors.text.secondary }}
              >
                {t("pricing.hero.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src={paymentImage}
                alt="Pricing plans"
                className="w-full max-w-md h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              {t("pricing.hero.plansTitle")}
            </h2>
            <p style={{ color: colors.text.secondary }}>
              {t("pricing.hero.plansSubtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={itemVariants}>
                <Card
                  className="h-full shadow-none relative overflow-visible"
                  style={{
                    backgroundColor: colors.background.gray,
                  }}
                >
                  {plan.popular && (
                    <div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold z-10"
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                    >
                      ⭐ {t("pricing.plans.mostPopular")}
                    </div>
                  )}
                  <CardBody className="p-6 pt-8">
                    <div className="mb-6">
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: colors.text.primary }}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className="text-sm mb-4"
                        style={{ color: colors.text.secondary }}
                      >
                        {plan.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-4xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {plan.price}
                        </span>
                        <span style={{ color: colors.text.secondary }}>
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: colors.primary.main }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="lg"
                      radius="full"
                      className="w-full font-semibold"
                      variant={plan.popular ? "solid" : "outlined"}
                      style={
                        plan.popular
                          ? {
                              backgroundColor: colors.primary.main,
                              color: colors.text.white,
                            }
                          : {
                              color: colors.button.primaryLight.text,
                              backgroundColor:
                                colors.button.primaryLight.background,
                            }
                      }
                      onPress={() =>
                        plan.name === "Enterprise"
                          ? console.log("Contact sales")
                          : navigate("/register")
                      }
                    >
                      {plan.buttonText}
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {t("pricing.faqs.title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Accordion
              variant="splitted"
              className="shadow-none"
              itemClasses={{
                base: "py-2 shadow-none",
                title: "font-medium text-base",
                trigger: "px-4 py-3 rounded-2xl",
                content: "px-4 pb-4 pt-0 rounded-2xl",
              }}
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  aria-label={faq.question}
                  title={
                    <span style={{ color: colors.text.primary }}>
                      {faq.question}
                    </span>
                  }
                  className="rounded-2xl"
                  style={{
                    backgroundColor: colors.background.card,
                  }}
                >
                  <p style={{ color: colors.text.secondary }}>{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 px-6 md:px-12"
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
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.white }}
            >
              {t("pricing.cta.title")}
            </h2>
            <p
              className="text-lg mb-8 opacity-90"
              style={{ color: colors.text.white }}
            >
              {t("pricing.cta.subtitle")}
            </p>
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
              {t("pricing.cta.button")}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
