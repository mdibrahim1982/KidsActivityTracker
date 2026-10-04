// Simple, everyday Tamil and Malayalam — not classical/literary register.
// English is the source of truth and the fallback for anything missing
// (e.g. a parent's own custom activity name, which can't be pre-translated).
//
// t(lang, key, vars)              — a plain UI string, with {placeholders}
// tActivity(lang, activity, field)— activity label/hint/buttonLabel
// tCategory(lang, categoryId)     — category name
// tTip(lang, category)            — one random hadith/reminder tip

export const LANGUAGES = ['en', 'ta', 'ml']
export const LANGUAGE_NAMES = { en: 'English', ta: 'தமிழ்', ml: 'മലയാളം' }

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
const EN = {
  appTitle: 'Kids Productivity Tracker',
  loading: 'Loading…',
  cancel: 'Cancel',
  save: 'Save',
  done: 'Done',
  doneCheckmark: 'Done ✅',
  edit: 'Edit',
  remove: 'Remove',
  confirm: 'Confirm',
  language: 'Language',

  // Auth gate
  authWelcomeBack: 'Welcome back',
  authCreateAccount: 'Create your family account',
  authResetPassword: 'Reset your password',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  loggingIn: 'Logging in…',
  logIn: 'Log In',
  forgotPassword: 'Forgot password?',
  newHere: 'New here?',
  createFamilyAccount: 'Create a family account',
  yourName: 'Your name',
  confirmPassword: 'Confirm password',
  parentCodeLabel: "Parent code (for day-review & settings — kids won't see this)",
  parentCodePlaceholder: 'e.g. a 4+ digit code',
  currencyForRewards: 'Currency for rewards',
  creatingAccount: 'Creating account…',
  createAccount: 'Create Account',
  alreadyHaveAccount: 'Already have an account?',
  sendingReset: 'Sending…',
  sendResetEmail: 'Send Reset Email',
  backToLogin: 'Back to log in',
  authErrEmailInUse: 'An account already exists for that email — try logging in instead.',
  authErrInvalidEmail: "That doesn't look like a valid email address.",
  authErrWeakPassword: 'Password should be at least 6 characters.',
  authErrUserNotFound: 'No account found for that email — sign up instead?',
  authErrWrongPassword: 'Incorrect password. Try again, or reset it below.',
  authErrInvalidCredential: "Email or password doesn't match our records.",
  authErrTooManyRequests: 'Too many attempts — please wait a bit and try again.',
  authErrGeneric: 'Something went wrong. Please try again.',
  authErrEnterName: 'Please enter your name.',
  authErrParentCodeShort: 'Please choose a parent code at least 4 characters long.',
  authErrPasswordShort: 'Password should be at least 6 characters.',
  authErrPasswordMismatch: "Passwords don't match.",
  authErrEnterEmailFirst: 'Enter the email on your account first.',
  authResetSent: 'Password reset email sent — check your inbox.',

  // Kid login gate
  assalamu: 'Assalaamu Alaikum!',
  whoAreYou: "Hey, Who're You?",
  passwordHint: "Password (hint: it's your name!)",
  enterPasswordFor: "Enter {name}'s password",
  wrongPassword: "Hmm, that's not quite right. Try again!",
  welcomeNameExclaim: 'Welcome, {name}!',
  welcomeMessage: "Let's make today a great one — Deen, studies, and play.",

  // No children yet
  welcomeExclaim: 'Welcome!',
  addFirstChild: "Let's add your first child to get started.",
  usedOldVersion: 'Used the old single-family version of this app before?',
  importThatData: 'Import that data',
  signOut: 'Sign out',

  // Manage children
  manageChildrenTitle: '👨\u200d👩\u200d👧 Manage children',
  noChildrenYet: 'No children yet — add your first one below to get started.',
  namePlaceholder: 'Name',
  agePlaceholder: 'Age',
  gradePlaceholder: 'Grade (e.g. 5th Grade)',
  noGradeSet: 'No grade set',
  ageSuffix: ' · Age {age}',
  addChildBtn: '+ Add a child',
  addChildSubmit: 'Add child',
  manageChildrenNote:
    "Every new child starts with the default set of activities. Pick an activity set for each child from the Activities tab.",
  removeChildConfirm: 'Remove {name}? This deletes all of their saved history too.',

  // Nav
  tabToday: 'Today',
  tabWeeks: 'Weeks',
  tabParent: '👨\u200d👩\u200d👧 Parent',
  notYouLogout: '👋 {name}, not you?',
  logOutTitle: 'Log out',

  // Cloud status
  cloudSynced: '☁️ Synced — every device shares this data',
  cloudConnecting: '🔄 Connecting to shared data…',
  cloudOffline: '📴 Offline — changes are saved on this device only for now',
  cloudLocal: '💾 Synced to local storage (dev mode)',

  // Parent sub-nav
  parentSectionsAria: 'Parent sections',
  parentSectionOverview: '📊 Progress',
  parentSectionActivities: '🎯 Activities',
  parentSectionSettings: '⚙️ Settings',
  lockShort: '🔒 Lock',
  activitiesTabNote:
    "Pick a child with the tabs above, then build their list. Each child can have a different set of activities and different rewards.",

  // Today view
  todayLabel: 'Today',
  thisWeeksBuckets: "This week's buckets",
  carriedPenalty: 'Carried penalty (owed)',
  payAndEmpty: '💰 Pay & empty buckets',
  todayLocked: '🔒 Today is locked. Great work — come back tomorrow for a fresh day.',
  verseTranslation: '\u201cSurely Allah fully knows what you used to do.\u201d',
  verseReference: "Al Qur'aan (Surah An-Nahl, Verse 28)",
  dayLocked: 'Day locked',
  lockDayFinish: 'Lock day & finish',
  footerNote:
    'Each activity shows its own reward (a parent sets these). Locking the day marks any still-pending activity as missed (empty bucket).',
  resetTodayBtn: '🔧 Reset Today',
  undoConfirm: 'Undo "{label}"? The coin will be taken back.',
  oopsUndo: '↩️ Oops, undo',
  scrollToTopAria: 'Scroll to top',

  // Activity card / status
  rewardTitle: 'Reward for this activity',
  unlocksAt: '🔒 Unlocks at {time}',
  completedOnTime: 'Completed on Time?',
  pushNow: 'Push Now',
  deadlinePrefix: 'Deadline: {label}',
  graceSuffix: ' + {min} min grace',
  lateCreditsSuffix: ' · "{label}" credits {cur}{amt}{until}',
  untilSuffix: ' until {time}',
  coinApproved: 'Coin approved',
  coinEarned: 'Coin earned',
  pendingParentReview: 'pending parent review',
  coinRejected: 'Coin rejected by parent',
  missedLabel: 'Missed',
  lockedLabel: 'Locked',
  dayClosed: 'Day closed',
  readyLabel: 'Ready',
  notYet: 'Not yet',
  noDataWord: 'no data',
  fromTime: ' · from {time}',

  // Weeks view
  dateLabel: 'Date',
  totalLabel: 'Total',
  weekN: 'Week {n}',
  weekNTotal: 'Week {n} total',

  // Day review modal
  reviewCoinsTitle: "Review {name}'s coins",
  noCoinsClaimed: 'No coins were claimed today — nothing to review.',
  reviewExplain:
    'Approve or reject each coin claimed today. A rejected coin is removed from the bucket and adds a {cur}{amount} penalty that carries forward.',
  markedDone: 'Marked done',
  approvedBadge: '✅ Approved',
  rejectedBadge: '❌ Rejected',
  approveBtn: 'Approve',
  rejectBtn: 'Reject',
  unreviewedNote: 'Anything left unreviewed stays approved and keeps its coin.',
  reviewLater: 'Review later',
  finishLockDay: 'Finish & lock day',

  // Parent weekly panel
  thisWeekAllChildren: '📊 This week — all children',
  lockParentView: '🔒 Lock parent view',
  thisWeekLabel: 'This week',
  coinsLabel: 'Coins',
  owedLabel: 'Owed',
  parentPanelResetNote:
    'This resets whenever "Pay & empty buckets" is used for a kid. For full day-by-day history, use the Weeks tab.',

  // Activity manager
  rewardAria: 'Reward',
  activitiesActiveLine: '{n} active · up to {cur}{amount} a day',
  dragHint:
    "Drag an idea from the right into this box (or tap \uFF0B). Set the reward for each activity — that's what a coin is worth for {name}.",
  rewardLabel: 'Reward',
  defaultReset: '\u21ba default',
  onTimeByAll: 'On-time by (all children)',
  showButtonAfterAll: 'Show button after (all children)',
  lateWindowNote: '+30 min late window after this',
  removeFromChildTitle: 'Remove from this child',
  needOneActivityTitle: 'A child needs at least one activity',
  dropHereToAdd: '\u2b07 Drop a suggested activity here',
  suggestedActivitiesTitle: '💡 Suggested activities',
  pickedForName: 'Picked for {name}',
  agePart: ', age {age}',
  createCustomBtn: '➕ Create a custom activity',
  cancelX: '✕ Cancel',
  activityNameLabel: 'Activity name',
  activityNamePlaceholder: 'e.g. Feed the fish',
  categoryLabel: 'Category',
  hintOptionalLabel: 'Hint (optional)',
  hintPlaceholder: 'Shown under the activity name',
  saveCustomActivityBtn: 'Save custom activity',
  customNote:
    "Saved for your whole family — it'll appear below under Recommended. Drag it into the list on the left (or tap \uFF0B) to add it to {name}, and the same for any other child.",
  filterCategoriesAria: 'Filter suggestions by category',
  allFilter: 'All',
  dropToRemove: "Drop here to remove it from {name}'s list",
  nothingLeftHere: "Nothing left here — everything is already on {name}'s list.",
  recommendedFor: 'Recommended for {name}',
  noMoreRecommendations: 'No more recommendations — see other ideas below.',
  otherIdeas: "Other ideas ({n}) — outside {name}'s age/grade",
  giveItAName: 'Give it a name.',
  rewardMustBeNumber: 'Reward must be a number, 0 or more.',
  removeActivityConfirm: 'Remove "{label}" from {name}\'s list? Their past history is kept.',
  aChildNeedsOneActivity: 'A child needs at least one activity.',
  suggestedWord: 'suggested',
  addActivityAria: 'Add {label}',
  removeActivityAria: 'Remove {label}',
  onTimeByWord: 'on-time by',
  showButtonAfterWord: 'show button after',
  gradeCommaPrefix: ', {grade}',

  // Settings panel
  childrenTitle: '👨\u200d👩\u200d👧 Children',
  manageChildrenNote2:
    "Add a child, or change a child's name, age and grade. Age and grade decide which suggested activities are recommended.",
  manageChildrenBtn: 'Manage children',
  rewardsTitle: '💰 Rewards',
  currencyLabel: 'Currency',
  defaultRewardPerActivity: 'Default reward per activity',
  defaultRewardHelp: "Used for any activity you haven't given its own reward (Activities tab).",
  penaltyForRejected: 'Penalty for a rejected coin',
  penaltyHelp: 'Taken back when you reject a claimed coin at day-end; carries forward until paid off.',
  parentCodeTitle: '🔐 Parent code',
  parentCodeHasOne: 'This code protects the day-end review, resets and this parent area from the children.',
  parentCodeNone: "No parent code is set yet — choose one so the children can't open the parent area.",
  newParentCode: 'New parent code',
  saveCodeBtn: 'Save code',
  codeTooShort: 'Please use at least 4 characters.',
  codeUpdated: 'Parent code updated.',
  liveSyncOn: '☁️ Live sync is on.',
  liveSyncExplain:
    'Every device signed in to {email} shares the same children and history. Backups below are an extra safety copy.',
  thisAccountWord: 'this account',
  localDevModeTitle: '💾 Local dev mode.',
  localDevExplain:
    'Running on localhost, so nothing here touches the cloud or needs a real account — data stays in this browser only.',
  notConnectedTitle: '⚠️ Not connected right now.',
  notConnectedExplain:
    'Changes are saved on this device and will sync when it reconnects. Use a backup to move data by hand in the meantime.',
  cloudStorageUsed: 'Cloud storage used: about {used} KB of roughly {limit} KB for one account.',
  gettingFull: ' Getting full — download a backup now.',
  downloadBackupBtn: '⬇️ Download backup',
  restoreBackupBtn: '⬆️ Restore from backup',
  backupHint: 'A backup file also imports data from the original single-family version of this app.',
  accountTitle: '👤 Account',
  signedInAs: 'Signed in as {email}',
  signOutDeviceBtn: '🚪 Sign out of this device',

  // Passcode modal
  enterPasscode: 'Enter passcode',
  incorrectPasscode: 'Incorrect passcode. Try again.',

  // Pending-action titles/messages (built in App.jsx)
  parentPasscodeRequired: 'Parent passcode required',
  adminPasscodeRequired: 'Admin passcode required',
  msgExportBackup: "Download a backup file of all your children's data.",
  msgImportBackup: "Replace your children's data with a backup file you pick next.",
  msgReviewCoins: "Review {name}'s coins for today before locking.",
  msgResetToday: "Reset today's activities for {name} for testing (even though today may be locked)?",
  msgOpenParentArea: 'Open the parent area (progress, activities & settings).',

  // Alerts / confirms
  noOlderData: 'No older data was found to import.',
  importLegacyConfirm: 'Import {count} child(ren) from the old shared data into this account?',
  importedLegacySuccess:
    'Imported! Your children now appear here — you can edit their age and grade from the Parent tab.',
  legacyImportFailed:
    'Could not read the older data. It may not exist, or the security rules no longer allow it — try importing a backup file instead (Parent tab \u2192 Settings \u2192 Import).',
  importConfirm: 'Replace the children and history in this account with the ones in that file?',
  importSuccess: "Backup imported! Your account now shows that backup's data.",
  importFailed: "Could not read that file — make sure it's a Kids Productivity Tracker backup .json file.",
  resetWeekConfirmWithDebt:
    "Empty all buckets for {name}? {cur}{min} of this week's {cur}{total} goes toward carried-forward penalties, paying out {cur}{payout}.",
  resetWeekConfirmNoDebt: "Empty all buckets for {name} after paying out this week's {cur}{total}?",

  // Banner
  bannerKicker: '🕌 Deen \u00a0\u00b7\u00a0 📚 Studies \u00a0\u00b7\u00a0 🌳 Play',
  bannerSubtitle: 'Daily habits, prayers & discipline tracker',
}

