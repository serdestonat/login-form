import { Schema, model, models } from "mongoose";

const VoteSchema = new Schema({
  poll_id: {
    type: Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
  },
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
  option: {
    type: String,
    required: true,
  },
  // vote_date: {
  //   type: Date,
  //   default: Date.now, // Oy tarihini kaydetmek için ayrı bir alan
  // },
});

const Vote = models.Vote || model("Vote", VoteSchema);
export default Vote;
