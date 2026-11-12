import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setAdminCredentials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const TenantModel = db.collection('tenants');
    const TenantUserModel = db.collection('tenantusers');
    const SuperadminModel = db.collection('superadmins');
    const BranchModel = db.collection('branches');

    // Get default tenant
    let tenant = await TenantModel.findOne({ slug: 'blossom-salon' });
    if (!tenant) {
      tenant = await TenantModel.findOne({});
    }
    const tenantIdStr = tenant._id.toString();

    // Get branch
    const branch = await BranchModel.findOne({ tenantId: tenantIdStr });
    const branchId = branch ? branch._id : new mongoose.Types.ObjectId();

    // Hash password 'admin'
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin', salt);

    const email = 'admin@gmail.com';

    // 1. Update / Insert in tenantusers (Tenant Admin)
    let tenantAdmin = await TenantUserModel.findOne({ email });
    if (tenantAdmin) {
      console.log('Updating existing TenantUser with email admin@gmail.com...');
      await TenantUserModel.updateOne(
        { _id: tenantAdmin._id },
        {
          $set: {
            name: 'Central Administrator',
            passwordHash,
            role: 'ADMIN',
            userType: 'ADMIN',
            targetBusiness: 'ALL',
            tenantId: tenantIdStr,
            branchId,
            status: 'active',
            isBlocked: false,
            failedLoginAttempts: 0,
            lockUntil: null,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      console.log('Inserting new TenantUser admin@gmail.com...');
      await TenantUserModel.insertOne({
        name: 'Central Administrator',
        email,
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
        userType: 'ADMIN',
        targetBusiness: 'ALL',
        tenantId: tenantIdStr,
        branchId,
        allowedBranches: [branchId],
        permissions: ['*'],
        status: 'active',
        isBlocked: false,
        failedLoginAttempts: 0,
        sessionVersion: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 2. Also ensure superadmins collection has admin@gmail.com
    let superadmin = await SuperadminModel.findOne({ email });
    if (superadmin) {
      console.log('Updating superadmin admin@gmail.com...');
      await SuperadminModel.updateOne(
        { _id: superadmin._id },
        {
          $set: {
            name: 'Central Superadmin',
            passwordHash,
            role: 'superadmin',
            status: 'active',
            isBlocked: false,
            failedLoginAttempts: 0,
            lockUntil: null,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      console.log('Inserting superadmin admin@gmail.com...');
      await SuperadminModel.insertOne({
        name: 'Central Superadmin',
        email,
        passwordHash,
        role: 'superadmin',
        status: 'active',
        isBlocked: false,
        failedLoginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Verify password verification
    const verifiedUser = await TenantUserModel.findOne({ email });
    const isMatch = await bcrypt.compare('admin', verifiedUser.passwordHash);
    console.log(`Verified TenantUser ${email}: password match = ${isMatch}, role = ${verifiedUser.role}`);

    console.log('Admin credentials successfully configured in database!');
    process.exit(0);
  } catch (err) {
    console.error('Error setting admin credentials:', err);
    process.exit(1);
  }
}

setAdminCredentials();