// ---------------------------------------------------------------------------
// Tamil — simple, everyday spoken style (not classical Tamil)
// ---------------------------------------------------------------------------
const TA = {
  appTitle: 'குழந்தைகள் செயல்பாடு டிராக்கர்',
  loading: 'லோட் ஆகுது…',
  cancel: 'ரத்து செய்',
  save: 'சேவ் செய்',
  done: 'முடிந்தது',
  doneCheckmark: 'முடிந்தது ✅',
  edit: 'எடிட் செய்',
  remove: 'நீக்கு',
  confirm: 'ஓகே',
  language: 'மொழி',

  authWelcomeBack: 'மறுபடியும் வருக',
  authCreateAccount: 'உங்க குடும்ப அக்கவுன்ட் உருவாக்குங்க',
  authResetPassword: 'பாஸ்வேர்ட் ரீசெட் செய்யுங்க',
  emailLabel: 'மின்னஞ்சல்',
  passwordLabel: 'பாஸ்வேர்ட்',
  loggingIn: 'லாகின் ஆகுது…',
  logIn: 'லாகின்',
  forgotPassword: 'பாஸ்வேர்ட் மறந்துட்டீங்களா?',
  newHere: 'புதுசா வந்தீங்களா?',
  createFamilyAccount: 'குடும்ப அக்கவுன்ட் உருவாக்குங்க',
  yourName: 'உங்க பேரு',
  confirmPassword: 'பாஸ்வேர்ட் மறுபடியும் போடுங்க',
  parentCodeLabel: 'பெற்றோர் கோட் (இதை குழந்தைங்க பார்க்க மாட்டாங்க)',
  parentCodePlaceholder: 'எ.கா. 4+ எழுத்து கோட்',
  currencyForRewards: 'பரிசுக்கான நாணயம்',
  creatingAccount: 'அக்கவுன்ட் உருவாகுது…',
  createAccount: 'அக்கவுன்ட் உருவாக்கு',
  alreadyHaveAccount: 'ஏற்கனவே அக்கவுன்ட் இருக்கா?',
  sendingReset: 'அனுப்புது…',
  sendResetEmail: 'ரீசெட் மெயில் அனுப்பு',
  backToLogin: 'லாகினுக்கு போ',
  authErrEmailInUse: 'இந்த மெயிலுக்கு ஏற்கனவே அக்கவுன்ட் இருக்கு — லாகின் செய்ய பாருங்க.',
  authErrInvalidEmail: 'இது சரியான மெயில் மாதிரி இல்லை.',
  authErrWeakPassword: 'பாஸ்வேர்ட் குறைந்தது 6 எழுத்துகள் இருக்கணும்.',
  authErrUserNotFound: 'இந்த மெயிலுக்கு அக்கவுன்ட் இல்லை — புதுசா சைன் அப் பண்ணுங்க?',
  authErrWrongPassword: 'பாஸ்வேர்ட் தப்பு. மறுபடியும் முயற்சி செய்யுங்க அல்லது கீழே ரீசெட் செய்யுங்க.',
  authErrInvalidCredential: 'மெயில் அல்லது பாஸ்வேர்ட் சரியில்லை.',
  authErrTooManyRequests: 'ரொம்ப தடவை முயற்சி பண்ணிட்டீங்க — கொஞ்சம் நேரம் கழிச்சு முயற்சி செய்யுங்க.',
  authErrGeneric: 'ஏதோ தப்பு நடந்துச்சு. மறுபடியும் முயற்சி செய்யுங்க.',
  authErrEnterName: 'தயவுசெய்து உங்க பேரு போடுங்க.',
  authErrParentCodeShort: 'குறைந்தது 4 எழுத்துள்ள பெற்றோர் கோட் ஒண்ணு வையுங்க.',
  authErrPasswordShort: 'பாஸ்வேர்ட் குறைந்தது 6 எழுத்துகள் இருக்கணும்.',
  authErrPasswordMismatch: 'பாஸ்வேர்ட் ரெண்டும் மேட்ச் ஆகல.',
  authErrEnterEmailFirst: 'முதல்ல உங்க அக்கவுன்ட் மெயிலை போடுங்க.',
  authResetSent: 'பாஸ்வேர்ட் ரீசெட் மெயில் அனுப்பிட்டோம் — இன்பாக்ஸ் பாருங்க.',

  assalamu: 'அஸ்ஸலாமு அலைக்கும்!',
  whoAreYou: 'யாரு நீங்க?',
  passwordHint: 'பாஸ்வேர்ட் (ஹிண்ட்: உங்க பேரு தான்!)',
  enterPasswordFor: '{name} ஓட பாஸ்வேர்டை போடுங்க',
  wrongPassword: 'அது சரியில்ல போல! மறுபடியும் முயற்சி செய்',
  welcomeNameExclaim: 'வருக, {name}!',
  welcomeMessage: 'இன்னைக்கு நல்லா இருக்கணும் — தொழுகை, படிப்பு, விளையாட்டு.',

  welcomeExclaim: 'வருக!',
  addFirstChild: 'முதல்ல உங்க முதல் குழந்தையை சேருங்க.',
  usedOldVersion: 'இந்த ஆப்ஸோட பழைய வெர்ஷன் முன்னாடி யூஸ் பண்ணீங்களா?',
  importThatData: 'அந்த டேட்டாவை கொண்டு வா',
  signOut: 'சைன் அவுட்',

  manageChildrenTitle: '👨\u200d👩\u200d👧 குழந்தைகளை மேனேஜ் செய்',
  noChildrenYet: 'இன்னும் குழந்தைகள் சேக்கல — கீழே முதல் குழந்தையை சேருங்க.',
  namePlaceholder: 'பேரு',
  agePlaceholder: 'வயசு',
  gradePlaceholder: 'கிளாஸ் (எ.கா. 5th Grade)',
  noGradeSet: 'கிளாஸ் போடல',
  ageSuffix: ' · வயசு {age}',
  addChildBtn: '+ குழந்தையை சேரு',
  addChildSubmit: 'குழந்தையை சேரு',
  manageChildrenNote:
    'புது குழந்தைக்கு டீஃபால்ட் ஆக்டிவிட்டீஸ் எல்லாம் இருக்கும். ஒவ்வொரு குழந்தைக்கும் எந்த ஆக்டிவிட்டீஸ் வேணும்ன்னு Activities டேபில் தேர்ந்தெடுக்கலாம்.',
  removeChildConfirm: '{name}-யை நீக்கணுமா? இதனால அவங்களோட சேவ் ஆன ஹிஸ்டரி எல்லாமே போயிடும்.',

  tabToday: 'இன்னைக்கு',
  tabWeeks: 'வாரங்கள்',
  tabParent: '👨\u200d👩\u200d👧 பெற்றோர்',
  notYouLogout: '👋 {name}, இது நீங்க இல்லையா?',
  logOutTitle: 'லாக் அவுட்',

  cloudSynced: '☁️ சின்க் ஆச்சு — எல்லா டிவைஸிலும் இதே டேட்டா',
  cloudConnecting: '🔄 டேட்டாவை கனெக்ட் பண்றோம்…',
  cloudOffline: '📴 ஆஃப்லைன் — இப்போதைக்கு இந்த டிவைஸ்ல மட்டும் சேவ் ஆகுது',
  cloudLocal: '💾 இந்த டிவைஸ்லயே சேவ் ஆகுது (டெவ் மோட்)',

  parentSectionsAria: 'பெற்றோர் பிரிவுகள்',
  parentSectionOverview: '📊 முன்னேற்றம்',
  parentSectionActivities: '🎯 ஆக்டிவிட்டீஸ்',
  parentSectionSettings: '⚙️ செட்டிங்ஸ்',
  lockShort: '🔒 லாக்',
  activitiesTabNote:
    'மேலே இருக்கிற டேப்ல ஒரு குழந்தையை தேர்ந்தெடுங்க, அப்புறம் அவங்க லிஸ்ட்டை உருவாக்குங்க. ஒவ்வொரு குழந்தைக்கும் வேற ஆக்டிவிட்டீஸும் வேற பரிசும் வைக்கலாம்.',

  todayLabel: 'இன்னைக்கு',
  thisWeeksBuckets: 'இந்த வாரத்துல சேர்ந்தது',
  carriedPenalty: 'கொடுக்கணும் (பெனால்டி)',
  payAndEmpty: '💰 பணம் கொடு & காலி பண்ணு',
  todayLocked: '🔒 இன்னைக்கு லாக் ஆயிடுச்சு. சூப்பர் வேலை — நாளைக்கு புது நாளா வாங்க.',
  verseTranslation: '\u201cநிச்சயமாக அல்லாஹ், நீங்கள் செய்து கொண்டிருந்தவற்றை முழுமையாக அறிபவனாக இருக்கின்றான்.\u201d',
  verseReference: 'குர்ஆன் (அன்-நஹ்ல், வசனம் 28)',
  dayLocked: 'நாள் லாக் ஆச்சு',
  lockDayFinish: 'நாளை லாக் பண்ணு',
  footerNote: 'ஒவ்வொரு ஆக்டிவிட்டீக்கும் அதுக்கான பரிசு இருக்கு (அதை பெற்றோர் தான் வைக்கணும்). நாளை லாக் பண்ணும்போது முடியாத ஆக்டிவிட்டீஸ் மிஸ் ஆகும்.',
  resetTodayBtn: '🔧 இன்னைக்கியை ரீசெட் செய்',
  undoConfirm: '"{label}"-ஐ திரும்ப பண்ணணுமா? கொயின் திரும்ப எடுக்கப்படும்.',
  oopsUndo: '↩️ தப்பா போச்சு, திரும்ப பண்ணு',
  scrollToTopAria: 'மேல போ',

  rewardTitle: 'இந்த ஆக்டிவிட்டீக்கான பரிசு',
  unlocksAt: '🔒 {time}-க்கு திறக்கும்',
  completedOnTime: 'சரியான நேரத்துல முடிச்சாச்சா?',
  pushNow: 'இப்போ பண்ணு',
  deadlinePrefix: 'கடைசி நேரம்: {label}',
  graceSuffix: ' + {min} நிமிஷம் தள்ளி',
  lateCreditsSuffix: ' · "{label}" என்றால் {cur}{amt}{until}',
  untilSuffix: ' {time} வரைக்கும்',
  coinApproved: 'கொயின் ஓகே ஆச்சு',
  coinEarned: 'கொயின் கிடைச்சுது',
  pendingParentReview: 'பெற்றோர் பார்க்கணும்',
  coinRejected: 'பெற்றோர் கொயினை ரிஜெக்ட் பண்ணிட்டாங்க',
  missedLabel: 'மிஸ் ஆச்சு',
  lockedLabel: 'லாக் ஆயிருக்கு',
  dayClosed: 'நாள் முடிஞ்சது',
  readyLabel: 'ரெடி',
  notYet: 'இன்னும் இல்ல',
  noDataWord: 'டேட்டா இல்ல',
  fromTime: ' · {time} முதல்',

  dateLabel: 'தேதி',
  totalLabel: 'மொத்தம்',
  weekN: '{n}வது வாரம்',
  weekNTotal: '{n}வது வார மொத்தம்',

  reviewCoinsTitle: '{name} கொயின்களை பாருங்க',
  noCoinsClaimed: 'இன்னைக்கு யாரும் கொயின் வாங்கல — பார்க்க ஒண்ணுமில்ல.',
  reviewExplain: 'இன்னைக்கு வாங்கின ஒவ்வொரு கொயினையும் ஓகே பண்ணுங்க அல்லது ரிஜெக்ட் பண்ணுங்க. ரிஜெக்ட் பண்ணா அந்த கொயின் போயிடும், {cur}{amount} பெனால்டியும் சேரும்.',
  markedDone: 'முடிச்சதா போட்டாங்க',
  approvedBadge: '✅ ஓகே ஆச்சு',
  rejectedBadge: '❌ ரிஜெக்ட் ஆச்சு',
  approveBtn: 'ஓகே',
  rejectBtn: 'ரிஜெக்ட்',
  unreviewedNote: 'நீங்க பார்க்காதது எல்லாம் ஓகேதான்னு வெச்சு கொயின் கிடைக்கும்.',
  reviewLater: 'அப்புறம் பார்க்கிறேன்',
  finishLockDay: 'முடிச்சு நாளை லாக் பண்ணு',

  thisWeekAllChildren: '📊 இந்த வாரம் — எல்லா குழந்தைகளும்',
  lockParentView: '🔒 பெற்றோர் பக்கத்தை லாக் பண்ணு',
  thisWeekLabel: 'இந்த வாரம்',
  coinsLabel: 'கொயின்கள்',
  owedLabel: 'கொடுக்கணும்',
  parentPanelResetNote: '"பணம் கொடு & காலி பண்ணு" பண்ணும்போது இது ரீசெட் ஆகும். நாள் வாரியா பார்க்க Weeks டேபுக்கு போங்க.',

  rewardAria: 'பரிசு',
  activitiesActiveLine: '{n} ஆக்டிவிட்டீஸ் · நாளுக்கு {cur}{amount} வரைக்கும்',
  dragHint: 'வலது பக்கத்துல இருந்து ஒரு ஐடியாவை இந்த பாக்ஸுக்குள் இழுத்துட்டு வாங்க (அல்லது ＋ அழுத்துங்க). ஒவ்வொரு ஆக்டிவிட்டீக்கும் பரிசை வையுங்க — அதுதான் {name}-க்கு ஒரு கொயின் மதிப்பு.',
  rewardLabel: 'பரிசு',
  defaultReset: '\u21ba டீஃபால்ட்',
  onTimeByAll: 'சரியான நேரம் (எல்லா குழந்தைகளுக்கும்)',
  showButtonAfterAll: 'இந்த நேரத்துக்கு அப்புறம் காட்டு (எல்லா குழந்தைகளுக்கும்)',
  lateWindowNote: 'இதுக்கு அப்புறம் +30 நிமிஷம் தாமதமா பண்ணலாம்',
  removeFromChildTitle: 'இந்த குழந்தையிடம் இருந்து நீக்கு',
  needOneActivityTitle: 'ஒரு குழந்தைக்கு குறைந்தது ஒரு ஆக்டிவிட்டீ வேணும்',
  dropHereToAdd: '\u2b07 ஒரு ஆக்டிவிட்டீயை இங்க விடுங்க',
  suggestedActivitiesTitle: '💡 சொல்லப்பட்ட ஆக்டிவிட்டீஸ்',
  pickedForName: '{name}-க்காக தேர்ந்தெடுக்கப்பட்டது',
  agePart: ', வயசு {age}',
  createCustomBtn: '➕ உங்க சொந்த ஆக்டிவிட்டீயை உருவாக்கு',
  cancelX: '✕ ரத்து செய்',
  activityNameLabel: 'ஆக்டிவிட்டீ பேரு',
  activityNamePlaceholder: 'எ.கா. மீனுக்கு சாப்பாடு போடு',
  categoryLabel: 'வகை',
  hintOptionalLabel: 'ஹிண்ட் (வேணும்ன்னா)',
  hintPlaceholder: 'ஆக்டிவிட்டீ பேருக்கு கீழே காட்டப்படும்',
  saveCustomActivityBtn: 'ஆக்டிவிட்டீயை சேவ் செய்',
  customNote: 'இது உங்க குடும்பத்துக்கே சேவ் ஆகும் — கீழே Recommended-ல காட்டும். இடது பக்கத்து லிஸ்ட்டுக்குள் இழுத்துட்டு போங்க (அல்லது ＋ அழுத்துங்க) {name}-க்கு சேர்க்க, வேற குழந்தைக்கும் இதே மாதிரி பண்ணலாம்.',
  filterCategoriesAria: 'வகை வாரியா பிளவு செய்',
  allFilter: 'எல்லாம்',
  dropToRemove: '{name} லிஸ்ட்டுல இருந்து நீக்க இங்க விடுங்க',
  nothingLeftHere: 'இங்க ஒண்ணும் மிச்சம் இல்ல — எல்லாமே {name} லிஸ்ட்டுல இருக்கு.',
  recommendedFor: '{name}-க்கு நல்லது',
  noMoreRecommendations: 'இன்னும் பரிந்துரை இல்ல — கீழே வேற ஐடியாக்கள பாருங்க.',
  otherIdeas: 'வேற ஐடியாக்கள் ({n}) — {name}-ஓட வயசு/கிளாஸுக்கு வேற',
  giveItAName: 'ஒரு பேரு வையுங்க.',
  rewardMustBeNumber: 'பரிசு 0 அல்லது அதுக்கு மேல ஒரு நம்பராத்தான் இருக்கணும்.',
  removeActivityConfirm: '"{label}"-ஐ {name} லிஸ்ட்டுல இருந்து நீக்கணுமா? முன்னாடி ஹிஸ்டரி அப்படியே இருக்கும்.',
  aChildNeedsOneActivity: 'ஒரு குழந்தைக்கு குறைந்தது ஒரு ஆக்டிவிட்டீ வேணும்.',
  suggestedWord: 'பரிந்துரை',
  addActivityAria: '{label}-ஐ சேரு',
  removeActivityAria: '{label}-ஐ நீக்கு',
  onTimeByWord: 'சரியான நேரம்',
  showButtonAfterWord: 'இந்த நேரத்துக்கு அப்புறம் காட்டு',
  gradeCommaPrefix: ', {grade}',

  childrenTitle: '👨\u200d👩\u200d👧 குழந்தைகள்',
  manageChildrenNote2: 'குழந்தையை சேருங்க, அல்லது பேரு/வயசு/கிளாஸை மாத்துங்க. வயசும் கிளாஸும் தான் எந்த ஆக்டிவிட்டீ நல்லது-ன்னு சொல்லும்.',
  manageChildrenBtn: 'குழந்தைகளை மேனேஜ் செய்',
  rewardsTitle: '💰 பரிசுகள்',
  currencyLabel: 'நாணயம்',
  defaultRewardPerActivity: 'ஆக்டிவிட்டீக்கு டீஃபால்ட் பரிசு',
  defaultRewardHelp: 'எந்த ஆக்டிவிட்டீக்கு நீங்க தனியா பரிசு வைக்கலையோ அதுக்கு இது பயன்படும் (Activities டேப்).',
  penaltyForRejected: 'ரிஜெக்ட் பண்ணும் கொயினுக்கான பெனால்டி',
  penaltyHelp: 'நீங்க ஒரு கொயினை ரிஜெக்ட் பண்ணும்போது இது பிடிக்கப்படும்; முழுசா கட்டற வரைக்கும் தொடரும்.',
  parentCodeTitle: '🔐 பெற்றோர் கோட்',
  parentCodeHasOne: 'இந்த கோட் தான் நாள் முடிவு, ரீசெட், இந்த பெற்றோர் பக்கத்தை குழந்தைகளிடம் இருந்து பாதுகாக்கும்.',
  parentCodeNone: 'இன்னும் பெற்றோர் கோட் வைக்கல — குழந்தைகள் இதை திறக்காம இருக்க ஒண்ணு வையுங்க.',
  newParentCode: 'புது பெற்றோர் கோட்',
  saveCodeBtn: 'கோட்டை சேவ் செய்',
  codeTooShort: 'குறைந்தது 4 எழுத்துகள் வையுங்க.',
  codeUpdated: 'பெற்றோர் கோட் மாத்தியாச்சு.',
  liveSyncOn: '☁️ சின்க் ஆன் ஆயிருக்கு.',
  liveSyncExplain: '{email}-ல் லாகின் பண்ண எல்லா டிவைஸிலும் இதே குழந்தைகளும் ஹிஸ்டரியும் இருக்கும். கீழே இருக்கிற பேக்அப் இன்னொரு பாதுகாப்பு காபி.',
  thisAccountWord: 'இந்த அக்கவுன்ட்',
  localDevModeTitle: '💾 லோக்கல் டெவ் மோட்.',
  localDevExplain: 'இது localhost-ல ரன் ஆகுதுனால இங்க ஒண்ணும் க்ளவுடுக்கு போகாது, அக்கவுன்ட் வேணாம் — டேட்டா இந்த பிரௌசர்ல மட்டும் இருக்கும்.',
  notConnectedTitle: '⚠️ இப்போ கனெக்ட் ஆகல.',
  notConnectedExplain: 'மாற்றங்கள் இந்த டிவைஸ்ல சேவ் ஆகி, திரும்ப கனெக்ட் ஆனதும் சின்க் ஆகும். அதுவரைக்கும் பேக்அப் வைத்து டேட்டாவை நீங்களே கொண்டு போகலாம்.',
  cloudStorageUsed: 'க்ளவுட் ஸ்டோரேஜ்: சுமார் {used} KB, ஒரு அக்கவுன்ட்டுக்கு {limit} KB வரைக்கும்.',
  gettingFull: ' நிறைஞ்சிடுச்சு — இப்பவே பேக்அப் எடுங்க.',
  downloadBackupBtn: '⬇️ பேக்அப் டவுன்லோட் செய்',
  restoreBackupBtn: '⬆️ பேக்அப்ல இருந்து திரும்ப கொண்டுவா',
  backupHint: 'இந்த ஆப்ஸோட பழைய வெர்ஷன் பேக்அப் ஃபைலையும் இது இம்போர்ட் பண்ணும்.',
  accountTitle: '👤 அக்கவுன்ட்',
  signedInAs: '{email} ஆக லாகின் ஆயிருக்கீங்க',
  signOutDeviceBtn: '🚪 இந்த டிவைஸ்ல இருந்து சைன் அவுட்',

  enterPasscode: 'பாஸ்கோடை போடுங்க',
  incorrectPasscode: 'பாஸ்கோட் தப்பு. மறுபடியும் முயற்சி செய்யுங்க.',

  parentPasscodeRequired: 'பெற்றோர் பாஸ்கோட் வேணும்',
  adminPasscodeRequired: 'அட்மின் பாஸ்கோட் வேணும்',
  msgExportBackup: 'உங்க குழந்தைகள் எல்லாரோட டேட்டாவையும் பேக்அப் டவுன்லோட் செய்யுங்க.',
  msgImportBackup: 'அடுத்து தேர்ந்தெடுக்கிற பேக்அப் ஃபைலை வெச்சு உங்க குழந்தைகள் டேட்டாவை மாத்துங்க.',
  msgReviewCoins: 'லாக் பண்றதுக்கு முன்னாடி {name}-ஓட இன்னைக்கிய கொயின்களை பாருங்க.',
  msgResetToday: '{name}-க்கு இன்னைக்கிய டெஸ்ட் பண்ண ரீசெட் பண்ணணுமா (லாக் ஆயிருந்தாலும்)?',
  msgOpenParentArea: 'பெற்றோர் பக்கத்தை திற (முன்னேற்றம், ஆக்டிவிட்டீஸ் & செட்டிங்ஸ்).',

  noOlderData: 'இம்போர்ட் பண்ண பழைய டேட்டா எதுவும் கெடைக்கல.',
  importLegacyConfirm: 'பழைய ஷேர்டு டேட்டாவில் இருந்து {count} குழந்தைய/குழந்தைகளை இந்த அக்கவுன்ட்டுக்கு இம்போர்ட் பண்ணணுமா?',
  importedLegacySuccess: 'இம்போர்ட் ஆச்சு! உங்க குழந்தைகள் இப்போ இங்க இருக்காங்க — வயசு/கிளாஸை பெற்றோர் டேப்ல மாத்தலாம்.',
  legacyImportFailed: 'பழைய டேட்டாவை படிக்க முடியல. அது இல்லாம இருக்கலாம், அல்லது செக்யூரிட்டி ரூல்ஸ் இப்போ அனுமதிக்கலை — பதிலா பேக்அப் ஃபைலை இம்போர்ட் செய்து பாருங்க (பெற்றோர் டேப் \u2192 செட்டிங்ஸ் \u2192 இம்போர்ட்).',
  importConfirm: 'இந்த அக்கவுன்ட்டோட குழந்தைகளும் ஹிஸ்டரியும் அந்த ஃபைல்ல இருக்கிறதா மாத்தணுமா?',
  importSuccess: 'பேக்அப் இம்போர்ட் ஆச்சு! உங்க அக்கவுன்ட் இப்போ அந்த பேக்அப் டேட்டாவை காட்டுது.',
  importFailed: 'அந்த ஃபைலை படிக்க முடியல — இது Kids Productivity Tracker-ஓட .json பேக்அப் ஃபைலா-ன்னு பாருங்க.',
  resetWeekConfirmWithDebt: '{name}-க்கு எல்லா பக்கெட்டையும் காலி பண்ணணுமா? இந்த வாரத்து {cur}{total}-ல {cur}{min} பெனால்டிக்கு போகும், {cur}{payout} கொடுக்கப்படும்.',
  resetWeekConfirmNoDebt: '{name}-க்கு இந்த வாரத்து {cur}{total} கொடுத்துட்டு எல்லா பக்கெட்டையும் காலி பண்ணணுமா?',

  bannerKicker: '🕌 தீன் \u00a0\u00b7\u00a0 📚 படிப்பு \u00a0\u00b7\u00a0 🌳 விளையாட்டு',
  bannerSubtitle: 'தினசரி பழக்கங்கள், தொழுகை & ஒழுக்க டிராக்கர்',
}

