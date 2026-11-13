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
    _id: '6af59290f084db282860c0bd',
    name: 'Radhika Sharma',
    email: 'staff@blossom.com',
    phone: '+91 98765 00001',
    department: 'PARLOUR',
    designation: 'Senior Bridal Stylist',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 32000,
    avatar: 'RS',
  },
  {
    id: 'STF-E-201',
    _id: '6af59291f084db282860c0bf',
    name: 'Vikram Chauhan',
    email: 'vikram.event@kashiservice.com',
    phone: '+91 98765 00002',
    department: 'EVENTS',
    designation: 'Event Operations Lead',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 35000,
    avatar: 'VC',
  },
  {
    id: 'STF-L-301',
    name: 'Rajesh Maurya',
    email: 'rajesh.plot@kashiservice.com',
    phone: '+91 98765 00003',
    department: 'PLOTTING',
    designation: 'Real Estate Sales Executive',
    shift: '09:30 AM - 06:30 PM',
    baseSalary: 38000,
    avatar: 'RM',
  },
  {
    id: 'STF-S-401',
    name: 'Aman Verma',
    email: 'aman.dev@kashiservice.com',
    phone: '+91 98765 00004',
    department: 'SOFTWARE',
    designation: 'Full Stack Software Engineer',
    shift: '10:00 AM - 07:00 PM',
    baseSalary: 52000,
    avatar: 'AV',
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

// Master Dynamic Roster Resolver: Combines default staff, dynamic/backend staff, and staff found in attendance records
export const getAllStaffRoster = (customStaffList = null) => {
  const map = new Map();

  // 1. Seed with DEFAULT_STAFF_MEMBERS
  DEFAULT_STAFF_MEMBERS.forEach((s) => {
    const key = (s._id || s.id || s.email || s.name).toLowerCase();
    map.set(key, { ...s });
    if (s.name) map.set(s.name.trim().toLowerCase(), { ...s });
    if (s._id) map.set(s._id.toString().toLowerCase(), { ...s });
    if (s.id) map.set(s.id.toLowerCase(), { ...s });
  });

  // 2. Add custom staff from backend or localStorage if provided
  if (Array.isArray(customStaffList) && customStaffList.length > 0) {
    customStaffList.forEach((s) => {
      const id = s._id || s.id || `STF-${Math.random().toString(36).substr(2, 6)}`;
      const name = s.name || s.fullName || 'Staff Member';
      const key = (s._id || s.id || s.email || name).toLowerCase();
      const existing = map.get(key) || map.get(name.trim().toLowerCase());
      const merged = {
        id: s.employeeId || s.id || id,
        _id: s._id || (existing ? existing._id : null),
        name,
        email: s.email || existing?.email || '',
        phone: s.phone || existing?.phone || '',
        department: (s.department || s.targetBusiness || existing?.department || 'PARLOUR').toUpperCase(),
        designation: s.designation || existing?.designation || 'Staff Member',
        shift: s.shift || existing?.shift || '09:30 AM - 06:30 PM',
        baseSalary: s.salary || s.baseSalary || existing?.baseSalary || 30000,
        avatar: existing?.avatar || name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      };
      map.set(key, merged);
      map.set(name.trim().toLowerCase(), merged);
    });
  }

  // 3. Scan allRecords from getMasterAttendance()
  // Any staff member who has clocked in/out or exists in attendance records is guaranteed to be in the roster!
  try {
    const raw = localStorage.getItem('master_staff_attendance_records');
    const allRecords = raw ? JSON.parse(raw) : [];
    if (Array.isArray(allRecords)) {
      allRecords.forEach((rec) => {
        if (!rec) return;
        const recId = (rec.staffId || '').toString().toLowerCase();
        const recName = (rec.staffName || '').trim().toLowerCase();

        const existing = map.get(recId) || map.get(recName);
        if (!existing && (rec.staffId || rec.staffName)) {
          const name = rec.staffName || 'Staff Member';
          const newStaff = {
            id: rec.staffId || `STF-${Date.now().toString().slice(-4)}`,
            _id: rec.staffId && rec.staffId.length === 24 ? rec.staffId : null,
            name,
            email: '',
            phone: '',
            department: (rec.department || 'PARLOUR').toUpperCase(),
            designation: 'Staff Member',
            shift: '09:30 AM - 06:30 PM',
            baseSalary: 30000,
            avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          };
          map.set(recId || recName, newStaff);
          map.set(recName, newStaff);
        } else if (existing) {
          if (rec.department && (!existing.department || existing.department === 'PARLOUR')) {
            existing.department = rec.department.toUpperCase();
          }
          if (rec.staffId && !existing._id && rec.staffId.length === 24) {
            existing._id = rec.staffId;
          }
        }
      });
    }
  } catch (e) {
    // Graceful fallback
  }

  // Extract unique staff objects
  const uniqueList = [];
  const seenIds = new Set();
  const seenNames = new Set();

  for (const staff of map.values()) {
    const nameKey = (staff.name || '').trim().toLowerCase();
    const idKey = (staff._id || staff.id || '').toLowerCase();
    if (!seenNames.has(nameKey) && !seenIds.has(idKey)) {
      seenNames.add(nameKey);
      seenIds.add(idKey);
      uniqueList.push(staff);
    }
  }

  return uniqueList;
};

// Builds comprehensive, synchronized initial attendance records for today and past days of November 2026
export const buildDefaultAttendanceRecords = () => {
  const records = [];
  const today = getTodayDateStr();

  // 1. Records for today (11/13/2026)
  // Vikram Chauhan: Clocked out (01:01 PM - 01:03 PM, 0h 2m Half Day)
  records.push({
    id: 'ATT-2026-11-13-VC',
    staffId: '6af59291f084db282860c0bf',
    staffName: 'Vikram Chauhan',
    department: 'EVENTS',
    date: today,
    checkIn: '01:01 PM',
    checkInTimestamp: Date.now() - 3600000,
    checkOut: '01:03 PM',
    checkOutTimestamp: Date.now() - 3480000,
    workHours: '0h 2m (Half Day)',
    status: 'HALF_DAY',
    source: 'STAFF_APP',
    isActive: false,
    punches: [
      {
        punchNum: 1,
        in: '01:01 PM',
        inTimestamp: Date.now() - 3600000,
        out: '01:03 PM',
        outTimestamp: Date.now() - 3480000,
        durationMins: 2,
        durationStr: '0h 2m',
      },
    ],
    notes: 'Clocked out via Staff Portal (Punch #1)',
  });

  // Radhika Sharma: Clocked in Session #2 (Active Live Working On Duty)
  records.push({
    id: 'ATT-2026-11-13-RS',
    staffId: '6af59290f084db282860c0bd',
    staffName: 'Radhika Sharma',
    department: 'PARLOUR',
    date: today,
    checkIn: '11:50 AM',
    checkInTimestamp: Date.now() - 3600000,
    checkOut: null,
    checkOutTimestamp: null,
    workHours: 'Active Timer Running',
    status: 'HALF_DAY',
    source: 'STAFF_APP',
    isActive: true,
    currentPunchIndex: 2,
    punches: [
      {
        punchNum: 1,
        in: '09:25 AM',
        inTimestamp: Date.now() - 14400000,
        out: '11:30 AM',
        outTimestamp: Date.now() - 7200000,
        durationMins: 125,
        durationStr: '2h 05m',
      },
      {
        punchNum: 2,
        in: '11:50 AM',
        inTimestamp: Date.now() - 3600000,
        out: null,
        outTimestamp: null,
        durationMins: 0,
        durationStr: 'In Progress',
      },
    ],
    notes: 'Clocked in via Staff Portal (Session #2)',
  });

  // 2. Consistent Historical Records for Past Days (Day 1 - 12 of November 2026)
  const currentYear = 2026;
  const currentMonth = 10; // November

  for (let day = 1; day <= 12; day++) {
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${currentYear}-11-${dayStr}`;
    const dObj = new Date(currentYear, currentMonth, day);
    const isSunday = dObj.getDay() === 0;

    if (isSunday) continue; // Sunday is weekly off

    DEFAULT_STAFF_MEMBERS.forEach((staff) => {
      let status = 'PRESENT';
      let checkIn = '09:30 AM';
      let checkOut = '06:30 PM';
      let workHours = '9h 00m (Full Day)';
      let notes = `Full day completed - ${staff.department}`;

      // Realistic historical day variations
      if (day === 10 && staff.name === 'Priya Verma') {
        status = 'LATE';
        checkIn = '10:25 AM';
        workHours = '8h 05m (Full Day)';
        notes = 'Late arrival due to traffic';
      } else if (day === 11 && staff.name === 'Vikram Chauhan') {
        status = 'HALF_DAY';
        checkOut = '02:00 PM';
        workHours = '4h 30m (Half Day)';
        notes = 'Half day approved by manager';
      } else if (day === 11 && staff.name === 'Radhika Sharma') {
        status = 'LATE';
        checkIn = '10:15 AM';
        workHours = '8h 15m (Full Day)';
        notes = 'Late clock-in';
      } else if (day === 12 && staff.name === 'Priya Verma') {
        status = 'HALF_DAY';
        checkOut = '02:00 PM';
        workHours = '4h 30m (Half Day)';
        notes = 'Half day taken';
      } else if (day === 12 && staff.name === 'Rajesh Tiwari') {
        status = 'ON_LEAVE';
        checkIn = null;
        checkOut = null;
        workHours = '-';
        notes = 'Approved Casual Leave';
      }

      records.push({
        id: `ATT-HIST-${dayStr}-${staff.id || staff.name.replace(/\s+/g, '')}`,
        staffId: staff._id || staff.id,
        staffName: staff.name,
        department: staff.department,
        date: dateStr,
        checkIn,
        checkOut,
        workHours,
        status,
        source: 'SYSTEM',
        isActive: false,
        notes,
      });
    });
  }

  return records;
};

// Default initial attendance records for today & recent days
const DEFAULT_ATTENDANCE = buildDefaultAttendanceRecords();

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
    _id: '6af59291f084db282860c0bf',
    staffName: 'Vikram Chauhan',
    department: 'EVENTS',
    designation: 'Event Operations Lead',
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
      const initial = buildDefaultAttendanceRecords();
      localStorage.setItem('master_staff_attendance_records', JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = buildDefaultAttendanceRecords();
      localStorage.setItem('master_staff_attendance_records', JSON.stringify(initial));
      return initial;
    }

    // Ensure Vikram Chauhan's record exists in attendance
    const hasVikram = parsed.some(
      (r) =>
        (r.staffName && r.staffName.toLowerCase().includes('vikram chauhan')) ||
        r.staffId === '6af59291f084db282860c0bf'
    );
    if (!hasVikram) {
      parsed.unshift({
        id: 'ATT-2026-11-13-VC',
        staffId: '6af59291f084db282860c0bf',
        staffName: 'Vikram Chauhan',
        department: 'EVENTS',
        date: getTodayDateStr(),
        checkIn: '01:01 PM',
        checkInTimestamp: Date.now() - 3600000,
        checkOut: '01:03 PM',
        checkOutTimestamp: Date.now() - 3480000,
        workHours: '0h 2m (Half Day)',
        status: 'HALF_DAY',
        source: 'STAFF_APP',
        isActive: false,
        punches: [
          {
            punchNum: 1,
            in: '01:01 PM',
            inTimestamp: Date.now() - 3600000,
            out: '01:03 PM',
            outTimestamp: Date.now() - 3480000,
            durationMins: 2,
            durationStr: '0h 2m',
          },
        ],
        notes: 'Clocked out via Staff Portal (Punch #1)',
      });
      localStorage.setItem('master_staff_attendance_records', JSON.stringify(parsed));
    }

    return parsed;
  } catch {
    return buildDefaultAttendanceRecords();
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
  const nowTs = now.getTime();
  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const timeStr = `${displayHours}:${mins} ${ampm}`;

  // If after 10:15 AM -> Late mark
  const isLate = hours > 10 || (hours === 10 && now.getMinutes() > 15);
  const status = isLate ? 'LATE' : 'PRESENT';

  const existingIdx = list.findIndex(
    (a) => (a.staffId === staffId || (staffName && a.staffName && a.staffName.trim().toLowerCase() === staffName.trim().toLowerCase())) && a.date === today
  );
  if (existingIdx >= 0) {
    const existing = list[existingIdx];
    const existingPunches = Array.isArray(existing.punches) ? [...existing.punches] : [];

    // Max 2 punches allowed per day
    if (existingPunches.length >= 2 && !existing.isActive) {
      throw new Error('Maximum 2 check-in/check-out sessions reached for today.');
    }

    if (existing.isActive) {
      throw new Error('You are already checked in. Please check out before punching in again.');
    }

    const punchNum = existingPunches.length + 1;
    existingPunches.push({
      punchNum,
      in: timeStr,
      inTimestamp: nowTs,
      out: null,
      outTimestamp: null,
      durationMins: 0,
      durationStr: 'In Progress',
    });

    list[existingIdx] = {
      ...existing,
      checkIn: existing.checkIn || timeStr,
      checkInTimestamp: nowTs,
      isActive: true,
      currentPunchIndex: punchNum,
      punches: existingPunches,
      status: existing.status === 'HALF_DAY' ? 'HALF_DAY' : status,
      workHours: 'In Progress (Active Timer Running)',
      notes: notes || `Clocked in (Punch #${punchNum}) via Staff Portal`,
    };
  } else {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      staffId: staffId || 'STF-P-101',
      staffName: staffName || 'Staff Member',
      department: department || 'PARLOUR',
      date: today,
      checkIn: timeStr,
      checkInTimestamp: nowTs,
      checkOut: null,
      checkOutTimestamp: null,
      isActive: true,
      currentPunchIndex: 1,
      punches: [
        {
          punchNum: 1,
          in: timeStr,
          inTimestamp: nowTs,
          out: null,
          outTimestamp: null,
          durationMins: 0,
          durationStr: 'In Progress',
        },
      ],
      totalDurationMins: 0,
      workHours: 'In Progress (Active Timer Running)',
      status,
      source: 'STAFF_APP',
      notes: notes || 'Clocked in (Punch #1) via Staff Portal',
    };
    list.unshift(newRecord);
  }

  saveMasterAttendance(list);
  window.dispatchEvent(new CustomEvent('staff_attendance_updated', { detail: { staffId, today } }));
  return list;
};

