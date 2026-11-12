/**
 * @file hrSharedStorage.js
 * @description Real-time Synchronized HR & Payroll Storage Service.
 * Bridges Staff Portal and Master Admin for:
 *   1. Staff Attendance & Live Roster (Clock In / Clock Out, Manual Overrides)
 *   2. Leave Applications & Admin Approvals/Rejections
 *   3. Staff Salary, Payroll Processing, and Payslip Generation
 * @module frontend/src/services/hrSharedStorage
 */

// Staff master roster across all businesses
export const DEFAULT_STAFF_MEMBERS = [
  {
    id: 'STF-P-101',
    name: 'Radhika Sharma',
    email: 'radhika@blossom.com',
    phone: '+91 98765 11111',
    department: 'PARLOUR',
    designation: 'Senior Bridal Stylist',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 32000,
    avatar: 'RS',
  },
  {
    id: 'STF-P-102',
    name: 'Priya Verma',
    email: 'priya@blossom.com',
    phone: '+91 98765 22222',
    department: 'PARLOUR',
    designation: 'Skin & Facial Specialist',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 26000,
    avatar: 'PV',
  },
  {
    id: 'STF-E-201',
    name: 'Vikramaditya Singh',
    email: 'vikram@jaygurudev.com',
    phone: '+91 98234 33333',
    department: 'EVENTS',
    designation: 'Stage & Mandap Coordinator',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 35000,
    avatar: 'VS',
  },
  {
    id: 'STF-E-202',
    name: 'Rajesh Tiwari',
    email: 'rajesh@jaygurudev.com',
    phone: '+91 98234 44444',
    department: 'EVENTS',
    designation: 'Audio-Visual & Pyro Technician',
    shift: '11:00 AM - 08:00 PM',
    baseSalary: 28000,
    avatar: 'RT',
  },
  {
    id: 'STF-L-301',
    name: 'Anand Mohan Roy',
    email: 'anand@kashiplot.com',
    phone: '+91 94152 55555',
    department: 'PLOTTING',
    designation: 'Senior Property Sales Officer',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 38000,
    avatar: 'AM',
  },
  {
    id: 'STF-L-302',
    name: 'Amitabh Pandey',
    email: 'amitabh@kashiplot.com',
    phone: '+91 94152 66666',
    department: 'PLOTTING',
    designation: 'Site Visit & Registry Executive',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 29000,
    avatar: 'AP',
  },
  {
    id: 'STF-S-401',
    name: 'Rohit K. Verma',
    email: 'rohit@rbsoftware.io',
    phone: '+91 98220 77777',
    department: 'SOFTWARE',
    designation: 'Lead Fullstack Dev & Architect',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 58000,
    avatar: 'RV',
  },
  {
    id: 'STF-S-402',
    name: 'Neha Srivastava',
    email: 'neha@rbsoftware.io',
    phone: '+91 98220 88888',
    department: 'SOFTWARE',
    designation: 'Frontend & UI/UX Specialist',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 45000,
    avatar: 'NS',
  },
  {
    id: 'STF-R-501',
    name: 'Dinesh Kumar Upadhyay',
    email: 'dinesh@kashirent.com',
    phone: '+91 98111 99999',
    department: 'RENT',
    designation: 'Commercial Lease Manager',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 30000,
    avatar: 'DU',
  },
];

// Helper: Today's date string YYYY-MM-DD
export const getTodayDateStr = () => new Date().toISOString().slice(0, 10);

