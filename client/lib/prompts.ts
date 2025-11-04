const medicalRecordPrompt = `Extract structured data from clinical notes and classify urgency.

**INPUT**: Clinical notes (200-2000 words) with patient history, findings, diagnoses, and treatment plans.

**EXTRACT**:
- Patient: name, age, gender, DOB, MRN
- Diagnoses: primary with ICD-10 code and certainty level; secondary conditions
- Medications: name, dosage, frequency, route
- Allergies: allergen, reaction, severity
- Vitals: BP, HR, temp, RR, O2 sat, pain
- Labs: test name, value, unit, range, flag
- Appointments: date, type, provider

**CLASSIFY**: Urgency as ROUTINE, URGENT, EMERGENCY, or CRITICAL

**OUTPUT**:
{
  "patient": {"name": "str", "age": "int", "gender": "str", "dob": "YYYY-MM-DD", "mrn": "str?"},
  "primary_diagnosis": {"condition": "str", "icd10": "str", "certainty": "confirmed|suspected|rule-out"},
  "medications": [{"name": "str", "dosage": "str", "frequency": "str"}],
  "allergies": [{"allergen": "str", "reaction": "str", "severity": "mild|moderate|severe"}],
  "vitals": {"bp": "str", "hr": "int", "temp": "str"},
  "urgency": {"level": "ROUTINE|URGENT|EMERGENCY|CRITICAL", "reasoning": "str"}
}
`;

const ecomProductReviewPrompt = `Analyze product reviews for sentiment, features, and helpfulness.

**INPUT**: Customer reviews (50-1000 words) with informal language, emojis, and mixed sentiments.

**EXTRACT**:
- Overall sentiment: positive/negative/mixed/neutral with confidence
- Features mentioned: quality, value, delivery, service, packaging, accuracy, usability
- Feature-specific sentiment: -2 to +2 scale per feature
- Star rating prediction (1-5) with confidence
- Purchase verification indicators
- Competitor comparisons with favorability
- Specific issues and praise with quotes

**CLASSIFY**: Review quality (1-5) and helpfulness (helpful/not helpful)

**OUTPUT**:
{
  "sentiment": {"type": "positive|negative|mixed|neutral", "confidence": "float"},
  "predicted_stars": {"rating": "int (1-5)", "confidence": "int (0-100)"},
  "features": [{"feature": "str", "sentiment": "int (-2 to +2)", "quote": "str"}],
  "verified_purchase": "bool",
  "competitor_comparison": {"present": "bool", "favorability": "favorable|unfavorable|neutral"},
  "issues": [{"issue": "str", "severity": "minor|moderate|major"}],
  "quality_score": "int (1-5)"
}
`;

const legalContractClausePrompt = `Extract key terms from legal contracts and assess risk.

**INPUT**: Legal contracts (1,000-10,000 words) including terms, warranties, liability, and termination clauses.

**EXTRACT**:
- Contract type: NDA, employment, service, purchase, lease, licensing, etc.
- Parties: names, entity types, jurisdictions, roles
- Dates: effective, execution, expiration, renewal terms
- Financial: payment amounts, schedule, penalties
- Liability: caps, excluded damages, indemnification, insurance
- Confidentiality: duration, scope, exclusions
- IP: ownership and license grants
- Termination: for convenience/cause, notice periods
- Governing law: jurisdiction, dispute resolution
- Restrictive covenants: non-compete, non-solicitation

**CLASSIFY**: Risk level (LOW/MEDIUM/HIGH) and flag concerning clauses

**OUTPUT**:
{
  "type": {"primary": "str", "confidence": "float"},
  "parties": [{"name": "str", "entity_type": "str", "role": "str"}],
  "dates": {"effective": "YYYY-MM-DD", "expiration": "YYYY-MM-DD", "notice_days": "int"},
  "financial": {"total_value": "str", "payment_schedule": "str"},
  "liability": {"cap": "str", "indemnification": "str"},
  "confidentiality": {"duration_years": "int", "scope": "str"},
  "termination": {"for_convenience": "bool", "notice_period": "str"},
  "risk": {"level": "LOW|MEDIUM|HIGH", "flagged_clauses": [{"type": "str", "concern": "str"}]}
}
`;
const newsArticleTopicPrompt = `Categorize news articles, extract entities, and assess credibility.

**INPUT**: News articles (300-3000 words) from various sources and formats.

**EXTRACT**:
- Topics: primary and secondary (politics, business, tech, health, etc.)
- Geographic focus: country, state, city, or global
- Named entities: persons, organizations, locations, events, monetary values, dates
- Key claims: 3-5 factual claims with attribution and verifiability
- Sources: named, anonymous, expert, primary/secondary
- Article type: news report, opinion, analysis, investigative, feature

**CLASSIFY**:
- Stance: supportive, critical, balanced, neutral, advocacy
- Bias indicators: loaded language, one-sided sourcing, omissions
- Credibility score (1-5)

**OUTPUT**:
{
  "topics": {"primary": "str", "secondary": ["str"]},
  "location": "str",
  "entities": {"persons": [{"name": "str", "role": "str"}], "organizations": ["str"], "events": ["str"]},
  "claims": [{"claim": "str", "source": "str", "verifiability": "easily|investigation|unverifiable"}],
  "stance": {"type": "SUPPORTIVE|CRITICAL|BALANCED|NEUTRAL|ADVOCACY", "explanation": "str"},
  "bias": {"detected": "bool", "assessment": "minimal|moderate|substantial"},
  "article_type": "str",
  "credibility": {"score": "int (1-5)", "reasoning": "str"}
}
`;
const customerSupportTicketPrompt = `Triage support tickets for routing, prioritization, and resolution.

**INPUT**: Support tickets (50-500 words) with informal language and mixed issues.

**EXTRACT**:
- Issue category: technical, billing, account, product, feature request, complaint, etc.
- Customer intent: information, resolution, action, feedback, escalation
- Products/services mentioned and order numbers
- Technical details: error messages, platform, device, reproduction steps
- Temporal urgency: deadlines, issue duration
- Customer effort: self-help attempts, previous contacts
- Desired outcome

**CLASSIFY**:
- Sentiment: satisfied, neutral, frustrated, angry, desperate
- Priority: CRITICAL (P1), HIGH (P2), MEDIUM (P3), LOW (P4)
- Routing: technical support, billing, account management, product team
- Complexity: simple, moderate, complex, escalated

**OUTPUT**:
{
  "issue": {"category": "str", "subcategories": ["str"]},
  "intent": {"type": "INFORMATION|RESOLUTION|ACTION|FEEDBACK|ESCALATION", "request": "str"},
  "details": {"products": ["str"], "errors": ["str"], "platform": "str"},
  "urgency": {"deadline": "YYYY-MM-DD", "time_sensitivity": "immediate|urgent|normal"},
  "sentiment": {"state": "SATISFIED|NEUTRAL|FRUSTRATED|ANGRY|DESPERATE", "score": "float (-1 to 1)"},
  "priority": {"level": "CRITICAL|HIGH|MEDIUM|LOW", "reasoning": "str"},
  "routing": {"team": "str", "requires_specialist": "bool"},
  "complexity": {"level": "SIMPLE|MODERATE|COMPLEX|ESCALATED", "est_time": "str"}
}
`;

