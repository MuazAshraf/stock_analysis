"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, Tag, FileText, Languages, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBillions } from "@/lib/format";
import type { FinancialStatements } from "@/types/stock";

type EducationTab = "glossary" | "formulas" | "symbols" | "account" | "statements";
type FreqTab = "annual" | "quarterly";
type Lang = "en" | "ur";

interface FormulasProps {
  statements?: FinancialStatements | null;
}

// ── Bilingual Content ─────────────────────────────────────────────────────

const GLOSSARY = [
  { term: "P/E Ratio (Price to Earnings)", en: "How much investors pay for every Rs. 1 of profit. If P/E is 15, people are paying Rs. 15 for each Rs. 1 the company earns. Lower can mean cheaper stock, higher can mean investors expect growth.", ur: "Har Rs. 1 ki kamai ke liye investors kitna dete hain. Agar P/E 15 hai, toh log Rs. 15 de rahe hain Rs. 1 kamai ke liye. Kam P/E ka matlab sasta stock ho sakta hai, zyada P/E ka matlab investors ko growth ki umeed hai." },
  { term: "EPS (Earnings Per Share)", en: "The company's total profit divided by the number of shares. If a company earned Rs. 100 Crore and has 10 Crore shares, EPS is Rs. 10. Higher EPS = more profit per share you own.", ur: "Company ka total profit shares ki tadaad se divide. Agar company ne Rs. 100 Crore kamaye aur 10 Crore shares hain, toh EPS Rs. 10 hai. Zyada EPS = aapke har share pe zyada kamai." },
  { term: "Market Cap (Market Capitalization)", en: "The total value of all shares combined (share price x total shares). It tells you how big the company is. Large cap = big and stable, small cap = smaller and more volatile.", ur: "Tamam shares ki kul value (share price x total shares). Ye batata hai company kitni bari hai. Large cap = bari aur stable, small cap = choti aur zyada utar chadhaav wali." },
  { term: "ROE (Return on Equity)", en: "How much profit a company makes from shareholders' money. If ROE is 20%, the company turns every Rs. 100 of equity into Rs. 20 profit. Higher ROE = better at using your money.", ur: "Shareholders ke paise se company kitna profit banati hai. Agar ROE 20% hai, toh Rs. 100 se Rs. 20 profit. Zyada ROE = aapke paise ka behtar istemal." },
  { term: "Dividend Yield", en: "The percentage return you get from dividends alone (without selling the stock). If a Rs. 100 stock pays Rs. 5 dividend, yield is 5%. Think of it like interest rate on your investment.", ur: "Sirf dividend se kitna percent return milta hai (bina stock beche). Agar Rs. 100 ka stock Rs. 5 dividend deta hai, toh yield 5% hai. Isko apni investment ka interest rate samjho." },
  { term: "LDCP (Last Day Closing Price)", en: "The price at which the stock closed on the previous trading day. Today's change is calculated from this price.", ur: "Pichle trading din ka closing price. Aaj ka change isi price se calculate hota hai." },
  { term: "Volume", en: "How many shares were traded during the day. High volume means lots of people are buying and selling — the stock is active. Low volume means less interest.", ur: "Din mein kitne shares trade hue. Zyada volume matlab bohat log khareed rahe hain ya bech rahe hain — stock active hai. Kam volume matlab kam interest." },
  { term: "52-Week High / Low", en: "The highest and lowest price the stock reached in the past one year. Helps you understand if the current price is near the top or bottom.", ur: "Pichle 1 saal mein stock ki sabse oonchi aur sabse neechi price. Ye samajhne mein madad karta hai ke current price top ke qareeb hai ya bottom ke." },
  { term: "Free Float", en: "The percentage of shares available for public trading (not held by promoters or locked). Higher free float = easier to buy/sell without affecting the price.", ur: "Kitne percent shares aam logon ke liye trading mein available hain. Zyada free float = asaani se khareed bech sakte hain bina price pe asar dale." },
  { term: "Circuit Breaker", en: "Price limits set by the exchange. If a stock hits the upper or lower circuit, trading is paused. It prevents extreme price swings in a single day.", ur: "Exchange ki taraf se price ki hadein. Agar stock upper ya lower circuit pe pahunch jaye toh trading ruk jaati hai. Ye ek din mein bohot zyada utar chadhaav rokta hai." },
  { term: "Net Profit Margin", en: "Out of every Rs. 100 the company earns from sales, how much becomes actual profit after all expenses. A 25% margin means Rs. 25 profit from Rs. 100 revenue.", ur: "Har Rs. 100 ki sale mein se kitna asli profit bachta hai tamam expenses ke baad. 25% margin matlab Rs. 100 ki sale se Rs. 25 profit." },
  { term: "Book Value (Total)", en: "The TOTAL net worth of the company on paper — what shareholders would get if the company sold every asset and paid off every debt. Formula: Total Assets − Total Liabilities − Preferred Equity. This is one big number for the whole company, not per share. Usually shown in millions or billions of PKR.", ur: "Company ki TOTAL net worth — agar company sab kuch bech de aur saare qarz chuka de toh shareholders ko kya milega. Formula: Total Assets − Total Liabilities − Preferred Equity. Ye poori company ka ek bara number hai, per share nahi. Aam taur pe millions ya billions PKR mein hota hai." },
  { term: "Book Value Per Share (BVPS)", en: "The per-share version of Book Value. Take the total Book Value and divide by the number of outstanding shares. If BVPS is Rs. 50 and the stock trades at Rs. 30, you are paying less than the company's net asset value per share. Most useful for comparing against the market price.", ur: "Book Value ka per-share version. Total Book Value ko outstanding shares se divide karo. Agar BVPS Rs. 50 hai aur stock Rs. 30 pe trade ho raha hai, toh aap company ki per-share net asset value se kam de rahe ho. Stock price se compare karne ke liye sabse useful." },
  { term: "Book Value vs BVPS — The Key Difference", en: "Book Value is the WHOLE COMPANY's net worth (total dollar amount, e.g., Rs. 50 billion). BVPS is the PER-SHARE slice of that (e.g., Rs. 50 per share). Use Book Value to see company size; use BVPS to compare against the stock price. Both are calculated from the same balance sheet — BVPS just divides by share count.", ur: "Book Value POORI COMPANY ki net worth hai (total amount, jaise Rs. 50 billion). BVPS us ka PER-SHARE hissa hai (jaise Rs. 50 per share). Book Value se company ka size dekho; BVPS ko stock price se compare karo. Dono same balance sheet se calculate hote hain — bas BVPS ko shares ki tadaad pe divide kiya jaata hai." },
  { term: "P/B Ratio (Price to Book)", en: "How the stock price compares to the company's book value per share. P/B of 1 means the stock matches its book value. Below 1 means the stock trades below book value (potentially undervalued). Above 1 means investors are paying a premium over book value — common for high-growth companies.", ur: "Stock price aur book value per share ka muqabla. P/B 1 matlab stock book value ke barabar hai. 1 se kam matlab book value se sasta (shayad undervalued). 1 se zyada matlab investors book value se zyada de rahe hain — high-growth companies mein aam baat hai." },
  { term: "Shariah Compliant", en: "Stocks that meet Islamic finance screening criteria set by PSX. These are part of the KMI (KSE Meezan Index) All Shares index. The screening checks the company's business activities and financial ratios against Shariah guidelines.", ur: "Woh stocks jo PSX ke Islamic finance screening criteria poore karte hain. Ye KMI All Shares index ka hissa hain. Screening mein company ke karobar aur financial ratios ko Shariah guidelines se check kiya jaata hai." },
];