// Default initial attendance records for today & recent days
const DEFAULT_ATTENDANCE = [
  {
    id: 'ATT-001',
    staffId: 'STF-P-101',
    staffName: 'Radhika Sharma',
    department: 'PARLOUR',
    date: getTodayDateStr(),
    checkIn: '09:25 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'Clocked in on time via Salon Staff portal',
  },
  {
    id: 'ATT-002',
    staffId: 'STF-P-102',
    staffName: 'Priya Verma',
    department: 'PARLOUR',
    date: getTodayDateStr(),
    checkIn: '10:14 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'LATE',
    source: 'STAFF_APP',
    notes: 'Traffic delay on Cantt bridge',
  },
  {
    id: 'ATT-003',
    staffId: 'STF-E-201',
    staffName: 'Vikramaditya Singh',
    department: 'EVENTS',
    date: getTodayDateStr(),
    checkIn: '09:50 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'On duty at Shri Ram Lawn mandap setup',
  },
  {
    id: 'ATT-004',
    staffId: 'STF-E-202',
    staffName: 'Rajesh Tiwari',
    department: 'EVENTS',
    date: getTodayDateStr(),
    checkIn: null,
    checkOut: null,
    workHours: '-',
    status: 'ON_LEAVE',
    source: 'SYSTEM',
    notes: 'Approved Casual Leave',
  },
  {
    id: 'ATT-005',
    staffId: 'STF-L-301',
    staffName: 'Anand Mohan Roy',
    department: 'PLOTTING',
    date: getTodayDateStr(),
    checkIn: '09:20 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'Smart Enclave phase-2 client visit scheduled',
  },
  {
    id: 'ATT-006',
    staffId: 'STF-L-302',
    staffName: 'Amitabh Pandey',
    department: 'PLOTTING',
    date: getTodayDateStr(),
    checkIn: '09:28 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'Chunar Road site documentation',
  },
  {
    id: 'ATT-007',
    staffId: 'STF-S-401',
    staffName: 'Rohit K. Verma',
    department: 'SOFTWARE',
    date: getTodayDateStr(),
    checkIn: '09:55 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'Backend sprint release',
  },
  {
    id: 'ATT-008',
    staffId: 'STF-S-402',
    staffName: 'Neha Srivastava',
    department: 'SOFTWARE',
    date: getTodayDateStr(),
    checkIn: '10:05 AM',
    checkOut: null,
    workHours: 'In Progress (Active)',
    status: 'PRESENT',
    source: 'STAFF_APP',
    notes: 'UI design review for ecommerce mobile app',
  },
  {
    id: 'ATT-009',
    staffId: 'STF-R-501',
    staffName: 'Dinesh Kumar Upadhyay',
    department: 'RENT',
    date: getTodayDateStr(),
    checkIn: null,
    checkOut: null,
    workHours: '-',
    status: 'ABSENT',
    source: 'SYSTEM',
    notes: 'No check-in recorded yet today',
  },
];

// Default initial leave requests
const DEFAULT_LEAVES = [
  {
    id: 'LEV-101',
    staffId: 'STF-P-101',
    staffName: 'Radhika Sharma',
    department: 'PARLOUR',
    leaveType: 'CASUAL',
    fromDate: '2026-11-20',
    toDate: '2026-11-21',
    daysCount: 2,
    reason: 'Family wedding event in Kanpur. Handed over bridal advance notes to Priya.',
    status: 'PENDING',
    appliedAt: '2026-11-11',
    reviewedBy: null,
    reviewedAt: null,
    adminRemarks: '',
  },
  {
    id: 'LEV-102',
    staffId: 'STF-E-202',
    staffName: 'Rajesh Tiwari',
    department: 'EVENTS',
    leaveType: 'CASUAL',
    fromDate: getTodayDateStr(),
    toDate: getTodayDateStr(),
    daysCount: 1,
    reason: 'Personal urgent bank work in city branch.',
    status: 'APPROVED',
    appliedAt: '2026-11-10',
    reviewedBy: 'Master Admin',
    reviewedAt: '2026-11-11',
    adminRemarks: 'Approved. Advance setup checked.',
  },
  {
    id: 'LEV-103',
    staffId: 'STF-S-402',
    staffName: 'Neha Srivastava',
    department: 'SOFTWARE',
    leaveType: 'SICK',
    fromDate: '2026-11-06',
    toDate: '2026-11-07',
    daysCount: 2,
    reason: 'Viral fever and doctor consultation.',
    status: 'APPROVED',
    appliedAt: '2026-11-05',
    reviewedBy: 'Master Admin',
    reviewedAt: '2026-11-05',
    adminRemarks: 'Approved with medical rest advice.',
  },
  {
    id: 'LEV-104',
    staffId: 'STF-L-301',
    staffName: 'Anand Mohan Roy',
    department: 'PLOTTING',
    leaveType: 'CASUAL',
    fromDate: '2026-11-02',
    toDate: '2026-11-03',
    daysCount: 2,
    reason: 'Village visit for agricultural harvesting.',
    status: 'REJECTED',
    appliedAt: '2026-10-31',
    reviewedBy: 'Master Admin',
    reviewedAt: '2026-11-01',
    adminRemarks: 'Major weekend buyer site visits were booked.',
  },
];

