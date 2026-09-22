#!/usr/bin/env python3
"""Generate data/unit.json — 150 people + 8 critical roles. Deterministic (seed=42)."""
import json, random
from datetime import date, timedelta
from pathlib import Path

random.seed(42)

FIRST = [
    "Alex","Maria","Dmitry","Elena","Ivan","Anna","Sergey","Olga","Nikita","Kate",
    "Pavel","Irina","Andrei","Sofia","Maxim","Yulia","Roman","Daria","Kirill","Alina",
    "Viktor","Natalia","Oleg","Tatiana","Artem","Polina","Igor","Vera","Egor","Marina",
    "Anton","Lina","Denis","Svetlana","Mikhail","Ekaterina","Vlad","Anastasia","Gleb","Yana",
    "Timur","Valeria","Ruslan","Kristina","Stepan","Nadia","Boris","Elizaveta","Fedor","Inna",
    "Arjun","Priya","Rahul","Ananya","Vikram","Meera","Amit","Sneha","Rohan","Isha",
    "Tomas","Eva","Piotr","Zuzanna","Lukas","Hana","Marek","Klara","Jan","Ola",
]
LAST = [
    "Ivanov","Petrova","Sokolov","Kuznetsova","Volkov","Morozova","Novikov","Popova",
    "Lebedev","Kozlova","Smirnov","Orlova","Pavlov","Vinogradova","Fedorov","Belova",
    "Egorov","Sorokina","Makarov","Nikolaeva","Zhukov","Kovaleva","Titov","Gromova",
    "Sharma","Patel","Singh","Reddy","Iyer","Nair","Gupta","Mehta","Khan","Desai",
    "Nowak","Kowalski","Wisniewski","Dvorak","Novak","Horvath","Kovacs","Nagy",
]
TRACKS = [
    "backend","frontend","fullstack","mobile","qa","devops","data","ml","security",
    "platform","architecture","delivery","ba","pm",
]
TITLES = {
    "junior": ["Junior Software Engineer","Junior QA Engineer","Junior Data Engineer","Junior Frontend Engineer"],
    "middle": ["Software Engineer","QA Engineer","DevOps Engineer","Data Engineer","Mobile Engineer","Business Analyst"],
    "senior": ["Senior Software Engineer","Senior QA Engineer","Senior DevOps Engineer","Senior Data Engineer","Senior Frontend Engineer","Senior Mobile Engineer"],
    "lead": ["Tech Lead","Team Lead","QA Lead","Delivery Lead","Engineering Lead"],
    "principal": ["Principal Engineer","Staff Engineer"],
    "architect": ["Solution Architect","Software Architect","Cloud Architect"],
    "partner": ["Engineering Partner","Delivery Partner","Practice Partner"],
}
SKILLS = {
    "backend": ["Java","Kotlin","Spring","Python","Go","PostgreSQL","Kafka","Redis","gRPC"],
    "frontend": ["TypeScript","React","Next.js","Vue","CSS","GraphQL"],
    "fullstack": ["TypeScript","Node.js","React","PostgreSQL","AWS"],
    "mobile": ["Swift","Kotlin","Flutter","React Native"],
    "qa": ["Selenium","Playwright","API testing","Test design","Cypress"],
    "devops": ["Kubernetes","Terraform","AWS","CI/CD","Observability"],
    "data": ["Python","Spark","dbt","Airflow","Snowflake"],
    "ml": ["Python","PyTorch","MLOps","LLM fine-tuning"],
    "security": ["AppSec","Threat modeling","OWASP","SIEM"],
    "platform": ["Kubernetes","SRE","Internal platforms","Golang"],
    "architecture": ["System design","Integration","Domain modeling","Cloud"],
    "delivery": ["Stakeholder mgmt","Estimation","Risk","P&L awareness"],
    "ba": ["Requirements","Workshops","SQL","Process mapping"],
    "pm": ["Delivery","Roadmapping","Client comms","Scope control"],
}
CLIENTS = ["NordBank","Helix Health","RetailOne","AeroLogix","Finora","CityGrid","MedStack","CargoHub","PayLattice","Orbit Media"]
DOMAINS = ["fintech","healthcare","retail","logistics","media","insurtech"]
LOCATIONS = ["Moscow","Almaty","Tbilisi","Yerevan","Warsaw","Belgrade","Bengaluru","Pune","Remote"]
ROLE_TEMPLATES = [
    ("Delivery Partner — Nordics banking", "delivery partner owning 2-3 banking accounts", "delivery"),
    ("Engineering Partner — Platform practice", "heads platform / cloud practice", "architecture"),
    ("Delivery Partner — Healthcare", "owns Helix/MedStack accounts", "delivery"),
    ("Tech Partner — Mobile practice", "mobile competence + key accounts", "mobile"),
    ("Delivery Lead — Finora account", "single large account P&L", "delivery"),
    ("Architecture Partner — Integrations", "solution architecture across accounts", "architecture"),
    ("QA / Quality Partner", "quality practice and key QA leads", "qa"),
    ("Data & AI Partner", "data/ml practice lead", "data"),
]

