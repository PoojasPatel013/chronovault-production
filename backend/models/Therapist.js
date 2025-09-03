// models/Therapist.js
import { Schema, model } from 'mongoose';

const TherapistSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: [{ type: Date }],
});

export default model('Therapist', TherapistSchema);