const FORMULAS = [
  { title: "Book Value (Total)", formula: "Total Assets − Total Liabilities − Preferred Equity", en: { explanation: "The TOTAL net worth of the company on paper. This is one big number for the whole business — not per share. It tells you how big the company's net asset base is. To compare it against the stock price, divide by total shares to get BVPS (next formula).", example: "Company has Rs. 500Cr in assets and Rs. 200Cr in debts: 500 − 200 = Rs. 300Cr total book value" }, ur: { explanation: "Company ki TOTAL net worth on paper. Ye ek bara number hai poori company ka — per share nahi. Batata hai company ki net asset base kitni bari hai. Stock price se compare karne ke liye total shares pe divide karo — phir BVPS milega.", example: "Company ke paas Rs. 500Cr assets aur Rs. 200Cr qarz: 500 − 200 = Rs. 300Cr total book value" } },
  { title: "Book Value Per Share (BVPS)", formula: "Total Book Value / Total Shares Outstanding", en: { explanation: "The per-share slice of Book Value. Take the total Book Value and split it across all outstanding shares. This is the version you compare against the stock price — if BVPS is higher than the stock price, some investors call it undervalued.", example: "Total Book Value Rs. 300Cr, total shares 10Cr: 300 / 10 = Rs. 30 per share (BVPS)" }, ur: { explanation: "Book Value ka per-share hissa. Total Book Value ko outstanding shares mein taqseem karo. Ye wala number stock price se compare karne ke kaam aata hai — agar BVPS stock price se zyada hai, kuch investors isko sasta maante hain.", example: "Total Book Value Rs. 300Cr, total shares 10Cr: 300 / 10 = Rs. 30 per share (BVPS)" } },
  { title: "Dividend Per Share (DPS)", formula: "Total Dividends Paid / Total Shares Outstanding", en: { explanation: "How much cash the company gave back to each shareholder. If DPS is Rs. 5, that means for every share you own, you got Rs. 5 as cash.", example: "Company paid Rs. 50Cr total dividends and has 10Cr shares: 50 / 10 = Rs. 5 per share" }, ur: { explanation: "Company ne har shareholder ko kitna cash wapas diya. Agar DPS Rs. 5 hai toh aapke har share pe Rs. 5 cash mila.", example: "Company ne total Rs. 50Cr dividend diya aur 10Cr shares hain: 50 / 10 = Rs. 5 per share" } },
  { title: "Dividend Yield", formula: "(Dividend Per Share / Current Stock Price) x 100", en: { explanation: "Shows what percentage return you get just from dividends (without selling the stock). Higher yield = more cash income. Think of it like interest rate on your investment.", example: "DPS is Rs. 5 and stock price is Rs. 100: (5 / 100) x 100 = 5% yield" }, ur: { explanation: "Sirf dividend se kitna percent return milta hai (bina stock beche). Zyada yield = zyada cash income. Isko apni investment ka interest rate samjho.", example: "DPS Rs. 5 hai aur stock price Rs. 100: (5 / 100) x 100 = 5% yield" } },
  { title: "EPS Growth %", formula: "((Current Year EPS - Last Year EPS) / Last Year EPS) x 100", en: { explanation: "How much the per-share profit grew compared to last year. Positive means the company is earning more per share. Negative means it earned less.", example: "Last year EPS was Rs. 10, this year Rs. 12: ((12 - 10) / 10) x 100 = 20% growth" }, ur: { explanation: "Pichle saal ke muqable mein per share profit kitna barha. Positive matlab zyada kama rahi hai. Negative matlab kam kamai.", example: "Pichle saal EPS Rs. 10 tha, is saal Rs. 12: ((12 - 10) / 10) x 100 = 20% growth" } },
  { title: "P/E Ratio (Price to Earnings)", formula: "Current Stock Price / Earnings Per Share (EPS)", en: { explanation: "How many rupees investors are willing to pay for every Rs. 1 of profit. Low P/E might mean cheap stock, high P/E might mean expensive — or investors expect fast growth.", example: "Stock price Rs. 200, EPS Rs. 10: 200 / 10 = P/E of 20" }, ur: { explanation: "Har Rs. 1 profit ke liye investors kitne rupees dene ko tayyar hain. Kam P/E matlab sasta stock ho sakta hai, zyada P/E matlab mehenga — ya investors ko tez growth ki umeed hai.", example: "Stock price Rs. 200, EPS Rs. 10: 200 / 10 = P/E 20" } },
  { title: "P/B Ratio (Price to Book)", formula: "Current Stock Price / Book Value Per Share", en: { explanation: "Compares stock price to the company's net asset value per share. A P/B below 1 may mean the stock trades for less than its assets are worth — sometimes a bargain, sometimes a warning. P/B above 1 means investors expect future growth justifies the premium.", example: "Stock price Rs. 50, Book Value per Share Rs. 100: 50 / 100 = P/B of 0.5 (trading at half its book value)" }, ur: { explanation: "Stock price aur company ki net asset value per share ka muqabla. P/B 1 se kam matlab stock apni asset value se bhi sasta trade ho raha hai — kabhi acha sauda, kabhi warning sign. P/B 1 se zyada matlab investors mustaqbil ki growth ki wajah se premium de rahe hain.", example: "Stock price Rs. 50, Book Value per Share Rs. 100: 50 / 100 = P/B 0.5 (apni book value ke aadhe pe trade ho raha hai)" } },
  { title: "Net Profit Margin %", formula: "(Net Profit / Total Revenue) x 100", en: { explanation: "Out of every Rs. 100 the company earns from sales, how much ends up as actual profit after all expenses. Higher is better.", example: "Revenue Rs. 100Cr, Net Profit Rs. 25Cr: (25 / 100) x 100 = 25% margin" }, ur: { explanation: "Har Rs. 100 ki sale mein se kitna actual profit bachta hai tamam kharche nikalne ke baad. Jitna zyada utna acha.", example: "Revenue Rs. 100Cr, Net Profit Rs. 25Cr: (25 / 100) x 100 = 25% margin" } },
];

