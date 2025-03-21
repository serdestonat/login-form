import { Schema, model, models } from "mongoose";
const PollSchema = new Schema({
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
});

const Poll = models.Poll || model("Poll", PollSchema);
export default Poll;
