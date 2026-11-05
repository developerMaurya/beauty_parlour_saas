/**
 * @file database.model.js
 * @description Central Mongoose Model for Database Clusters and Registries.
 * @module backend/src/modules/superadmin/databases/models/database.model
 */

import mongoose from 'mongoose';

const DatabaseRegistrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['shared', 'separate'],
      required: true,
    },
    databaseName: {
      type: String,
      required: true,
      trim: true,
    },
    host: {
      type: String,
      default: 'cluster0.c4qroz0.mongodb.net',
    },
    port: {
      type: Number,
      default: 27017,
    },
    uri: {
      type: String,
      default: null,
      select: false, // Never expose raw connection strings
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive', 'error'],
      default: 'active',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    maxTenants: {
      type: Number,
      default: 1000,
    },
    tenantCount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const DatabaseRegistry =
  mongoose.models.DatabaseRegistry || mongoose.model('DatabaseRegistry', DatabaseRegistrySchema);
export default DatabaseRegistry;
