# Kids Productivity Tracker

A React + Vite app that lets **any parent** track their children's daily
habits — prayers, studies, chores, play — with a coin bucket per activity
and rewards the parent chooses.

- Parents **sign up / log in** (Firebase Authentication). Each parent's
  family is private to their own account.
- A parent adds their **children** (name, age, grade).
- Every child starts with the **11 default activities**; the parent then
  **drags suggested activities** (picked by the child's age and grade) into
  the child's list and sets **a reward for each activity**.
- Children log in on the shared device with a friendly greeting, tap their
  activities through the day, and the parent approves or rejects the coins
  at day end.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**On `localhost` the app runs in local dev mode**: there is no sign-in and
nothing touches Firebase — data stays in that browser's `localStorage`, so
testing can never affect a real family's data. The parent code in dev mode
is `devmode`. To try real sign-up / cloud sync from localhost on purpose,
create a file named `.env.local` containing `VITE_FORCE_CLOUD=true` and
restart `npm run dev`.

## One-time Firebase setup

`src/firebase.js` already points at this project's Firebase config (that
config is meant to be public — access is controlled by the rules below).
In the [Firebase console](https://console.firebase.google.com):

1. **Authentication → Sign-in method → enable "Email/Password".**
2. **Authentication → Settings → Authorized domains → add your site's
   domain** (for GitHub Pages: `<your-username>.github.io`). `localhost` is
   there by default.
3. **Firestore Database → Rules → replace everything with:**

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Each signed-in parent can read/write ONLY their own family document.
       match /families/{familyId} {
         allow read, write: if request.auth != null && request.auth.uid == familyId;
       }
       // Everything else is locked.
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

   Click **Publish**. This is what keeps one family's data private from
   every other family. (The old rule that opened `app/state` to everyone is
   gone — see "Bringing over the original data" first if you still need it.)

4. `npm install` after pulling this version (it uses `firebase/auth`, which
   is part of the `firebase` package already in `package.json`).

## How a family uses it

1. **Sign up** (name, email, password, a **parent code**, and the currency
   for rewards). Log in on every device with the same email/password.
2. Add your first child. More children, and edits to a child's name, age or
   grade, are under **Parent → Settings → Manage children**.
3. **Kids log in**: on the device, pick your name and type your name as the
   password (a friendly ritual, not real security), then tap activities.
4. **Parents** open the **👨‍👩‍👧 Parent** tab (parent code required):
   - **📊 Progress** — every child's week: coins, money, penalties owed.
   - **🎯 Activities** — build each child's list (below).
   - **⚙️ Settings** — children, currency, default reward, rejection
     penalty, parent code, backup/restore, sign out.

### Activities, suggestions and rewards (Parent → 🎯 Activities)

Pick a child with the tabs at the top, then:

- **Left: the child's activities** — the box you drop things into. Each row
  has that activity's **reward** (what one coin is worth for this child) and
  a time field — **"show button after"** for most activities (leave empty
  for always available), or **"on-time by"** for Fajr. All of these times
  are shared by every child, since prayer times are the same for everyone.
  Fajr's "Late Comer" window is always the 30 minutes right after its
  on-time time — move the time and the late window moves with it.
- **Right: suggested activities** — 31 ready-made ideas (chores, health,
  study, deen, creative, kindness) with a suggested reward. They are sorted
  into **Recommended for this child** and **Other ideas** using the child's
  **age and grade** (grade is worked out from age, or age from grade, if only
  one is entered). Filter by category with the chips.
- **➕ Create a custom activity** (above the suggestions) lets you add your
  own — a name, category, optional hint, and a reward. It's saved for the
  whole family and immediately added to the child you're viewing; you can
  add it to your other children the same way you add any suggestion.
- **Drag** a suggestion into the left box to add it, or tap **＋** (this is
  what works on phones/tablets, where dragging is unreliable). Drag a row
  from the list back onto the suggestions panel — or press **✕** — to
  remove it. Removing an activity keeps its past history.
- Reward order of precedence: the reward you set → the activity's suggested
  reward → the family default (Settings). "↺ default" clears your override.

### Day cycle & approval

- Every activity is independent — none depends on another.
- Tapping an activity records the time and credits its reward to that
  activity's bucket right away, after a short Hadith/tip pop-up.
- **↩️ Oops, undo** appears on a just-tapped activity so a kid can take back
  an accidental press — it disappears once a parent has approved/rejected
  that coin, or once the day is locked, whichever comes first.
- **Lock day & finish** (parent code) opens the review: **approve or reject**
  each coin. Rejecting takes the coin back **and** adds a penalty (Settings)
  that carries forward until paid off. Unreviewed coins stay approved.
- **Pay & empty buckets** clears the week after you hand over the reward;
  any carried-forward penalty is deducted first.
- **Reset Today** (parent code) clears today for the current child.
- A **⬆ back-to-top button** appears in the corner once you've scrolled down
  — handy once a child's activity list gets long.

## Bringing over the original data (one time)

If you used the earlier single-family version of this app:

- **Easiest:** *before* deploying this version, open the old site → Parent →
  **Export backup**. After signing up here, go to **Parent → Settings →
  Restore from backup** and pick that file. The two original children are
  created with their history (add their ages afterwards). Backups from this
  version restore the same way.
- Alternatively, keep a temporary rule like the one below, sign up, and use
  **"Import that data"** on the "add your first child" screen, then delete
  the rule. Replace the email with the one you signed up with:

  ```
  match /app/state {
    allow read: if request.auth != null && request.auth.token.email == 'you@example.com';
  }
  ```

## Known limitations (please read)

- **Storage limit.** A family's data lives in one Firestore document, which
  has a hard limit of about **1 MB**. With a couple of children that is
  roughly a year or more of daily history. *Parent → Settings* shows how
  much is used and warns when it's getting full — download a backup then.
  The proper long-term fix is to store each month of history in its own
  document; that is not done yet.
- **Different children on different devices** are safe (each child is
  written separately). Two devices editing the *same* child at the same
  moment can overwrite each other — last write wins.
- **The kid login and parent code are not real security.** They keep
  children out of the parent area on a shared device. The parent code is
  stored in the family's private document (visible to that parent's own
  account), and the account password is what actually protects the family.
- **Drag-and-drop** uses the browser's native drag events. It works with a
  mouse and on most desktop browsers; use the ＋ button on touch screens.
- **Signing out** wipes that account's cached data from the device.
- If you never signed up, nothing here works on the deployed site — the
  first screen is the sign-up/log-in form.

## Rendering on tablets / older browsers

If a tablet shows a blank page it is usually an outdated browser that can't
run modern JavaScript. `vite.config.js` sets `build.target: 'es2015'`, so a
**production build** (`npm run build`, then host `dist/` or use
`npm run preview`) supports much older browsers. `npm run dev` always needs
a reasonably modern browser.

## Project layout

- `src/App.jsx` — sign-in shell, per-family state, cloud sync, Today /
  Weeks / Parent views.
- `src/data/activities.js` — the 11 default activities, the suggestion
  library, categories, tips, age/grade matching and reward helpers. Add
  new suggestions here.
- `src/components/` — `AuthGate` (sign up / log in), `ManageChildren`,
  `LoginGate` (kid login), `ActivityManager` (drag-and-drop + rewards),
  `ParentWeeklyPanel`, `WeeksView`, `DayReviewModal`, `PasscodeModal`.
- `src/CurrencyContext.js` — the family's currency symbol.
- `src/App.css` — all styling.
