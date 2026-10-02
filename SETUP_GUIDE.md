# Alignora Smiles — Setup Guide (Configure + Client ko Demo Dena)

Yeh guide step-by-step hai. Upar se neeche follow karo, koi step skip mat
karo — har step agle step ke liye zaroori hai.

Cheezein 3 accounts par depend karti hain, teeno **free** hain:
1. **Supabase** — database + login system (jahan bookings save hoti hain)
2. **Resend** — email bhejne ke liye (booking notification)
3. **Vercel** — website hosting (client ko dikhane wala link yahi se milega)
4. **GitHub** — code rakhne ke liye (Vercel isi se deploy karta hai)

---

## Pehle samajh lo: abhi kya kaam karta hai, kya nahi

**Abhi kaam karta hai (already built):**
- Customer website par jaake "Book an Appointment" form bharega
- Woh data seedha secure database (Supabase) mein save hota hai
- Aap `/admin` dashboard mein login karke woh booking dekh sakte ho

**Jo maine abhi add kiya hai (is turn mein):** jab customer booking submit
karega, do emails automatically jaayengi:
- Ek email **clinic ke inbox** par ("naya booking aaya hai")
- Ek confirmation email **customer** ko (agar usne apna email diya ho)

Yeh sirf tab kaam karega jab aap neeche diye Resend steps (Step 3) complete
karoge. Tab tak bhi booking save hoti rahegi, bas email nahi jaayegi —
aapko dashboard check karna padega.

**WhatsApp notification abhi nahi hai** — WhatsApp Business API paid aur
complex hai. Email hi sabse simple/reliable tarika hai abhi ke liye. Baad
mein chaho to add karwa sakte ho.

---

## Step 1 — Supabase (database) setup