const resumeParsingPrompt = `**INPUT FORMAT**: Resume or CV documents in plain text format, typically 300-1500 words. May include various formatting styles, bullet points converted to text, multiple sections (education, experience, skills, certifications), and varying levels of detail. May contain abbreviations, acronyms, and industry-specific terminology.

**TASK DESCRIPTION**: You are an advanced resume parsing and candidate evaluation system used by HR departments and recruiting platforms. Your task is to extract structured information from resumes, identify relevant skills and qualifications, calculate experience levels, and evaluate candidate fit for specific roles. This system helps recruiters quickly assess candidate qualifications and match them to appropriate positions.

**EXTRACTION REQUIREMENTS**:
- **Personal Information**: Extract:
  - Full name
  - Contact information (email, phone, LinkedIn URL, portfolio/website)
  - Current location (city, state, country)
  - Desired job title or role (if stated)
- **Professional Summary**: Extract career summary, objective statement, or professional headline if present
- **Work Experience**: For each position, extract:
  - Job title
  - Company name
  - Employment dates (start and end month/year)
  - Duration (calculated in months)
  - Location (city, state/country)
  - Key responsibilities (bullet points or description)
  - Achievements with quantifiable metrics when present
  - Technologies/tools used
  - Employment type (full-time, part-time, contract, freelance, internship)
- **Education**: For each degree, extract:
  - Degree type (Associate, Bachelor's, Master's, PhD, Certificate)
  - Field of study/major
  - Institution name
  - Graduation year (or expected graduation)
  - GPA (if listed and above 3.0)
  - Honors/distinctions (Dean's List, Magna Cum Laude, etc.)
  - Relevant coursework (if listed)
- **Skills**: Categorize and extract:
  - Technical skills (programming languages, software, tools, platforms)
  - Soft skills (leadership, communication, problem-solving)
  - Language proficiencies with levels (native, fluent, intermediate, basic)
  - Industry-specific skills
  - Certifications with names and issuing organizations
- **Certifications and Licenses**: Extract:
  - Certification name
  - Issuing organization
  - Date obtained
  - Expiration date (if applicable)
  - Credential ID (if present)
- **Projects**: Extract any mentioned projects with descriptions, technologies used, and outcomes
- **Publications, Patents, Awards**: Extract if present
- **Professional Memberships**: Extract professional organizations and associations
- **Volunteer Experience**: Extract if present with role and organization

**CLASSIFICATION REQUIREMENTS**:
- **Experience Level**: Classify candidate as:
  - ENTRY_LEVEL: 0-2 years of relevant experience
  - EARLY_CAREER: 2-5 years
  - MID_LEVEL: 5-10 years
  - SENIOR: 10-15 years
  - EXECUTIVE/EXPERT: 15+ years
- **Career Trajectory**: Assess career progression:
  - UPWARD: Clear progression to more senior roles and responsibilities
  - LATERAL: Moves across similar level positions (potentially building breadth)
  - MIXED: Combination of upward and lateral moves
  - UNCLEAR: Insufficient information or non-linear path
  - STAGNANT: No clear progression over time
- **Job Stability**: Assess tenure patterns:
  - STABLE: Average tenure > 3 years per position
  - MODERATE: Average tenure 1.5-3 years
  - FREQUENT_CHANGES: Average tenure < 1.5 years
- **Technical Proficiency**: For tech roles, categorize skill levels:
  - Extract years of experience per technology when inferable
  - Identify primary vs. secondary technical skills based on emphasis and recency

**JOB MATCHING (IF JOB DESCRIPTION PROVIDED)**:
If a job description is provided alongside the resume, also include:
- **Match Score**: Overall fit percentage (0-100%)
- **Required Skills Match**: Percentage of required skills present
- **Preferred Skills Match**: Percentage of preferred skills present
- **Experience Match**: Whether years of experience meets requirements
- **Education Match**: Whether education level meets requirements
- **Missing Critical Qualifications**: List key requirements not met
- **Standout Qualifications**: List impressive qualifications that exceed requirements

**OUTPUT FORMAT**: Return the following schema:
{
  "personal_information": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "linkedin": "string (URL) or null",
    "portfolio_website": "string (URL) or null",
    "location": "string",
    "desired_role": "string or null"
  },
  "professional_summary": "string or null",
  "work_experience": [
    {
      "job_title": "string",
      "company": "string",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or 'Present'",
      "duration_months": "integer",
      "location": "string or null",
      "employment_type": "string",
      "responsibilities": ["array of strings"],
      "achievements": ["array of strings with metrics when available"],
      "technologies_used": ["array of strings"]
    }
  ],
  "total_experience_years": "float",
  "education": [
    {
      "degree_type": "string",
      "field_of_study": "string",
      "institution": "string",
      "graduation_year": "integer or null",
      "gpa": "float or null",
      "honors": "string or null",
      "relevant_coursework": ["array of strings"]
    }
  ],
  "skills": {
    "technical_skills": [
      {
        "skill": "string",
        "proficiency_level": "expert|advanced|intermediate|beginner or null",
        "years_experience": "integer or null"
      }
    ],
    "soft_skills": ["array of strings"],
    "languages": [
      {
        "language": "string",
        "proficiency": "native|fluent|professional|intermediate|basic"
      }
    ],
    "industry_skills": ["array of strings"]
  },
  "certifications": [
    {
      "name": "string",
      "issuing_organization": "string",
      "date_obtained": "YYYY-MM or null",
      "expiration_date": "YYYY-MM or null",
      "credential_id": "string or null"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["array of strings"],
      "url": "string or null"
    }
  ],
  "publications": ["array of strings"],
  "awards": ["array of strings"],
  "professional_memberships": ["array of strings"],
  "volunteer_experience": ["array of strings"],
  "experience_level": {
    "classification": "ENTRY_LEVEL|EARLY_CAREER|MID_LEVEL|SENIOR|EXECUTIVE",
    "years_of_experience": "float"
  },
  "career_assessment": {
    "career_trajectory": "UPWARD|LATERAL|MIXED|UNCLEAR|STAGNANT",
    "trajectory_reasoning": "string",
    "job_stability": "STABLE|MODERATE|FREQUENT_CHANGES",
    "average_tenure_months": "float",
    "career_gaps": [
      {
        "start_date": "YYYY-MM",
        "end_date": "YYYY-MM",
        "duration_months": "integer"
      }
    ]
  },
  "technical_profile": {
    "primary_technical_skills": ["array of top 5-10 skills"],
    "technology_stack_focus": "string (e.g., 'Full-stack JavaScript', 'Data Engineering', 'Cloud Infrastructure')",
    "most_recent_technologies": ["array of technologies used in last 2 years"]
  },
  "job_match_analysis": {
    "overall_match_score": "integer (0-100)",
    "required_skills_match_percentage": "integer (0-100)",
    "preferred_skills_match_percentage": "integer (0-100)",
    "experience_match": "exceeds|meets|below",
    "education_match": "exceeds|meets|below",
    "missing_critical_qualifications": ["array of strings"],
    "standout_qualifications": ["array of strings"],
    "recommendations": "string (hiring recommendation summary)"
  }
}
`;

