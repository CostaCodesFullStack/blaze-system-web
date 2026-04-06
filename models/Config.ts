import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const configSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    guildId: {
      type: String,
      required: true,
      trim: true,
    },
    bot: {
      type: String,
      required: true,
      trim: true,
    },
    systems: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

configSchema.index({ userId: 1, guildId: 1 }, { unique: true });

type ConfigSchemaFields = InferSchemaType<typeof configSchema>;

export type ConfigDocument = ConfigSchemaFields & {
  createdAt: Date;
  updatedAt: Date;
};

export const Config =
  (models.Config as Model<ConfigDocument>) ||
  model<ConfigDocument>("Config", configSchema);