// ---------------------------------------------------------------------------
// Malayalam — simple, everyday spoken style (not classical/literary)
// ---------------------------------------------------------------------------
const ML = {
  appTitle: 'കിഡ്‌സ് പ്രൊഡക്ടിവിറ്റി ട്രാക്കർ',
  loading: 'ലോഡ് ആകുന്നു…',
  cancel: 'ക്യാൻസൽ',
  save: 'സേവ് ചെയ്യുക',
  done: 'കഴിഞ്ഞു',
  doneCheckmark: 'കഴിഞ്ഞു ✅',
  edit: 'എഡിറ്റ് ചെയ്യുക',
  remove: 'നീക്കം ചെയ്യുക',
  confirm: 'ഓക്കെ',
  language: 'ഭാഷ',

  authWelcomeBack: 'വീണ്ടും സ്വാഗതം',
  authCreateAccount: 'നിങ്ങളുടെ ഫാമിലി അക്കൗണ്ട് ഉണ്ടാക്കൂ',
  authResetPassword: 'പാസ്‌വേഡ് മാറ്റുക',
  emailLabel: 'ഇമെയിൽ',
  passwordLabel: 'പാസ്‌വേഡ്',
  loggingIn: 'ലോഗിൻ ആകുന്നു…',
  logIn: 'ലോഗിൻ',
  forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?',
  newHere: 'പുതിയ ആളാണോ?',
  createFamilyAccount: 'ഫാമിലി അക്കൗണ്ട് ഉണ്ടാക്കൂ',
  yourName: 'നിങ്ങളുടെ പേര്',
  confirmPassword: 'പാസ്‌വേഡ് ഒന്നുകൂടി ടൈപ്പ് ചെയ്യുക',
  parentCodeLabel: 'പേരന്റ് കോഡ് (ഇത് കുട്ടികൾ കാണില്ല)',
  parentCodePlaceholder: 'ഉദാ. 4+ അക്ക കോഡ്',
  currencyForRewards: 'റിവാർഡിനുള്ള കറൻസി',
  creatingAccount: 'അക്കൗണ്ട് ഉണ്ടാക്കുന്നു…',
  createAccount: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
  alreadyHaveAccount: 'അക്കൗണ്ട് ഉണ്ടോ നേരത്തെ?',
  sendingReset: 'അയക്കുന്നു…',
  sendResetEmail: 'റീസെറ്റ് മെയിൽ അയക്കുക',
  backToLogin: 'ലോഗിനിലേക്ക് തിരിച്ച് പോകുക',
  authErrEmailInUse: 'ഈ ഇമെയിലിൽ നേരത്തെ ഒരു അക്കൗണ്ട് ഉണ്ട് — ലോഗിൻ ചെയ്തു നോക്കൂ.',
  authErrInvalidEmail: 'ഇത് ശരിയായ ഇമെയിൽ അല്ല.',
  authErrWeakPassword: 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരമെങ്കിലും വേണം.',
  authErrUserNotFound: 'ഈ ഇമെയിലിന് അക്കൗണ്ട് ഇല്ല — പുതുതായി സൈൻ അപ്പ് ചെയ്യണോ?',
  authErrWrongPassword: 'പാസ്‌വേഡ് തെറ്റാണ്. വീണ്ടും നോക്കൂ, അല്ലെങ്കിൽ താഴെ റീസെറ്റ് ചെയ്യൂ.',
  authErrInvalidCredential: 'ഇമെയിലോ പാസ്‌വേഡോ ശരിയല്ല.',
  authErrTooManyRequests: 'പല തവണ ശ്രമിച്ചു — കുറച്ച് കഴിഞ്ഞ് വീണ്ടും നോക്കൂ.',
  authErrGeneric: 'എന്തോ പിഴച്ചു. വീണ്ടും ശ്രമിക്കൂ.',
  authErrEnterName: 'ദയവായി നിങ്ങളുടെ പേര് ഇടുക.',
  authErrParentCodeShort: 'കുറഞ്ഞത് 4 അക്ഷരമുള്ള പേരന്റ് കോഡ് ഒന്ന് തിരഞ്ഞെടുക്കൂ.',
  authErrPasswordShort: 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരമെങ്കിലും വേണം.',
  authErrPasswordMismatch: 'രണ്ട് പാസ്‌വേഡും ഒന്നല്ല.',
  authErrEnterEmailFirst: 'ആദ്യം നിങ്ങളുടെ അക്കൗണ്ട് ഇമെയിൽ ഇടുക.',
  authResetSent: 'പാസ്‌വേഡ് റീസെറ്റ് മെയിൽ അയച്ചു — ഇൻബോക്സ് നോക്കൂ.',

  assalamu: 'അസ്സലാമു അലൈക്കും!',
  whoAreYou: 'ആരാ നിങ്ങൾ?',
  passwordHint: 'പാസ്‌വേഡ് (ഹിന്റ്: നിങ്ങളുടെ പേര് തന്നെ!)',
  enterPasswordFor: '{name}-ന്റെ പാസ്‌വേഡ് ഇടുക',
  wrongPassword: 'അത് ശരിയല്ല! ഒന്നുകൂടി നോക്കൂ!',
  welcomeNameExclaim: 'സ്വാഗതം, {name}!',
  welcomeMessage: 'ഇന്ന് നല്ലൊരു ദിവസമാക്കാം — നമസ്കാരം, പഠനം, കളി.',

  welcomeExclaim: 'സ്വാഗതം!',
  addFirstChild: 'ആദ്യം നിങ്ങളുടെ ആദ്യത്തെ കുട്ടിയെ ചേർക്കൂ.',
  usedOldVersion: 'ഈ ആപ്പിന്റെ പഴയ വേർഷൻ മുമ്പ് ഉപയോഗിച്ചിരുന്നോ?',
  importThatData: 'ആ ഡാറ്റ കൊണ്ടുവരൂ',
  signOut: 'സൈൻ ഔട്ട്',

  manageChildrenTitle: '👨\u200d👩\u200d👧 കുട്ടികളെ മാനേജ് ചെയ്യുക',
  noChildrenYet: 'ഇതുവരെ കുട്ടികൾ ഇല്ല — ആദ്യത്തെ കുട്ടിയെ താഴെ ചേർക്കൂ.',
  namePlaceholder: 'പേര്',
  agePlaceholder: 'വയസ്സ്',
  gradePlaceholder: 'ക്ലാസ് (ഉദാ. 5th Grade)',
  noGradeSet: 'ക്ലാസ് ഇട്ടിട്ടില്ല',
  ageSuffix: ' · വയസ്സ് {age}',
  addChildBtn: '+ ഒരു കുട്ടിയെ ചേർക്കുക',
  addChildSubmit: 'കുട്ടിയെ ചേർക്കുക',
  manageChildrenNote:
    'പുതിയ ഓരോ കുട്ടിക്കും ഡിഫോൾട്ട് ആക്ടിവിറ്റികൾ എല്ലാം കിട്ടും. ഓരോ കുട്ടിക്കും ഏതൊക്കെ ആക്ടിവിറ്റി വേണമെന്ന് Activities ടാബിൽ നിന്ന് തിരഞ്ഞെടുക്കാം.',
  removeChildConfirm: '{name}-യെ നീക്കണോ? ഇതോടെ അവരുടെ സേവ് ചെയ്ത ഹിസ്റ്ററി മുഴുവൻ പോകും.',

  tabToday: 'ഇന്ന്',
  tabWeeks: 'ആഴ്ചകൾ',
  tabParent: '👨\u200d👩\u200d👧 പേരന്റ്',
  notYouLogout: '👋 {name}, ഇത് നിങ്ങളല്ലേ?',
  logOutTitle: 'ലോഗ് ഔട്ട്',

  cloudSynced: '☁️ സിങ്ക് ആയി — എല്ലാ ഡിവൈസിലും ഇതേ ഡാറ്റ',
  cloudConnecting: '🔄 ഡാറ്റ കണക്റ്റ് ചെയ്യുന്നു…',
  cloudOffline: '📴 ഓഫ്‌ലൈൻ — ഇപ്പോൾ ഈ ഡിവൈസിൽ മാത്രം സേവ് ആകുന്നു',
  cloudLocal: '💾 ഈ ഡിവൈസിൽ മാത്രം സേവ് ആകുന്നു (ഡെവ് മോഡ്)',

  parentSectionsAria: 'പേരന്റ് വിഭാഗങ്ങൾ',
  parentSectionOverview: '📊 പുരോഗതി',
  parentSectionActivities: '🎯 ആക്ടിവിറ്റികൾ',
  parentSectionSettings: '⚙️ സെറ്റിംഗ്സ്',
  lockShort: '🔒 ലോക്ക്',
  activitiesTabNote:
    'മുകളിലെ ടാബിൽ ഒരു കുട്ടിയെ തിരഞ്ഞെടുക്കൂ, എന്നിട്ട് അവരുടെ ലിസ്റ്റ് ഉണ്ടാക്കൂ. ഓരോ കുട്ടിക്കും വ്യത്യസ്ത ആക്ടിവിറ്റികളും വ്യത്യസ്ത റിവാർഡും വെക്കാം.',

  todayLabel: 'ഇന്ന്',
  thisWeeksBuckets: 'ഈ ആഴ്ചത്തെ ബക്കറ്റ്',
  carriedPenalty: 'കൊടുക്കാനുള്ള പെനാൽറ്റി',
  payAndEmpty: '💰 പൈസ കൊടുത്ത് ബക്കറ്റ് കാലിയാക്കുക',
  todayLocked: '🔒 ഇന്നത്തെ ദിവസം ലോക്ക് ആയി. നല്ല പണി — നാളെ പുതിയ ദിവസമായി വരൂ.',
  verseTranslation: '\u201cതീർച്ചയായും നിങ്ങൾ പ്രവർത്തിച്ചുകൊണ്ടിരുന്നതെല്ലാം അല്ലാഹു നന്നായി അറിയുന്നവനാകുന്നു.\u201d',
  verseReference: 'ഖുർആൻ (സൂറത്ത് അന്നഹ്ൽ, ആയത്ത് 28)',
  dayLocked: 'ദിവസം ലോക്ക് ആയി',
  lockDayFinish: 'ദിവസം ലോക്ക് ചെയ്ത് തീർക്കുക',
  footerNote: 'ഓരോ ആക്ടിവിറ്റിക്കും അതിന്റേതായ റിവാർഡ് കാണിക്കുന്നു (ഇത് പേരന്റ് ആണ് വെക്കുന്നത്). ദിവസം ലോക്ക് ചെയ്യുമ്പോൾ ബാക്കിയുള്ളത് മിസ് ആയി (ബക്കറ്റ് കാലി) മാറും.',
  resetTodayBtn: '🔧 ഇന്നത്തേത് റീസെറ്റ് ചെയ്യുക',
  undoConfirm: '"{label}" തിരിച്ചെടുക്കണോ? കോയിൻ തിരിച്ച് എടുക്കും.',
  oopsUndo: '↩️ അയ്യോ, തിരിച്ചെടുക്കുക',
  scrollToTopAria: 'മുകളിലേക്ക് പോകുക',

  rewardTitle: 'ഈ ആക്ടിവിറ്റിക്കുള്ള റിവാർഡ്',
  unlocksAt: '🔒 {time}-ന് തുറക്കും',
  completedOnTime: 'സമയത്ത് ചെയ്തോ?',
  pushNow: 'ഇപ്പോൾ ചെയ്യുക',
  deadlinePrefix: 'അവസാന സമയം: {label}',
  graceSuffix: ' + {min} മിനിറ്റ് കൂടുതൽ',
  lateCreditsSuffix: ' · "{label}" ആണെങ്കിൽ {cur}{amt}{until}',
  untilSuffix: ' {time} വരെ',
  coinApproved: 'കോയിൻ അംഗീകരിച്ചു',
  coinEarned: 'കോയിൻ കിട്ടി',
  pendingParentReview: 'പേരന്റ് നോക്കാനുണ്ട്',
  coinRejected: 'പേരന്റ് കോയിൻ വേണ്ട എന്ന് പറഞ്ഞു',
  missedLabel: 'മിസ് ആയി',
  lockedLabel: 'ലോക്ക് ആണ്',
  dayClosed: 'ദിവസം തീർന്നു',
  readyLabel: 'റെഡി',
  notYet: 'ഇതുവരെ ഇല്ല',
  noDataWord: 'ഡാറ്റ ഇല്ല',
  fromTime: ' · {time} മുതൽ',

  dateLabel: 'തീയതി',
  totalLabel: 'ആകെ',
  weekN: '{n}-ാം ആഴ്ച',
  weekNTotal: '{n}-ാം ആഴ്ചയുടെ ആകെ',

  reviewCoinsTitle: '{name}-ന്റെ കോയിനുകൾ നോക്കുക',
  noCoinsClaimed: 'ഇന്ന് ആരും കോയിൻ വാങ്ങിയിട്ടില്ല — നോക്കാൻ ഒന്നുമില്ല.',
  reviewExplain: 'ഇന്ന് വാങ്ങിയ ഓരോ കോയിനും അംഗീകരിക്കൂ അല്ലെങ്കിൽ വേണ്ട എന്ന് പറയൂ. വേണ്ട എന്ന് പറഞ്ഞാൽ ആ കോയിൻ പോകും, {cur}{amount} പെനാൽറ്റിയും കൂടും.',
  markedDone: 'ചെയ്തു എന്ന് മാർക്ക് ചെയ്തു',
  approvedBadge: '✅ അംഗീകരിച്ചു',
  rejectedBadge: '❌ വേണ്ട എന്ന് പറഞ്ഞു',
  approveBtn: 'അംഗീകരിക്കുക',
  rejectBtn: 'വേണ്ട',
  unreviewedNote: 'നോക്കാത്തവയെല്ലാം അംഗീകരിച്ചതായി കണക്കാക്കി കോയിൻ നിലനിൽക്കും.',
  reviewLater: 'പിന്നെ നോക്കാം',
  finishLockDay: 'തീർത്ത് ദിവസം ലോക്ക് ചെയ്യുക',

  thisWeekAllChildren: '📊 ഈ ആഴ്ച — എല്ലാ കുട്ടികളും',
  lockParentView: '🔒 പേരന്റ് പേജ് ലോക്ക് ചെയ്യുക',
  thisWeekLabel: 'ഈ ആഴ്ച',
  coinsLabel: 'കോയിനുകൾ',
  owedLabel: 'കൊടുക്കാനുള്ളത്',
  parentPanelResetNote: '"പൈസ കൊടുത്ത് ബക്കറ്റ് കാലിയാക്കുക" ചെയ്യുമ്പോൾ ഇത് റീസെറ്റ് ആകും. ദിവസം തോറുമുള്ള ഹിസ്റ്ററിക്ക് Weeks ടാബ് നോക്കൂ.',

  rewardAria: 'റിവാർഡ്',
  activitiesActiveLine: '{n} ആക്ടീവ് · ദിവസം {cur}{amount} വരെ',
  dragHint: 'വലതുവശത്ത് നിന്ന് ഒരു ഐഡിയ ഈ ബോക്സിലേക്ക് വലിച്ചിടൂ (അല്ലെങ്കിൽ ＋ അമർത്തൂ). ഓരോ ആക്ടിവിറ്റിക്കും റിവാർഡ് വെക്കൂ — അതാണ് {name}-ന് ഒരു കോയിന്റെ വില.',
  rewardLabel: 'റിവാർഡ്',
  defaultReset: '\u21ba ഡിഫോൾട്ട്',
  onTimeByAll: 'സമയത്ത് (എല്ലാ കുട്ടികൾക്കും)',
  showButtonAfterAll: 'ഈ സമയം കഴിഞ്ഞ് കാണിക്കുക (എല്ലാ കുട്ടികൾക്കും)',
  lateWindowNote: 'ഇതിന് ശേഷം +30 മിനിറ്റ് വൈകി ചെയ്യാം',
  removeFromChildTitle: 'ഈ കുട്ടിയിൽ നിന്ന് നീക്കം ചെയ്യുക',
  needOneActivityTitle: 'ഒരു കുട്ടിക്ക് കുറഞ്ഞത് ഒരു ആക്ടിവിറ്റി വേണം',
  dropHereToAdd: '\u2b07 ഒരു ആക്ടിവിറ്റി ഇവിടെ ഇടൂ',
  suggestedActivitiesTitle: '💡 നിർദേശിച്ച ആക്ടിവിറ്റികൾ',
  pickedForName: '{name}-ന് വേണ്ടി തിരഞ്ഞെടുത്തത്',
  agePart: ', വയസ്സ് {age}',
  createCustomBtn: '➕ സ്വന്തമായി ഒരു ആക്ടിവിറ്റി ഉണ്ടാക്കുക',
  cancelX: '✕ ക്യാൻസൽ',
  activityNameLabel: 'ആക്ടിവിറ്റിയുടെ പേര്',
  activityNamePlaceholder: 'ഉദാ. മീനിന് തീറ്റ കൊടുക്കുക',
  categoryLabel: 'വിഭാഗം',
  hintOptionalLabel: 'ഹിന്റ് (വേണമെങ്കിൽ)',
  hintPlaceholder: 'ആക്ടിവിറ്റിയുടെ പേരിന് താഴെ കാണിക്കും',
  saveCustomActivityBtn: 'ആക്ടിവിറ്റി സേവ് ചെയ്യുക',
  customNote: 'ഇത് നിങ്ങളുടെ ഫാമിലിക്ക് മുഴുവൻ സേവ് ആകും — താഴെ Recommended-ൽ കാണാം. {name}-ന് ചേർക്കാൻ ഇടത്തെ ലിസ്റ്റിലേക്ക് വലിച്ചിടൂ (അല്ലെങ്കിൽ ＋ അമർത്തൂ), വേറെ കുട്ടികൾക്കും ഇതുപോലെ ചെയ്യാം.',
  filterCategoriesAria: 'വിഭാഗം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക',
  allFilter: 'എല്ലാം',
  dropToRemove: '{name}-ന്റെ ലിസ്റ്റിൽ നിന്ന് നീക്കാൻ ഇവിടെ ഇടൂ',
  nothingLeftHere: 'ഇവിടെ ഒന്നും ബാക്കിയില്ല — എല്ലാം {name}-ന്റെ ലിസ്റ്റിൽ ഉണ്ട്.',
  recommendedFor: '{name}-ന് നല്ലത്',
  noMoreRecommendations: 'ഇനി നിർദേശങ്ങൾ ഇല്ല — താഴെ വേറെ ഐഡിയകൾ നോക്കൂ.',
  otherIdeas: 'വേറെ ഐഡിയകൾ ({n}) — {name}-ന്റെ വയസ്സ്/ക്ലാസിന് ചേരാത്തത്',
  giveItAName: 'ഒരു പേര് കൊടുക്കൂ.',
  rewardMustBeNumber: 'റിവാർഡ് 0-ഓ അതിൽ കൂടുതലോ ഉള്ള ഒരു നമ്പർ ആയിരിക്കണം.',
  removeActivityConfirm: '"{label}" {name}-ന്റെ ലിസ്റ്റിൽ നിന്ന് നീക്കണോ? പഴയ ഹിസ്റ്ററി അതുപോലെ ഉണ്ടാകും.',
  aChildNeedsOneActivity: 'ഒരു കുട്ടിക്ക് കുറഞ്ഞത് ഒരു ആക്ടിവിറ്റി വേണം.',
  suggestedWord: 'നിർദേശം',
  addActivityAria: '{label} ചേർക്കുക',
  removeActivityAria: '{label} നീക്കം ചെയ്യുക',
  onTimeByWord: 'സമയത്ത്',
  showButtonAfterWord: 'ഈ സമയം കഴിഞ്ഞ് കാണിക്കുക',
  gradeCommaPrefix: ', {grade}',

  childrenTitle: '👨\u200d👩\u200d👧 കുട്ടികൾ',
  manageChildrenNote2: 'ഒരു കുട്ടിയെ ചേർക്കൂ, അല്ലെങ്കിൽ പേരും വയസ്സും ക്ലാസും മാറ്റൂ. വയസ്സും ക്ലാസും അനുസരിച്ചാണ് ഏത് ആക്ടിവിറ്റി നല്ലതെന്ന് നിർദേശിക്കുന്നത്.',
  manageChildrenBtn: 'കുട്ടികളെ മാനേജ് ചെയ്യുക',
  rewardsTitle: '💰 റിവാർഡുകൾ',
  currencyLabel: 'കറൻസി',
  defaultRewardPerActivity: 'ഓരോ ആക്ടിവിറ്റിക്കുമുള്ള ഡിഫോൾട്ട് റിവാർഡ്',
  defaultRewardHelp: 'പ്രത്യേകം റിവാർഡ് വെക്കാത്ത ആക്ടിവിറ്റികൾക്ക് ഇത് ഉപയോഗിക്കും (Activities ടാബ്).',
  penaltyForRejected: 'വേണ്ട എന്ന് പറഞ്ഞ കോയിന്റെ പെനാൽറ്റി',
  penaltyHelp: 'നിങ്ങൾ ഒരു കോയിൻ വേണ്ട എന്ന് പറയുമ്പോൾ ഇത് തിരിച്ചെടുക്കും; മുഴുവൻ കൊടുത്തു തീരുന്നത് വരെ തുടരും.',
  parentCodeTitle: '🔐 പേരന്റ് കോഡ്',
  parentCodeHasOne: 'ഈ കോഡ് ആണ് ദിവസാവസാന റിവ്യൂ, റീസെറ്റ്, ഈ പേരന്റ് ഭാഗം എന്നിവ കുട്ടികളിൽ നിന്ന് സംരക്ഷിക്കുന്നത്.',
  parentCodeNone: 'ഇതുവരെ പേരന്റ് കോഡ് വെച്ചിട്ടില്ല — കുട്ടികൾ ഇത് തുറക്കാതിരിക്കാൻ ഒന്ന് വെക്കൂ.',
  newParentCode: 'പുതിയ പേരന്റ് കോഡ്',
  saveCodeBtn: 'കോഡ് സേവ് ചെയ്യുക',
  codeTooShort: 'കുറഞ്ഞത് 4 അക്ഷരമെങ്കിലും ഉപയോഗിക്കൂ.',
  codeUpdated: 'പേരന്റ് കോഡ് മാറ്റി.',
  liveSyncOn: '☁️ ലൈവ് സിങ്ക് ഓൺ ആണ്.',
  liveSyncExplain: '{email}-ൽ ലോഗിൻ ചെയ്ത എല്ലാ ഡിവൈസിലും ഇതേ കുട്ടികളും ഹിസ്റ്ററിയും കാണും. താഴെയുള്ള ബാക്കപ്പ് ഒരു എക്സ്ട്രാ സേഫ്റ്റി കോപ്പി ആണ്.',
  thisAccountWord: 'ഈ അക്കൗണ്ട്',
  localDevModeTitle: '💾 ലോക്കൽ ഡെവ് മോഡ്.',
  localDevExplain: 'ഇത് localhost-ൽ ആയതിനാൽ ഇവിടെ ഒന്നും ക്ലൗഡിലേക്ക് പോകില്ല, അക്കൗണ്ട് വേണ്ട — ഡാറ്റ ഈ ബ്രൗസറിൽ മാത്രം.',
  notConnectedTitle: '⚠️ ഇപ്പോൾ കണക്റ്റ് അല്ല.',
  notConnectedExplain: 'മാറ്റങ്ങൾ ഈ ഡിവൈസിൽ സേവ് ആയി, വീണ്ടും കണക്റ്റ് ആകുമ്പോൾ സിങ്ക് ആകും. അതുവരെ ബാക്കപ്പ് വഴി സ്വയം ഡാറ്റ കൊണ്ടുപോകാം.',
  cloudStorageUsed: 'ക്ലൗഡ് സ്റ്റോറേജ്: ഏകദേശം {used} KB, ഒരു അക്കൗണ്ടിന് {limit} KB വരെ.',
  gettingFull: ' നിറയാറായി — ഇപ്പോൾ ഒരു ബാക്കപ്പ് എടുക്കൂ.',
  downloadBackupBtn: '⬇️ ബാക്കപ്പ് ഡൗൺലോഡ് ചെയ്യുക',
  restoreBackupBtn: '⬆️ ബാക്കപ്പിൽ നിന്ന് തിരിച്ചെടുക്കുക',
  backupHint: 'ഈ ആപ്പിന്റെ പഴയ വേർഷന്റെ ബാക്കപ്പ് ഫയലും ഇത് ഇംപോർട്ട് ചെയ്യും.',
  accountTitle: '👤 അക്കൗണ്ട്',
  signedInAs: '{email} ആയി ലോഗിൻ ചെയ്തിരിക്കുന്നു',
  signOutDeviceBtn: '🚪 ഈ ഡിവൈസിൽ നിന്ന് സൈൻ ഔട്ട്',

  enterPasscode: 'പാസ്‌കോഡ് ഇടുക',
  incorrectPasscode: 'പാസ്‌കോഡ് തെറ്റാണ്. വീണ്ടും നോക്കൂ.',

  parentPasscodeRequired: 'പേരന്റ് പാസ്‌കോഡ് വേണം',
  adminPasscodeRequired: 'അഡ്മിൻ പാസ്‌കോഡ് വേണം',
  msgExportBackup: 'നിങ്ങളുടെ എല്ലാ കുട്ടികളുടെയും ഡാറ്റ ബാക്കപ്പ് ഡൗൺലോഡ് ചെയ്യുക.',
  msgImportBackup: 'അടുത്തതായി തിരഞ്ഞെടുക്കുന്ന ബാക്കപ്പ് ഫയൽ വെച്ച് കുട്ടികളുടെ ഡാറ്റ മാറ്റുക.',
  msgReviewCoins: 'ലോക്ക് ചെയ്യുന്നതിന് മുൻപ് {name}-ന്റെ ഇന്നത്തെ കോയിനുകൾ നോക്കുക.',
  msgResetToday: '{name}-ന് വേണ്ടി ഇന്നത്തെ ആക്ടിവിറ്റികൾ ടെസ്റ്റിന് വേണ്ടി റീസെറ്റ് ചെയ്യണോ (ലോക്ക് ആയാലും)?',
  msgOpenParentArea: 'പേരന്റ് ഭാഗം തുറക്കുക (പുരോഗതി, ആക്ടിവിറ്റികൾ & സെറ്റിംഗ്സ്).',

  noOlderData: 'ഇംപോർട്ട് ചെയ്യാൻ പഴയ ഡാറ്റ ഒന്നും കിട്ടിയില്ല.',
  importLegacyConfirm: 'പഴയ ഷെയർഡ് ഡാറ്റയിൽ നിന്ന് {count} കുട്ടി/കുട്ടികളെ ഈ അക്കൗണ്ടിലേക്ക് ഇംപോർട്ട് ചെയ്യണോ?',
  importedLegacySuccess: 'ഇംപോർട്ട് ആയി! നിങ്ങളുടെ കുട്ടികൾ ഇപ്പോൾ ഇവിടെ ഉണ്ട് — വയസ്സും ക്ലാസും പേരന്റ് ടാബിൽ നിന്ന് മാറ്റാം.',
  legacyImportFailed: 'പഴയ ഡാറ്റ വായിക്കാൻ കഴിഞ്ഞില്ല. അത് ഇല്ലായിരിക്കാം, അല്ലെങ്കിൽ സെക്യൂരിറ്റി റൂൾസ് ഇപ്പോൾ അനുവദിക്കുന്നില്ല — പകരം ഒരു ബാക്കപ്പ് ഫയൽ ഇംപോർട്ട് ചെയ്ത് നോക്കൂ (പേരന്റ് ടാബ് \u2192 സെറ്റിംഗ്സ് \u2192 ഇംപോർട്ട്).',
  importConfirm: 'ഈ അക്കൗണ്ടിലെ കുട്ടികളെയും ഹിസ്റ്ററിയെയും ആ ഫയലിലുള്ളത് കൊണ്ട് മാറ്റണോ?',
  importSuccess: 'ബാക്കപ്പ് ഇംപോർട്ട് ആയി! നിങ്ങളുടെ അക്കൗണ്ട് ഇപ്പോൾ ആ ബാക്കപ്പിന്റെ ഡാറ്റ കാണിക്കുന്നു.',
  importFailed: 'ആ ഫയൽ വായിക്കാൻ കഴിഞ്ഞില്ല — ഇത് Kids Productivity Tracker-ന്റെ .json ബാക്കപ്പ് ഫയൽ ആണോ എന്ന് നോക്കൂ.',
  resetWeekConfirmWithDebt: '{name}-ന് എല്ലാ ബക്കറ്റും കാലിയാക്കണോ? ഈ ആഴ്ചത്തെ {cur}{total}-ൽ {cur}{min} പെനാൽറ്റിക്ക് പോകും, {cur}{payout} കൊടുക്കും.',
  resetWeekConfirmNoDebt: '{name}-ന് ഈ ആഴ്ചത്തെ {cur}{total} കൊടുത്ത് എല്ലാ ബക്കറ്റും കാലിയാക്കണോ?',

  bannerKicker: '🕌 ദീൻ \u00a0\u00b7\u00a0 📚 പഠനം \u00a0\u00b7\u00a0 🌳 കളി',
  bannerSubtitle: 'ദിവസേനയുള്ള ശീലങ്ങൾ, നമസ്കാരം & അച്ചടക്ക ട്രാക്കർ',
}

