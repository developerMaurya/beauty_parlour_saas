import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedStaff() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const TenantModel = db.collection('tenants');
    const TenantUserModel = db.collection('tenantusers');
    const StaffModel = db.collection('staffs');
    const BranchModel = db.collection('branches');

    // Get blossom-salon tenant
    let tenant = await TenantModel.findOne({ slug: 'blossom-salon' });
    if (!tenant) {
      tenant = await TenantModel.findOne({});
    }
    const tenantIdStr = tenant._id.toString();
    console.log('Target Tenant:', { id: tenantIdStr, slug: tenant.slug, name: tenant.name });

    // Get branch
    const branch = await BranchModel.findOne({ tenantId: tenantIdStr });
    const branchId = branch ? branch._id : new mongoose.Types.ObjectId();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Staff@123', salt);

    const staffAccounts = [
      {
        email: 'staff@blossom.com',
        name: 'Radhika Sharma',
        role: 'STAFF',
        userType: 'STAFF',
        targetBusiness: 'PARLOUR',
        designation: 'Senior Bridal Stylist',
        department: 'Hair & Makeup',
        phone: '+91 98765 00001',
      },
      {
        email: 'vikram.event@kashiservice.com',
        name: 'Vikram Chauhan',
        role: 'STAFF',
        userType: 'STAFF',
        targetBusiness: 'EVENTS',
        designation: 'Event Operations Lead',
        department: 'Stage & Production Crew',
        phone: '+91 98765 00002',
      },
      {
        email: 'rajesh.plot@kashiservice.com',
        name: 'Rajesh Maurya',
        role: 'STAFF',
        userType: 'STAFF',
        targetBusiness: 'PLOTTING',
        designation: 'Real Estate Sales Executive',
        department: 'Colony & Land Sales',
        phone: '+91 98765 00003',
      },
      {
        email: 'aman.dev@kashiservice.com',
        name: 'Aman Verma',
        role: 'STAFF',
        userType: 'STAFF',
        targetBusiness: 'SOFTWARE',
        designation: 'Full Stack Software Engineer',
        department: 'Engineering & Tech Hub',
        phone: '+91 98765 00004',
      },
    ];

    for (const acc of staffAccounts) {
      const emailLower = acc.email.toLowerCase().trim();
      let user = await TenantUserModel.findOne({ email: emailLower });

      if (user) {
        console.log(`Updating existing TenantUser: ${emailLower}`);
        await TenantUserModel.updateOne(
          { _id: user._id },
          {
            $set: {
              name: acc.name,
              passwordHash: passwordHash,
              role: acc.role,
              userType: acc.userType,
              targetBusiness: acc.targetBusiness,
              tenantId: tenantIdStr,
              branchId: branchId,
              status: 'active',
              isBlocked: false,
              phone: acc.phone,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        console.log(`Inserting new TenantUser: ${emailLower}`);
        const result = await TenantUserModel.insertOne({
          name: acc.name,
          email: emailLower,
          username: emailLower.split('@')[0],
          passwordHash: passwordHash,
          role: acc.role,
          userType: acc.userType,
          targetBusiness: acc.targetBusiness,
          tenantId: tenantIdStr,
          branchId: branchId,
          allowedBranches: [branchId],
          permissions: [],
          status: 'active',
          isBlocked: false,
          failedLoginAttempts: 0,
          sessionVersion: 1,
          phone: acc.phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        user = { _id: result.insertedId };
      }

      // Check or create Staff doc
      const staffDoc = await StaffModel.findOne({ email: emailLower });
      if (staffDoc) {
        await StaffModel.updateOne(
          { _id: staffDoc._id },
          {
            $set: {
              userId: user._id,
              tenantId: tenantIdStr,
              name: acc.name,
              designation: acc.designation,
              department: acc.department,
              branchId: branchId,
              status: 'active',
              updatedAt: new Date(),
            },
          }
        );
      } else {
        await StaffModel.insertOne({
          userId: user._id,
          tenantId: tenantIdStr,
          name: acc.name,
          email: emailLower,
          phone: acc.phone,
          designation: acc.designation,
          department: acc.department,
          branchId: branchId,
          employmentType: 'full_time',
          gender: 'female',
          status: 'active',
          skills: [],
          assignedBranches: [branchId],
          workingHours: { start: '09:00', end: '19:00' },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Verify password
      const savedUser = await TenantUserModel.findOne({ email: emailLower });
      const isMatch = await bcrypt.compare('Staff@123', savedUser.passwordHash);
      console.log(`Verified ${emailLower}: password match = ${isMatch}, targetBusiness = ${savedUser.targetBusiness}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding staff:', err);
    process.exit(1);
  }
}

seedStaff();
