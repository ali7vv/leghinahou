export type Report = {
  id: string
  name: string
  age: string
  lastPlace: string
  reportDate: string
  lostDate: string
  status: "مفقود" | "تم العثور"
  image: string
}

export const reports: Report[] = [
  {
    id: "1",
    name: "أحمد محمد علي",
    age: "12 سنة",
    lastPlace: "أم درمان",
    lostDate: "2024-05-20",
    reportDate: "2024-05-21",
    status: "مفقود",
    image: "/images/person-boy.png",
  },
  {
    id: "2",
    name: "محمد أحمد",
    age: "20 سنة",
    lastPlace: "أم درمان",
    lostDate: "2024-05-18",
    reportDate: "2024-05-20",
    status: "مفقود",
    image: "/images/person-young-man.png",
  },
  {
    id: "3",
    name: "الطيب حسين",
    age: "45 سنة",
    lastPlace: "بحري",
    lostDate: "2024-05-15",
    reportDate: "2024-05-19",
    status: "مفقود",
    image: "/images/person-older-man.png",
  },
  {
    id: "4",
    name: "فاطمة عثمان",
    age: "17 سنة",
    lastPlace: "الخرطوم",
    lostDate: "2024-05-15",
    reportDate: "2024-05-18",
    status: "مفقود",
    image: "/images/person-woman.png",
  },
]