export const UI = { en: EN, ta: TA, ml: ML }

// ---------------------------------------------------------------------------
// Activity label / hint / buttonLabel translations, by built-in activity id.
// A custom (parent-made) activity has no entry here, so it always falls
// back to whatever the parent typed (see tActivity below) — we can't
// pre-translate text we've never seen.
// ---------------------------------------------------------------------------
const ACTIVITY_TA = {
  fajr: {
    label: 'ஃபஜ்ர் தொழுகை',
    lateLabel: 'தாமதமா வந்தேன் 🐢',
    hint: 'நேரத்துக்குள் "இப்போ பண்ணு" அழுத்தினா முழு பரிசு, அதுக்கு அப்புறம் 30 நிமிஷத்துக்குள் "தாமதமா வந்தேன்" அழுத்தினா கொஞ்சம் குறைவா கிடைக்கும். பெற்றோர் நேரத்தை Activities டேப்ல மாத்தலாம்.',
  },
  quran: { label: 'குர்ஆன் ஓதுதல்', buttonLabel: 'குர்ஆன் ஓதுதல் 📖', hint: 'ஃபஜ்ருக்கு அப்புறம் 15 நிமிஷம்' },
  hadith: { label: 'ஹதீஸ் படிப்பு', buttonLabel: 'முடிந்தது', hint: 'ஒரு ஹதீஸ் அதோட அர்த்தத்தோட படிங்க.' },
  study: { label: 'படிப்பு', buttonLabel: 'படிப்பு 📚', hint: 'ளுஹ்ருக்கு முன்னாடி ஹோம்வொர்க் & பாடம்' },
  dhuhr: { label: 'ளுஹர் தொழுகை', hint: 'ஸ்கூல் நாள்ல ஸ்கூல் முடிச்சு வந்து போடுங்க. ஞாயிறு தொழுகை நேரத்துக்கு. மதியம் 3:45க்கு திறக்கும்.' },
  asr: { label: 'அஸர் தொழுகை', hint: 'ஸ்கூல் நாள்ல ஸ்கூல் முடிச்சு வந்து போடுங்க. ஞாயிறு தொழுகை நேரத்துக்கு. மதியம் 3:45க்கு திறக்கும்.' },
  maghrib: { label: 'மஃரிப் தொழுகை', hint: '4வது தொழுகை. மாலை 6 மணிக்கு திறக்கும்.' },
  isha: { label: 'இஷா தொழுகை', hint: '5வது தொழுகை. இரவு 7:45க்கு திறக்கும்.' },
  mobile: {
    label: 'மொபைல் பார்க்குறது',
    buttonLabel: 'கண்ட்ரோல்ல வெச்சிருந்தேன் 📵',
    hint: 'அனுமதி: அஸருக்கு அப்புறம் மாலை 5:00–5:30 (30 நிமிஷம்), இஷாவுக்கு அப்புறம் இரவு 9:45–10:00 (15 நிமிஷம்). நாள் முடிவுல பெற்றோர் பார்ப்பாங்க.',
  },
  obey: { label: 'பெற்றோக்கு கீழ்ப்படிதல்', buttonLabel: 'ஆமா கேட்டேன்', hint: 'நாள் முடிவுல பெற்றோர் பார்ப்பாங்க.' },
  outdoor: { label: 'வெளியில விளையாடுறது', buttonLabel: 'ஆமா விளையாடினேன் 👍', hint: 'ஸ்கிரீன் இல்லாம வெளியில நேரம். நாள் முடிவுல பெற்றோர் பார்ப்பாங்க.' },

  lib_make_bed: { label: 'படுக்கையை சரி பண்ணுறது', hint: 'ரூமை விட்டு போறதுக்கு முன்னாடி படுக்கையை சரியா பண்ணுங்க.' },
  lib_tidy_room: { label: 'ரூமை சுத்தம் பண்ணுறது', hint: 'பொம்மை, துணி, புத்தகம் எல்லாம் வெச்சு வையுங்க.' },
  lib_set_table: { label: 'மேஜையை தயார் பண்ணுறது', hint: 'சாப்பாட்டுக்கு மேஜை வெக்க, சாப்பிட்டதுக்கு அப்புறம் சுத்தம் பண்ண உதவுங்க.' },
  lib_help_cook: { label: 'சமையலுக்கு உதவுறது', hint: 'சாப்பாடு தயார் பண்ண அல்லது பாத்திரம் கழுவ உதவுங்க.' },
  lib_laundry: { label: 'துணி வேலைக்கு உதவுறது', hint: 'துணிய மடிக்க அல்லது எடுத்து வைக்க உதவுங்க.' },
  lib_trash: { label: 'குப்பையை வெளியில போடுறது', hint: 'குப்பை பை காலி பண்ணி புது பை வையுங்க.' },
  lib_plants: { label: 'செடிக்கு தண்ணீர் ஊத்துறது', hint: 'செடிகளை கவனிச்சுக்கோங்க.' },
  lib_pet: { label: 'வளர்ப்பு பிராணிய பார்த்துக்குறது', hint: 'தீனி, தண்ணீர் அல்லது நடந்துக்கிட்டு போக அழைச்சுக்கிட்டு போங்க.' },

  lib_water: { label: 'தண்ணீர் நல்லா குடிக்குறது', hint: 'நாள் முழுக்க நல்ல அளவு தண்ணீர் குடிங்க.' },
  lib_exercise: { label: '20 நிமிஷம் உடற்பயிற்சி', hint: 'ஓடுறது, சைக்கிள், ஸ்ட்ரெட்ச் அல்லது விளையாட்டு.' },
  lib_sleep: { label: 'நேரத்துக்கு தூங்குறது', hint: 'சொன்ன நேரத்துக்கு படுக்கையில இருக்கணும்.' },
  lib_teeth: { label: 'பல் துலக்குறது (2 தடவை)', hint: 'காலையிலும் இரவிலும்.' },
  lib_veg: { label: 'காய்கறி சாப்பிடுறது', hint: 'பிளேட்ல இருக்கிற காய்கறியை முடிக்கணும்.' },

  lib_read: { label: '20 நிமிஷம் புத்தகம் படிக்குறது', buttonLabel: 'படிச்சாச்சு 📕', hint: 'உங்களுக்கு பிடிச்ச எந்த புத்தகமும்.' },
  lib_math: { label: 'கணக்கு பயிற்சி', buttonLabel: 'பயிற்சி முடிச்சாச்சு ➗', hint: 'சின்ன பயிற்சி கேள்விகள்.' },
  lib_spelling: { label: 'ஸ்பெல்லிங் & வார்த்தைகள்', hint: 'புது வார்த்தைகளை கத்துக்குங்க, பழையதை பார்க்குங்க.' },
  lib_homework_first: { label: 'ஹோம்வொர்க் முடிச்சு விளையாடுறது', hint: 'ஸ்கிரீன் அல்லது விளையாட்டுக்கு முன்னாடி ஹோம்வொர்க் முடிக்கணும்.' },
  lib_journal: { label: 'டைரி எழுதுறது', hint: 'இன்னைக்கு நடந்தது பத்தி கொஞ்சம் எழுதுங்க.' },
  lib_coding: { label: 'கோடிங் / லாஜிக் பஸில்', hint: 'கொஞ்சம் கோட் பண்ணுங்க அல்லது லாஜிக் பஸில் போடுங்க.' },
  lib_language: { label: 'ஒரு மொழியை பயிற்சி பண்ணுறது', hint: 'வேற மொழிக்கு 10 நிமிஷம்.' },

  lib_adhkar: { label: 'காலை / மாலை திக்ர்', hint: 'தினசரி திக்ர் ஓதுங்க.' },
  lib_dua: { label: 'புது துஆ கத்துக்குறது', hint: 'ஒரு புது துஆவை மனப்பாடம் பண்ணுங்க.' },
  lib_revise_surah: { label: 'ஒரு ஸூரா ரிவிஷன்', hint: 'ஏற்கனவே மனப்பாடம் பண்ணினத ரிவிஷன் பண்ணுங்க.' },
  lib_sadaqah: { label: 'ஸதகா கொடுக்குறது', hint: 'எவ்வளவு சின்னதா இருந்தாலும் ஏதாவது கொடுங்க.' },

  lib_draw: { label: 'வரைதல்', hint: 'ஒரு படம் வரையுங்க.' },
  lib_build: { label: 'ஏதாவது கட்டுறது', hint: 'பிளாக்ஸ், மாடல் அல்லது க்ராஃப்ட் ப்ராஜெக்ட்.' },
  lib_story: { label: 'கதை எழுதுறது', hint: 'உங்களோட சொந்த சின்ன கதை அல்லது கவிதை.' },

  lib_sibling: { label: 'அண்ணன்/தங்கைக்கு உதவுறது', hint: 'யாரும் சொல்லாமயே அண்ணன் அல்லது தங்கைக்கு உதவுங்க.' },
  lib_grandparents: { label: 'குடும்பத்தை கூப்பிடுறது / பார்க்க போறது', hint: 'தாத்தா, பாட்டி, அத்தை, மாமா, அல்லது கசின்ஸ்.' },
  lib_thanks: { label: 'நன்றி சொல்லுறது', hint: 'இன்னைக்கு யாருக்காவது சரியா நன்றி சொல்லுங்க.' },
  lib_share: { label: 'நல்லா பகிர்ந்து கொள்ளுறது', hint: 'மத்தவங்களோட டர்ன் எடுத்து பகிர்ந்துக்குங்க.' },
}