// Default initial salary payroll ledger
const DEFAULT_PAYROLL = [
  {
    id: 'PAY-2026-11-001',
    staffId: 'STF-P-101',
    staffName: 'Radhika Sharma',
    department: 'PARLOUR',
    designation: 'Senior Bridal Stylist',
    month: 'November 2026',
    baseSalary: 32000,
    presentDays: 26,
    paidLeaves: 2,
    unpaidLeaves: 0,
    allowances: 3500,
    bonus: 2500,
    deductions: 500,
    netSalary: 37500,
    paymentStatus: 'PAID',
    paidAt: '2026-11-10',
    paymentMode: 'BANK_TRANSFER',
    transactionRef: 'NEFT-SBI-88992211',
  },
  {
    id: 'PAY-2026-11-002',
    staffId: 'STF-P-102',
    staffName: 'Priya Verma',
    department: 'PARLOUR',
    designation: 'Skin & Facial Specialist',
    month: 'November 2026',
    baseSalary: 26000,
    presentDays: 25,
    paidLeaves: 1,
    unpaidLeaves: 1,
    allowances: 2500,
    bonus: 1000,
    deductions: 866,
    netSalary: 28634,
    paymentStatus: 'PENDING',
    paidAt: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: 'PAY-2026-11-003',
    staffId: 'STF-E-201',
    staffName: 'Vikramaditya Singh',
    department: 'EVENTS',
    designation: 'Stage & Mandap Coordinator',
    month: 'November 2026',
    baseSalary: 35000,
    presentDays: 27,
    paidLeaves: 1,
    unpaidLeaves: 0,
    allowances: 4000,
    bonus: 3000,
    deductions: 0,
    netSalary: 42000,
    paymentStatus: 'PAID',
    paidAt: '2026-11-10',
    paymentMode: 'UPI',
    transactionRef: 'UPI-HDFC-99112233',
  },
  {
    id: 'PAY-2026-11-004',
    staffId: 'STF-E-202',
    staffName: 'Rajesh Tiwari',
    department: 'EVENTS',
    designation: 'Audio-Visual & Pyro Technician',
    month: 'November 2026',
    baseSalary: 28000,
    presentDays: 24,
    paidLeaves: 2,
    unpaidLeaves: 0,
    allowances: 2500,
    bonus: 1500,
    deductions: 400,
    netSalary: 31600,
    paymentStatus: 'PENDING',
    paidAt: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: 'PAY-2026-11-005',
    staffId: 'STF-L-301',
    staffName: 'Anand Mohan Roy',
    department: 'PLOTTING',
    designation: 'Senior Property Sales Officer',
    month: 'November 2026',
    baseSalary: 38000,
    presentDays: 26,
    paidLeaves: 2,
    unpaidLeaves: 0,
    allowances: 5000,
    bonus: 5000,
    deductions: 1000,
    netSalary: 47000,
    paymentStatus: 'PAID',
    paidAt: '2026-11-09',
    paymentMode: 'BANK_TRANSFER',
    transactionRef: 'RTGS-ICICI-44556677',
  },
  {
    id: 'PAY-2026-11-006',
    staffId: 'STF-L-302',
    staffName: 'Amitabh Pandey',
    department: 'PLOTTING',
    designation: 'Site Visit & Registry Executive',
    month: 'November 2026',
    baseSalary: 29000,
    presentDays: 25,
    paidLeaves: 1,
    unpaidLeaves: 0,
    allowances: 3000,
    bonus: 1500,
    deductions: 500,
    netSalary: 33000,
    paymentStatus: 'PENDING',
    paidAt: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: 'PAY-2026-11-007',
    staffId: 'STF-S-401',
    staffName: 'Rohit K. Verma',
    department: 'SOFTWARE',
    designation: 'Lead Fullstack Dev & Architect',
    month: 'November 2026',
    baseSalary: 58000,
    presentDays: 26,
    paidLeaves: 2,
    unpaidLeaves: 0,
    allowances: 6000,
    bonus: 6000,
    deductions: 2000,
    netSalary: 68000,
    paymentStatus: 'PAID',
    paidAt: '2026-11-10',
    paymentMode: 'BANK_TRANSFER',
    transactionRef: 'NEFT-AXIS-77889900',
  },
  {
    id: 'PAY-2026-11-008',
    staffId: 'STF-S-402',
    staffName: 'Neha Srivastava',
    department: 'SOFTWARE',
    designation: 'Frontend & UI/UX Specialist',
    month: 'November 2026',
    baseSalary: 45000,
    presentDays: 24,
    paidLeaves: 2,
    unpaidLeaves: 0,
    allowances: 4500,
    bonus: 3000,
    deductions: 1000,
    netSalary: 51500,
    paymentStatus: 'PENDING',
    paidAt: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: 'PAY-2026-11-009',
    staffId: 'STF-R-501',
    staffName: 'Dinesh Kumar Upadhyay',
    department: 'RENT',
    designation: 'Commercial Lease Manager',
    month: 'November 2026',
    baseSalary: 30000,
    presentDays: 25,
    paidLeaves: 1,
    unpaidLeaves: 0,
    allowances: 3000,
    bonus: 2000,
    deductions: 500,
    netSalary: 34500,
    paymentStatus: 'PENDING',
    paidAt: null,
    paymentMode: null,
    transactionRef: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE METHODS
// ─────────────────────────────────────────────────────────────────────────────
export const getMasterAttendance = () => {
  try {
    const raw = localStorage.getItem('master_staff_attendance_records');
    if (!raw) {
      localStorage.setItem('master_staff_attendance_records', JSON.stringify(DEFAULT_ATTENDANCE));
      return DEFAULT_ATTENDANCE;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ATTENDANCE;
  } catch {
    return DEFAULT_ATTENDANCE;
  }
};

export const saveMasterAttendance = (records) => {
  try {
    localStorage.setItem('master_staff_attendance_records', JSON.stringify(records));
  } catch (e) {
    console.warn('Storage save warning:', e);
  }
};

export const clockInStaff = ({ staffId, staffName, department, notes = '' }) => {
  const list = getMasterAttendance();
  const today = getTodayDateStr();
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const timeStr = `${displayHours}:${mins} ${ampm}`;

  // If after 10:15 AM -> Late mark
  const isLate = hours > 10 || (hours === 10 && now.getMinutes() > 15);
  const status = isLate ? 'LATE' : 'PRESENT';

  const existingIdx = list.findIndex((a) => a.staffId === staffId && a.date === today);
  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      checkIn: timeStr,
      status,
      workHours: 'In Progress (Active)',
      notes: notes || list[existingIdx].notes,
    };
  } else {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      staffId: staffId || 'STF-P-101',
      staffName: staffName || 'Staff Member',
      department: department || 'PARLOUR',
      date: today,
      checkIn: timeStr,
      checkOut: null,
      workHours: 'In Progress (Active)',
      status,
      source: 'STAFF_APP',
      notes: notes || 'Clocked in via portal',
    };
    list.unshift(newRecord);
  }

  saveMasterAttendance(list);
  return list;
};

