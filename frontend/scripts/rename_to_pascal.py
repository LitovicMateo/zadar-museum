#!/usr/bin/env python3
"""
Rename all kebab-case / lowercase *.tsx and *.ts component files to PascalCase,
then update every import statement inside the src/ directory that referenced the
old filenames.

Run from the frontend/ directory:
    python3 scripts/rename_to_pascal.py [--dry-run]
"""

import os
import re
import subprocess
import sys
from pathlib import Path


def to_pascal_case(name: str) -> str:
    """Convert a filename stem to PascalCase.

    Handles three cases:
    - kebab-case  →  split by '-', capitalize each segment  →  PascalCase
    - snake_case  →  split by '_', capitalize each segment  →  PascalCase
    - camelCase   →  just uppercase the first letter (preserve internal caps)
    """
    if "-" in name or "_" in name:
        # Truly segmented name: split and capitalize each segment.
        return "".join(seg[0].upper() + seg[1:] for seg in re.split(r"[-_]", name) if seg)
    # Already camelCase (e.g. useCoachStatsTable, getImageUrl): only the first
    # letter needs to change; the rest of the identifier stays intact.
    return name[0].upper() + name[1:]


def should_rename(stem: str) -> bool:
    """Return True if the file stem needs PascalCase conversion."""
    # Skip files that are already PascalCase (start with uppercase).
    if stem[0].isupper():
        return False
    # Skip special/entry-point files that must keep their exact names.
    skip = {"main", "index", "vite-env.d", "vite.config", "app"}
    if stem.lower() in skip:
        return False
    # Skip utility/constant/module files we handle separately.
    for suffix in (".module", ".utils", ".constants", ".stories", ".test", ".spec"):
        if stem.endswith(suffix):
            return False
    return True


def git_mv(old: Path, new: Path, dry_run: bool) -> bool:
    if dry_run:
        print(f"  [DRY] git mv {old} -> {new.name}")
        return True
    result = subprocess.run(
        ["git", "mv", str(old), str(new)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        # Fall back to os.rename if not in a git repo / file not tracked.
        try:
            old.rename(new)
            print(f"  mv {old.name} -> {new.name}")
            return True
        except Exception as e:
            print(f"  ERROR renaming {old}: {e}")
            return False
    print(f"  git mv {old.name} -> {new.name}")
    return True


def collect_renames(src_root: Path) -> dict[str, str]:
    """
    Walk src/ and return a mapping of {old_stem: new_stem} for every file
    that needs renaming.  Keys/values are just the *stem* (no extension, no
    directory).
    """
    renames: dict[str, str] = {}
    for ext in ("*.tsx", "*.ts"):
        for f in src_root.rglob(ext):
            stem = f.stem
            if not should_rename(stem):
                continue
            new_stem = to_pascal_case(stem)
            if new_stem != stem:
                renames[stem] = new_stem
    return renames


def update_imports_in_file(
    filepath: Path,
    renames: dict[str, str],
    dry_run: bool,
) -> int:
    """
    Rewrite import/export paths that reference old (lowercase/kebab) filenames.
    Returns number of replacements made.
    """
    try:
        text = filepath.read_text(encoding="utf-8")
    except Exception:
        return 0

    original = text
    count = 0

    for old_stem, new_stem in renames.items():
        # Match imports/exports like:
        #   from './button'
        #   from '@/components/UI/button'
        #   from '../coach-gamelog'
        #   import './types'   (bare side-effect imports)
        # The old stem may appear as the last path segment before a quote / extension.
        pattern = re.compile(
            r"((?:from|import)\s+['\"](?:[^'\"]*/)?)("
            + re.escape(old_stem)
            + r")((?:\.tsx|\.ts)?['\"])"
        )
        new_text, n = pattern.subn(r"\g<1>" + new_stem + r"\g<3>", text)
        if n:
            text = new_text
            count += n

    if count and not dry_run:
        filepath.write_text(text, encoding="utf-8")

    return count


def main():
    dry_run = "--dry-run" in sys.argv

    # This script is meant to be run from frontend/.
    cwd = Path.cwd()
    src_root = cwd / "src"
    if not src_root.is_dir():
        print("ERROR: Run this script from the frontend/ directory.")
        sys.exit(1)

    print("=" * 60)
    print("Step 1: Collecting files to rename...")
    print("=" * 60)
    renames = collect_renames(src_root)
    print(f"  Found {len(renames)} stem(s) to rename.\n")

    # Step 2: Update imports BEFORE renaming so the paths still resolve.
    print("=" * 60)
    print("Step 2: Updating import statements...")
    print("=" * 60)
    total_updates = 0
    for ext in ("*.tsx", "*.ts"):
        for f in src_root.rglob(ext):
            n = update_imports_in_file(f, renames, dry_run)
            if n:
                print(f"  {f.relative_to(src_root)}: {n} replacement(s)")
                total_updates += n
    print(f"\n  Total import replacements: {total_updates}\n")

    # Step 3: Rename files.
    print("=" * 60)
    print("Step 3: Renaming files...")
    print("=" * 60)
    renamed = 0
    for ext in (".tsx", ".ts"):
        for f in sorted(src_root.rglob(f"*{ext}")):
            stem = f.stem
            if stem not in renames:
                continue
            new_stem = renames[stem]
            new_path = f.with_name(new_stem + ext)
            if git_mv(f, new_path, dry_run):
                renamed += 1

    # Step 3b: Rename companion CSS module files and utils/constants files.
    for f in sorted(src_root.rglob("*.module.css")):
        # e.g. button.module.css -> Button.module.css
        # The stem before .module is the component name.
        parts = f.name.split(".", 2)  # ['button', 'module', 'css']
        if len(parts) == 3 and parts[0] in renames:
            new_name = renames[parts[0]] + ".module.css"
            new_path = f.with_name(new_name)
            if git_mv(f, new_path, dry_run):
                renamed += 1

    print(f"\n  Total files renamed: {renamed}\n")

    if dry_run:
        print("DRY RUN complete — no files were actually changed.")
    else:
        print("Done. Run `npm run build` to verify there are no broken imports.")


if __name__ == "__main__":
    main()
