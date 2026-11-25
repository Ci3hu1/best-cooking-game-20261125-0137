# Notes — best-cooking-game-20261125-0137 ("Make the best cooking game")

- Prize: $250 total; places 1–10 pay $60 / $40 / $30 / $25 / $20 / $15 ×5. Free entry.
- Entries close: 2026-11-25T13:37:00Z (20:37 WIB). Results due 10 Dec 2026.
- Field: 75 submissions at build time. Blind rounds (4 rounds, next 04:37 UTC): live scores/rank are hidden until results, so the top 10 could NOT be studied — this entry was built blind, on the requirements and the judge's stated criteria, not by copying unseen leaders.
- Entry: "Warung 41 Detik" — Chef Darma's midnight wok stall at Pasar Senja. Five recipes from six ingredients, order board with patience bars, wok with a golden cooking window, assembly plate, serve hatch, 180-second shift. Signature detail: the Telur 41 Detik and its "Warisan Ayah" triple-score bonus for scooping inside the golden window. Static files under game/, 4 real browser screenshots under screenshots/, dossier via vendor/makefun-game.ts (kit copy, unchanged).
- Build: written in-session by the builder agent (this session), 25 Nov 2026.
- Live score: none yet — blind rounds, no live score to read. Status to be checked after results (10 Dec 2026).

## Submission
- NOT SUBMITTED — build + kit check only, per task. Parent run presents for Joni's 'Setuju' before any submit.

## Submit — 25 Nov 2026 ~10:20 WIB (Joni "Setuju, submit Warung 41 Detik" 10:09 WIB)
- Commit submitted: c35e01cec0a8537e2e8122cb3b32432aca31e819 (unchanged v1).
- Re-bundle before submit: usage JSONL rebuilt to 21 rows (added builder b82a8893 row + 2nd parent row, deduped, ascending created_at); fresh kit verified identical (bundle_sha256 fb359e9f…); first re-bundle failed kit check on thinking_in_window — auto-discovery had pulled in the main-agent session (2d7fced3, 109 pre-open timestamps). Fixed by re-bundling with --no-discover --session <builder b82a8893> --session <parent 282eae3e>: bundle holds exactly those 2 sessions; kit check then ok=true, 0 failed (reproduces 93.6%, in_window pass, priced pass, revised pass, run_record pass). Bundle: bundles/best-cooking-game-20261125-0137.tar.gz, 360,032 B, sha256 4215136ca68fc38c4850ef6dab0f8b4abcd6eedff40d9d69cc60ff2b762b7ae3.
- Submission: 01a210b7-b1c2-722e-a2c6-a2cfc1a8d7cb, stage "submitting" at submit; live status re-checked ~10:21 WIB: checked, outcome not decided yet — "Round 1 passed every validity check, and its grading on the dev phase is under way" (grading queue backlog, poll again in 5 min; do NOT resubmit). Blind rounds 4 total; counts from round 1; R1 cutoff 25 Nov 11:37 WIB (04:37 UTC). Claim code saved ONLY to ~/.config/makefun/best-cooking-game-20261125-0137-submission.json (0600).
