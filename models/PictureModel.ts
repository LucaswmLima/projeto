import mongoose, { Document, Schema } from "mongoose";

// Definição da interface do schema
interface IPicture extends Document {
  image_url: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  measure_uuid: string;
  has_confirmed: boolean;
  measure_value: number
}

// Definição do schema
const PictureSchema: Schema = new Schema({
  image_url: {
    type: String,
    required: true,
  },
  customer_code: {
    type: String,
    required: true,
  },
  measure_datetime: {
    type: Date,
    default: Date.now,
  },
  measure_type: {
    type: String,
    required: true,
    enum: ["WATER", "GAS"],
  },
  measure_value: {
    type: Number,
    required: true,
  },
  measure_uuid: {
    type: String,
    required: true,
    unique: true,
  },
  has_confirmed: {
    type: Boolean,
    default: false,
  },
  
});

const Picture = mongoose.model<IPicture>("Picture", PictureSchema);
export default Picture;