const MARKET_SYMBOLS = [
  { symbol: "XD", en: "Ex-Dividend — The stock is trading without the right to the upcoming dividend. If you buy on or after this date, you won't get the dividend.", ur: "Ex-Dividend — Stock bina upcoming dividend ke trade ho raha hai. Agar aaj ya baad mein khareedte ho toh dividend nahi milega." },
  { symbol: "XB", en: "Ex-Bonus — The stock is trading without the right to upcoming bonus shares. Buyers after this date won't receive the bonus.", ur: "Ex-Bonus — Stock bina bonus shares ke trade ho raha hai. Is date ke baad khareedne walon ko bonus nahi milega." },
  { symbol: "XR", en: "Ex-Right — The stock is trading without the right to subscribe to new shares at a discounted price.", ur: "Ex-Right — Stock bina right shares ke trade ho raha hai. Discounted price pe naye shares lene ka haq nahi milega." },
  { symbol: "N", en: "Newly Listed — This company was recently listed on the exchange. It may have limited trading history.", ur: "Newly Listed — Ye company haal hi mein exchange pe list hui hai. Trading history kam ho sakti hai." },
  { symbol: "UL", en: "Upper Lock / Upper Circuit — The stock hit its maximum allowed price increase for the day. No more buying is possible until the next session.", ur: "Upper Lock — Stock ne din ki maximum allowed price barhaawat ko chhu liya. Agla session tak mazeed khareed nahi ho sakti." },
  { symbol: "LL", en: "Lower Lock / Lower Circuit — The stock hit its maximum allowed price decrease for the day. No more selling is possible until the next session.", ur: "Lower Lock — Stock ne din ki maximum allowed girawat ko chhu liya. Agla session tak mazeed bechna mumkin nahi." },
  { symbol: "NC", en: "Not in any index Category — The stock is not part of KSE-100, KSE-30, or KMI-30 indices.", ur: "Kisi bhi index mein shamil nahi — Ye stock KSE-100, KSE-30, ya KMI-30 ka hissa nahi hai." },
  { symbol: "S", en: "Suspended — Trading in this stock has been temporarily halted by the exchange, usually due to non-compliance or pending announcements.", ur: "Suspended — Is stock ki trading exchange ne waqti taur pe rok di hai, aam taur pe non-compliance ya pending announcement ki wajah se." },
  { symbol: "H", en: "Halt — Trading is temporarily paused, often due to a significant pending announcement that could affect the stock price.", ur: "Halt — Trading waqti taur pe ruki hui hai, aksar kisi bari announcement ki wajah se jo stock price pe asar dal sakti hai." },
  { symbol: "Z", en: "Defaulter / Non-Compliant — The company has failed to meet PSX listing requirements (e.g., not filing reports). Trade with extra caution.", ur: "Defaulter — Company ne PSX ki listing requirements poori nahi ki (jaise reports nahi di). Bohat ehtiyaat se trade karein." },
];

