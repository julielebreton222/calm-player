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
 *   popular  true for widely watched videos from big channels; `views` is the view count when added
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
    { id: "adriene", name: "Yoga With Adriene", where: "Gentle, welcoming Hatha & Vinyasa · one of the biggest yoga channels", status: "totry", popular: true },
    { id: "kassandra", name: "Yoga with Kassandra", where: "Morning flows & Yin", status: "totry", popular: true },
    { id: "sarahbeth", name: "SarahBethYoga", where: "Short, clear Vinyasa flows", status: "totry", popular: true },
    { id: "boho", name: "Boho Beautiful Yoga", where: "Flowing full-body practices filmed outdoors", status: "totry", popular: true },
    { id: "travis", name: "Travis Eliot", where: "Power yoga · strong, long classes", status: "totry", popular: true },
    { id: "charlie", name: "Charlie Follows", where: "30-min full body flows", status: "totry" },
    { id: "tim", name: "Yoga With Tim", where: "Steady all-levels Vinyasa", status: "totry" },
    { id: "bird", name: "Yoga With Bird", where: "Restorative & Yin", status: "totry" },
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

    // Popular picks
    { id: "v7AYKMP6rOE", section: "yoga", teacher: "adriene", title: "Yoga For Complete Beginners · 20 Minute Home Yoga", channel: "Yoga With Adriene", min: 24, level: "beginner", feel: "gentle", style: "Hatha", popular: true, views: "56M" },
    { id: "oBu-pQG6sTY", section: "yoga", teacher: "adriene", title: "Day 1 · Ease Into It · 30 Days of Yoga", channel: "Yoga With Adriene", min: 35, level: "beginner", feel: "flow", style: "Vinyasa", popular: true, views: "32M" },
    { id: "GLy2rYHwUqY", section: "yoga", teacher: "adriene", title: "Total Body Yoga · Deep Stretch", channel: "Yoga With Adriene", min: 45, level: "all", feel: "gentle", style: "Deep stretch", popular: true, views: "30M" },
    { id: "XCIviBT3Txc", section: "yoga", teacher: "sarahbeth", title: "15 Minute Morning Yoga · Full Body Flow", channel: "SarahBethYoga", min: 16, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "5.6M" },
    { id: "lC5f2xqWBag", section: "yoga", teacher: "travis", title: "60 Min Power Yoga · Flexibility", channel: "Travis Eliot", min: 63, level: "intermediate", feel: "strong", style: "Power yoga", popular: true, views: "3.7M" },
    { id: "6zzeSJxJS4s", section: "yoga", teacher: "boho", title: "30 Min Full Body Flow · Stretch, Breathe & Feel the Bliss", channel: "Boho Beautiful Yoga", min: 29, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "2.6M" },
    { id: "Y8vJqiePu1I", section: "yoga", teacher: "kassandra", title: "15 min Gentle Morning Yoga · Full Body Stretch", channel: "Yoga with Kassandra", min: 17, level: "beginner", feel: "gentle", style: "Gentle yoga", popular: true, views: "2.1M" },
    { id: "hHhxKkskHDg", section: "yoga", teacher: "kassandra", title: "30 min Morning Yoga · Feel Great", channel: "Yoga with Kassandra", min: 28, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "2M" },

    // More full-length yoga (30 min+)
    { id: "wCUI1bwlJqA", section: "yoga", teacher: "breatheflow", title: "Hips & Lower Back Will Feel So Much Better · Beginner Flow", channel: "Breathe and Flow", min: 33, level: "beginner", feel: "gentle", style: "Beginner flow", popular: true, views: "4.3M" },
    { id: "t2UCGc4eUHo", section: "yoga", teacher: "breatheflow", title: "This 30 Minute Flow Will Expose How Well You Really Move", channel: "Breathe and Flow", min: 32, level: "all", feel: "flow", style: "Mobility flow", views: "570K" },
    { id: "NZmPE0jQqpY", section: "yoga", teacher: "breatheflow", title: "This 30 Minute Flow Will Make Your Whole Body Work", channel: "Breathe and Flow", min: 30, level: "all", feel: "strong", style: "Vinyasa", views: "230K" },
    { id: "aYloLsUsp4M", section: "yoga", teacher: "breatheflow", title: "This 35 Minute Flow Trains Your Body to Move as One", channel: "Breathe and Flow", min: 35, level: "all", feel: "flow", style: "Vinyasa", views: "240K" },
    { id: "VfNY72G8Q0U", section: "yoga", teacher: "breatheflow", title: "The Practice You Need When You Can't Stop Pushing", channel: "Breathe and Flow", min: 37, level: "all", feel: "gentle", style: "Slow flow", views: "176K" },
    { id: "YNvS1XUkjxQ", section: "yoga", teacher: "breatheflow", title: "45 Minute Practice · Day 1 IGNITE 28 Day Program", channel: "Breathe and Flow", min: 47, level: "intermediate", feel: "strong", style: "Vinyasa", views: "490K" },
    { id: "P0UsdewWXLA", section: "yoga", teacher: "breatheflow", title: "The Practice You Need When Slowing Down Feels Impossible", channel: "Breathe and Flow", min: 49, level: "all", feel: "rest", style: "Slow flow & yin", views: "870K" },
    { id: "YA5yr7wAMjo", section: "yoga", teacher: "breatheflow", title: "50 Minute Full Body Yin Yoga · Day 3 IGNITE", channel: "Breathe and Flow", min: 49, level: "all", feel: "rest", style: "Yin", views: "200K" },
    { id: "f7_zx1sPBj0", section: "yoga", teacher: "breatheflow", title: "This 1 Hour Practice Will Push Your Body and Quiet Your Mind", channel: "Breathe and Flow", min: 52, level: "intermediate", feel: "strong", style: "Vinyasa", views: "336K" },
    { id: "uv5e_MZ7erg", section: "yoga", teacher: "breatheflow", title: "1 Hour Practice That Tests More Than Your Strength (Not for Beginners)", channel: "Breathe and Flow", min: 61, level: "intermediate", feel: "strong", style: "Power vinyasa", views: "193K" },
    { id: "qSG7PsdZG04", section: "yoga", teacher: "adriene", title: "60 Minute Total Body Workout", channel: "Yoga With Adriene", min: 61, level: "all", feel: "strong", style: "Vinyasa", popular: true, views: "5.9M" },
    { id: "GAnKh5kKpgA", section: "yoga", teacher: "adriene", title: "Self Love Yoga · Full Class", channel: "Yoga With Adriene", min: 50, level: "all", feel: "flow", style: "Hatha Vinyasa", popular: true, views: "4.9M" },
    { id: "vbgxIwQoyN4", section: "yoga", teacher: "adriene", title: "Detox and Reset · 40-Minute Practice", channel: "Yoga With Adriene", min: 41, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "3.5M" },
    { id: "164zsYk4x9o", section: "yoga", teacher: "adriene", title: "Compassion Yoga · Core Strength Vinyasa", channel: "Yoga With Adriene", min: 58, level: "intermediate", feel: "strong", style: "Vinyasa", popular: true, views: "3.3M" },
    { id: "rVkXRhDsGTU", section: "yoga", teacher: "travis", title: "60 Min Power Yoga · Detox Flow", channel: "Travis Eliot", min: 62, level: "intermediate", feel: "strong", style: "Power yoga", popular: true, views: "3.2M" },
    { id: "2GyFyS6Zp5E", section: "yoga", teacher: "travis", title: "45 Min Power Yoga EDGE · Strength", channel: "Travis Eliot", min: 50, level: "intermediate", feel: "strong", style: "Power yoga", views: "746K" },
    { id: "X4MchDHkJWw", section: "yoga", teacher: "kassandra", title: "45 min Slow Flow Deep Stretch Yoga", channel: "Yoga with Kassandra", min: 46, level: "all", feel: "gentle", style: "Slow flow", popular: true, views: "2.5M" },
    { id: "mzf2kFNf8Yw", section: "yoga", teacher: "kassandra", title: "1 Hour Yin Yoga Class Without Props", channel: "Yoga with Kassandra", min: 55, level: "all", feel: "rest", style: "Yin", popular: true, views: "1.3M" },
    { id: "ECoCf0PYX1s", section: "yoga", teacher: "kassandra", title: "45 min Intermediate Vinyasa · Full Body", channel: "Yoga with Kassandra", min: 47, level: "intermediate", feel: "strong", style: "Vinyasa", popular: true, views: "1.3M" },
    { id: "IZSEVaxTtHc", section: "yoga", teacher: "boho", title: "60 Min Yoga for Flexibility, Mobility & Strength", channel: "Boho Beautiful Yoga", min: 72, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "1.5M" },
    { id: "H4eimzWFcls", section: "yoga", teacher: "boho", title: "Full Body Yoga Flow · 60 Min", channel: "Boho Beautiful Yoga", min: 56, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "1.2M" },
    { id: "bmMww1Wo6Tc", section: "yoga", teacher: "sivananda", title: "Sivananda Yoga Class · 60 min", channel: "Sivananda Yoga Centre, Gurgaon", min: 66, level: "all", feel: "gentle", style: "Classical Hatha", popular: true, views: "1.1M" },
    { id: "PZB7EkWkj_M", section: "yoga", title: "45 Min Full Body Yoga Flow · Balance & Strength", channel: "Move With Nicole", min: 48, level: "all", feel: "flow", style: "Vinyasa", popular: true, views: "1.5M" },
    { id: "ZFbEt_TzeNI", section: "yoga", teacher: "charlie", title: "30 Min Yoga to Feel Good · Mixed Levels", channel: "Charlie Follows", min: 32, level: "all", feel: "flow", style: "Vinyasa", views: "723K" },
    { id: "W3LS7J68bic", section: "yoga", teacher: "charlie", title: "30 Min Yoga Flow · Strength & Flexibility", channel: "Charlie Follows", min: 31, level: "all", feel: "strong", style: "Vinyasa", views: "620K" },
    { id: "WdOcag5C_DE", section: "yoga", teacher: "tim", title: "45 Min Morning Yoga Flow · All Levels", channel: "Yoga With Tim", min: 47, level: "all", feel: "flow", style: "Vinyasa", views: "155K" },
    { id: "tV2FuUq2tBQ", section: "yoga", teacher: "bird", title: "30 Minute Restorative Yoga for Stress & Relaxation", channel: "Yoga With Bird", min: 33, level: "all", feel: "rest", style: "Restorative", views: "162K" },

    // ---------- Calisthenics ----------
    { id: "gOkCJ57IvNg", section: "move", title: "Home Workout for Beginners", channel: "Hybrid Calisthenics", min: 26, level: "beginner", feel: "strong", style: "Full body" },
    { id: "yMrJA1sYCvA", section: "move", title: "Day 1: Push-ups & Core · Beginner's Home Workout", channel: "Hybrid Calisthenics", min: 14, level: "beginner", feel: "strong", style: "Push & core" },
    { id: "xFfxZTiDn20", section: "move", title: "Full-Body Home Workout · Follow Along", channel: "Hybrid Calisthenics", min: 17, level: "all", feel: "strong", style: "Full body" },
    { id: "TOXmdZ35CH0", section: "move", title: "Beginner At Home Calisthenics · 20 min, Full Body", channel: "Lucy Lismore", min: 22, level: "beginner", feel: "strong", style: "Full body" },
    { id: "nB0D1a0oC-A", section: "move", title: "Full Body Calisthenics · Follow Along at Home", channel: "Lucy Lismore", min: 21, level: "intermediate", feel: "strong", style: "Full body" },
    { id: "N-D49aRmS2Q", section: "move", title: "30 Min Calisthenics-Inspired Bodyweight Workout", channel: "growingannanas", min: 34, level: "intermediate", feel: "strong", style: "Strength" },
    { id: "_VeW_HDXz94", section: "move", title: "30 Min Full Body Calisthenics · No Repeat", channel: "BeeZee", min: 31, level: "intermediate", feel: "strong", style: "Full body" },

    // Popular picks
    { id: "UItWltVZZmE", section: "move", title: "20 Min Full Body Workout · Beginner Version", channel: "Pamela Reif", min: 22, level: "beginner", feel: "strong", style: "Full body", popular: true, views: "66M" },
    { id: "UBMk30rjy0o", section: "move", title: "20 Min Full Body Workout · No Equipment", channel: "Pamela Reif", min: 20, level: "intermediate", feel: "strong", style: "Full body", popular: true, views: "59M" },
    { id: "CGmr02bfHUo", section: "move", title: "Full Body Workout · 20 min, 28 Day Challenge", channel: "Chloe Ting", min: 21, level: "intermediate", feel: "strong", style: "Full body", popular: true, views: "33M" },
    { id: "kIVxdIWy7Eo", section: "move", title: "Start Calisthenics with This Workout", channel: "THENX", min: 14, level: "beginner", feel: "strong", style: "Calisthenics", popular: true, views: "5.6M" },
    { id: "kuUZYUBHryw", section: "move", title: "20 Min Beginner Calisthenics Workout at Home", channel: "Tom Peto Training", min: 19, level: "beginner", feel: "strong", style: "Calisthenics", popular: true, views: "3.9M" },
    { id: "gnTzk1yUHB4", section: "move", title: "Complete 15 Min Full Body Workout", channel: "THENX", min: 18, level: "all", feel: "strong", style: "Calisthenics", popular: true, views: "2.7M" },

    // ---------- Flexibility ----------
    { id: "L_xrDAtykMI", section: "flex", title: "15 Minute Beginner Stretch Routine", channel: "Tom Merrick", min: 15, level: "beginner", feel: "gentle", style: "Full body stretch" },
    { id: "OjcN6RzWFWs", section: "flex", title: "25 Minute Beginner Flexibility Routine V3", channel: "Tom Merrick", min: 26, level: "beginner", feel: "gentle", style: "Full body stretch" },
    { id: "9j8Rqnw0CiE", section: "flex", title: "25 Minute Full Body Flexibility Routine V5", channel: "Tom Merrick", min: 26, level: "all", feel: "gentle", style: "Full body stretch" },
    { id: "CmCysOVh5gA", section: "flex", title: "30 Minute Full Body Flexibility Routine V4", channel: "Tom Merrick", min: 33, level: "all", feel: "flow", style: "Full body stretch" },
    { id: "enSIG1rTjJA", section: "flex", title: "45 Minute Full Body Flexibility Routine", channel: "Tom Merrick", min: 46, level: "intermediate", feel: "flow", style: "Full body stretch" },
    { id: "cOiO6_E6CDI", section: "flex", title: "Unlock Your Splits · Hip Flexor & Hamstring Class", channel: "FLEXFORM by Shan", min: 38, level: "intermediate", feel: "strong", style: "Splits" },

    // Popular picks
    { id: "g_tea8ZNk5A", section: "flex", title: "15 Min Full Body Stretch · Daily Routine", channel: "Mady Morrison", min: 17, level: "all", feel: "gentle", style: "Full body stretch", popular: true, views: "106M" },
    { id: "CY6QP4ofwx4", section: "flex", title: "Full Body Stretch · Gentle 30 Min Routine", channel: "Mady Morrison", min: 28, level: "all", feel: "gentle", style: "Yoga-inspired stretch", popular: true, views: "20M" },
    { id: "sTANio_2E0Q", section: "flex", title: "20 min Full Body Stretch for Stress & Anxiety Relief", channel: "MadFit", min: 21, level: "all", feel: "rest", style: "Full body stretch", popular: true, views: "19M" },
    { id: "itJE4neqDJw", section: "flex", title: "12 Min Daily Stretch · Full Body", channel: "MadFit", min: 14, level: "all", feel: "gentle", style: "Full body stretch", popular: true, views: "13M" },
    { id: "KjednnUNNjA", section: "flex", title: "20 min Full Body Stretch for Flexibility", channel: "Anna McNulty Stretches", min: 21, level: "intermediate", feel: "flow", style: "Flexibility", popular: true, views: "7.8M" },
    { id: "ugXQe5hbUAA", section: "flex", title: "Beginner Flexibility Routine · Stretches for the Inflexible", channel: "MadFit", min: 34, level: "beginner", feel: "gentle", style: "Full body stretch", popular: true, views: "4.6M" },

    // ---------- Pilates (no equipment) ----------
    { id: "CdjRQ6GG8bA", section: "pilates", title: "Gentle Pilates · 15 Minutes for Beginners", channel: "Jessica Valant", min: 17, level: "beginner", feel: "gentle", style: "Mat Pilates" },
    { id: "aOYcySi-kpU", section: "pilates", title: "Pilates for Beginners · Total Body Workout", channel: "Jessica Valant", min: 22, level: "beginner", feel: "flow", style: "Mat Pilates" },
    { id: "dF2dXejdKHM", section: "pilates", title: "20 Min Pilates Core & Abs · All Levels", channel: "Move With Nicole", min: 23, level: "all", feel: "strong", style: "Core" },
    { id: "wtVyZmHnlxM", section: "pilates", title: "30 Min Pilates · Beginner to Moderate", channel: "Move With Nicole", min: 30, level: "beginner", feel: "flow", style: "Mat Pilates" },
    { id: "C2HX2pNbUCM", section: "pilates", title: "30 Min Full Body At-Home Pilates", channel: "Move With Nicole", min: 33, level: "all", feel: "flow", style: "Mat Pilates" },
    { id: "koTzaUu7Vws", section: "pilates", title: "40 Min Full Body · Intermediate Pilates Class", channel: "Move With Nicole", min: 44, level: "intermediate", feel: "strong", style: "Mat Pilates" },

    // Popular picks
    { id: "f9UbVRqd9YY", section: "pilates", title: "15 Min Pilates · Slow Full Body Toning", channel: "Pamela Reif", min: 16, level: "beginner", feel: "gentle", style: "Low impact", popular: true, views: "11M" },
    { id: "zTLGjyt1GdQ", section: "pilates", title: "Total Body Pilates Workout · POP Pilates", channel: "blogilates", min: 12, level: "all", feel: "strong", style: "POP Pilates", popular: true, views: "2.8M" },
    { id: "enK76XbR9Q0", section: "pilates", title: "12 Min Pilates · Slow Full Body Toning, Floor Only", channel: "Pamela Reif", min: 13, level: "all", feel: "flow", style: "Low impact", popular: true, views: "2.8M" },
    { id: "gsgRJd_-rLI", section: "pilates", title: "21 Minute All in One Tone Workout", channel: "blogilates", min: 24, level: "all", feel: "strong", style: "POP Pilates", popular: true, views: "1.8M" },
    { id: "kg07a-mgmlI", section: "pilates", title: "15 Minute Everyday Pilates Abs & Core", channel: "Lottie Murphy", min: 14, level: "all", feel: "strong", style: "Core", popular: true, views: "1.7M" },
    { id: "FQRoS0KsQBo", section: "pilates", title: "Ultimate Pilates Toning · 30 Min Abs, Glutes, Back", channel: "Lottie Murphy", min: 34, level: "intermediate", feel: "strong", style: "Mat Pilates", popular: true, views: "1.4M" },

    // ---------- Dance (no equipment) ----------
    { id: "TItIq0L0e58", section: "dance", title: "15 Min Throwbacks Dance Party Workout", channel: "MadFit", min: 15, level: "all", feel: "strong", style: "Dance cardio" },
    { id: "q7ytBN8eaiM", section: "dance", title: "African Dance Workout · Let's Shine 15", channel: "Kukuwa Fitness", min: 19, level: "all", feel: "flow", style: "African dance" },
    { id: "fYQq4iyUYAM", section: "dance", title: "20 Minute Dance Workout · Low Impact, No Jumping", channel: "Zumba Sulu", min: 20, level: "beginner", feel: "gentle", style: "Low impact" },
    { id: "3LpJSXiI3iA", section: "dance", title: "20 Minute Low Impact Dance to Brighten Your Mood", channel: "Improved Health", min: 23, level: "beginner", feel: "gentle", style: "Low impact" },
    { id: "aBtP7008EfA", section: "dance", title: "30-Minute All-Levels Cardio Dance Workout", channel: "PS Fit", min: 31, level: "all", feel: "strong", style: "Dance cardio" },
    { id: "r9120Tk-JQI", section: "dance", title: "African Dance Workout · Fantastic Classics", channel: "Kukuwa Fitness", min: 33, level: "intermediate", feel: "strong", style: "African dance" },

    // Popular picks
    { id: "F-jgNJyRkiU", section: "dance", title: "January Challenge Sweat Session", channel: "The Fitness Marshall", min: 37, level: "all", feel: "strong", style: "Dance cardio", popular: true, views: "3M" },
    { id: "TcKGkEyoYGg", section: "dance", title: "30 Min Dua Lipa Dance Workout", channel: "MadFit", min: 34, level: "all", feel: "strong", style: "Dance cardio", popular: true, views: "2.4M" },
    { id: "vI5MzT-wIjs", section: "dance", title: "30 Min Cardio Aerobics · All Standing, Low Impact", channel: "MadFit", min: 29, level: "beginner", feel: "flow", style: "Low impact", popular: true, views: "1.5M" },
    { id: "jR_yGxrNHq0", section: "dance", title: "30 Minute Sweat Session · Day 2", channel: "The Fitness Marshall", min: 32, level: "all", feel: "strong", style: "Dance cardio", popular: true, views: "1.3M" },

    // ---------- Soundscapes ----------
    { id: "aaPE-MlAppQ", section: "sound", title: "Rain on leaves", channel: "Calm Relax Ambient Soothing", min: 180, level: "all", feel: "rest", style: "Rain" },
    { id: "0Lawyy6ZUU8", section: "sound", title: "Singing bowls", channel: "Aurabowls", min: 61, level: "all", feel: "rest", style: "Singing bowls" },
    { id: "XL-vgJcCR9Q", section: "sound", title: "Singing bowl & gentle rain", channel: "Aurabowls", min: 66, level: "all", feel: "rest", style: "Singing bowls" },
    { id: "G3cVeKJ5xkg", section: "sound", title: "Ganga at dusk · Aarti, Triveni Ghat", channel: "Wanderers", min: 12, level: "all", feel: "rest", style: "River & chant" },
    { id: "AO2S2QZjykE", section: "sound", title: "Ocean waves, morning", channel: "Relaxing Sounds Of Nature", min: 61, level: "all", feel: "rest", style: "Ocean" },
    { id: "xNN7iTA57jM", section: "sound", title: "Forest birdsong", channel: "The Guild of Ambience", min: 180, level: "all", feel: "rest", style: "Forest" },
    { id: "UgHKb_7884o", section: "sound", title: "Crackling fireplace", channel: "Cat Trumpet", min: 720, level: "all", feel: "rest", style: "Fire" },
    // Popular picks
    { id: "o8GrqUSdzi0", section: "sound", title: "Piano & rain", channel: "Soothing Relaxation", min: 603, level: "all", feel: "rest", style: "Rain & piano", popular: true, views: "177M" },
    { id: "yIQd2Ya0Ziw", section: "sound", title: "Rainstorm", channel: "Calm", min: 480, level: "all", feel: "rest", style: "Rain", popular: true, views: "112M" },
    { id: "bn9F19Hi1Lk", section: "sound", title: "Rolling ocean waves", channel: "Naturaleza Viva", min: 677, level: "all", feel: "rest", style: "Ocean", popular: true, views: "86M" },
    { id: "eTeD8DAta4c", section: "sound", title: "Steady rain", channel: "Relaxing White Noise", min: 600, level: "all", feel: "rest", style: "Rain", popular: true, views: "74M" },
    { id: "HmH4W8JOifg", section: "sound", title: "Rain & gentle thunder", channel: "Jason Stephenson", min: 180, level: "all", feel: "rest", style: "Rain", popular: true, views: "64M" },
    { id: "yEP2YrD-dyY", section: "sound", title: "Big Tibetan singing bowl", channel: "Meditative Mind", min: 71, level: "all", feel: "rest", style: "Singing bowls", popular: true, views: "9.2M" },
  ],

  // Each playlist holds one kind of video (`kind` = a section id).
  playlists: [
    { id: "morning-hatha", kind: "yoga", name: "Morning Hatha", items: ["CWIcRrBdk_k", "jsbAwAJz4tM", "_hHuczegZDs", "_noquwycq78"] },
    { id: "breathe-flow", kind: "yoga", name: "Breathe and Flow favourites", items: ["wCUI1bwlJqA", "t2UCGc4eUHo", "P0UsdewWXLA", "f7_zx1sPBj0"] },
    { id: "long-yoga", kind: "yoga", name: "Long yoga · 60 min+", items: ["qSG7PsdZG04", "lC5f2xqWBag", "bmMww1Wo6Tc", "IZSEVaxTtHc"] },
    { id: "strong-steady", kind: "move", name: "Strong & steady", items: ["gOkCJ57IvNg", "TOXmdZ35CH0", "kuUZYUBHryw", "UItWltVZZmE"] },
    { id: "daily-stretch", kind: "flex", name: "Daily stretch", items: ["L_xrDAtykMI", "g_tea8ZNk5A", "OjcN6RzWFWs", "CY6QP4ofwx4"] },
    { id: "pilates-core", kind: "pilates", name: "Pilates on the mat", items: ["CdjRQ6GG8bA", "aOYcySi-kpU", "f9UbVRqd9YY", "C2HX2pNbUCM"] },
    { id: "move-joy", kind: "dance", name: "Move for joy", items: ["q7ytBN8eaiM", "TItIq0L0e58", "vI5MzT-wIjs", "TcKGkEyoYGg"] },
  ],

  // My YouTube playlist "background videos": music & ambience to play under anything.
  // Playing the whole list streams it straight from YouTube, so new additions show up by themselves.
  background: {
    playlistId: "PL-caKhR0_LKxbNTNacuBljCO90A7htG3e",
    name: "background videos",
    groups: [
      { id: "focus", label: "Focus & pomodoro" },
      { id: "lofi", label: "Lofi & jazz" },
      { id: "dreamy", label: "Calm & dreamy" },
      { id: "chant", label: "Chant & flute" },
      { id: "rain", label: "Rain" },
      { id: "talks", label: "Talks & stories" },
    ],
    items: [
      { id: "NJuSStkIZBg", group: "lofi", title: "Rainy Jazz Cafe - Slow Jazz Music in Coffee Shop Ambience for Work, Study and Relaxation", channel: "Coffee Shop Vibes" },
      { id: "eH-_GMhH-kk", group: "focus", title: "Study | Work Aid • \"The Office\" Ambience 🎧 Keyboard Typing & Pencil Writing sounds", channel: "Lullablocks" },
      { id: "ij2wEWhbHjI", group: "focus", title: "🍀3-HOUR STUDY & WORK AMBIENCE/ Cottage Relaxing Stream Sounds for DEEP FOCUS/POMODORO Timer & Alarm", channel: "The Sherry Formula" },
      { id: "GpkeZQs_-Gw", group: "focus", title: "🚀 Pomodoro TIMER with BINAURAL BEATS 🚀 ( 40hz ) [25/5 min] Ambience & music to STUDY and concentrate", channel: "pomodoro · ikeshuku" },
      { id: "1ex_bNIFR1A", group: "focus", title: "3 HOUR STUDY WITH ME | Background noise, Rain Sounds, 10-min break, No Music", channel: "Merve", embed: false },
      { id: "nS9QtzGwBcc", group: "dreamy", title: "AphexTwin - Stone in focus -  Philosophical Ape 2 hours", channel: "Sleeptimer" },
      { id: "IWDrzAGouLQ", group: "focus", title: "ADHD Pomodoro Timer - 4x25 minutes [Lofi - Chill🎵]", channel: "The Mini ADHD Coach" },
      { id: "lkkGlVWvkLk", group: "focus", title: "Intense Study - 40Hz Gamma Binaural Beats to Increase Productivity and Focus", channel: "Study Sonic Focus" },
      { id: "lTRiuFIWV54", group: "lofi", title: "1 A.M Study Session 📚 [lofi hip hop]", channel: "Lofi Girl" },
      { id: "FHHVHSe-_AM", group: "talks", title: "Poetry as Enchantment", channel: "Library of Congress" },
      { id: "7vTraPeiEtw", group: "dreamy", title: "Music to Stop Doomscrolling to | Spiritual Paralysis by Hexsystem (Full Album)", channel: "u m a m i" },
      { id: "bLXzkz21nmI", group: "talks", title: "The Creation Myth of the Proto Indo-Europeans", channel: "Crecganford" },
      { id: "frsy3mdvvaw", group: "dreamy", title: "Classical Music for When you are plotting your Revenge-#classicalmusic #violin / Violin", channel: "Moo Wire Media" },
      { id: "ABGURyOP65g", group: "lofi", title: "☆𝘸𝘩𝘦𝘳𝘦 𝘢𝘮 𝘪? ☆𝘸𝘦𝘪𝘳𝘥𝘤𝘰𝘳𝘦/𝘥𝘳𝘦𝘢𝘮𝘤𝘰𝘳𝘦/𝘵𝘳𝘢𝘶𝘮𝘢𝘤𝘰𝘳𝘦 𝘱𝘭𝘢𝘺𝘭𝘪𝘴𝘵 ☆", channel: "• pipermint! •" },
      { id: "VbDx4-8VEgs", group: "lofi", title: "drive it like you stole it.", channel: "home alone." },
      { id: "Llour2YvsiI", group: "lofi", title: "[Playlist] When you don't want to think about anything | Cozy Relaxing Jazz Music Background", channel: "WRG 우리가 듣고 싶어서 연주한 playlist" },
      { id: "__1uVWUSJe4", group: "lofi", title: "Human no AI lofi Music in a Real Poppy Field · Dreamy Drawing Session with our Pup", channel: "Yellow Cherry Jam" },
      { id: "MYJAlhBzvU4", group: "lofi", title: "Study and Work with Carrie Bradshaw | Jazz 🍸", channel: "TOUT Studio" },
      { id: "mAnyyhytrrI", group: "focus", title: "⏰️Pomodoro 50/10 • (ASMR) Writer's Old Study📝 In-game sounds + fireplace + rain 🌧 ", channel: "Lullablocks" },
      { id: "Bqr4-cxoNsQ", group: "focus", title: "⏰️Pomodoro 25/5 • Study with Katie + rain with thunder & windy ambience▪️No music version📖🎧", channel: "Lullablocks" },
      { id: "gAsNvXDsrGA", group: "dreamy", title: "an hour of relaxing spongebob music", channel: "float" },
      { id: "9Y8OA70vmeY", group: "dreamy", title: "Stone In Focus - Aphex Twin, but it's a perfect loop [1 hour]", channel: "SlomanajaRuka" },
      { id: "MWPYhebILb4", group: "dreamy", title: "A playlist that makes you feel calm and dreamy..", channel: "Pianza" },
      { id: "0dcFWLV_OlI", group: "rain", title: "Soothing rain sounds on the clay jars with distant thunder. ⛈️Great for relaxing and deep sleep.", channel: "healing by nature" },
      { id: "ucKb3ZLft5Q", group: "dreamy", title: "a vintage european dream | soft strings + classical music to relax", channel: "Lepreezy", embed: false },
      { id: "bIbLPDlbW-Q", group: "chant", title: "Mayan Temple Flute  The biggest one ever made. (the Sound of the Temple)", channel: "Eagle Feather and Aida Mendoza" },
      { id: "jeZSyHTUFSU", group: "chant", title: "Mayan Full Moon (Mayan Temple Flute)", channel: "Eagle Feather and Aida Mendoza" },
      { id: "Rt2empUOJfU", group: "chant", title: "The Reverent Calm Of Nuns Singing Gregorian Chants", channel: "Harmonia Antiqua" },
      { id: "VVjYff1nK5M", group: "chant", title: "The Mask of the Forest | 1 Hour of Native American Flute Music", channel: "Eagle Feather and Aida Mendoza" },
    ],
  },

  // Calisthenics progression ladders. `step` = index of the current rung.
  ladders: [
    { id: "push", label: "Push", steps: ["Wall push-up", "Incline push-up", "Knee push-up", "Full push-up", "Diamond push-up"], step: 1, last: "3 × 10" },
    { id: "pull", label: "Pull", steps: ["Dead hang", "Australian rows", "Negatives", "Band pull-up", "First pull-up"], step: 0, last: "3 × 20 s" },
    { id: "legs", label: "Legs", steps: ["Squat", "Split squat", "Bulgarian split squat", "Shrimp squat", "Pistol squat"], step: 1, last: "3 × 8 each" },
    { id: "core", label: "Core & skill", steps: ["Hollow hold", "Tuck L-sit", "Crow", "Wall handstand", "Freestanding handstand"], step: 0, last: "3 × 15 s" },
  ],
};
