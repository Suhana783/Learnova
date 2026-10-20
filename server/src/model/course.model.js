
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["notes", "documentation", "article", "download", "other"],
      default: "other",
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoId: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    durationMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        default: "",
      },
      altText: {
        type: String,
        default: "",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    language: {
      type: String,
      default: "English",
    },

    instructor: {
      name: {
        type: String,
        default: "Learnova",
      },
      bio: {
        type: String,
        default: "",
      },
      avatarUrl: {
        type: String,
        default: "",
      },
    },

    highlights: {
      type: [String],
      default: [],
    },

    learningOutcomes: {
      type: [String],
      default: [],
    },

    prerequisites: {
      type: [String],
      default: [],
    },

    duration: {
      value: {
        type: Number,
        default: 0,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["minutes", "hours", "days", "weeks"],
        default: "hours",
      },
      displayLabel: {
        type: String,
        default: "",
      },
    },

    curriculum: {
      playlistUrl: {
        type: String,
        default: "",
      },
      modules: {
        type: [moduleSchema],
        default: [],
      },
    },

    resources: {
      type: [resourceSchema],
      default: [],
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