const ACCOUNT_STEPS: { step: number; title: string; en: string; ur: string; tip?: { en: string; ur: string } }[] = [
  {
    step: 1,
    title: "Get Your Basics Ready",
    en: "Before anything, you need: a valid CNIC (national ID card), a personal bank account in your name, a CNIC-verified SIM card, and an email address. If you are a tax filer (on the FBR Active Taxpayers List), you will pay lower tax on profits and dividends — so it is worth registering as a filer first.",
    ur: "Sabse pehle ye tayyar rakho: valid CNIC, apne naam ka bank account, CNIC-verified SIM card, aur email address. Agar aap tax filer ho (FBR Active Taxpayers List pe) toh profits aur dividends pe kam tax lagega — toh pehle filer ban jaana behtar hai.",
    tip: { en: "You can check your filer status on the FBR website (fbr.gov.pk) using your CNIC.", ur: "Apna filer status FBR website (fbr.gov.pk) pe CNIC se check kar sakte ho." },
  },
  {
    step: 2,
    title: "Choose a Licensed Broker",
    en: "You cannot buy stocks directly on PSX — you need a licensed broker (called a TREC Holder). Visit psx.com.pk for the official list of brokers. Popular ones include AKD Securities, Topline Securities, Arif Habib, JS Global, and Next Capital. Look for one with a good online trading app, reasonable fees (typically 0.1%–0.5% per trade), and responsive customer support.",
    ur: "Aap seedha PSX se stocks nahi khareed sakte — aapko licensed broker chahiye (jise TREC Holder kehte hain). psx.com.pk pe brokers ki official list hai. Mashhoor brokers mein AKD Securities, Topline Securities, Arif Habib, JS Global, aur Next Capital hain. Acha online trading app, munasib fees (0.1%–0.5% per trade), aur achi customer support dekho.",
    tip: { en: "Never give money or documents to an unlicensed person claiming to be a broker. Always verify on the PSX or SECP website.", ur: "Kabhi bhi kisi unlicensed shakhs ko paisa ya documents mat do. Hamesha PSX ya SECP website se verify karo." },
  },
  {
    step: 3,
    title: "Choose Account Type",
    en: "You have two main options: a Regular Account (full features, standard KYC paperwork) or a Sahulat Account (simplified, can be opened online with just CNIC — ideal for beginners with small investments). Both hold your shares in CDC (Central Depository Company) so your ownership is protected.",
    ur: "Do options hain: Regular Account (poori features, standard KYC paperwork) ya Sahulat Account (simple, sirf CNIC se online khul sakta hai — beginners ke liye best). Dono mein aapke shares CDC (Central Depository Company) mein hote hain toh ownership safe hai.",
    tip: { en: "Sahulat Account is the easiest way to start. You can always upgrade to a regular account later.", ur: "Sahulat Account shuru karne ka sabse aasan tareeqa hai. Baad mein regular account pe upgrade kar sakte ho." },
  },
  {
    step: 4,
    title: "Submit Documents to Broker",
    en: "For a regular account, give your broker: CNIC copy (front & back), 2 passport-size photos, bank account details (IBAN), proof of income or a signed declaration, NTN certificate (if available), and a completed KYC (Know Your Customer) form. The broker may do in-person or video verification as required by SECP.",
    ur: "Regular account ke liye broker ko do: CNIC copy (aagay aur peechay), 2 passport-size photos, bank account details (IBAN), income proof ya signed declaration, NTN certificate (agar hai), aur KYC form. Broker SECP ke mutabiq in-person ya video verification bhi kar sakta hai.",
  },
  {
    step: 5,
    title: "Broker Sets Up Your Accounts",
    en: "Behind the scenes, your broker does several things: opens a CDC Sub-Account for your shares, registers you on NCCPL's system and gets you a UIN (Unique Identification Number — your master investor ID linked to your CNIC), and sets up RAST (Remote Access to Sub-accounts by Traders) which allows them to settle your trades.",
    ur: "Broker peeche se kai kaam karta hai: aapke shares ke liye CDC Sub-Account banata hai, NCCPL ke system pe register karta hai aur aapko UIN (Unique Identification Number — aapki master investor ID jo CNIC se linked hai) dilata hai, aur RAST setup karta hai jo trades settle karne ke kaam aata hai.",
  },
  {
    step: 6,
    title: "Wait for Confirmations (3–7 Business Days)",
    en: "It takes a few business days for everything to process. You will receive: a Trading Account ID and login credentials from your broker, a CDC Sub-Account number (where your shares will be held), CDC eServices login credentials (to independently check your holdings), and your UIN from NCCPL.",
    ur: "Sab process hone mein kuch business days lagte hain. Aapko milega: broker se Trading Account ID aur login credentials, CDC Sub-Account number (jahan aapke shares honge), CDC eServices login (apne holdings khud check karne ke liye), aur NCCPL se UIN.",
  },
  {
    step: 7,
    title: "Complete NCCPL Verification (IVS)",
    en: "Download the NCCPL IVS (Investor Verification System) app from the Play Store or App Store. Complete the identity verification process using your CNIC. This links your identity across the trading ecosystem — broker, CDC, and bank — and is mandatory before you can start trading.",
    ur: "NCCPL IVS (Investor Verification System) app Play Store ya App Store se download karo. CNIC se identity verification complete karo. Ye aapki identity ko broker, CDC, aur bank se link karta hai — aur trading shuru karne se pehle ye zaroori hai.",
  },
  {
    step: 8,
    title: "Link Your Bank Account",
    en: "Your broker will provide you with a RAST ID. Link this with your bank account so that money can flow between your bank and your trading account. When you buy shares, money is debited from your bank. When you sell, proceeds go back to your bank.",
    ur: "Broker aapko RAST ID dega. Ise apne bank account se link karo taake paisa aapke bank aur trading account ke beech aa ja sake. Jab shares khareedoge toh bank se paisa katega. Jab bechoge toh paisa wapas bank mein aayega.",
  },
  {
    step: 9,
    title: "Deposit Funds & Start Trading",
    en: "Transfer money to your broker (most brokers accept online bank transfers). Log into your broker's trading app, search for a stock (e.g., type LUCK for Lucky Cement), place a buy order (market or limit), and you are officially an investor! Settlement takes T+2 days — shares appear in your CDC account 2 business days after the trade.",
    ur: "Broker ko paisa transfer karo (zyada tar brokers online bank transfer accept karte hain). Broker ki trading app mein login karo, stock search karo (jaise LUCK type karo Lucky Cement ke liye), buy order lagao (market ya limit), aur bas — aap officially investor ban gaye! Settlement T+2 din mein hota hai — trade ke 2 business days baad shares CDC account mein aate hain.",
    tip: { en: "Start small! You can buy as few as 1 share. Learn the process first before investing big amounts.", ur: "Chhota shuru karo! 1 share bhi khareed sakte ho. Pehle process seekho, phir bade amounts invest karo." },
  },
];

