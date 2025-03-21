import { Schema, model, models } from "mongoose";

const VoteSchema = new Schema({
  poll_id: {
    type: Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  option: {
    type: Date,
    default: Date.now,
  },
});

const Vote = models.Vote || model("Vote", VoteSchema);
export default Vote;
