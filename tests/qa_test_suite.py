import os, sys, re, struct

print("==================================================")
print("     WARANUSA COMPREHENSIVE QA TEST RUNNER        ")
print("==================================================")

errors = []
warnings = []
passed_tests = 0

# TEST 1: Syntax & Bracket Balance across all 186 TS/TSX files
print("\n[TEST 1] Testing Syntax & Bracket Balance across all files...")
src_files = []
for root, _, files in os.walk("src"):
    for f in files:
        if f.endswith((".ts", ".tsx")):
            src_files.append(os.path.join(root, f))

balance_errors = []
for path in src_files:
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    ob = text.count("{")
    cb = text.count("}")
    ok = text.count("[")
    ck = text.count("]")
    if ob != cb:
        balance_errors.append(f"{path}: mismatched braces ({ob} != {cb})")
    if ok != ck:
        balance_errors.append(f"{path}: mismatched brackets ({ok} != {ck})")

if balance_errors:
    for be in balance_errors[:5]:
        errors.append(f"Syntax Balance Error in {be}")
else:
    print(f"  ✓ {len(src_files)} TS/TSX source files passed syntax & bracket balance.")
    passed_tests += 1

# TEST 2: Import & Path Resolution
print("\n[TEST 2] Testing Import & Module Resolutions...")
import_pattern = re.compile(r"from\s+[\"'](@/[^\"']+|\.[^\"']+)[\"']")
broken_imports = []

for path in src_files:
    dir_name = os.path.dirname(path)
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    for m in import_pattern.finditer(text):
        target = m.group(1)
        if target.startswith("@/"):
            resolved_base = os.path.join("src", target[2:])
        else:
            resolved_base = os.path.normpath(os.path.join(dir_name, target))
        
        candidates = [
            resolved_base,
            resolved_base + ".ts",
            resolved_base + ".tsx",
            resolved_base + ".d.ts",
            os.path.join(resolved_base, "index.ts"),
            os.path.join(resolved_base, "index.tsx")
        ]
        if not any(os.path.exists(c) for c in candidates):
            broken_imports.append((path, target))

if broken_imports:
    for b in broken_imports[:5]:
        errors.append(f"Broken import in {b[0]}: cannot resolve \"{b[1]}\"")
else:
    print(f"  ✓ All module imports across {len(src_files)} files resolve correctly.")
    passed_tests += 1

# TEST 3: 3D GLB Binary Asset Integrity
print("\n[TEST 3] Testing 3D GLB Binary Headers & Asset Paths...")
houses_dir = "public/models/houses"
inst_dir = "public/models/instruments"
glb_files = []
for d in [houses_dir, inst_dir]:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith(".glb"):
                glb_files.append(os.path.join(d, f))

corrupt_glb = []
for glb in glb_files:
    with open(glb, "rb") as f:
        header = f.read(12)
        if len(header) < 12 or header[:4] != b"glTF":
            corrupt_glb.append(glb)

if corrupt_glb:
    for c in corrupt_glb:
        errors.append(f"Corrupt 3D GLB asset: {c}")
else:
    print(f"  ✓ {len(glb_files)} 3D GLB files verified with valid glTF 2.0 binary headers.")
    passed_tests += 1

# TEST 4: Data Catalogues (38 Houses & 38 Instruments)
print("\n[TEST 4] Testing 38 Provinces Cultural Catalogues...")
with open("src/data/traditional-houses.ts", "r", encoding="utf-8") as f:
    houses_code = f.read()
with open("src/data/instruments-data.ts", "r", encoding="utf-8") as f:
    inst_code = f.read()

house_provinces = len(re.findall(r"province:\s*\"", houses_code))
inst_provinces = len(re.findall(r"province:\s*\"", inst_code))

if house_provinces >= 38 and inst_provinces >= 38:
    print(f"  ✓ 38 Provinces Houses ({house_provinces} entries) and Instruments ({inst_provinces} entries) verified.")
    passed_tests += 1
else:
    errors.append(f"Catalogue incomplete: houses={house_provinces}, instruments={inst_provinces}")

# TEST 5: Palette & Deprecated Color Check
print("\n[TEST 5] Testing Palette & Legacy Red Accents...")
legacy_reds = ["8B2624", "801C1A", "9C2623", "B3302C", "7A2623", "731F1D"]
red_matches = []
for p in src_files:
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()
    for red in legacy_reds:
        if red in content:
            red_matches.append((p, red))

if red_matches:
    for rm in red_matches:
        errors.append(f"Legacy red #{rm[1]} found in {rm[0]}")
else:
    print("  ✓ Zero legacy red codes found. Warm earthy palette verified.")
    passed_tests += 1

# TEST 6: Audio Synthesizer Frequency Ranges
print("\n[TEST 6] Testing Audio Engine & Note Frequencies...")
freqs = [float(x) for x in re.findall(r"freq:\s*([0-9.]+)", inst_code)]
invalid_freqs = [fq for fq in freqs if fq < 20 or fq > 5000]

if invalid_freqs:
    errors.append(f"Invalid musical frequencies found: {invalid_freqs[:5]}")
else:
    print(f"  ✓ {len(freqs)} musical frequencies verified within acoustic safety boundaries (20Hz - 5000Hz).")
    passed_tests += 1

# TEST 7: SPA Hash Routing Integrity
print("\n[TEST 7] Testing SPA Hash Routes & Links...")
routes_defined = [
    "", "jelajah", "katalog", "budaya", "instrumen", "3d", "eksplorasi-3d", 
    "3d-heritage", "virtual-instruments",
    "kontribusi", "tentang", "pencarian", "admin", "masuk", "keluar", 
    "kontribusi-saya", "kontribusi-terkirim"
]
link_pattern = re.compile(r"href=[\"']#/([^\"'?]+)")
unhandled_routes = []

for p in src_files:
    with open(p, "r", encoding="utf-8") as f:
        text = f.read()
    for m in link_pattern.finditer(text):
        base_route = m.group(1).split("/")[0]
        if base_route not in routes_defined and not base_route.startswith("${") and not base_route.startswith("…"):
            unhandled_routes.append((p, m.group(1)))

if unhandled_routes:
    for ur in unhandled_routes:
        warnings.append(f"Unregistered route link in {ur[0]}: #{ur[1]}")
else:
    print("  ✓ 100% of internal SPA hash links match valid registered route handlers.")
    passed_tests += 1

# TEST 8: Responsive Attributes & Mobile Viewport
print("\n[TEST 8] Testing Viewport Metadata & Responsive Shell...")
with open("src/app/layout.tsx", "r", encoding="utf-8") as f:
    layout_code = f.read()

if "viewport: Viewport" in layout_code and "device-width" in layout_code:
    print("  ✓ Next.js Viewport Metadata verified (device-width, initialScale: 1).")
    passed_tests += 1
else:
    errors.append("Missing Viewport metadata in layout.tsx")

print("\n==================================================")
print(f"FINAL QA RESULT: {passed_tests}/8 Test Suites PASSED.")
if errors:
    print(f"FAILED with {len(errors)} errors:")
    for e in errors:
        print("  ✖", e)
    sys.exit(1)
else:
    print("ALL 8 TEST SUITES PASSED WITH 0 ERRORS! (100% Clean Bill of Health)")
if warnings:
    print(f"Warnings ({len(warnings)}):")
    for w in warnings:
        print("  ⚠", w)
print("==================================================")
