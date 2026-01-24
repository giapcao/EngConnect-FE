import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Image,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  DotsThree,
  PencilSimple,
  Trash,
  Eye,
  Users,
  Star,
  Clock,
  BookOpen,
  VideoCamera,
} from "@phosphor-icons/react";

const MyCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Business English Masterclass",
      description: "Complete business English course for professionals",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      students: 45,
      rating: 4.9,
      totalLessons: 20,
      price: 199,
      status: "published",
      category: "Business",
    },
    {
      id: 2,
      title: "IELTS Preparation Course",
      description: "Comprehensive IELTS preparation for band 7+",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      students: 32,
      rating: 4.8,
      totalLessons: 24,
      price: 249,
      status: "published",
      category: "Exam Prep",
    },
    {
      id: 3,
      title: "Conversational English",
      description: "Improve your daily English conversation skills",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      students: 28,
      rating: 5.0,
      totalLessons: 15,
      price: 149,
      status: "published",
      category: "Speaking",
    },
    {
      id: 4,
      title: "Academic Writing",
      description: "Master academic writing for university",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      students: 0,
      rating: 0,
      totalLessons: 12,
      price: 179,
      status: "draft",
      category: "Writing",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return colors.state.success;
      case "draft":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (selectedTab === "all") return true;
    return course.status === selectedTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.myCourses.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.myCourses.subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus weight="bold" className="w-5 h-5" />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          onPress={onOpen}
        >
          {t("tutorDashboard.myCourses.createCourse")}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.myCourses.searchPlaceholder")}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={{
            inputWrapper: "shadow-none",
          }}
          style={{
            backgroundColor: colors.background.light,
          }}
          className="max-w-xs"
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="light"
          classNames={{
            tabList: "gap-2",
            tab: "px-4",
          }}
        >
          <Tab key="all" title={t("tutorDashboard.myCourses.all")} />
          <Tab
            key="published"
            title={t("tutorDashboard.myCourses.published")}
          />
          <Tab key="draft" title={t("tutorDashboard.myCourses.draft")} />
        </Tabs>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card
              shadow="none"
              className="border-none h-full"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-0">
                <div className="relative">
                  <div className="w-full h-40 overflow-hidden rounded-t-xl">
                    <Image
                      src={course.image}
                      alt={course.title}
                      classNames={{
                        wrapper: "w-full h-full !max-w-full",
                        img: "w-full h-full object-cover",
                      }}
                      radius="none"
                    />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    <Chip
                      size="sm"
                      style={{
                        backgroundColor: getStatusColor(course.status),
                        color: colors.text.white,
                      }}
                    >
                      {course.status === "published"
                        ? t("tutorDashboard.myCourses.published")
                        : t("tutorDashboard.myCourses.draft")}
                    </Chip>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="absolute top-3 right-3 z-10"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                        }}
                      >
                        <DotsThree weight="bold" className="w-5 h-5" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="view"
                        startContent={<Eye className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.viewCourse")}
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        startContent={<PencilSimple className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.editCourse")}
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        startContent={<Trash className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.deleteCourse")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="p-4">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="mb-2"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {course.category}
                  </Chip>

                  <h3
                    className="font-semibold text-lg mb-2 line-clamp-1"
                    style={{ color: colors.text.primary }}
                  >
                    {course.title}
                  </h3>

                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Users
                        weight="duotone"
                        className="w-4 h-4"
                        style={{ color: colors.text.tertiary }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {course.students}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen
                        weight="duotone"
                        className="w-4 h-4"
                        style={{ color: colors.text.tertiary }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {course.totalLessons}{" "}
                        {t("tutorDashboard.myCourses.lessons")}
                      </span>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star
                          weight="fill"
                          className="w-4 h-4"
                          style={{ color: colors.state.warning }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {course.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className="text-xl font-bold"
                      style={{ color: colors.primary.main }}
                    >
                      ${course.price}
                    </p>
                    <Button
                      size="sm"
                      variant="flat"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                        color: colors.primary.main,
                      }}
                    >
                      {t("tutorDashboard.myCourses.manage")}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Course Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.myCourses.createNewCourse")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t("tutorDashboard.myCourses.courseTitle")}
                placeholder={t(
                  "tutorDashboard.myCourses.courseTitlePlaceholder",
                )}
                labelPlacement="outside"
              />
              <Input
                label={t("tutorDashboard.myCourses.courseDescription")}
                placeholder={t(
                  "tutorDashboard.myCourses.courseDescriptionPlaceholder",
                )}
                labelPlacement="outside"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t("tutorDashboard.myCourses.price")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  startContent={
                    <span style={{ color: colors.text.tertiary }}>$</span>
                  }
                />
                <Input
                  label={t("tutorDashboard.myCourses.totalLessons")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t("tutorDashboard.myCourses.cancel")}
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={onClose}
            >
              {t("tutorDashboard.myCourses.create")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MyCourses;
