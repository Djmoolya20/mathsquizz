from flask import Flask, render_template, request, jsonify, session
import random, os

app = Flask(__name__)
app.secret_key = os.urandom(24)

LIMITS  = {"easy": (1, 30), "normal": (30, 100), "hard": (100, 1000)}
TIMERS  = {"easy": 20, "normal": 15, "hard": 8}
OPS     = {"+": lambda a,b: round(a+b,2), "-": lambda a,b: round(a-b,2),
           "*": lambda a,b: round(a*b,2), "/": lambda a,b: round(a/b,2) if b else 0}
SYMBOLS = {"+":"+", "-":"−", "*":"×", "/":"÷"}

def gen_question(difficulty, operator):
    lo, hi = LIMITS[difficulty]
    op = operator if operator != "random" else random.choice(["+","-","*","/"])
    if op == "/":
        b = random.randint(1, max(1, hi//10))
        a = b * random.randint(1, 15)
    elif op == "*":
        a = random.randint(lo, min(hi, 50))
        b = random.randint(1, min(hi, 30))
    else:
        a, b = random.randint(lo, hi), random.randint(lo, hi)
    answer = OPS[op](a, b)
    hints = {
        "+": f"{a} + {b//2} = {a+b//2}, then add {b-b//2} more",
        "-": f"{a} − {b//2} = {a-b//2}, then subtract {b-b//2} more",
        "*": f"Think: {a} groups of {b}",
        "/": f"How many times does {b} go into {a}?"
    }
    return {"a": a, "b": b, "op": op, "symbol": SYMBOLS[op], "answer": answer, "hint": hints[op]}

@app.route("/")
def index(): return render_template("index.html")

@app.route("/api/start", methods=["POST"])
def start():
    d = request.json
    diff = d.get("difficulty","normal")
    session.clear()
    session.update({"difficulty": diff, "operator": d.get("operator","random"),
                    "total": int(d.get("total",10)), "correct": 0, "attempted": 0,
                    "streak": 0, "best_streak": 0, "time_per_q": TIMERS[diff], "history": []})
    return jsonify({"ok": True, "time_per_q": TIMERS[diff]})

@app.route("/api/question")
def question():
    q = gen_question(session["difficulty"], session["operator"])
    session["cur_ans"]  = q["answer"]
    session["cur_hint"] = q["hint"]
    session["cur_q"]    = f"{q['a']} {q['symbol']} {q['b']}"
    return jsonify({"question": session["cur_q"], "num": session["attempted"]+1,
                    "total": session["total"], "time_per_q": session["time_per_q"]})

@app.route("/api/hint")
def hint(): return jsonify({"hint": session.get("cur_hint","No hint")})

@app.route("/api/answer", methods=["POST"])
def answer():
    d = request.json
    timed_out = d.get("timed_out", False)
    try:    player = float(d["answer"]); is_correct = not timed_out and abs(player - session["cur_ans"]) < 0.01
    except: player = None; is_correct = False
    if is_correct:
        session["correct"] += 1; session["streak"] += 1
        session["best_streak"] = max(session["best_streak"], session["streak"])
    else:
        session["streak"] = 0
    session["attempted"] += 1
    session["history"] = session.get("history",[]) + [{"q": session["cur_q"],
        "correct_ans": session["cur_ans"], "player_ans": player,
        "is_correct": is_correct, "timed_out": timed_out}]
    return jsonify({"correct": is_correct, "answer": session["cur_ans"],
                    "score": session["correct"], "attempted": session["attempted"],
                    "streak": session["streak"], "done": session["attempted"] >= session["total"]})

@app.route("/api/quit", methods=["POST"])
def quit_game(): return _summary()

@app.route("/api/score")
def score(): return _summary()

def _summary():
    c, t = session.get("correct",0), session.get("attempted",1)
    pct   = round((c/t)*100) if t else 0
    if pct==100: grade="PERFECT! 🏆"
    elif pct>=80: grade="AMAZING! 🌟"
    elif pct>=60: grade="GREAT JOB! 🎉"
    elif pct>=40: grade="GOOD EFFORT! 👍"
    else: grade="KEEP GOING! 💪"
    return jsonify({"correct":c,"total":t,"pct":pct,"grade":grade,
                    "best_streak":session.get("best_streak",0),"history":session.get("history",[])})

if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))