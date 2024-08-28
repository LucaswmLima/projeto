import mongoose, { Document, Schema } from "mongoose";

// Definição da interface do schema
interface IPicture extends Document {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  measure_uuid: string;
  has_confirmed: boolean;
}

// Definição do schema
const PictureSchema: Schema = new Schema({
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        /^data:image\/[a-zA-Z]+;base64,/.test(value),
      message: "Formato da imagem base64 inválido",
    },
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

// Adiciona índice para garantir a unicidade
PictureSchema.index(
  { customer_code: 1, measure_type: 1, measure_datetime: 1 },
  { unique: true }
);

const Picture = mongoose.model<IPicture>("Picture", PictureSchema);
export default Picture;