const financialDocumentAnalysis = `**INPUT FORMAT**: Financial documents (invoices, receipts, purchase orders, bills) in text format extracted from OCR or digital documents. Length varies from 100-1000 words. May include tabular data, line items, tax calculations, terms and conditions. Can have various formats depending on vendor/industry standards.

**TASK DESCRIPTION**: You are an automated accounts payable and financial document processing system. Your role is to extract structured financial data from invoices and related documents, validate calculations, classify expenses, identify payment terms, and flag anomalies or issues that require human review. This system helps accounting departments automate invoice processing and reduce manual data entry.

**EXTRACTION REQUIREMENTS**:
- **Document Type**: Classify as Invoice, Receipt, Purchase Order, Credit Note, Debit Note, Bill, Quote/Estimate, Packing Slip
- **Vendor Information**: Extract:
  - Vendor/seller legal name
  - Vendor address (full address)
  - Vendor tax ID (EIN, VAT number, etc.)
  - Vendor contact (phone, email, website)
  - Vendor bank details if present (account number, routing number)
- **Customer/Buyer Information**: Extract:
  - Customer name (company or individual)
  - Customer address (billing address)
  - Shipping address (if different from billing)
  - Customer account number or ID
- **Document Identifiers**: Extract:
  - Invoice number/document number
  - Purchase order number (PO#) if referenced
  - Customer reference number
  - Quote or contract number if referenced
- **Date Information**: Extract:
  - Invoice date/document date
  - Due date for payment
  - Service/delivery date or period
  - Payment terms in days (Net 30, Net 60, etc.)
- **Line Items**: For each product/service line, extract:
  - Item description or product name
  - Item/SKU code if present
  - Quantity
  - Unit of measure (each, hours, pounds, etc.)
  - Unit price
  - Line total (before tax)
  - Discount amount or percentage (if applicable)
  - Tax rate applied
  - Line item tax amount
- **Financial Totals**: Extract and validate:
  - Subtotal (sum of all line items before tax)
  - Total discount amount
  - Shipping/delivery charges
  - Other fees or charges itemized
  - Tax amount by rate (if multiple tax rates, break down by rate)
  - Total tax amount
  - Grand total/amount due
  - Amount paid (if partial payment)
  - Balance due
  - Currency code (USD, EUR, GBP, etc.)
- **Payment Information**: Extract:
  - Payment methods accepted
  - Early payment discount terms (2/10 Net 30, etc.)
  - Late payment penalties or interest rates
  - Payment instructions
- **Tax Details**: Extract:
  - Tax rates applied (percentage)
  - Tax jurisdiction (state, country)
  - Tax exemption status if indicated
  - Tax ID numbers
- **Additional Terms**: Extract:
  - Delivery terms (FOB, CIF, etc.)
  - Warranty information
  - Return policy
  - Notes or special instructions

**CLASSIFICATION REQUIREMENTS**:
- **Expense Category**: Classify the primary expense type:
  - COGS (Cost of Goods Sold): Raw materials, wholesale products
  - OPERATING_EXPENSE: Rent, utilities, supplies, subscriptions
  - PAYROLL: Contractor payments, payroll services
  - MARKETING: Advertising, promotions, agency fees
  - TECHNOLOGY: Software licenses, IT services, hosting
  - TRAVEL: Airfare, hotels, meals, transportation
  - PROFESSIONAL_SERVICES: Legal, accounting, consulting
  - EQUIPMENT: Machinery, computers, furniture
  - MAINTENANCE: Repairs, maintenance services
  - OTHER: Specify if doesn't fit standard categories
- **Payment Status**: Classify current status:
  - UNPAID: Due date not reached, no payment recorded
  - OVERDUE: Past due date, no payment recorded
  - PARTIALLY_PAID: Some payment made, balance remaining
  - PAID: Fully paid
  - DISPUTED: Issue flagged with invoice
- **Priority Level**: Assign processing priority:
  - URGENT: Overdue, large amount, penalty risk, important vendor
  - HIGH: Due soon (within 7 days), medium-to-large amount
  - NORMAL: Standard payment timeline (7-30 days)
  - LOW: Far future due date, small amount

**VALIDATION AND ANOMALY DETECTION**:
- **Mathematical Validation**: Check if:
  - Line item calculations are correct (quantity × unit price = line total)
  - Subtotal equals sum of all line items
  - Tax calculations are correct (subtotal × tax rate = tax amount)
  - Grand total = subtotal + tax + shipping + fees - discounts
- **Anomaly Flags**: Identify potential issues:
  - Calculation errors or mismatches
  - Duplicate invoice number
  - Unusually high amount for vendor/category
  - Missing required fields (PO number if required, tax ID, etc.)
  - Tax rate inconsistency for jurisdiction
  - Payment terms unusually strict or loose
  - Suspicious vendor information (mismatched names/addresses)

**OUTPUT FORMAT**: Return the following schema:
{
  "document_classification": {
    "document_type": "string",
    "confidence": "float (0-1)"
  },
  "vendor_information": {
    "name": "string",
    "address": "string",
    "tax_id": "string or null",
    "contact_phone": "string or null",
    "contact_email": "string or null",
    "website": "string or null",
    "bank_details": "string or null"
  },
  "customer_information": {
    "name": "string",
    "billing_address": "string",
    "shipping_address": "string or null",
    "account_number": "string or null"
  },
  "document_identifiers": {
    "invoice_number": "string",
    "purchase_order_number": "string or null",
    "customer_reference": "string or null",
    "contract_number": "string or null"
  },
  "dates": {
    "invoice_date": "YYYY-MM-DD",
    "due_date": "YYYY-MM-DD",
    "service_period_start": "YYYY-MM-DD or null",
    "service_period_end": "YYYY-MM-DD or null",
    "payment_terms_days": "integer or null",
    "payment_terms_description": "string"
  },
  "line_items": [
    {
      "description": "string",
      "item_code": "string or null",
      "quantity": "float",
      "unit_of_measure": "string",
      "unit_price": "float",
      "line_subtotal": "float",
      "discount_amount": "float",
      "tax_rate": "float (as decimal, e.g., 0.08 for 8%)",
      "tax_amount": "float",
      "line_total": "float"
    }
  ],
  "financial_totals": {
    "subtotal": "float",
    "total_discount": "float",
    "shipping_charges": "float",
    "other_fees": [
      {
        "description": "string",
        "amount": "float"
      }
    ],
    "tax_breakdown": [
      {
        "tax_type": "string (e.g., 'Sales Tax', 'VAT')",
        "rate": "float",
        "taxable_amount": "float",
        "tax_amount": "float"
      }
    ],
    "total_tax": "float",
    "grand_total": "float",
    "amount_paid": "float",
    "balance_due": "float",
    "currency": "string (ISO code)"
  },
  "payment_information": {
    "payment_methods_accepted": ["array of strings"],
    "early_payment_discount": "string or null",
    "late_payment_penalty": "string or null",
    "payment_instructions": "string or null"
  },
  "tax_details": {
    "tax_jurisdiction": "string",
    "vendor_tax_id": "string or null",
    "customer_tax_id": "string or null",
    "tax_exempt": "boolean"
  },
  "additional_terms": {
    "delivery_terms": "string or null",
    "warranty": "string or null",
    "return_policy": "string or null",
    "notes": "string or null"
  },
  "expense_classification": {
    "primary_category": "string",
    "subcategory": "string or null",
    "gl_code_suggestion": "string or null"
  },
  "payment_status": {
    "status": "UNPAID|OVERDUE|PARTIALLY_PAID|PAID|DISPUTED",
    "days_until_due": "integer (negative if overdue)",
    "priority": "URGENT|HIGH|NORMAL|LOW"
  },
  "validation_results": {
    "calculations_valid": "boolean",
    "calculation_errors": ["array of strings describing any errors found"],
    "all_required_fields_present": "boolean",
    "missing_required_fields": ["array of strings"]
  },
  "anomaly_flags": [
    {
      "flag_type": "string",
      "severity": "critical|high|medium|low",
      "description": "string",
      "recommendation": "string"
    }
  ],
  "requires_human_review": "boolean",
  "review_reasons": ["array of strings explaining why review is needed"]
}
`;