export const clockOutStaff = ({ staffId, notes = '' }) => {
  const list = getMasterAttendance();
  const today = getTodayDateStr();
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const timeStr = `${displayHours}:${mins} ${ampm}`;

  const existingIdx = list.findIndex((a) => a.staffId === staffId && a.date === today);
  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      checkOut: timeStr,
      workHours: 'Shift Completed (8.5 hrs)',
      notes: notes || list[existingIdx].notes || 'Clocked out via Staff portal',
    };
  } else {
    list.unshift({
      id: `ATT-${Date.now().toString().slice(-6)}`,
      staffId: staffId || 'STF-P-101',
      staffName: 'Staff Member',
      department: 'PARLOUR',
      date: today,
      checkIn: '09:30 AM',
      checkOut: timeStr,
      workHours: 'Shift Completed',
      status: 'PRESENT',
      source: 'STAFF_APP',
      notes: notes || 'Clocked out via portal',
    });
  }

  saveMasterAttendance(list);
  return list;
};

export const updateDayAttendance = ({ staffId, staffName, department, date, status, checkIn = '', checkOut = '', notes = '' }) => {
  const list = getMasterAttendance();
  const existingIdx = list.findIndex((a) => a.staffId === staffId && a.date === date);

  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      status: status.toUpperCase(),
      checkIn: checkIn || list[existingIdx].checkIn || (status === 'PRESENT' ? '09:30 AM' : null),
      checkOut: checkOut || list[existingIdx].checkOut,
      notes: notes || list[existingIdx].notes,
      source: 'ADMIN_OVERRIDE',
    };
  } else {
    list.unshift({
      id: `ATT-${Date.now().toString().slice(-6)}`,
      staffId,
      staffName: staffName || 'Staff Member',
      department: (department || 'PARLOUR').toUpperCase(),
      date,
      checkIn: checkIn || (status === 'PRESENT' ? '09:30 AM' : null),
      checkOut: checkOut || null,
      workHours: checkOut ? '8h 30m' : status === 'HALF_DAY' ? '4h 00m' : status === 'PRESENT' ? 'In Progress' : '-',
      status: status.toUpperCase(),
      source: 'ADMIN_OVERRIDE',
      notes: notes || 'Admin updated via monthly matrix',
    });
  }

  saveMasterAttendance(list);
  return list;
};

