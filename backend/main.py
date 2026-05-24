from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import anthropic
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# ============================================
# MODELS
# ============================================
class MetricsPayload(BaseModel):
    mrr: str
    mrrChange: str
    activeUsers: str
    userChange: str
    churnRate: str
    runway: str
    cashPosition: str
    burnRate: str
    highlights: str
    challenges: str
    nextMonth: str
    asks: str
    companyName: str = "My Company"
    founderName: str = "Founder"

class SendPayload(BaseModel):
    report: str
    subject: str
    recipients: List[str]
    senderEmail: str
    appPassword: str

# ============================================
# GENERATE REPORT
# ============================================
@app.post("/generate-report")
async def generate_report(payload: MetricsPayload):
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        prompt = f"""You are writing a monthly investor update for {payload.founderName}, founder of {payload.companyName}.

Based on these metrics, write a professional, concise investor update email:

MRR: ${payload.mrr} ({payload.mrrChange} MoM)
Active Users: {payload.activeUsers} ({payload.userChange} MoM)
Churn Rate: {payload.churnRate}
Runway: {payload.runway} months
Cash Position: ${payload.cashPosition}
Burn Rate: ${payload.burnRate}/month

Key Highlights this month:
{payload.highlights}

Challenges:
{payload.challenges}

Focus for next month:
{payload.nextMonth}

Asks from investors:
{payload.asks}

Write a warm, professional investor update. Structure it as:
- Subject line (first line, prefixed with "Subject: ")
- Brief greeting
- Performance snapshot with key numbers
- Highlights
- Challenges (honest but confident)
- Next month focus
- Asks
- Closing

Keep it under 400 words. Write like a founder, not a consultant."""

        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"report": message.content[0].text}

    except Exception as e:
        return {"error": str(e)}

# ============================================
# SEND EMAIL
# ============================================
@app.post("/send-email")
async def send_email(payload: SendPayload):
    try:
        sent = []
        failed = []

        for recipient in payload.recipients:
            try:
                msg = MIMEMultipart()
                msg['From'] = payload.senderEmail
                msg['To'] = recipient
                msg['Subject'] = payload.subject

                msg.attach(MIMEText(payload.report, 'plain'))

                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login(payload.senderEmail, payload.appPassword)
                    smtp.sendmail(payload.senderEmail, recipient, msg.as_string())

                sent.append(recipient)
            except Exception:
                failed.append(recipient)

        return {"sent": sent, "failed": failed}

    except Exception as e:
        return {"error": str(e)}

# ============================================
# HEALTH CHECK
# ============================================
@app.get("/health")
async def health():
    return {"status": "ok"}