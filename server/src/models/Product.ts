import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  url: string;
  id: string;
  sku: string;
  images: string[];
  previewImage: string;
  categoryId: string;
  categoryName: string;
  description: string;
  pdfUrl?: string;
  videoUrl?: string;
  subHeader?: string;
  bulletPoints?: string[];
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    sku: { type: String },
    images: [{ type: String }],
    previewImage: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String },
    pdfUrl: { type: String },
    videoUrl: { type: String },
    subHeader: { type: String },
    bulletPoints: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