const socialMediaContentModeration = `**INPUT FORMAT**: Social media posts, comments, or messages in plain text format, typically 10-500 words. May include informal language, slang, hashtags, @mentions, emojis, URLs, and multilingual content. Content may be from platforms like Twitter/X, Facebook, Instagram, Reddit, TikTok captions, or YouTube comments.

**TASK DESCRIPTION**: You are a comprehensive content moderation system that identifies policy violations, harmful content, spam, and inappropriate material across social media platforms. Your analysis helps platform moderators prioritize review queues, automatically filter content, and protect users from harmful experiences. The system must balance free expression with safety, flag edge cases for human review, and adapt to various cultural contexts.

**EXTRACTION REQUIREMENTS**:
- **Content Type**: Classify as Post/Tweet, Comment/Reply, Direct Message, Bio/Profile, Image Caption, Video Description, Story/Status
- **Language Detection**: Identify primary language(s) used in the content
- **Mentioned Entities**: Extract:
  - @mentions (usernames)
  - #hashtags
  - URLs/links
  - Subreddit or community references
  - Geographic locations mentioned
- **Topic Identification**: Identify main topics discussed (politics, sports, entertainment, personal life, products, news events, etc.)

**CLASSIFICATION REQUIREMENTS** (Multi-label - multiple can apply):

**Primary Safety Classifications**:
- **SAFE**: Content that doesn't violate any policies
- **HATE_SPEECH**: Content attacking people based on protected characteristics (race, ethnicity, religion, gender, sexual orientation, disability, etc.)
  - Severity: MILD (borderline/ambiguous) | MODERATE (clear targeting) | SEVERE (explicit calls for harm/violence)
- **HARASSMENT_BULLYING**: Targeted abuse, threats, intimidation, doxxing, or sustained harassment
  - Severity: MILD (rude/mean) | MODERATE (targeted attacks) | SEVERE (threats, doxxing)
- **VIOLENCE_GORE**: Depictions or glorification of violence, graphic content, gore, or threats of violence
  - Severity: MILD (cartoon violence) | MODERATE (realistic depictions) | SEVERE (graphic/glorified)
- **SELF_HARM**: Content promoting, glorifying, or providing instructions for self-harm or suicide
  - Severity: MODERATE (concerning references) | SEVERE (explicit instructions/encouragement)
- **SEXUAL_CONTENT**: Pornographic, sexually explicit, or sexualized content
  - Subcategories: NSFW_ADULT (consensual adult content) | EXPLOITATIVE (non-consensual, minors, trafficking)
- **CHILD_SAFETY**: Content sexualizing, endangering, or exploiting minors
  - **ALWAYS CRITICAL** - Requires immediate escalation
- **SPAM**: Repetitive, commercial spam, phishing, or manipulative engagement bait
  - Types: COMMERCIAL | ENGAGEMENT_BAIT | PHISHING | SCAM
- **MISINFORMATION**: False or misleading information
  - Categories: HEALTH_MISINFO | ELECTION_MISINFO | MANIPULATED_MEDIA | CONSPIRACY | GENERAL
  - Severity: LOW (opinion/satire) | MODERATE (misleading) | HIGH (demonstrably false and harmful)
- **ILLEGAL_ACTIVITY**: Content promoting illegal activities (drug sales, weapons trafficking, fraud, etc.)
- **COPYRIGHT_IP**: Potential copyright or intellectual property violations
- **COORDINATED_INAUTHENTIC**: Signs of bot activity, fake accounts, or coordinated campaigns

**Secondary Flags**:
- **NEEDS_CW**: Content that should have content/trigger warnings (mental health, trauma, etc.)
- **POTENTIAL_SATIRE**: May be satirical or parody (reduces certainty of violations)
- **CULTURALLY_SENSITIVE**: Content that may be acceptable in some cultural contexts but problematic in others
- **POLITICAL**: Politically charged content requiring careful handling
- **EDGE_CASE**: Borderline case requiring human judgment

**SENTIMENT ANALYSIS**:
- Overall tone: POSITIVE | NEGATIVE | NEUTRAL | MIXED
- Emotional intensity: LOW | MODERATE | HIGH | EXTREME

**USER RISK ASSESSMENT**:
- **Account Age**: NEW (< 30 days) | ESTABLISHED (30-365 days) | VETERAN (> 1 year)
- **Posting Pattern**: NORMAL | SUSPICIOUS (rapid posting, templated messages) | BOT_LIKE
- **Historical Violations**: Extract if mentioned (prior warnings, strikes, suspensions)

**RECOMMENDED ACTION**:
- **NO_ACTION**: Content is safe, no moderation needed
- **WARN_USER**: Send automated warning about policy violation
- **REQUIRE_EDIT**: Request user to edit/remove violating content
- **SHADOW_RESTRICT**: Limit visibility without notifying user (for spam/engagement bait)
- **REMOVE_CONTENT**: Delete the content, notify user
- **TEMPORARY_SUSPENSION**: Suspend account temporarily (specify duration: 24h, 7d, 30d)
- **PERMANENT_BAN**: Permanently ban account
- **ESCALATE_TO_HUMAN**: Flag for human moderator review
- **ESCALATE_TO_TRUST_SAFETY**: Escalate to specialized team (for CSAM, imminent harm, etc.)
- **REPORT_TO_AUTHORITIES**: Requires law enforcement notification

**OUTPUT FORMAT**: Return the following schema:
{
  "content_metadata": {
    "content_type": "string",
    "primary_language": "string",
    "additional_languages": ["array of strings"],
    "character_count": "integer",
    "word_count": "integer"
  },
  "extracted_elements": {
    "mentions": ["array of strings"],
    "hashtags": ["array of strings"],
    "urls": [
      {
        "url": "string",
        "domain": "string",
        "suspicious": "boolean"
      }
    ],
    "locations_mentioned": ["array of strings"]
  },
  "topic_classification": {
    "primary_topics": ["array of strings"],
    "is_political": "boolean",
    "is_commercial": "boolean"
  },
  "safety_classifications": [
    {
      "category": "string (from safety classifications above)",
      "detected": "boolean",
      "confidence": "float (0-1)",
      "severity": "MILD|MODERATE|SEVERE|CRITICAL or null",
      "subcategory": "string or null",
      "specific_violations": ["array of strings describing what specifically violates policy"],
      "supporting_evidence": ["array of strings with quoted phrases that support classification"]
    }
  ],
  "overall_safety_score": "float (0-1, where 0 is extremely unsafe, 1 is completely safe)",
  "secondary_flags": {
    "needs_content_warning": "boolean",
    "potential_satire": "boolean",
    "culturally_sensitive": "boolean",
    "political_content": "boolean",
    "edge_case": "boolean"
  },
  "sentiment_analysis": {
    "overall_tone": "POSITIVE|NEGATIVE|NEUTRAL|MIXED",
    "emotional_intensity": "LOW|MODERATE|HIGH|EXTREME",
    "hostile_tone": "boolean"
  },
  "misinformation_assessment": {
    "likely_misinformation": "boolean",
    "category": "string or null",
    "verifiability": "easily_verifiable|requires_fact_check|opinion_based",
    "claims_to_fact_check": ["array of strings"]
  },
  "user_risk_indicators": {
    "account_age_category": "NEW|ESTABLISHED|VETERAN",
    "posting_pattern": "NORMAL|SUSPICIOUS|BOT_LIKE",
    "coordination_signals": ["array of strings if coordinated behavior detected"],
    "authenticity_concerns": "boolean"
  },
  "recommended_action": {
    "primary_action": "string (from recommended actions above)",
    "secondary_actions": ["array of additional actions to consider"],
    "urgency": "LOW|MEDIUM|HIGH|CRITICAL",
    "requires_human_review": "boolean",
    "explanation": "string (clear reasoning for the recommendation)",
    "suggested_suspension_duration": "string or null (if applicable)"
  },
  "policy_violations": [
    {
      "policy_section": "string (specific policy violated)",
      "violation_description": "string",
      "first_offense": "boolean or null"
    }
  ],
  "special_escalations": {
    "requires_legal_team": "boolean",
    "requires_law_enforcement": "boolean",
    "imminent_harm_risk": "boolean",
    "child_safety_concern": "boolean"
  },
  "context_notes": "string (any additional context that human reviewers should consider)",
  "false_positive_risk": "LOW|MEDIUM|HIGH (how likely this is a false positive requiring human verification)"
}
`;