export const clockOutStaff = ({ staffId, staffName = '', notes = '' }) => {
  const list = getMasterAttendance();
  const today = getTodayDateStr();
  const now = new Date();
  const nowTs = now.getTime();
  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const timeStr = `${displayHours}:${mins} ${ampm}`;

  const existingIdx = list.findIndex(
    (a) =>
      a.date === today &&
      (a.staffId === staffId ||
        (staffName && a.staffName && a.staffName.trim().toLowerCase() === staffName.trim().toLowerCase()))
  );
  if (existingIdx >= 0) {
    const rec = list[existingIdx];
    const punches = Array.isArray(rec.punches) && rec.punches.length > 0 ? [...rec.punches] : [];

    let currentPunch = punches[punches.length - 1];
    if (!currentPunch || currentPunch.out) {
      // Create a fallback punch if none was active
      currentPunch = {
        punchNum: punches.length + 1,
        in: rec.checkIn || '09:30 AM',
        inTimestamp: rec.checkInTimestamp || (nowTs - 4 * 3600 * 1000),
        out: timeStr,
        outTimestamp: nowTs,
        durationMins: 240,
        durationStr: '4h 00m',
      };
      punches.push(currentPunch);
    } else {
      const punchDurationMins = Math.max(1, Math.round((nowTs - (currentPunch.inTimestamp || nowTs)) / 60000));
      const pHours = Math.floor(punchDurationMins / 60);
      const pMins = punchDurationMins % 60;
      currentPunch.out = timeStr;
      currentPunch.outTimestamp = nowTs;
      currentPunch.durationMins = punchDurationMins;
      currentPunch.durationStr = `${pHours}h ${pMins}m`;
    }

    // Calculate total minutes worked today across all punches
    const totalMinsWorked = punches.reduce((acc, p) => acc + (p.durationMins || 0), 0);
    const totalHoursDecimal = parseFloat((totalMinsWorked / 60).toFixed(2));
    const totalH = Math.floor(totalMinsWorked / 60);
    const totalM = totalMinsWorked % 60;

    // Half Day vs Full Day Calculation:
    // If working hours < 4.5 hrs -> Automatic HALF_DAY
    // If working hours >= 7.5 hrs -> Automatic PRESENT (Full Day)
    // If working hours between 4.5 and 7.5 hrs -> HALF_DAY
    let calculatedStatus = 'PRESENT';
    if (totalHoursDecimal < 4.5) {
      calculatedStatus = 'HALF_DAY';
    } else if (totalHoursDecimal >= 7.5) {
      calculatedStatus = 'PRESENT';
    } else {
      calculatedStatus = 'HALF_DAY';
    }

    const workHoursDisplay = `${totalH}h ${totalM}m (${calculatedStatus === 'HALF_DAY' ? 'Half Day' : 'Full Day'})`;

    list[existingIdx] = {
      ...rec,
      checkOut: timeStr,
      checkOutTimestamp: nowTs,
      isActive: false,
      punches,
      totalDurationMins: totalMinsWorked,
      totalHoursDecimal,
      workHours: workHoursDisplay,
      status: calculatedStatus,
      notes: notes || `Clocked out (Punch #${punches.length}/2). Logged ${totalHoursDecimal} hrs [${calculatedStatus === 'HALF_DAY' ? 'Half Day' : 'Full Day'}]`,
    };
  } else {
    // If no previous checkin recorded today, record single session check-out
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      staffId: staffId || 'STF-P-101',
      staffName: staffName || 'Staff Member',
      department: 'PARLOUR',
      date: today,
      checkIn: '09:30 AM',
      checkInTimestamp: nowTs - (4 * 3600 * 1000),
      checkOut: timeStr,
      checkOutTimestamp: nowTs,
      isActive: false,
      punches: [
        {
          punchNum: 1,
          in: '09:30 AM',
          inTimestamp: nowTs - (4 * 3600 * 1000),
          out: timeStr,
          outTimestamp: nowTs,
          durationMins: 240,
          durationStr: '4h 00m',
        },
      ],
      totalDurationMins: 240,
      totalHoursDecimal: 4.0,
      workHours: '4h 00m (Half Day)',
      status: 'HALF_DAY',
      source: 'STAFF_APP',
      notes: notes || 'Direct clock out recorded (Half Day)',
    };
    list.unshift(newRecord);
  }

  saveMasterAttendance(list);
  window.dispatchEvent(new CustomEvent('staff_attendance_updated', { detail: { staffId, today } }));
  return list;
};

