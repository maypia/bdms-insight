export type Role = "root" | "admin" | "manager" | "staff";

export type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
  updatedAt: string;
};

export type Department = {
  id: string;
  code: string;
  name: string;
  description: string;
  manager: string;
  managerEmail: string;
  contact: string;
  status: "active" | "draft";
  updatedAt: string;
  faqs: FAQ[];
  procedures: { id: string; title: string; steps: string[] }[];
  documents: { id: string; name: string; required: boolean; note?: string }[];
  contacts: { id: string; name: string; role: string; phone: string; email: string }[];
  attachments: { id: string; name: string; type: string; size: string }[];
};

export const departments: Department[] = [
  {
    id: "ap",
    code: "AP",
    name: "Accounts Payable",
    description: "ฝ่ายบัญชีเจ้าหนี้ — ดูแลการตั้งหนี้ การจ่ายเงิน และเอกสารทางการเงิน",
    manager: "คุณสมศรี วัฒนกุล",
    managerEmail: "ap.manager@bdms.local",
    contact: "02-310-3000 ต่อ 1201",
    status: "active",
    updatedAt: "2026-05-12",
    faqs: [
      {
        id: "ap-1",
        category: "Payment Schedule",
        question: "กำหนดวันรับเช็คและการโอนเงิน",
        answer: "รับเช็คทุกวันพุธและศุกร์ เวลา 13:30 - 16:00 น. สอบถามเพิ่มเติมที่หมายเลข 02-310-3000 ต่อ 1205",
        tags: ["payment", "เช็ค"],
        updatedAt: "2026-05-10",
      },
      {
        id: "ap-2",
        category: "Debt Setup Documents",
        question: "เอกสารประกอบการตั้งหนี้มีอะไรบ้าง",
        answer:
          "1. ต้นฉบับใบกำกับภาษี\n2. ใบเสร็จรับเงิน (สินค้า)\n3. ใบแจ้งหนี้\n4. ใบส่งของ\n5. ใบวางบิล",
        tags: ["ตั้งหนี้", "เอกสาร"],
        updatedAt: "2026-05-08",
      },
      {
        id: "ap-3",
        category: "Payment Documents",
        question: "เอกสารประกอบการจ่ายเงินมีอะไรบ้าง",
        answer:
          "ประเภทงานบริการ:\n- ต้นฉบับใบกำกับภาษี\n- ใบเสร็จรับเงิน\n\nประเภทงานก่อสร้าง:\n- ใบส่งมอบงาน\n- Certificate of Payment (COP)",
        tags: ["จ่ายเงิน"],
        updatedAt: "2026-05-05",
      },
      {
        id: "ap-4",
        category: "TE Advance",
        question: "TE Advance ต้องทำอย่างไร",
        answer:
          "ต้องมีมูลค่ามากกว่า 3,000 บาท\nเอกสารที่ใช้:\n- แบบฟอร์มเงินทดรองจ่าย\n- Memo ขออนุมัติ\n- หลักการอนุมัติตามอำนาจดำเนินการ",
        tags: ["TE", "advance"],
        updatedAt: "2026-05-03",
      },
      {
        id: "ap-5",
        category: "Clear TE",
        question: "Clear TE ใช้อะไรบ้าง",
        answer: "- สำเนาแบบฟอร์มเงินทดรองจ่าย\n- ใบเสร็จรับเงินตัวจริง",
        tags: ["TE", "clear"],
        updatedAt: "2026-05-01",
      },
      {
        id: "ap-6",
        category: "Petty Cash",
        question: "Petty Cash ใช้อะไรบ้าง",
        answer:
          "ต้องมีมูลค่าน้อยกว่า 3,000 บาท\nเอกสาร:\n- แบบฟอร์มการเบิกเงินสดย่อย\n- ใบแจ้งหนี้\n- ใบเสร็จรับเงิน",
        tags: ["petty cash"],
        updatedAt: "2026-04-28",
      },
    ],
    procedures: [
      {
        id: "p1",
        title: "ขั้นตอนการตั้งหนี้",
        steps: [
          "รวบรวมเอกสารตั้งหนี้ให้ครบถ้วน",
          "ส่งเอกสารที่แผนก AP ภายในวันที่ 5 ของเดือน",
          "AP ตรวจสอบความถูกต้องภายใน 3 วันทำการ",
          "บันทึกตั้งหนี้ในระบบ ERP",
          "แจ้งผู้ขอเบิกเมื่อพร้อมจ่าย",
        ],
      },
      {
        id: "p2",
        title: "ขั้นตอนการเบิก TE Advance",
        steps: [
          "กรอกแบบฟอร์มเงินทดรองจ่าย",
          "แนบ Memo และเอกสารอนุมัติ",
          "ส่งให้หัวหน้าแผนกอนุมัติ",
          "ส่งต่อไปยัง AP เพื่อจ่ายเงิน",
        ],
      },
    ],
    documents: [
      { id: "d1", name: "แบบฟอร์มเงินทดรองจ่าย (TE Advance Form)", required: true, note: "ใช้สำหรับเบิก > 3,000 บาท" },
      { id: "d2", name: "แบบฟอร์มเบิกเงินสดย่อย (Petty Cash Form)", required: true, note: "ใช้สำหรับ < 3,000 บาท" },
      { id: "d3", name: "Certificate of Payment (COP)", required: false, note: "เฉพาะงานก่อสร้าง" },
      { id: "d4", name: "ใบกำกับภาษี / ใบเสร็จรับเงิน", required: true },
    ],
    contacts: [
      { id: "c1", name: "คุณสมศรี วัฒนกุล", role: "AP Manager", phone: "02-310-3000 #1201", email: "somsri.w@bdms.local" },
      { id: "c2", name: "คุณกิตติ ภักดี", role: "Senior AP Officer", phone: "02-310-3000 #1205", email: "kitti.p@bdms.local" },
      { id: "c3", name: "คุณนภา ศรีสุข", role: "Petty Cash Officer", phone: "02-310-3000 #1208", email: "napa.s@bdms.local" },
    ],
    attachments: [
      { id: "a1", name: "AP-SOP-2026.pdf", type: "PDF", size: "2.1 MB" },
      { id: "a2", name: "TE-Advance-Form.xlsx", type: "Excel", size: "85 KB" },
      { id: "a3", name: "Petty-Cash-Form.pdf", type: "PDF", size: "120 KB" },
    ],
  },
  {
    id: "hr",
    code: "HR",
    name: "Human Resources",
    description: "ฝ่ายทรัพยากรบุคคล — สวัสดิการ การลา การจ้างงาน และพัฒนาบุคลากร",
    manager: "คุณวิภา จันทร์เพ็ญ",
    managerEmail: "hr.manager@bdms.local",
    contact: "02-310-3000 ต่อ 1500",
    status: "active",
    updatedAt: "2026-05-11",
    faqs: [
      { id: "hr-1", category: "Leave", question: "ลาพักร้อนต้องแจ้งล่วงหน้ากี่วัน", answer: "อย่างน้อย 7 วันทำการ ผ่านระบบ HRIS", updatedAt: "2026-05-11" },
      { id: "hr-2", category: "Benefits", question: "สิทธิรักษาพยาบาลครอบคลุมอะไรบ้าง", answer: "ครอบคลุม OPD/IPD ในเครือ BDMS วงเงินตามระดับตำแหน่ง", updatedAt: "2026-05-09" },
    ],
    procedures: [],
    documents: [{ id: "hd1", name: "แบบฟอร์มใบลา", required: true }],
    contacts: [{ id: "hc1", name: "คุณวิภา", role: "HR Manager", phone: "02-310-3000 #1500", email: "hr@bdms.local" }],
    attachments: [],
  },
  {
    id: "fin",
    code: "FIN",
    name: "Finance",
    description: "ฝ่ายการเงิน — บริหารกระแสเงินสดและงบประมาณ",
    manager: "คุณอนันต์ ทรัพย์มั่น",
    managerEmail: "finance@bdms.local",
    contact: "02-310-3000 ต่อ 1300",
    status: "active",
    updatedAt: "2026-05-09",
    faqs: [],
    procedures: [],
    documents: [],
    contacts: [],
    attachments: [],
  },
  {
    id: "proc",
    code: "PROC",
    name: "Procurement",
    description: "ฝ่ายจัดซื้อ — จัดหาสินค้าและบริการ",
    manager: "คุณธนา สุวรรณ",
    managerEmail: "procurement@bdms.local",
    contact: "02-310-3000 ต่อ 1400",
    status: "active",
    updatedAt: "2026-05-07",
    faqs: [],
    procedures: [],
    documents: [],
    contacts: [],
    attachments: [],
  },
  {
    id: "it",
    code: "IT",
    name: "IT Support",
    description: "ฝ่ายเทคโนโลยีสารสนเทศ — สนับสนุนระบบและอุปกรณ์",
    manager: "คุณพีระ ดิจิทัล",
    managerEmail: "it@bdms.local",
    contact: "02-310-3000 ต่อ 1700",
    status: "active",
    updatedAt: "2026-05-13",
    faqs: [],
    procedures: [],
    documents: [],
    contacts: [],
    attachments: [],
  },
  {
    id: "legal",
    code: "LEG",
    name: "Legal",
    description: "ฝ่ายกฎหมาย — สัญญาและการกำกับดูแล",
    manager: "คุณสุพร ยุติธรรม",
    managerEmail: "legal@bdms.local",
    contact: "02-310-3000 ต่อ 1800",
    status: "active",
    updatedAt: "2026-04-30",
    faqs: [],
    procedures: [],
    documents: [],
    contacts: [],
    attachments: [],
  },
  {
    id: "acc",
    code: "ACC",
    name: "Accounting",
    description: "ฝ่ายบัญชี — ปิดงบและภาษี",
    manager: "คุณรุ่งทิพย์ บัญชี",
    managerEmail: "accounting@bdms.local",
    contact: "02-310-3000 ต่อ 1250",
    status: "draft",
    updatedAt: "2026-04-25",
    faqs: [],
    procedures: [],
    documents: [],
    contacts: [],
    attachments: [],
  },
];

export const currentUser = {
  name: "Dr. Pattara Chen",
  email: "pattara.c@bdms.local",
  role: "admin" as Role,
  department: "AP",
  initials: "PC",
};

export const dashboardStats = {
  totalDepartments: departments.length,
  totalFaqs: departments.reduce((s, d) => s + d.faqs.length, 0),
  chatSessions: 1284,
  knowledgeUpdates: 37,
};

export const recentUpdates = [
  { id: "u1", department: "AP", title: "อัปเดตเอกสารตั้งหนี้ (TE Advance)", by: "คุณสมศรี", at: "2 ชม. ที่แล้ว" },
  { id: "u2", department: "HR", title: "เพิ่ม FAQ เรื่องสิทธิรักษาพยาบาล", by: "คุณวิภา", at: "เมื่อวาน" },
  { id: "u3", department: "IT", title: "อัปเดต SOP การขอ VPN", by: "คุณพีระ", at: "2 วันที่แล้ว" },
  { id: "u4", department: "AP", title: "เพิ่ม Petty Cash Procedure", by: "คุณกิตติ", at: "3 วันที่แล้ว" },
];