const academicPaperClassification = `**INPUT FORMAT**: Academic paper abstracts or full texts in plain text format, typically 200-10,000 words depending on whether abstract-only or full paper. Content includes scientific/technical language, citations, mathematical notation, methodology descriptions, results, and conclusions. Papers may be from various disciplines (STEM, social sciences, humanities).

**TASK DESCRIPTION**: You are a scholarly document analysis system used by academic databases, research institutions, and literature review tools. Your task is to classify papers by discipline and methodology, extract key research elements, assess novelty and impact, identify relationships to prior work, and help researchers quickly understand a paper's contribution to the field.

**EXTRACTION REQUIREMENTS**:
- **Bibliographic Information**: Extract:
  - Paper title
  - Author names with affiliations
  - Publication venue (journal name, conference name)
  - Publication year
  - DOI or other identifiers
  - Volume, issue, page numbers if present
- **Research Problem**: Extract:
  - The main research question or problem being addressed
  - Gap in existing knowledge or limitations of prior work
  - Motivation for the research
- **Research Objectives**: Extract specific goals or hypotheses stated
- **Methodology**: Extract:
  - Research approach (experimental, theoretical, computational, qualitative, mixed-methods)
  - Specific methods/techniques used
  - Datasets or materials used
  - Sample size or scope
  - Tools/software/equipment mentioned
  - Statistical methods or analytical frameworks
- **Key Findings**: Extract:
  - Main results (quantitative and qualitative)
  - Performance metrics achieved
  - Statistical significance of results
  - Novel discoveries or insights
- **Contributions**: Extract stated contributions:
  - Theoretical contributions
  - Methodological innovations
  - Practical applications
  - Dataset or tool releases
  - Empirical findings
- **Limitations**: Extract acknowledged limitations or constraints
- **Future Work**: Extract suggested directions for future research
- **Citations and References**: Extract:
  - Number of references
  - Key cited works (most relevant 3-5 papers mentioned)
  - Self-citations vs. external citations if inferable
- **Keywords**: Extract author-provided keywords or identify main concepts
- **Funding**: Extract funding sources if mentioned

**CLASSIFICATION REQUIREMENTS**:

**Primary Discipline**: Classify into main field:
- Computer Science & IT
- Engineering (specify: Electrical, Mechanical, Civil, Chemical, etc.)
- Natural Sciences (specify: Physics, Chemistry, Biology, Earth Sciences)
- Mathematics & Statistics
- Medicine & Health Sciences
- Social Sciences (specify: Psychology, Sociology, Economics, Political Science, etc.)
- Humanities (specify: History, Philosophy, Literature, etc.)
- Interdisciplinary

**Sub-discipline**: Provide more specific field classification (e.g., "Computer Science" → "Machine Learning" → "Natural Language Processing")

**Research Type**: Classify as:
- EMPIRICAL: Original data collection and analysis
- EXPERIMENTAL: Controlled experiments
- THEORETICAL: Mathematical or conceptual framework development
- COMPUTATIONAL: Simulation or algorithm development
- REVIEW: Literature review, systematic review, meta-analysis
- CASE_STUDY: In-depth examination of specific case(s)
- METHODOLOGICAL: New method or technique development
- SURVEY: Large-scale data collection via surveys
- META_ANALYSIS: Statistical aggregation of multiple studies

**Methodology Classification**:
- QUANTITATIVE: Numerical data and statistical analysis
- QUALITATIVE: Non-numerical data, thematic analysis
- MIXED_METHODS: Combination of both
- COMPUTATIONAL: Primarily algorithmic/simulation

**Novelty Assessment**: Rate the claimed novelty (1-5):
- 5 = Groundbreaking: Paradigm-shifting contribution
- 4 = Highly Novel: Significant new approach or finding
- 3 = Moderately Novel: Meaningful extension of existing work
- 2 = Incremental: Small improvement or specific application
- 1 = Limited Novelty: Replication or minor variation

**Impact Potential**: Assess potential impact (1-5):
- 5 = Transformative: Could change field significantly
- 4 = High Impact: Important contribution with broad applications
- 3 = Moderate Impact: Useful for sub-field or specific applications
- 2 = Limited Impact: Narrow application or interest
- 1 = Minimal Impact: Very specialized or incremental

**Reproducibility Assessment**: Evaluate reproducibility:
- HIGH: Detailed methods, data/code available, clear procedures
- MODERATE: Adequate description, some materials available
- LOW: Vague methods, insufficient detail, no materials shared
- CANNOT_ASSESS: Insufficient information

**OUTPUT FORMAT**: Return the following schema:
{
  "bibliographic_information": {
    "title": "string",
    "authors": [
      {
        "name": "string",
        "affiliation": "string or null"
      }
    ],
    "publication_venue": "string",
    "publication_year": "integer",
    "doi": "string or null",
    "volume": "string or null",
    "issue": "string or null",
    "pages": "string or null"
  },
  "research_elements": {
    "research_problem": "string",
    "research_gap": "string",
    "objectives": ["array of strings"],
    "hypotheses": ["array of strings or empty"]
  },
  "methodology": {
    "research_approach": "string",
    "specific_methods": ["array of strings"],
    "datasets": ["array of strings"],
    "sample_size": "string or null",
    "tools_used": ["array of strings"],
    "statistical_methods": ["array of strings"],
    "analytical_framework": "string or null"
  },
  "key_findings": {
    "main_results": ["array of strings"],
    "performance_metrics": [
      {
        "metric_name": "string",
        "value": "string",
        "baseline_comparison": "string or null"
      }
    ],
    "statistical_significance": "string or null",
    "novel_discoveries": ["array of strings"]
  },
  "contributions": {
    "theoretical": ["array of strings"],
    "methodological": ["array of strings"],
    "practical": ["array of strings"],
    "datasets_released": ["array of strings"],
    "tools_released": ["array of strings"],
    "empirical_findings": ["array of strings"]
  },
  "limitations": ["array of strings"],
  "future_work": ["array of strings"],
  "citations": {
    "total_references": "integer or null",
    "key_cited_works": [
      {
        "citation": "string",
        "relevance": "string (why this citation is important)"
      }
    ]
  },
  "keywords": ["array of strings"],
  "funding_sources": ["array of strings or empty"],
  "discipline_classification": {
    "primary_discipline": "string",
    "sub_discipline": "string",
    "interdisciplinary_fields": ["array of strings if applicable"],
    "confidence": "float (0-1)"
  },
  "research_type": {
    "primary_type": "string",
    "secondary_types": ["array of strings"],
    "methodology_type": "QUANTITATIVE|QUALITATIVE|MIXED_METHODS|COMPUTATIONAL"
  },
  "assessment_scores": {
    "novelty_score": "integer (1-5)",
    "novelty_justification": "string",
    "impact_potential_score": "integer (1-5)",
    "impact_justification": "string",
    "reproducibility": "HIGH|MODERATE|LOW|CANNOT_ASSESS",
    "reproducibility_notes": "string"
  },
  "research_quality_indicators": {
    "clear_objectives": "boolean",
    "rigorous_methodology": "boolean",
    "adequate_validation": "boolean",
    "limitations_acknowledged": "boolean",
    "ethical_considerations_addressed": "boolean",
    "data_availability": "boolean",
    "code_availability": "boolean"
  },
  "summary_for_researchers": "string (2-3 sentence plain-language summary of contribution)",
  "recommended_tags": ["array of strings for database indexing"],
  "related_research_areas": ["array of strings suggesting where this work fits in the literature"]
}
`;