1. [supabase.com](https://supabase.com) par jaake free account banao.
2. **New Project** banao. Naam kuch bhi do (e.g. "alignora-smiles"), ek
   strong database password set karo (isse yaad rakhna — kahin note kar lo).
3. Project ban jaaye (1-2 min lagte hain), fir **Project Settings → API**
   par jaao. Yahan 3 values milengi:
   - `Project URL`
   - `anon public` key
   - `service_role` key (yeh secret hai, kisi ko mat dena)
4. Left sidebar mein **SQL Editor** kholo. Project ke `supabase/migrations/`
   folder mein 3 files hain — inhe is order mein kholo, copy karo, paste
   karo SQL editor mein, aur **Run** dabao:
   - `0001_core_schema.sql`
   - `0002_rls_policies.sql`
   - `0003_storage.sql`
   Fir `supabase/seed/seed.sql` bhi run kar do (yeh kuch draft services aur
   FAQs add karta hai — sab unpublished, koi bhi live nahi hoga automatically).
5. **Apna admin login banao:** Sidebar mein **Authentication → Users →
   Add user** par jaake apna email + password daalo. Yeh wahi email/password
   hoga jisse aap `/admin` mein login karoge.
6. Ab isi user ko **admin** banao (default sab "staff" role mein aate hain,
   security ke liye). SQL Editor mein yeh chalao (apna email daal ke):
   ```sql
   update profiles set role = 'admin' where id =
     (select id from auth.users where email = 'aapka-email@example.com');
   ```

---

## Step 2 — Admin dashboard kaise use hoga

Yeh abhi local/preview mein bhi test kar sakte ho, aur live hone ke baad
bhi same tarika rahega:

- **Login:** `yourwebsite.com/admin/login` par jaake wahi email/password
  daalo jo Step 1.5 mein banaya.
- **Dashboard** (`/admin/dashboard`): pending bookings, published/draft
  blog posts ka quick summary.
- **Appointments** (`/admin/appointments`): **yahi woh jagah hai jahan
  har booking dikhegi** — naam, phone, service, preferred date/time,
  message. Status (Pending/Confirmed/Completed/Cancelled) yahin se
  dropdown se change kar sakte ho.
- **Blog** (`/admin/blog`): naye posts likhna, schedule karna, publish
  karna.
- **Services / Testimonials / FAQs / Before & After**: content add/edit
  karna, publish toggle on/off karna.
- **Settings** (`/admin/settings`): clinic ka address, phone, WhatsApp,
  email, social links — yeh sab yahin se update karo, poori website
  automatically update ho jaayegi.

Doctor/clinic staff ko roz ek baar `/admin/appointments` check karne ki
aadat daalni hogi — email notification uska reminder hai, replacement nahi.

---

## Step 3 — Resend (email notification) setup

1. [resend.com](https://resend.com) par free account banao.
2. **API Keys** section mein jaake ek naya API key banao — isse copy kar lo.
3. Testing ke liye aap `onboarding@resend.dev` se emails bhej sakte ho
   (Resend ka default sandbox address) — koi domain verify karne ki
   zaroorat nahi, turant kaam karega.
4. **Production ke liye** (asli clinic email jaisa `hello@alignorasmiles.com`
   se bhejne ke liye): Resend mein **Domains → Add Domain** karo, woh jo
   DNS records dikhayega, unhe apne domain provider (GoDaddy/Namecheap/
   whoever aapne domain liya hai) mein add karo. Isme 10-30 min lag sakte
   hain verify hone mein.
5. Yeh 3 values Vercel mein environment variables ke roop mein daalni
   hongi (Step 4 mein bataya hai):
   - `RESEND_API_KEY` → jo key aapne banayi
   - `EMAIL_FROM` → `Alignora Smiles <onboarding@resend.dev>` (ya apna
     verified domain wala address)
   - `NOTIFICATION_EMAIL` → clinic ka actual email jahan booking alerts
     aani chahiye (e.g. doctor ka Gmail/personal email)

---

## Step 4 — GitHub + Vercel (client ko dikhane wala live link)

### GitHub par code daalna
1. [github.com](https://github.com) par account banao (agar nahi hai).
2. Naya **private** repository banao (e.g. `alignora-smiles`).
3. Is project ka zip extract karo apne computer par, fir:
   ```bash
   cd alignora-smiles
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/alignora-smiles.git
   git push -u origin main
   ```
   (Agar `git`/terminal se comfortable nahi ho, GitHub Desktop app use
   kar sakte ho — same kaam graphically ho jaata hai.)

### Vercel par deploy karna
1. [vercel.com](https://vercel.com) par GitHub se sign up karo (free).
2. **Add New → Project** → apna GitHub repo select karo → **Import**.
3. Deploy karne se pehle **Environment Variables** section mein yeh sab
   daalo (`.env.example` file mein poori list hai):
   | Variable | Kahan se milega |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SITE_URL` | Vercel jo URL dega (e.g. `https://alignora-smiles.vercel.app`) |
   | `CRON_SECRET` | Khud koi random text bana lo (e.g. `openssl rand -hex 32`, ya kisi bhi random password generator se) |
   | `AUTOMATION_API_SECRET` | Same tarah random text |
   | `RESEND_API_KEY` | Resend dashboard |
   | `EMAIL_FROM` | Step 3 dekho |
   | `NOTIFICATION_EMAIL` | Clinic ka email |
4. **Deploy** dabao. 1-2 minute mein live link mil jaayega —
   kuch aisa: `https://alignora-smiles-xyz.vercel.app`

**Yehi link client ko bhej sakte ho demo ke liye.** Yeh 100% live website
hai, real database ke saath — client isko apne phone/laptop par khol ke
puri site dekh sakta hai, booking form try kar sakta hai.

### Baad mein apna domain lagana (optional)
Vercel → Project → Settings → Domains mein jaake apna domain
(`alignorasmiles.com` jaisa) add kar sakte ho — Vercel bataega DNS mein
kya change karna hai. HTTPS automatically set ho jaata hai.

---

## Step 5 — Client ko kaise dikhana hai

1. Vercel wala live link (upar Step 4.4) client ko WhatsApp/email kar do.
2. Unhe bolo: "Yeh aapki website hai, live hai — koi bhi is link se dekh
   sakta hai. Test appointment book karke dikhao."
3. Aap khud `/admin/login` mein login karke unhe screen-share pe dikha
   sakte ho ki booking kaise `/admin/appointments` mein turant aa jaati hai.
4. Jab client final "yes, go live" bole, to bas apna real domain Step 4
   ke "optional" wale part se attach kar dena — website already ready hai.

---

## Har cheez ek line mein — quick reference

| Sawaal | Jawaab |
|---|---|
| Admin dashboard mein kaise jaayein? | `yourwebsite.com/admin/login` |
| Booking kahan dikhegi? | `/admin/appointments` |
| Doctor ko booking ka pata kaise chalega? | Email par (Step 3 configure karne ke baad) + dashboard mein check karke |
| Customer ko confirmation kaise milega? | Agar usne email diya, to automatic confirmation email |
| Website kahan host hai? | Vercel (free tier kaafi hai shuru mein) |
| Client ko dikhane wala link? | Vercel deploy ke baad milne wala `.vercel.app` link, ya apna domain baad mein |
| Content (services, blog, FAQs) kaise badlein? | `/admin` mein login karke, koi coding nahi chahiye |

Koi bhi step mein atko, ya error aaye, to woh exact error message bhej
dena — us hisaab se aage guide kar dunga.