// Generates or reads full monthly attendance matrix for all staff
export const getMonthlyAttendanceMatrix = (year = 2026, month = 10) => {
  // month is 0-indexed (10 = November)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const allRecords = getMasterAttendance();
  const today = getTodayDateStr();

  return DEFAULT_STAFF_MEMBERS.map((staff) => {
    const daysData = {};
    let presentCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let offCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const dObj = new Date(year, month, day);
      const isSunday = dObj.getDay() === 0;

      // Check existing record
      const found = allRecords.find((r) => r.staffId === staff.id && r.date === dateStr);

      if (found) {
        daysData[day] = {
          date: dateStr,
          status: found.status,
          checkIn: found.checkIn,
          checkOut: found.checkOut,
          notes: found.notes,
          recordId: found.id,
        };
      } else if (isSunday) {
        daysData[day] = {
          date: dateStr,
          status: 'OFF',
          label: 'OFF',
          notes: 'Sunday Weekly Off',
        };
      } else if (dateStr > today) {
        daysData[day] = {
          date: dateStr,
          status: 'UPCOMING',
          label: '-',
          notes: 'Upcoming working day',
        };
      } else {
        // Deterministic realistic past days pattern for demo staff
        const seed = (staff.id.charCodeAt(staff.id.length - 1) + day) % 15;
        let st = 'PRESENT';
        let cin = '09:28 AM';
        let cout = '06:32 PM';

        if (seed === 0) {
          st = 'LATE';
          cin = '10:18 AM';
        } else if (seed === 1) {
          st = 'HALF_DAY';
          cout = '02:00 PM';
        } else if (seed === 2) {
          st = 'ON_LEAVE';
          cin = null;
          cout = null;
        } else if (seed === 3) {
          st = 'ABSENT';
          cin = null;
          cout = null;
        }

        daysData[day] = {
          date: dateStr,
          status: st,
          checkIn: cin,
          checkOut: cout,
          notes: `Regular shift day ${day}`,
        };
      }

      // Counts
      const currentSt = daysData[day].status;
      if (currentSt === 'PRESENT') presentCount++;
      else if (currentSt === 'LATE') lateCount++;
      else if (currentSt === 'HALF_DAY') halfDayCount++;
      else if (currentSt === 'ABSENT') absentCount++;
      else if (currentSt === 'ON_LEAVE') leaveCount++;
      else if (currentSt === 'OFF') offCount++;
    }

    return {
      staff,
      daysData,
      summary: {
        present: presentCount,
        late: lateCount,
        halfDay: halfDayCount,
        absent: absentCount,
        leave: leaveCount,
        off: offCount,
        totalWorkingDays: daysInMonth - offCount,
        effectivePresent: presentCount + lateCount + halfDayCount * 0.5,
      },
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVES METHODS
// ─────────────────────────────────────────────────────────────────────────────
export const getMasterLeaves = () => {
  try {
    const raw = localStorage.getItem('master_staff_leave_requests');
    if (!raw) {
      localStorage.setItem('master_staff_leave_requests', JSON.stringify(DEFAULT_LEAVES));
      return DEFAULT_LEAVES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LEAVES;
  } catch {
    return DEFAULT_LEAVES;
  }
};

export const saveMasterLeaves = (leaves) => {
  try {
    localStorage.setItem('master_staff_leave_requests', JSON.stringify(leaves));
  } catch (e) {
    console.warn('Storage save warning:', e);
  }
};

export const applyStaffLeave = ({ staffId, staffName, department, leaveType, fromDate, toDate, reason }) => {
  const list = getMasterLeaves();
  const d1 = new Date(fromDate);
  const d2 = new Date(toDate);
  const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);

  const newLeave = {
    id: `LEV-${Date.now().toString().slice(-5)}`,
    staffId: staffId || 'STF-P-101',
    staffName: staffName || 'Staff Member',
    department: department || 'PARLOUR',
    leaveType: (leaveType || 'CASUAL').toUpperCase(),
    fromDate: fromDate || getTodayDateStr(),
    toDate: toDate || fromDate || getTodayDateStr(),
    daysCount: diffDays,
    reason: reason || 'Personal work',
    status: 'PENDING',
    appliedAt: getTodayDateStr(),
    reviewedBy: null,
    reviewedAt: null,
    adminRemarks: '',
  };

  const updated = [newLeave, ...list];
  saveMasterLeaves(updated);
  return updated;
};

export const reviewLeaveByAdmin = ({ leaveId, action, adminRemarks = '', reviewer = 'Master Admin' }) => {
  const list = getMasterLeaves();
  const idx = list.findIndex((l) => l.id === leaveId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      reviewedBy: reviewer,
      reviewedAt: getTodayDateStr(),
      adminRemarks: adminRemarks || (action === 'APPROVE' ? 'Approved by Admin' : 'Rejected by Admin'),
    };
    saveMasterLeaves(list);
  }
  return list;
};

// ─────────────────────────────────────────────────────────────────────────────
// SALARY & PAYROLL METHODS
// ─────────────────────────────────────────────────────────────────────────────
export const getMasterPayroll = () => {
  try {
    const raw = localStorage.getItem('master_staff_payroll_ledger');
    if (!raw) {
      localStorage.setItem('master_staff_payroll_ledger', JSON.stringify(DEFAULT_PAYROLL));
      return DEFAULT_PAYROLL;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PAYROLL;
  } catch {
    return DEFAULT_PAYROLL;
  }
};

export const saveMasterPayroll = (ledger) => {
  try {
    localStorage.setItem('master_staff_payroll_ledger', JSON.stringify(ledger));
  } catch (e) {
    console.warn('Storage save warning:', e);
  }
};

export const processSalaryDisbursement = ({
  payrollId,
  paymentMode = 'BANK_TRANSFER',
  transactionRef = `TXN-${Date.now().toString().slice(-6)}`,
}) => {
  const list = getMasterPayroll();
  const idx = list.findIndex((p) => p.id === payrollId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      paymentStatus: 'PAID',
      paidAt: getTodayDateStr(),
      paymentMode,
      transactionRef,
    };
    saveMasterPayroll(list);
  }
  return list;
};

export const updateSalaryAdjustments = ({ payrollId, bonus = 0, deductions = 0, allowances = 0 }) => {
  const list = getMasterPayroll();
  const idx = list.findIndex((p) => p.id === payrollId);
  if (idx >= 0) {
    const item = list[idx];
    const b = Number(bonus);
    const d = Number(deductions);
    const a = Number(allowances);
    const net = item.baseSalary + a + b - d;
    list[idx] = {
      ...item,
      bonus: b,
      deductions: d,
      allowances: a,
      netSalary: net,
    };
    saveMasterPayroll(list);
  }
  return list;
};