const KEY_ENTITIES: { name: string; role: { en: string; ur: string } }[] = [
  { name: "PSX (Pakistan Stock Exchange)", role: { en: "The exchange where all buying and selling happens. Think of it as the marketplace.", ur: "Exchange jahan sab khareed farokht hoti hai. Ise marketplace samjho." } },
  { name: "Broker (TREC Holder)", role: { en: "Your agent who executes buy/sell orders on PSX on your behalf. You cannot trade without one.", ur: "Aapka agent jo PSX pe aapki taraf se buy/sell orders lagata hai. Iske bina trade nahi kar sakte." } },
  { name: "CDC (Central Depository Company)", role: { en: "Holds your shares electronically. Like a bank, but for stocks instead of money.", ur: "Aapke shares electronically rakhta hai. Bank jaisa, lekin paise ki jagah stocks ke liye." } },
  { name: "NCCPL (National Clearing Company)", role: { en: "Clears and settles all trades. Makes sure shares and money move correctly between buyer and seller.", ur: "Tamam trades clear aur settle karta hai. Ye ensure karta hai ke shares aur paisa buyer aur seller ke beech sahi tarah se move ho." } },
  { name: "SECP (Securities & Exchange Commission)", role: { en: "The government regulator that licenses brokers and protects investors.", ur: "Government regulator jo brokers ko license deta hai aur investors ki hifazat karta hai." } },
];