export const updateDayAttendance = ({ staffId, staffName, department, date, status, checkIn = '', checkOut = '', notes = '' }) => {
  const list = getMasterAttendance();
  const existingIdx = list.findIndex(
    (a) =>
      a.date === date &&
      (a.staffId === staffId ||
        (staffName && a.staffName && a.staffName.trim().toLowerCase() === staffName.trim().toLowerCase()))
  );

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
  window.dispatchEvent(new CustomEvent('staff_attendance_updated', { detail: { staffId, date } }));
  return list;
};

// Generates or reads full monthly attendance matrix for all dynamic staff
export const getMonthlyAttendanceMatrix = (year = 2026, month = 10, customStaffList = null) => {
  // month is 0-indexed (10 = November)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const allRecords = getMasterAttendance();
  const today = getTodayDateStr();
  const staffList = getAllStaffRoster(customStaffList);

  return staffList.map((staff) => {
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

      // Check existing record - match by ID, MongoDB _id, or staff name
      const found = allRecords.find(
        (r) =>
          r.date === dateStr &&
          (r.staffId === staff.id ||
            (staff._id && r.staffId === staff._id) ||
            (r.staffName && staff.name && r.staffName.trim().toLowerCase() === staff.name.trim().toLowerCase()))
      );

      if (found) {
        const isLive = dateStr === today && !!found.isActive;
        daysData[day] = {
          date: dateStr,
          status: found.status,
          checkIn: found.checkIn,
          checkOut: found.checkOut,
          notes: found.notes,
          recordId: found.id,
          isActive: isLive,
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
          label: '·',
          notes: 'Upcoming working day',
        };
      } else if (dateStr === today) {
        // Today and no punch record exists yet
        daysData[day] = {
          date: dateStr,
          status: 'NOT_CLOCKED_IN',
          label: '·',
          notes: 'Shift pending / Not clocked in yet',
        };
      } else {
        // Past working days (days 1 to 12) without explicit override record
        daysData[day] = {
          date: dateStr,
          status: 'PRESENT',
          checkIn: '09:30 AM',
          checkOut: '06:30 PM',
          notes: `Regular shift day ${day}`,
        };
      }

      // Summary Counts
      const currentSt = daysData[day].status;
      if (daysData[day].isActive || currentSt === 'PRESENT') presentCount++;
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

