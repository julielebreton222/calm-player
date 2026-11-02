/*
 * My Calm Player — starter library.
 *
 * Every video here was checked against YouTube (oEmbed) when it was added.
 * Tags:
 *   section  yoga | move (calisthenics) | flex | pilates | dance | sound
 *   level    beginner | all | intermediate
 *   feel     gentle | flow | strong | rest
 *   min      length in minutes (used for the 15 / 30 / 60+ filter)
 *   style    a short free-text style label shown on the card
 *   teacher  (yoga only) links a class to a teacher on "My yoga path"
 *
 * Anything you add in the app is saved in your browser and merged with this list.
 */
window.CALM_DATA = {
  sections: [
    { id: "yoga", label: "Yoga" },
    { id: "move", label: "Calisthenics" },
    { id: "flex", label: "Flexibility" },
    { id: "pilates", label: "Pilates" },
    { id: "dance", label: "Dance" },
    { id: "sound", label: "Soundscapes" },
  ],

  teachers: [
    { id: "aym", name: "AYM Yoga School", where: "Rishikesh · Hatha Vinyasa", status: "kept" },
    { id: "sivananda", name: "Sivananda Yoga Centre, Gurgaon", where: "Classical Hatha · pranayama, sun salutes, 12 postures", status: "trying" },
    { id: "samahita", name: "Samahita Retreat", where: "Centered Hatha-Vinyasa", status: "trying" },
    { id: "hya", name: "Himalayan Yoga Association", where: "Rishikesh · Ashtanga & Hatha", status: "totry" },
    { id: "breatheflow", name: "Breathe and Flow", where: "Mobility-minded Vinyasa", status: "totry" },
    { id: "ulu", name: "Ulu Yoga", where: "90-min Hatha Vinyasa · alignment", status: "totry" },
    { id: "akshaya", name: "Akshaya Agnes", where: "Traditional Hatha · all levels", status: "totry" },
  ],

  videos: [
    // ---------- Yoga ----------
    { id: "CWIcRrBdk_k", section: "yoga", teacher: "aym", title: "Hatha Vinyasa Class at AYM Yoga School", channel: "AYM Yoga School", min: 10, level: "all", feel: "flow", style: "Hatha Vinyasa" },
    { id: "lc5ODvwEhZ4", section: "yoga", teacher: "aym", title: "Hatha & Vinyasa Flow for Beginners · Episode 3", channel: "AYM Yoga School", min: 54, level: "beginner", feel: "flow", style: "Hatha Vinyasa" },
    { id: "vrqp5AP92Cw", section: "yoga", teacher: "aym", title: "Hatha Vinyasa Flow Class · Episode 2", channel: "AYM Yoga School", min: 54, level: "intermediate", feel: "flow", style: "Hatha Vinyasa" },
    { id: "iUKjuni-6l8", section: "yoga", teacher: "sivananda", title: "Classic Sivananda Yoga Class · 90 min", channel: "Sivananda Yoga Centre, Gurgaon", min: 92, level: "all", feel: "gentle", style: "Classical Hatha" },
    { id: "Y_gnQ7BxzTQ", section: "yoga", teacher: "sivananda", title: "A Complete 90 min Sivananda Class · Intermediate", channel: "Sivananda Yoga Centre, Gurgaon", min: 91, level: "intermediate", feel: "strong", style: "Classical Hatha" },
    { id: "xo3salktxTo", section: "yoga", teacher: "samahita", title: "30 Min Hatha-Vinyasa Practice for All Levels", channel: "Samahita Retreat", min: 34, level: "all", feel: "flow", style: "Centered Hatha-Vinyasa" },
    { id: "C5rexjRc0SE", section: "yoga", teacher: "samahita", title: "60 Min Centered Hatha-Vinyasa Dynamic Practice", channel: "Samahita Retreat", min: 64, level: "intermediate", feel: "strong", style: "Centered Hatha-Vinyasa" },
    { id: "vu9fVA5cAxc", section: "yoga", teacher: "hya", title: "Ashtanga Class · Sun Salutation B", channel: "Himalayan Yoga Association", min: 21, level: "all", feel: "flow", style: "Ashtanga" },
    { id: "B4kNiCWTl7M", section: "yoga", teacher: "breatheflow", title: "Your Body Needs This on Rest Days", channel: "Breathe and Flow", min: 22, level: "all", feel: "gentle", style: "Gentle mobility" },
    { id: "Vf0aTjNNEsg", section: "yoga", teacher: "breatheflow", title: "The Full Body Practice That Makes Everything Feel Better", channel: "Breathe and Flow", min: 40, level: "all", feel: "flow", style: "Vinyasa" },
    { id: "w98tzKQQMuE", section: "yoga", teacher: "breatheflow", title: "Start Here If You Think You're Too Stiff for Yoga", channel: "Breathe and Flow", min: 47, level: "beginner", feel: "gentle", style: "Beginner flow" },
    { id: "nDK_MUgnmO8", section: "yoga", teacher: "ulu", title: "90-Minute Vinyasa for Beginners · Foundational Flow", channel: "Ulu Yoga", min: 92, level: "beginner", feel: "flow", style: "Hatha Vinyasa" },
    { id: "GSjQHz2GDXQ", section: "yoga", teacher: "ulu", title: "Hatha Vinyasa · 90 Minute Alignment Practice", channel: "Ulu Yoga", min: 95, level: "intermediate", feel: "strong", style: "Hatha Vinyasa" },
    { id: "jsbAwAJz4tM", section: "yoga", teacher: "akshaya", title: "Traditional Hatha · Full Body Class (All Levels)", channel: "Akshaya Agnes", min: 43, level: "all", feel: "gentle", style: "Traditional Hatha" },
    { id: "_hHuczegZDs", section: "yoga", title: "Classic Sun Salutation · Hatha", channel: "One Yoga", min: 43, level: "beginner", feel: "flow", style: "Hatha" },
    { id: "_noquwycq78", section: "yoga", title: "Ten Minute Yoga Nidra · Reset Your Nervous System", channel: "Ally Boothroyd · Sarovara Yoga", min: 11, level: "all", feel: "rest", style: "Yoga Nidra" },

    // ---------- Calisthenics ----------
    { id: "gOkCJ57IvNg", section: "move", title: "Home Workout for Beginners", channel: "Hybrid Calisthenics", min: 26, level: "beginner", feel: "strong", style: "Full body" },
    { id: "yMrJA1sYCvA", section: "move", title: "Day 1: Push-ups & Core · Beginner's Home Workout", channel: "Hybrid Calisthenics", min: 14, level: "beginner", feel: "strong", style: "Push & core" },
    { id: "xFfxZTiDn20", section: "move", title: "Full-Body Home Workout · Follow Along", channel: "Hybrid Calisthenics", min: 17, level: "all", feel: "strong", style: "Full body" },
    { id: "TOXmdZ35CH0", section: "move", title: "Beginner At Home Calisthenics · 20 min, Full Body", channel: "Lucy Lismore", min: 22, level: "beginner", feel: "strong", style: "Full body" },
    { id: "nB0D1a0oC-A", section: "move", title: "Full Body Calisthenics · Follow Along at Home", channel: "Lucy Lismore", min: 21, level: "intermediate", feel: "strong", style: "Full body" },
    { id: "N-D49aRmS2Q", section: "move", title: "30 Min Calisthenics-Inspired Bodyweight Workout", channel: "growingannanas", min: 34, level: "intermediate", feel: "strong", style: "Strength" },
    { id: "_VeW_HDXz94", section: "move", title: "30 Min Full Body Calisthenics · No Repeat", channel: "BeeZee", min: 31, level: "intermediate", feel: "strong", style: "Full body" },

    // ---------- Flexibility ----------
    { id: "L_xrDAtykMI", section: "flex", title: "15 Minute Beginner Stretch Routine", channel: "Tom Merrick", min: 15, level: "beginner", feel: "gentle", style: "Full body stretch" },
    { id: "OjcN6RzWFWs", section: "flex", title: "25 Minute Beginner Flexibility Routine V3", channel: "Tom Merrick", min: 26, level: "beginner", feel: "gentle", style: "Full body stretch" },
    { id: "9j8Rqnw0CiE", section: "flex", title: "25 Minute Full Body Flexibility Routine V5", channel: "Tom Merrick", min: 26, level: "all", feel: "gentle", style: "Full body stretch" },
    { id: "CmCysOVh5gA", section: "flex", title: "30 Minute Full Body Flexibility Routine V4", channel: "Tom Merrick", min: 33, level: "all", feel: "flow", style: "Full body stretch" },
    { id: "enSIG1rTjJA", section: "flex", title: "45 Minute Full Body Flexibility Routine", channel: "Tom Merrick", min: 46, level: "intermediate", feel: "flow", style: "Full body stretch" },
    { id: "cOiO6_E6CDI", section: "flex", title: "Unlock Your Splits · Hip Flexor & Hamstring Class", channel: "FLEXFORM by Shan", min: 38, level: "intermediate", feel: "strong", style: "Splits" },

    // ---------- Pilates (no equipment) ----------
    { id: "CdjRQ6GG8bA", section: "pilates", title: "Gentle Pilates · 15 Minutes for Beginners", channel: "Jessica Valant", min: 17, level: "beginner", feel: "gentle", style: "Mat Pilates" },
    { id: "aOYcySi-kpU", section: "pilates", title: "Pilates for Beginners · Total Body Workout", channel: "Jessica Valant", min: 22, level: "beginner", feel: "flow", style: "Mat Pilates" },
    { id: "dF2dXejdKHM", section: "pilates", title: "20 Min Pilates Core & Abs · All Levels", channel: "Move With Nicole", min: 23, level: "all", feel: "strong", style: "Core" },
    { id: "wtVyZmHnlxM", section: "pilates", title: "30 Min Pilates · Beginner to Moderate", channel: "Move With Nicole", min: 30, level: "beginner", feel: "flow", style: "Mat Pilates" },
    { id: "C2HX2pNbUCM", section: "pilates", title: "30 Min Full Body At-Home Pilates", channel: "Move With Nicole", min: 33, level: "all", feel: "flow", style: "Mat Pilates" },
    { id: "koTzaUu7Vws", section: "pilates", title: "40 Min Full Body · Intermediate Pilates Class", channel: "Move With Nicole", min: 44, level: "intermediate", feel: "strong", style: "Mat Pilates" },

    // ---------- Dance (no equipment) ----------
    { id: "TItIq0L0e58", section: "dance", title: "15 Min Throwbacks Dance Party Workout", channel: "MadFit", min: 15, level: "all", feel: "strong", style: "Dance cardio" },
    { id: "q7ytBN8eaiM", section: "dance", title: "African Dance Workout · Let's Shine 15", channel: "Kukuwa Fitness", min: 19, level: "all", feel: "flow", style: "African dance" },
    { id: "fYQq4iyUYAM", section: "dance", title: "20 Minute Dance Workout · Low Impact, No Jumping", channel: "Zumba Sulu", min: 20, level: "beginner", feel: "gentle", style: "Low impact" },
    { id: "3LpJSXiI3iA", section: "dance", title: "20 Minute Low Impact Dance to Brighten Your Mood", channel: "Improved Health", min: 23, level: "beginner", feel: "gentle", style: "Low impact" },
    { id: "aBtP7008EfA", section: "dance", title: "30-Minute All-Levels Cardio Dance Workout", channel: "PS Fit", min: 31, level: "all", feel: "strong", style: "Dance cardio" },
    { id: "r9120Tk-JQI", section: "dance", title: "African Dance Workout · Fantastic Classics", channel: "Kukuwa Fitness", min: 33, level: "intermediate", feel: "strong", style: "African dance" },

    // ---------- Soundscapes ----------
    { id: "aaPE-MlAppQ", section: "sound", title: "Rain on leaves", channel: "Calm Relax Ambient Soothing", min: 180, level: "all", feel: "rest", style: "Rain" },
    { id: "0Lawyy6ZUU8", section: "sound", title: "Singing bowls", channel: "Aurabowls", min: 61, level: "all", feel: "rest", style: "Singing bowls" },
    { id: "XL-vgJcCR9Q", section: "sound", title: "Singing bowl & gentle rain", channel: "Aurabowls", min: 66, level: "all", feel: "rest", style: "Singing bowls" },
    { id: "G3cVeKJ5xkg", section: "sound", title: "Ganga at dusk · Aarti, Triveni Ghat", channel: "Wanderers", min: 12, level: "all", feel: "rest", style: "River & chant" },
    { id: "AO2S2QZjykE", section: "sound", title: "Ocean waves, morning", channel: "Relaxing Sounds Of Nature", min: 61, level: "all", feel: "rest", style: "Ocean" },
    { id: "xNN7iTA57jM", section: "sound", title: "Forest birdsong", channel: "The Guild of Ambience", min: 180, level: "all", feel: "rest", style: "Forest" },
    { id: "UgHKb_7884o", section: "sound", title: "Crackling fireplace", channel: "Cat Trumpet", min: 720, level: "all", feel: "rest", style: "Fire" },
  ],

  playlists: [
    { id: "morning-hatha", name: "Morning Hatha", items: ["CWIcRrBdk_k", "jsbAwAJz4tM", "_hHuczegZDs", "_noquwycq78"] },
    { id: "strong-week", name: "Strong & steady", items: ["gOkCJ57IvNg", "dF2dXejdKHM", "OjcN6RzWFWs"] },
    { id: "move-joy", name: "Move for joy", items: ["q7ytBN8eaiM", "TItIq0L0e58", "B4kNiCWTl7M"] },
  ],

  // Calisthenics progression ladders. `step` = index of the current rung.
  ladders: [
    { id: "push", label: "Push", steps: ["Wall push-up", "Incline push-up", "Knee push-up", "Full push-up", "Diamond push-up"], step: 1, last: "3 × 10" },
    { id: "pull", label: "Pull", steps: ["Dead hang", "Australian rows", "Negatives", "Band pull-up", "First pull-up"], step: 0, last: "3 × 20 s" },
    { id: "legs", label: "Legs", steps: ["Squat", "Split squat", "Bulgarian split squat", "Shrimp squat", "Pistol squat"], step: 1, last: "3 × 8 each" },
    { id: "core", label: "Core & skill", steps: ["Hollow hold", "Tuck L-sit", "Crow", "Wall handstand", "Freestanding handstand"], step: 0, last: "3 × 15 s" },
  ],
};
