export const heroData = {
  title: "Welcome to The Arbour Academy",
  subtitle:
    "A place where children learn through discovery, creativity, and play in a nurturing Montessori environment.",
  buttonText: "Apply for Admission",
  imageUrl:
    "https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

export const aboutData = {
  title: "Our Montessori Philosophy",
  description:
    "At The Arbour Academy, we believe in fostering independence, curiosity, and a love for learning. Our Montessori approach respects each child's unique development path, allowing them to learn at their own pace in a carefully prepared environment.",
  secondDescription:
    "Founded in 2005, our school has been dedicated to providing an authentic Montessori education that nurtures the whole child—intellectually, physically, socially, and emotionally.",
  imageUrl:
    "https://images.pexels.com/photos/8613317/pexels-photo-8613317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

export const testimonials = [
  {
    img: "/images/user.webp",
    name: "Sarah Johnson",
    subtitle: "Parent of Emma, Age 5",
    text: "The Arbour Academy has been transformative for our daughter. She's become more confident, independent, and genuinely excited about learning.",
  },
  {
    img: "/images/user.webp",
    name: "Michael Rodriguez",
    subtitle: "Parent of Liam, Age 7",
    text: "We've been amazed by how the teachers nurture our son's natural curiosity. The individualized attention has helped him thrive academically and socially.",
  },
  {
    img: "/images/user.webp",
    name: "Jennifer Chen",
    subtitle: "Parent of Sophia, Age 4",
    text: "The warm, supportive community at The Arbour Academy makes it feel like an extension of our family. My daughter loves going to school every day.",
  },
];

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

export const AVAILABLE_GRADES = [
  "Toddlers",
  "Play-Group",
  "Nursery",
  "Kindergarten",
];

export const AVAILABLE_SECTIONS = ["A", "B", "C", "D"];

export const MOCK_UPCOMING_TESTS = [
  {
    id: "1",
    studentName: "Kamran",
    subject: "Math Test",
    date: new Date(Date.now() + 86400000), // Tomorrow
    grade: "Play-Group",
    importance: "high",
  },
  {
    id: "2",
    studentName: "Hassan",
    subject: "Science Quiz",
    date: new Date(Date.now() + 86400000 * 4), // 4 days from now (Friday)
    grade: "Play-Group",
    importance: "medium",
  },
  {
    id: "3",
    studentName: "Saima",
    subject: "English Activity",
    date: new Date(Date.now() + 86400000 * 6), // 6 days from now
    grade: "Nursery",
    importance: "medium",
  },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    description: "Annual parent-teacher meeting scheduled for next week.",
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    isNew: true,
  },
  {
    id: "2",
    title: "School Carnival",
    description: "Join us for the annual school carnival this weekend.",
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    isNew: true,
  },
  {
    id: "3",
    title: "Holiday Announcement",
    description: "School will be closed for the upcoming national holiday.",
    date: new Date(Date.now() + 86400000 * 10), // 10 days from now
    isNew: true,
  },
];