const voiceOfCustomerAnalysis = `**INPUT FORMAT**: Customer feedback text from multiple sources including survey responses, social media mentions, customer support transcripts, online reviews, focus group transcripts, user interviews, and feedback forms. Text length varies from single sentences to multi-paragraph responses (10-2000 words). May contain mixed sentiment, multiple topics, specific product/feature mentions, and emotional language.

**TASK DESCRIPTION**: You are an advanced Voice of Customer analytics system that processes diverse feedback sources to extract actionable insights for product, marketing, and customer experience teams. Your analysis identifies patterns, prioritizes issues, uncovers opportunities, tracks sentiment trends, and links feedback to specific product features or customer journey stages. This system helps organizations transform unstructured feedback into strategic decisions.

**EXTRACTION REQUIREMENTS**:

**Feedback Metadata**:
- **Source Type**: Survey, Social Media, Support Ticket, Review (App Store, Google Play, Trustpilot, etc.), Interview/Focus Group, Email, Community Forum, Sales Call Transcript
- **Customer Segment**: If inferable - New Customer, Long-term Customer, Churned Customer, Free User, Paid User, Enterprise Customer, SMB Customer
- **Date/Timeframe**: Extract if mentioned
- **Product/Service Referenced**: Specific product name, feature, or service area

**Core Content Extraction**:
- **Primary Topics**: Identify all distinct topics discussed (can be multiple per feedback)
  - Product Features (specific features mentioned)
  - Pricing/Value
  - Customer Service Experience
  - User Experience/Usability
  - Performance/Reliability
  - Documentation/Support Resources
  - Onboarding/Setup
  - Integrations/Compatibility
  - Billing/Account Management
  - Specific Use Cases
  - Competitor Comparisons
- **Sentiment Per Topic**: For each topic identified, classify sentiment:
  - VERY_POSITIVE (+2): Enthusiastic praise, exceeded expectations
  - POSITIVE (+1): Satisfied, meets expectations
  - NEUTRAL (0): Factual statement, no clear sentiment
  - NEGATIVE (-1): Dissatisfied, unmet expectations
  - VERY_NEGATIVE (-2): Frustrated, angry, considering churn
- **Pain Points**: Extract specific problems, frustrations, or obstacles mentioned
  - Severity: CRITICAL (blocking usage) | HIGH (major friction) | MEDIUM (annoying) | LOW (minor inconvenience)
  - Frequency indicators: "always", "often", "sometimes", "occasionally"
- **Positive Highlights**: Extract specific praise, delightful experiences, or things working well
- **Feature Requests**: Identify explicit or implicit requests for new features or improvements
  - Urgency: HIGH (essential for customer) | MEDIUM (would be helpful) | LOW (nice to have)
- **Competitive Mentions**: Extract references to competitors
  - Comparison type: FAVORABLE (we're better) | UNFAVORABLE (competitor better) | NEUTRAL (just mentioned)
  - Specific differentiators mentioned
- **Customer Journey Stage**: Identify which stage of journey feedback relates to:
  - AWARENESS: Marketing, brand perception
  - CONSIDERATION: Sales process, evaluation
  - PURCHASE: Buying experience, pricing
  - ONBOARDING: Setup, initial experience
  - ADOPTION: Regular usage, learning curve
  - RETENTION: Ongoing satisfaction, renewals
  - EXPANSION: Upsell opportunities, additional products
  - ADVOCACY: Referrals, recommendations
  - CHURN_RISK: Cancellation considerations
- **Emotional Indicators**: Identify emotional language:
  - JOY/DELIGHT: "love", "amazing", "thrilled"
  - FRUSTRATION: "annoying", "disappointed", "frustrated"
  - CONFUSION: "don't understand", "unclear", "confusing"
  - ANXIETY/CONCERN: "worried", "concerned", "nervous"
  - ANGER: "unacceptable", "terrible", "worst"
  - TRUST: "reliable", "trustworthy", "confidence"
- **Actionable Quotes**: Extract 1-3 most impactful verbatim quotes that capture key insights

**CLASSIFICATION REQUIREMENTS**:

**Overall Sentiment**: PROMOTER (very positive, likely to recommend) | PASSIVE (satisfied but not enthusiastic) | DETRACTOR (negative, at-risk)

**Feedback Type**: Classify primary purpose:
- COMPLAINT: Reporting problem or expressing dissatisfaction
- COMPLIMENT: Expressing satisfaction or praise
- SUGGESTION: Proposing improvement or new feature
- QUESTION: Seeking information or clarification
- BUG_REPORT: Technical issue reporting
- FEATURE_REQUEST: Explicit request for new capability
- COMPARISON: Comparing to competitor or alternative
- USE_CASE: Describing how they use the product
- MIXED: Combination of multiple types

**Priority Score**: Calculate priority for action (1-100) based on:
- Sentiment intensity
- Customer value (if segment known)
- Issue severity
- Frequency of mention (if part of aggregate analysis)
- Potential impact on churn or expansion

**Theme Categories**: Map feedback to strategic themes:
- PRODUCT_QUALITY: Core functionality and reliability
- USER_EXPERIENCE: Ease of use, interface, workflow
- CUSTOMER_SUPPORT: Support team, documentation, resources
- VALUE_FOR_MONEY: Pricing perception, ROI
- PERFORMANCE: Speed, uptime, scalability
- INNOVATION: New features, staying competitive
- INTEGRATION_ECOSYSTEM: Third-party connections
- ONBOARDING_EDUCATION: Learning curve, training
- TRUST_SECURITY: Data protection, reliability concerns
- COMMUNITY_ENGAGEMENT: User community, forums

**Churn Risk Indicators**: Flag signals of potential churn:
- Direct cancellation mention
- Frustration with unresolved issues
- Frequent comparison to competitors
- Downgrade mention
- Payment concerns
- Lack of value realization
- Usage pattern changes (if mentioned)

**Opportunity Indicators**: Flag potential for growth:
- Expansion interest
- Feature requests aligned with upsell
- Advocacy behavior
- Increased usage intent
- Referral willingness

**OUTPUT FORMAT**: Return the following schema:
{
  "feedback_metadata": {
    "source_type": "string",
    "customer_segment": "string or null",
    "date": "YYYY-MM-DD or null",
    "product_service": "string or null",
    "customer_id": "string or null (if available)",
    "feedback_length_words": "integer"
  },
  "topics_analyzed": [
    {
      "topic": "string",
      "category": "string (from topic list above)",
      "sentiment": "VERY_POSITIVE|POSITIVE|NEUTRAL|NEGATIVE|VERY_NEGATIVE",
      "sentiment_score": "integer (-2 to +2)",
      "mentions_count": "integer (how many times topic appears)",
      "key_phrases": ["array of relevant phrases/quotes"]
    }
  ],
  "pain_points": [
    {
      "pain_point": "string (concise description)",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "frequency_indicator": "string or null",
      "related_topic": "string",
      "supporting_quote": "string"
    }
  ],
  "positive_highlights": [
    {
      "highlight": "string",
      "related_topic": "string",
      "supporting_quote": "string"
    }
  ],
  "feature_requests": [
    {
      "request": "string",
      "urgency": "HIGH|MEDIUM|LOW",
      "use_case": "string (why customer wants this)",
      "supporting_quote": "string"
    }
  ],
  "competitive_intelligence": {
    "competitors_mentioned": [
      {
        "competitor": "string",
        "comparison_type": "FAVORABLE|UNFAVORABLE|NEUTRAL",
        "specific_differentiator": "string",
        "quote": "string"
      }
    ]
  },
  "customer_journey_mapping": {
    "primary_stage": "string (from journey stages)",
    "stage_specific_insights": "string"
  },
  "emotional_analysis": {
    "dominant_emotion": "string",
    "emotional_intensity": "LOW|MODERATE|HIGH|EXTREME",
    "emotions_detected": [
      {
        "emotion": "string",
        "indicators": ["array of emotion words/phrases"]
      }
    ]
  },
  "impactful_quotes": [
    {
      "quote": "string (verbatim)",
      "significance": "string (why this quote is important)"
    }
  ],
  "overall_sentiment": {
    "classification": "PROMOTER|PASSIVE|DETRACTOR",
    "nps_equivalent": "integer (0-10 estimated NPS score)",
    "sentiment_confidence": "float (0-1)"
  },
  "feedback_classification": {
    "primary_type": "string",
    "secondary_types": ["array of strings"]
  },
  "priority_assessment": {
    "priority_score": "integer (1-100)",
    "scoring_factors": [
      {
        "factor": "string",
        "weight": "string (contribution to score)"
      }
    ],
    "recommended_action": "string",
    "recommended_owner": "string (which team should handle)"
  },
  "strategic_themes": [
    {
      "theme": "string (from theme categories)",
      "relevance_score": "integer (1-10)",
      "action_items": ["array of strings"]
    }
  ],
  "risk_and_opportunity": {
    "churn_risk": {
      "risk_level": "NONE|LOW|MEDIUM|HIGH|CRITICAL",
      "risk_indicators": ["array of strings"],
      "recommended_intervention": "string or null"
    },
    "expansion_opportunity": {
      "opportunity_level": "NONE|LOW|MEDIUM|HIGH",
      "opportunity_indicators": ["array of strings"],
      "recommended_approach": "string or null"
    }
  },
  "cross_functional_tags": {
    "product_team": ["array of relevant tags"],
    "support_team": ["array of relevant tags"],
    "marketing_team": ["array of relevant tags"],
    "sales_team": ["array of relevant tags"]
  },
  "suggested_followup": {
    "requires_response": "boolean",
    "response_urgency": "IMMEDIATE|WITHIN_24H|WITHIN_WEEK|ROUTINE",
    "suggested_response_approach": "string"
  },
  "executive_summary": "string (1-2 sentence key takeaway for leadership)"
}
`;

export {
  medicalRecordPrompt,
  ecomProductReviewPrompt,
  legalContractClausePrompt,
  newsArticleTopicPrompt,
  customerSupportTicketPrompt,
  resumeParsingPrompt,
  financialDocumentAnalysis,
  socialMediaContentModeration,
  academicPaperClassification,
  voiceOfCustomerAnalysis,
};
  