const ACTIVITY_ML = {
  fajr: {
    label: 'ഫജ്ർ നമസ്കാരം',
    lateLabel: 'വൈകി വന്നു 🐢',
    hint: 'സമയത്തിന് "ഇപ്പോൾ ചെയ്യുക" അമർത്തിയാൽ മുഴുവൻ റിവാർഡ്, അതിന് ശേഷം 30 മിനിറ്റിനുള്ളിൽ "വൈകി വന്നു" അമർത്തിയാൽ കുറച്ച് കുറവ് കിട്ടും. പേരന്റിന് സമയം Activities ടാബിൽ മാറ്റാം.',
  },
  quran: { label: 'ഖുർആൻ പാരായണം', buttonLabel: 'ഖുർആൻ പാരായണം 📖', hint: 'ഫജ്റിന് ശേഷം 15 മിനിറ്റ്' },
  hadith: { label: 'ഹദീസ് വായന', buttonLabel: 'കഴിഞ്ഞു', hint: 'ഒരു ഹദീസ് അതിന്റെ അർത്ഥത്തോടെ വായിക്കൂ.' },
  study: { label: 'പഠനം', buttonLabel: 'പഠനം 📚', hint: 'ളുഹ്റിന് മുൻപ് ഹോംവർക്കും പാഠങ്ങളും' },
  dhuhr: { label: 'ളുഹ്ർ നമസ്കാരം', hint: 'സ്കൂൾ ദിവസങ്ങളിൽ സ്കൂൾ കഴിഞ്ഞ് മാർക്ക് ചെയ്യൂ. ഞായറാഴ്ച നമസ്കാര സമയത്ത്. ഉച്ചയ്ക്ക് 3:45-ന് തുറക്കും.' },
  asr: { label: 'അസ്ർ നമസ്കാരം', hint: 'സ്കൂൾ ദിവസങ്ങളിൽ സ്കൂൾ കഴിഞ്ഞ് മാർക്ക് ചെയ്യൂ. ഞായറാഴ്ച നമസ്കാര സമയത്ത്. ഉച്ചയ്ക്ക് 3:45-ന് തുറക്കും.' },
  maghrib: { label: 'മഗ്‌രിബ് നമസ്കാരം', hint: '4-ാമത്തെ നമസ്കാരം. വൈകിട്ട് 6 മണിക്ക് തുറക്കും.' },
  isha: { label: 'ഇശാ നമസ്കാരം', hint: '5-ാമത്തെ നമസ്കാരം. രാത്രി 7:45-ന് തുറക്കും.' },
  mobile: {
    label: 'മൊബൈൽ കാണൽ',
    buttonLabel: 'കൺട്രോളിൽ വെച്ചു 📵',
    hint: 'അനുവദനീയം: അസ്റിന് ശേഷം വൈകിട്ട് 5:00–5:30 (30 മിനിറ്റ്), ഇശായ്ക്ക് ശേഷം രാത്രി 9:45–10:00 (15 മിനിറ്റ്). ദിവസാവസാനം പേരന്റ് നോക്കും.',
  },
  obey: { label: 'മാതാപിതാക്കളെ അനുസരിച്ചു', buttonLabel: 'അതെ, അനുസരിച്ചു', hint: 'ദിവസാവസാനം പേരന്റ് നോക്കും.' },
  outdoor: { label: 'പുറത്ത് കളിക്കൽ', buttonLabel: 'അതെ, കളിച്ചു 👍', hint: 'സ്ക്രീൻ ഇല്ലാതെ പുറത്ത് സമയം. ദിവസാവസാനം പേരന്റ് നോക്കും.' },

  lib_make_bed: { label: 'കിടക്ക ശരിയാക്കൽ', hint: 'മുറി വിടുന്നതിന് മുൻപ് കിടക്ക വൃത്തിയായി ശരിയാക്കൂ.' },
  lib_tidy_room: { label: 'മുറി വൃത്തിയാക്കൽ', hint: 'കളിപ്പാട്ടങ്ങളും വസ്ത്രവും പുസ്തകവും എടുത്തു വെക്കൂ.' },
  lib_set_table: { label: 'മേശ ഒരുക്കൽ', hint: 'ഭക്ഷണത്തിന് മേശ ഒരുക്കാനോ കഴിഞ്ഞ് വൃത്തിയാക്കാനോ സഹായിക്കൂ.' },
  lib_help_cook: { label: 'അടുക്കളയിൽ സഹായിക്കൽ', hint: 'ഭക്ഷണം ഉണ്ടാക്കാനോ പാത്രം കഴുകാനോ സഹായിക്കൂ.' },
  lib_laundry: { label: 'തുണി അലക്കൽ സഹായം', hint: 'തുണി മടക്കാനോ എടുത്തു വെക്കാനോ സഹായിക്കൂ.' },
  lib_trash: { label: 'ചവർ പുറത്ത് കളയൽ', hint: 'ബിന്നുകൾ കാലിയാക്കി പുതിയ ബാഗ് വെക്കൂ.' },
  lib_plants: { label: 'ചെടികൾക്ക് വെള്ളം ഒഴിക്കൽ', hint: 'ചെടികളെ നോക്കൂ.' },
  lib_pet: { label: 'വളർത്തുമൃഗത്തെ നോക്കൽ', hint: 'തീറ്റ, വെള്ളം, അല്ലെങ്കിൽ നടക്കാൻ കൊണ്ടുപോകൽ.' },

  lib_water: { label: 'വേണ്ടത്ര വെള്ളം കുടിക്കൽ', hint: 'ദിവസം മുഴുവൻ നല്ല അളവിൽ വെള്ളം കുടിക്കൂ.' },
  lib_exercise: { label: '20 മിനിറ്റ് വ്യായാമം', hint: 'ഓട്ടം, സൈക്കിൾ, സ്ട്രെച്ച് അല്ലെങ്കിൽ കളി.' },
  lib_sleep: { label: 'സമയത്ത് ഉറങ്ങൽ', hint: 'പറഞ്ഞ സമയത്ത് കിടക്കയിൽ ആയിരിക്കണം.' },
  lib_teeth: { label: 'പല്ല് തേക്കൽ (2 തവണ)', hint: 'രാവിലെയും രാത്രിയും.' },
  lib_veg: { label: 'പച്ചക്കറി കഴിക്കൽ', hint: 'പ്ലേറ്റിലെ പച്ചക്കറി തീർക്കണം.' },

  lib_read: { label: '20 മിനിറ്റ് പുസ്തകം വായിക്കൽ', buttonLabel: 'വായിച്ചു 📕', hint: 'ഇഷ്ടമുള്ള ഏത് പുസ്തകവും.' },
  lib_math: { label: 'കണക്ക് പരിശീലനം', buttonLabel: 'പരിശീലിച്ചു ➗', hint: 'കുറച്ച് പരിശീലന ചോദ്യങ്ങൾ.' },
  lib_spelling: { label: 'സ്പെല്ലിംഗും വാക്കുകളും', hint: 'പുതിയ വാക്കുകൾ പഠിക്കൂ, പഴയത് ഒന്നുകൂടി നോക്കൂ.' },
  lib_homework_first: { label: 'ഹോംവർക്ക് കഴിഞ്ഞേ കളി', hint: 'സ്ക്രീനോ കളിയോ തുടങ്ങുന്നതിന് മുൻപ് ഹോംവർക്ക് തീർക്കണം.' },
  lib_journal: { label: 'ഡയറി എഴുതൽ', hint: 'ഇന്ന് നടന്നതിനെ കുറിച്ച് കുറച്ച് വരികൾ എഴുതൂ.' },
  lib_coding: { label: 'കോഡിംഗ് / ലോജിക് പസിൽ', hint: 'കുറച്ച് കോഡ് ചെയ്യൂ അല്ലെങ്കിൽ ഒരു ലോജിക് പസിൽ പരിഹരിക്കൂ.' },
  lib_language: { label: 'ഒരു ഭാഷ പരിശീലിക്കൽ', hint: 'വേറെ ഒരു ഭാഷയ്ക്ക് 10 മിനിറ്റ്.' },

  lib_adhkar: { label: 'രാവിലെ / വൈകിട്ട് ദിക്ർ', hint: 'ദിവസേനയുള്ള ദിക്ർ ചൊല്ലൂ.' },
  lib_dua: { label: 'പുതിയ ദുആ പഠിക്കൽ', hint: 'ഒരു പുതിയ ദുആ മനഃപാഠമാക്കൂ.' },
  lib_revise_surah: { label: 'ഒരു സൂറത്ത് ഒന്നുകൂടി നോക്കൽ', hint: 'നേരത്തെ മനഃപാഠമാക്കിയത് ഒന്നുകൂടി നോക്കൂ.' },
  lib_sadaqah: { label: 'സ്വദഖ കൊടുക്കൽ', hint: 'എത്ര ചെറുതായാലും എന്തെങ്കിലും കൊടുക്കൂ.' },

  lib_draw: { label: 'വരയ്ക്കൽ', hint: 'ഒരു ചിത്രം വരയ്ക്കൂ.' },
  lib_build: { label: 'എന്തെങ്കിലും ഉണ്ടാക്കൽ', hint: 'ബ്ലോക്കുകൾ, മോഡലുകൾ അല്ലെങ്കിൽ ക്രാഫ്റ്റ് പ്രൊജക്റ്റ്.' },
  lib_story: { label: 'കഥ എഴുതൽ', hint: 'സ്വന്തമായി ഒരു ചെറിയ കഥയോ കവിതയോ.' },

  lib_sibling: { label: 'സഹോദരങ്ങളെ സഹായിക്കൽ', hint: 'ആരും പറയാതെ തന്നെ സഹോദരനെയോ സഹോദരിയെയോ സഹായിക്കൂ.' },
  lib_grandparents: { label: 'കുടുംബത്തെ വിളിക്കൽ / കാണൽ', hint: 'മുത്തച്ഛൻ, മുത്തശ്ശി, അമ്മാവൻ, അമ്മായി അല്ലെങ്കിൽ കസിൻസ്.' },
  lib_thanks: { label: 'നന്ദി പറയൽ', hint: 'ഇന്ന് ആരോടെങ്കിലും ശരിക്കും നന്ദി പറയൂ.' },
  lib_share: { label: 'നന്നായി പങ്കിടൽ', hint: 'മറ്റുള്ളവരുമായി ഊഴം വെച്ച് പങ്കിടൂ.' },
}