def unique_name(used):
    for _ in range(300):
        n = f"{random.choice(FIRST)} {random.choice(LAST)}"
        if n not in used:
            used.add(n)
            return n
    return f"Person {random.randint(1000,9999)}"

def track_for(level):
    if level == "partner":
        return random.choice(["delivery", "architecture"])
    if level in ("architect", "principal"):
        return random.choice(["architecture", "backend", "platform"])
    return random.choice(TRACKS)

def build():
    levels = (["junior"] * 28 + ["middle"] * 50 + ["senior"] * 40 + ["lead"] * 18 + ["principal"] * 6 + ["architect"] * 6 + ["partner"] * 2)[:150]
    random.shuffle(levels)
    perf_w = ["low"] * 10 + ["medium"] * 50 + ["high"] * 40
    pot_w = ["low"] * 15 + ["medium"] * 50 + ["high"] * 35
    used, people = set(), []
    years_map = {"junior": (0, 2), "middle": (2, 5), "senior": (5, 10), "lead": (7, 14), "principal": (10, 18), "architect": (10, 20), "partner": (12, 22)}
    for i in range(150):
        level = levels[i]
        track = track_for(level)
        title = random.choice(TITLES[level])
        name = unique_name(used)
        lo, hi = years_map[level]
        years = random.randint(lo, hi)
        sk = SKILLS[track][:]
        random.shuffle(sk)
        skills = sk[: random.randint(3, min(6, len(sk)))]
        projects = []
        for _ in range(random.randint(1, 3)):
            projects.append({
                "client": random.choice(CLIENTS),
                "domain": random.choice(DOMAINS),
                "role_on_project": title if random.random() > 0.3 else random.choice(["IC", "module owner", "tech lead on stream"]),
                "duration_months": random.randint(4, 24),
                "status": random.choice(["active", "completed", "completed"]),
                "impact": random.choice(["Stabilized release train", "Cut incident rate", "Shipped MVP on time", "Owned integration with client core", "Mentored 3 juniors", "Recovered delayed stream"]),
            })
        feedbacks = []
        for _ in range(random.randint(1, 2)):
            feedbacks.append({
                "source": random.choice(["client", "account", "internal stakeholder"]),
                "date": str(date(2025, 1, 1) + timedelta(days=random.randint(0, 600))),
                "score": round(random.uniform(3.2, 5.0), 1),
                "summary": random.choice(["Reliable delivery, good English", "Strong technically, needs more client-facing practice", "Trusted by the client PO", "Good under pressure", "Needs tighter estimates", "Excellent stakeholder management", "Solid engineer, limited leadership signals"]),
            })
        talks = [{
            "date": str(date(2026, 1, 1) + timedelta(days=random.randint(0, 250))),
            "author_role": random.choice(["line manager", "HRBP", "delivery partner"]),
            "summary": random.choice(["Wants more ownership of a stream", "Ready for lead track if given P&L exposure", "Strong IC, not yet interested in people management", "Flight risk if no growth in 6 months", "Asked for architect path", "Needs conflict management coaching", "High energy, good bench candidate"]),
        }]
        people.append({
            "id": f"p{i+1:03d}",
            "name": name,
            "email": name.lower().replace(" ", ".") + "@outsource.example",
            "location": random.choice(LOCATIONS),
            "track": track,
            "level": level,
            "title": title,
            "years_experience": years,
            "years_in_company": max(0, min(years, random.randint(1, 8))),
            "manager_id": None,
            "utilization_pct": random.choice([70, 80, 90, 100, 100, 100]),
            "bench_risk": random.choice([False, False, False, True]),
            "english": random.choice(["B1", "B2", "B2", "C1", "C1", "C2"]),
            "skills": skills,
            "projects": projects,
            "client_feedback": feedbacks,
            "manager_talks": talks,
            "performance": random.choice(perf_w),
            "potential": random.choice(pot_w),
            "notes": random.choice(["Key person on current account", "Can travel", "Prefers product-like work", "Strong mentor", "Needs visibility with partners", ""]),
        })
    incumbents = [p for p in people if p["level"] in ("partner", "lead", "architect", "principal")]
    random.shuffle(incumbents)
    incumbents = incumbents[:8]
    leads = [p for p in people if p["level"] in ("lead", "partner", "architect")]
    inc_ids = {p["id"] for p in incumbents}
    for p in people:
        if p["id"] in inc_ids:
            continue
        if leads:
            p["manager_id"] = random.choice(leads)["id"]
    readiness_opts = ["ready_now", "6m", "12m", "18m"]
    roles = []
    for idx, (title, purpose, track_hint) in enumerate(ROLE_TEMPLATES):
        inc = incumbents[idx]
        cands = [p for p in people if p["id"] != inc["id"] and p["level"] != "junior" and p["potential"] in ("medium", "high")]
        pref = [p for p in cands if p["track"] in (track_hint, "delivery", "architecture", "backend") or p["level"] in ("lead", "senior", "architect", "principal")]
        pool = pref or cands
        random.shuffle(pool)
        planned, recommended = pool[:2], pool[2:5]
        def slate(person, planned_flag, i):
            r = readiness_opts[min(i + 1, 3)] if not planned_flag else random.choice(["ready_now", "6m", "12m"])
            goals = []
            for k, t in enumerate(["Lead a client QBR without partner", "Own staffing for a stream", "Close a delivery risk independently"]):
                st = random.choice(["not_started", "in_progress", "done"] if r != "ready_now" else ["done", "in_progress"])
                goals.append({"id": f"g{person['id']}_{k}", "title": t, "due": str(date(2026, 12, 1) + timedelta(days=30 * k)), "status": st, "evidence": ""})
            done = sum(1 for g in goals if g["status"] == "done")
            return {
                "person_id": person["id"],
                "kind": "planned" if planned_flag else "recommended",
                "primary": planned_flag and i == 0,
                "readiness": r,
                "track_status": "on_track" if done >= 1 else random.choice(["on_track", "at_risk", "not_started"]),
                "goals": goals,
                "why": random.choice(["Strong client feedback + lead experience", "Closest skill match to role profile", "High potential, missing account P&L", "Architect path, needs delivery exposure"]),
            }
        slates = [slate(p, True, i) for i, p in enumerate(planned)]
        slates += [slate(p, False, i) for i, p in enumerate(recommended)]
        roles.append({
            "id": f"role{idx+1:02d}",
            "name": title,
            "purpose": purpose,
            "created_by": "unit_head",
            "incumbent_id": inc["id"],
            "criticality": random.choice(["high", "high", "medium"]),
            "success_profile": {"must_have": ["Client trust", "Delivery ownership", "People leadership"], "nice_to_have": ["P&L exposure", "Practice building"], "competencies": ["stakeholder_mgmt", "system_thinking", "coaching"]},
            "emergency_cover_id": slates[0]["person_id"] if slates else None,
            "slates": slates,
            "hr_notes": "Calibrate 9-box before locking primary successor.",
        })
    return {
        "unit": {
            "name": "Engineering Unit — Delivery Center East",
            "company": "Large outsourcing / staff augmentation + project delivery",
            "head": {"id": "boss", "name": "Unit Head (Big Boss)", "title": "Unit Director"},
            "hrbp": {"id": "hr1", "name": "HRBP Anna", "title": "HR Business Partner"},
            "headcount": 150,
            "last_talent_review": "2026-09-01",
        },
        "people": people,
        "roles": roles,
    }

def main():
    root = Path(__file__).resolve().parents[1]
    out = root / "data" / "unit.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    data = build()
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out} people={len(data['people'])} roles={len(data['roles'])}")

if __name__ == "__main__":
    main()