// ── Component ─────────────────────────────────────────────────────────────

export function Formulas({ statements }: FormulasProps) {
  const [activeTab, setActiveTab] = useState<EducationTab>("glossary");
  const [freq, setFreq] = useState<FreqTab>("annual");
  const [lang, setLang] = useState<Lang>("en");

  const hasStatements =
    statements &&
    (statements.income_annual.length > 0 ||
      statements.balance_annual.length > 0 ||
      statements.cashflow_annual.length > 0);

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
              Learn the Basics
              <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
                Education
              </Badge>
            </CardTitle>
            <p className="text-sm text-[#404E3F]/60">
              {lang === "en"
                ? "New to investing? Learn what the numbers mean and how they are calculated."
                : "Investing mein naye ho? Seekho ke numbers ka kya matlab hai aur kaise calculate hote hain."}
            </p>
          </div>
          {/* Language toggle */}
          {activeTab !== "statements" && (
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer",
                lang === "ur"
                  ? "bg-[#4BC232] text-white border-[#4BC232]"
                  : "bg-white text-[#404E3F] border-[#E5E0D9] hover:border-[#4BC232]"
              )}
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "Roman Urdu" : "English"}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab toggle */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#E5E0D9] bg-[#F8F3EA] p-1">
          <TabButton active={activeTab === "glossary"} onClick={() => setActiveTab("glossary")} icon={<BookOpen className="h-4 w-4" />} label="Glossary" />
          <TabButton active={activeTab === "formulas"} onClick={() => setActiveTab("formulas")} icon={<Calculator className="h-4 w-4" />} label="Formulas" />
          <TabButton active={activeTab === "symbols"} onClick={() => setActiveTab("symbols")} icon={<Tag className="h-4 w-4" />} label="Market Symbols" />
          <TabButton active={activeTab === "account"} onClick={() => setActiveTab("account")} icon={<UserPlus className="h-4 w-4" />} label="Open an Account" />
          {hasStatements && (
            <TabButton active={activeTab === "statements"} onClick={() => setActiveTab("statements")} icon={<FileText className="h-4 w-4" />} label="Financial Statements" />
          )}
        </div>

        {/* Glossary tab */}
        {activeTab === "glossary" && (
          <div className="space-y-3">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="p-4 rounded-xl bg-[#F8F3EA]">
                <h4 className="text-sm font-bold text-[#404E3F] mb-1">{g.term}</h4>
                <p className="text-sm text-[#404E3F]/80 leading-relaxed">
                  {lang === "en" ? g.en : g.ur}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Market Symbols tab */}
        {activeTab === "symbols" && (
          <div className="overflow-x-auto rounded-lg border border-[#E5E0D9]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F3F1E5]">
                  <th className="text-left p-3 font-semibold text-[#404E3F] w-24">Symbol</th>
                  <th className="text-left p-3 font-semibold text-[#404E3F]">
                    {lang === "en" ? "What It Means" : "Iska Matlab"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MARKET_SYMBOLS.map((s) => (
                  <tr key={s.symbol} className="border-t border-[#E5E0D9] hover:bg-[#F8F3EA]/50">
                    <td className="p-3">
                      <span className="inline-flex items-center rounded bg-[#2B5288]/10 px-2 py-0.5 text-xs font-bold text-[#2B5288]">
                        {s.symbol}
                      </span>
                    </td>
                    <td className="p-3 text-[#404E3F]/80">{lang === "en" ? s.en : s.ur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulas tab */}
        {activeTab === "formulas" && (
          <div className="space-y-4">
            {FORMULAS.map((f) => {
              const content = lang === "en" ? f.en : f.ur;
              return (
                <div key={f.title} className="p-4 rounded-xl bg-[#F8F3EA] space-y-2">
                  <h4 className="text-sm font-bold text-[#404E3F]">{f.title}</h4>
                  <div className="px-3 py-2 rounded-lg bg-white border border-[#E5E0D9] font-mono text-sm text-[#2B5288]">
                    {f.formula}
                  </div>
                  <p className="text-sm text-[#404E3F]/80 leading-relaxed">
                    {content.explanation}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-[#404E3F]/60">
                    <span className="font-semibold text-[#4BC232]">
                      {lang === "en" ? "Example:" : "Misaal:"}
                    </span>
                    <span>{content.example}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Account Process tab */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Steps */}
            <div className="space-y-3">
              {ACCOUNT_STEPS.map((s) => (
                <div key={s.step} className="p-4 rounded-xl bg-[#F8F3EA] space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-[#4BC232] text-white text-xs font-bold">
                      {s.step}
                    </span>
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-[#404E3F]">{s.title}</h4>
                      <p className="text-sm text-[#404E3F]/80 leading-relaxed">
                        {lang === "en" ? s.en : s.ur}
                      </p>
                      {s.tip && (
                        <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-white border border-[#E5E0D9]">
                          <span className="text-xs font-semibold text-[#4BC232] flex-shrink-0">
                            {lang === "en" ? "Tip:" : "Mashwara:"}
                          </span>
                          <span className="text-xs text-[#404E3F]/70 leading-relaxed">
                            {lang === "en" ? s.tip.en : s.tip.ur}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key entities */}
            <div className="rounded-xl border border-[#E5E0D9] overflow-hidden">
              <div className="px-5 py-3 bg-[#2B5288] text-white font-semibold text-sm">
                {lang === "en" ? "Who Does What?" : "Kaun Kya Karta Hai?"}
              </div>
              <div className="divide-y divide-[#E5E0D9]">
                {KEY_ENTITIES.map((e) => (
                  <div key={e.name} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <span className="text-sm font-semibold text-[#404E3F] sm:min-w-[220px] flex-shrink-0">{e.name}</span>
                    <span className="text-sm text-[#404E3F]/70 leading-relaxed">{lang === "en" ? e.role.en : e.role.ur}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#404E3F]/40 text-center">
              {lang === "en"
                ? "This is a general guide for educational purposes. The exact process may vary by broker. Always verify with your broker and official sources (PSX, CDC, NCCPL, SECP)."
                : "Ye ek general guide hai sirf seekhne ke liye. Asal process broker ke hisaab se thora different ho sakta hai. Hamesha apne broker aur official sources (PSX, CDC, NCCPL, SECP) se verify karo."}
            </p>
          </div>
        )}

        {/* Financial Statements tab */}
        {activeTab === "statements" && statements && (
          <StatementsTab statements={statements} freq={freq} onFreqChange={setFreq} />
        )}
      </CardContent>
    </Card>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer",
        active ? "bg-white text-[#404E3F] shadow-sm" : "text-[#404E3F]/50 hover:text-[#404E3F]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatementsTab({ statements, freq, onFreqChange }: { statements: FinancialStatements; freq: FreqTab; onFreqChange: (f: FreqTab) => void }) {
  const income = freq === "annual" ? statements.income_annual : statements.income_quarterly;
  const balance = freq === "annual" ? statements.balance_annual : statements.balance_quarterly;
  const cashflow = freq === "annual" ? statements.cashflow_annual : statements.cashflow_quarterly;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#404E3F]/60">Key highlights from this company&apos;s financial filings.</p>
        <div className="inline-flex rounded-lg border border-[#E5E0D9] bg-white p-1 gap-1">
          <button type="button" onClick={() => onFreqChange("annual")} className={cn("px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer", freq === "annual" ? "bg-[#4BC232] text-white shadow-sm" : "text-[#404E3F]/50 hover:text-[#404E3F]")}>Annual</button>
          <button type="button" onClick={() => onFreqChange("quarterly")} className={cn("px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer", freq === "quarterly" ? "bg-[#4BC232] text-white shadow-sm" : "text-[#404E3F]/50 hover:text-[#404E3F]")}>Quarterly</button>
        </div>
      </div>

      {income.length > 0 && (
        <StatementBlock title="Income Statement" color="#4BC232">
          <FullWidthTable
            headers={["Item", ...income.map((p) => p.period)]}
            rows={[
              { label: "Revenue", values: income.map((p) => formatBillions(p.revenue)) },
              { label: "Gross Profit", values: income.map((p) => formatBillions(p.gross_profit)), hide: income.every((p) => p.gross_profit == null) },
              { label: "Operating Income", values: income.map((p) => formatBillions(p.operating_income)), hide: income.every((p) => p.operating_income == null) },
              { label: "Profit Before Tax", values: income.map((p) => formatBillions(p.pretax_income)) },
              { label: "Tax", values: income.map((p) => formatBillions(p.tax)) },
              { label: "Net Income", values: income.map((p) => formatBillions(p.net_income)), highlight: true },
              { label: "EPS (per share)", values: income.map((p) => p.eps != null ? `Rs. ${p.eps.toFixed(2)}` : "---"), highlight: true },
            ]}
          />
        </StatementBlock>
      )}

      {balance.length > 0 && (
        <StatementBlock title="Balance Sheet" color="#2B5288">
          <FullWidthTable
            headers={["Item", ...balance.map((p) => p.period)]}
            rows={[
              { label: "Total Assets", values: balance.map((p) => formatBillions(p.total_assets)), highlight: true },
              { label: "Current Assets", values: balance.map((p) => formatBillions(p.current_assets)), hide: balance.every((p) => p.current_assets == null) },
              { label: "Total Equity", values: balance.map((p) => formatBillions(p.total_equity)), highlight: true },
              { label: "Total Liabilities", values: balance.map((p) => formatBillions(p.total_liabilities)) },
              { label: "Total Debt", values: balance.map((p) => formatBillions(p.total_debt)), hide: balance.every((p) => p.total_debt == null) },
              { label: "Cash & Equivalents", values: balance.map((p) => formatBillions(p.cash)) },
              { label: "Current Liabilities", values: balance.map((p) => formatBillions(p.current_liabilities)), hide: balance.every((p) => p.current_liabilities == null) },
            ]}
          />
        </StatementBlock>
      )}

      {cashflow.length > 0 && (
        <StatementBlock title="Cash Flow Statement" color="#E5A100">
          <FullWidthTable
            headers={["Item", ...cashflow.map((p) => p.period)]}
            rows={[
              { label: "Operating Cash Flow", values: cashflow.map((p) => formatBillions(p.operating_cash_flow)), highlight: true },
              { label: "Investing Cash Flow", values: cashflow.map((p) => formatBillions(p.investing_cash_flow)) },
              { label: "Financing Cash Flow", values: cashflow.map((p) => formatBillions(p.financing_cash_flow)) },
              { label: "Free Cash Flow", values: cashflow.map((p) => formatBillions(p.free_cash_flow)), highlight: true },
              { label: "Capital Expenditure", values: cashflow.map((p) => formatBillions(p.capital_expenditure)), hide: cashflow.every((p) => p.capital_expenditure == null) },
              { label: "Cash at End of Period", values: cashflow.map((p) => formatBillions(p.end_cash)) },
            ]}
          />
        </StatementBlock>
      )}

      <p className="text-xs text-[#404E3F]/40 text-center">
        Data sourced from Yahoo Finance. All amounts in PKR. Numbers may differ slightly from PSX filings due to rounding or data timing.
      </p>
    </div>
  );
}

function StatementBlock({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E5E0D9] overflow-hidden">
      <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: color }}>{title}</div>
      {children}
    </div>
  );
}

interface TableRow { label: string; values: string[]; highlight?: boolean; hide?: boolean }

function FullWidthTable({ headers, rows }: { headers: string[]; rows: TableRow[] }) {
  const visibleRows = rows.filter((r) => !r.hide);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8F3EA]">
            {headers.map((h, i) => (
              <th key={i} className={cn("p-4 font-semibold text-[#404E3F] whitespace-nowrap", i === 0 ? "text-left min-w-[180px]" : "text-right min-w-[120px]")}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.label} className={cn("border-t border-[#E5E0D9]", row.highlight ? "bg-[#F8F3EA]/60" : "hover:bg-[#F8F3EA]/30")}>
              <td className={cn("p-4 text-[#404E3F] whitespace-nowrap", row.highlight && "font-semibold")}>{row.label}</td>
              {row.values.map((val, i) => (
                <td key={i} className={cn("p-4 text-right whitespace-nowrap", row.highlight && "font-semibold", val.startsWith("-") ? "text-red-500" : "text-[#404E3F]")}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