export const ACTIVITY_TEXT = { ta: ACTIVITY_TA, ml: ACTIVITY_ML }

// ---------------------------------------------------------------------------
// Category names
// ---------------------------------------------------------------------------
const CATEGORY_TA = {
  prayer: 'தொழுகை',
  quran: 'குர்ஆன் & துஆ',
  study: 'படிப்பு',
  discipline: 'ஒழுக்கம்',
  play: 'விளையாட்டு',
  chores: 'வீட்டு வேலை',
  health: 'ஆரோக்கியம்',
  creative: 'கிரியேட்டிவ்',
  kindness: 'கருணை',
}

const CATEGORY_ML = {
  prayer: 'നമസ്കാരം',
  quran: 'ഖുർആൻ & ദുആ',
  study: 'പഠനം',
  discipline: 'അച്ചടക്കം',
  play: 'കളി',
  chores: 'വീട്ടുജോലി',
  health: 'ആരോഗ്യം',
  creative: 'ക്രിയേറ്റിവ്',
  kindness: 'ദയ',
}

export const CATEGORY_TEXT = { ta: CATEGORY_TA, ml: CATEGORY_ML }

// ---------------------------------------------------------------------------
// Category tips — same length/order as CATEGORY_TIPS in activities.js, so
// the same random index works across all three languages.
// ---------------------------------------------------------------------------
const TIPS_TA = {
  prayer: [
    '🕌 நபி (ஸல்) அவங்க சொன்னாங்க, தொழுகை கண்ணுக்கு குளிர்ச்சின்னு — எவ்ளோ நேசிச்சா அவ்ளோ அது தெரியும்.',
    '🕌 மறுமை நாளில் முதல்ல கேட்கப்படுறது தொழுகை பத்திதான். சரியா தொழுறது முக்கியம்!',
    '🕌 நேரத்துக்கு தொழுற ஒவ்வொரு தொழுகையும் உங்க மனசை அல்லாஹ்வோட இணைக்குற ஒரு சின்ன வெற்றி.',
  ],
  quran: [
    '📖 நபி (ஸல்) சொன்னாங்க, குர்ஆனை கத்துக்கிட்டு மத்தவங்களுக்கும் சொல்லிக்குடுக்குறவங்கதான் உங்களுல நல்லவங்க.',
    '📖 குர்ஆனில ஓதுற ஒவ்வொரு எழுத்துக்கும் பலன் கிடைக்கும் — அதுவும் பல மடங்காக!',
    '📖 மறுமை நாளில குர்ஆன் உங்களுக்கு ஒரு வெளிச்சமா இருக்கும். ஓதிக்கிட்டே இருங்க.',
    '📗 நபி (ஸல்) அவங்களோட வாழ்க்கைதான் அன்பும் நல்ல குணமும் உள்ள சிறந்த உதாரணம் — அவங்க வாழ்க்கை பற்றி படிக்கிறது நமக்கு உதவும்.',
  ],
  study: [
    '📚 நபி (ஸல்) சொன்னாங்க, அறிவு தேடுறது ஒவ்வொரு முஸ்லீமுக்கும் கடமை.',
    '📚 படிக்குற ஒவ்வொரு நிமிஷமும் வீண் போகாது — அறிவு ஒரு வெளிச்சம், அது அணையாது.',
    '📚 படிக்கிறவங்க இஸ்லாம்ல ரொம்ப மரியாதைக்குரியவங்க. படிச்சுக்கிட்டே இருங்க, வளர்ந்துக்கிட்டே இருங்க!',
  ],
  discipline: [
    '😊 சிரிப்பும் நல்ல நடத்தையும் ஒரு வகையான தர்மம். இப்படியே தொடருங்க!',
    '🤝 நபி (ஸல்) சொன்னாங்க, உங்க குடும்பத்துக்கு நல்லவங்களா இருக்குறவங்கதான் உங்களுல நல்லவங்க.',
    '📱 தன்னை கட்டுப்படுத்துறதும் நம்பிக்கையோட ஒரு பகுதிதான் — இன்னைக்கு நல்லா பாலன்ஸ் பண்ணீங்க.',
  ],
  play: [
    '🌳 நபி (ஸல்) விளையாடுறதையும் உடற்பயிற்சியையும் ஊக்கப்படுத்தினாங்க — ஆரோக்கியமான உடம்பு இருந்தா வணக்கம் செய்றதும் நல்லா முடியும்.',
    '🌳 நபி (ஸல்) கூட மத்தவங்களோட ஓட்டப்போட்டி போட்டு விளையாடியிருக்காங்க. வெளில நேரத்த எஞ்சாய் பண்ணுங்க!',
  ],
  chores: [
    '🧹 சுத்தமா இருக்குறதும் நம்பிக்கையோட ஒரு பகுதிதான் — சுத்தமான இடமும் ஒரு நல்ல செயல்.',
    '🏠 நபி (ஸல்) வீட்டு வேலையில உதவினாங்க. வீட்டுல உதவுறது அவங்களோட வழியை பின்பற்றுறதுதான்!',
  ],
  health: [
    '💧 ஆரோக்கியமான உடம்பு இருந்தா நல்ல காரியங்களை நீண்ட நேரம் செய்யலாம். உங்களை கவனிச்சுக்கிறது சூப்பர்!',
    '🍎 உங்க உடம்புக்கு உங்களோட ஒரு உரிமை இருக்குன்னு இஸ்லாம் சொல்லுது — அதை கவனிச்சுக்குறது ஒரு நல்ல செயல்.',
  ],
  creative: [
    '🎨 உங்க கையால அழகான ஒண்ணு உருவாக்குறது, உங்களுக்கு கிடைச்ச திறமையை நல்லா பயன்படுத்துறதுதான்.',
  ],
  kindness: [
    '💝 மத்தவங்களுக்கு அதிகமா உதவுறவங்கதான் சிறந்தவங்க.',
    '😊 ஒரு நல்ல வார்த்தை அல்லது சிரிப்பு கூட ஒரு வகை தர்மம்தான்.',
  ],
}

const TIPS_ML = {
  prayer: [
    '🕌 നമസ്കാരം കണ്ണിന് കുളിർമയാണെന്ന് നബി (സ) പറഞ്ഞു — എത്ര സ്നേഹിക്കുന്നോ അത്രയും അത് കാണിക്കും.',
    '🕌 അന്ത്യനാളിൽ ആദ്യം ചോദിക്കുന്നത് നമസ്കാരത്തെ കുറിച്ചാണ്. സമയത്ത് ചെയ്യുന്നത് പ്രധാനമാണ്!',
    '🕌 സമയത്തുള്ള ഓരോ നമസ്കാരവും നിങ്ങളുടെ ഹൃദയത്തെ അള്ളാഹുവുമായി ബന്ധിപ്പിക്കുന്ന ഒരു ചെറിയ വിജയമാണ്.',
  ],
  quran: [
    '📖 ഖുർആൻ പഠിച്ച് മറ്റുള്ളവരെ പഠിപ്പിക്കുന്നവരാണ് നിങ്ങളിൽ ഏറ്റവും നല്ലവർ എന്ന് നബി (സ) പറഞ്ഞു.',
    '📖 ഖുർആനിൽ നിന്ന് ഓതുന്ന ഓരോ അക്ഷരത്തിനും പ്രതിഫലം കിട്ടും — അതും പല മടങ്ങായി!',
    '📖 അന്ത്യനാളിൽ ഖുർആൻ നിങ്ങൾക്ക് ഒരു വെളിച്ചമായിരിക്കും. ഓതിക്കൊണ്ടേയിരിക്കൂ.',
    '📗 സ്നേഹവും നല്ല സ്വഭാവവും ഉള്ള ഏറ്റവും നല്ല മാതൃകയായിരുന്നു നബി (സ) — അവിടുത്തെ ജീവിതം വായിക്കുന്നത് നമ്മളെ സഹായിക്കും.',
  ],
  study: [
    '📚 അറിവ് തേടുന്നത് എല്ലാ മുസ്‌ലിമിനും നിർബന്ധമാണെന്ന് നബി (സ) പറഞ്ഞു.',
    '📚 പഠിക്കാൻ ചെലവഴിക്കുന്ന ഓരോ നിമിഷവും വെറുതെയല്ല — അറിവ് ഒരിക്കലും അണയാത്ത വെളിച്ചമാണ്.',
    '📚 പണ്ഡിതന്മാർ ഇസ്‌ലാമിൽ വലിയ ബഹുമാനമുള്ളവരാണ്. പഠിച്ചും വളർന്നും കൊണ്ടേയിരിക്കൂ!',
  ],
  discipline: [
    '😊 ഒരു പുഞ്ചിരിയും നല്ല പെരുമാറ്റവും ഒരുതരം ദാനമായാണ് കണക്കാക്കുന്നത്. ഇതുപോലെ തുടരൂ!',
    '🤝 കുടുംബത്തോട് ഏറ്റവും നല്ലവരായവരാണ് നിങ്ങളിൽ ഏറ്റവും നല്ലവർ എന്ന് നബി (സ) പറഞ്ഞു.',
    '📱 സ്വയം നിയന്ത്രിക്കുന്നതും വിശ്വാസത്തിന്റെ ഭാഗമാണ് — ഇന്ന് നല്ല ബാലൻസ് സൂക്ഷിച്ചതിന് അഭിനന്ദനം.',
  ],
  play: [
    '🌳 കളിയും വ്യായാമവും നബി (സ) പ്രോത്സാഹിപ്പിച്ചു — ആരോഗ്യമുള്ള ശരീരം ആരാധനയും നന്നായി ചെയ്യാൻ സഹായിക്കും.',
    '🌳 നബി (സ) പോലും മറ്റുള്ളവരോടൊപ്പം ഓട്ടമത്സരം നടത്തി കളിച്ചിരുന്നു. പുറത്തെ സമയം ആസ്വദിക്കൂ!',
  ],
  chores: [
    '🧹 വൃത്തി വിശ്വാസത്തിന്റെ ഭാഗമാണ് — വൃത്തിയുള്ള സ്ഥലവും ഒരു നല്ല പ്രവൃത്തിയാണ്.',
    '🏠 നബി (സ) വീട്ടുജോലികളിൽ സഹായിച്ചിരുന്നു. വീട്ടിൽ സഹായിക്കുന്നത് അവിടുത്തെ മാതൃക പിന്തുടരലാണ്!',
  ],
  health: [
    '💧 ആരോഗ്യമുള്ള ശരീരം ഉണ്ടെങ്കിൽ കൂടുതൽ കാലം നല്ല കാര്യങ്ങൾ ചെയ്യാം. സ്വയം നോക്കിയതിന് അഭിനന്ദനം!',
    '🍎 നിങ്ങളുടെ ശരീരത്തിന് നിങ്ങളോട് ഒരു അവകാശമുണ്ടെന്ന് ഇസ്‌ലാം പഠിപ്പിക്കുന്നു — അത് നോക്കുന്നത് ഒരു നല്ല പ്രവൃത്തിയാണ്.',
  ],
  creative: [
    '🎨 സ്വന്തം കൈകൊണ്ട് മനോഹരമായ എന്തെങ്കിലും ഉണ്ടാക്കുന്നത്, നിങ്ങൾക്ക് കിട്ടിയ കഴിവ് നല്ലരീതിയിൽ ഉപയോഗിക്കലാണ്.',
  ],
  kindness: [
    '💝 മറ്റുള്ളവരെ ഏറ്റവും കൂടുതൽ സഹായിക്കുന്നവരാണ് ഏറ്റവും നല്ല ആളുകൾ.',
    '😊 ഒരു നല്ല വാക്കോ പുഞ്ചിരിയോ പോലും ഒരുതരം ദാനമാണ്.',
  ],
}

export const TIPS_TEXT = { ta: TIPS_TA, ml: TIPS_ML }

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

// Simple {placeholder} substitution.
function interpolate(str, vars) {
  if (!vars) return str
  return Object.keys(vars).reduce((s, k) => s.replaceAll(`{${k}}`, vars[k]), str)
}

// t('ta', 'cancel') -> 'ரத்து செய்'. Falls back to English, then the key
// itself, so a missing translation never breaks the app — it just shows
// in English until someone fills it in.
export function t(lang, key, vars) {
  const dict = UI[lang] || UI.en
  const str = dict[key] ?? UI.en[key] ?? key
  return interpolate(str, vars)
}

// A custom (parent-made) activity has no translation — it stays in
// whichever language the parent typed it in, which is the correct
// behaviour (we can't invent a translation for text we've never seen).
export function tActivity(lang, activity, field) {
  if (!activity) return ''
  const over = ACTIVITY_TEXT[lang]?.[activity.id]?.[field]
  if (over != null) return over
  // Most library activities share the exact same default button label
  // ("Done ✅") from the `done()` helper in activities.js, rather than
  // each having their own override — translate that shared default once
  // instead of repeating the same entry for ~30 activities.
  if (field === 'buttonLabel' && activity.buttonLabel === 'Done ✅') {
    return t(lang, 'doneCheckmark')
  }
  return activity[field] ?? ''
}

export function tCategory(lang, categoryId, fallbackLabel) {
  return CATEGORY_TEXT[lang]?.[categoryId] ?? fallbackLabel ?? categoryId
}

// Picks a random tip, then looks up the same index in the requested
// language so the vocabulary is consistent (not a random mix mid-tip).
export function tTip(lang, category, englishList) {
  const list = englishList
  if (!list || !list.length) return null
  const idx = Math.floor(Math.random() * list.length)
  const translated = TIPS_TEXT[lang]?.[category]?.[idx]
  return translated ?? list[idx]
}
