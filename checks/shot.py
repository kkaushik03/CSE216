#!/usr/bin/env python3
"""Screenshots for the manual review, named by check, and the evidence column filled for you.
Run from the repo root.

  checks/shot.py site codex/L1/run-01   choose the site you review now (once per site)
  checks/shot.py K8                     screenshot: drag a box around the problem (Esc cancels)
  checks/shot.py K8 wait                screenshot of the full screen after 4 seconds, so you can
                                        click back into Safari first (focus rings, open menus)
  checks/shot.py done                   fill the evidence column of manual-review.csv
                                        (save the CSV in your editor first)

Images go to <site>/manual-img/ as K8.png, K8-2.png, ...
"""
import csv
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CURRENT = Path(__file__).resolve().parent / '.shot-site'


def site_dir(arg):
    p = Path(arg.strip('/'))
    if p.parts and p.parts[0] == 'results':
        p = Path(*p.parts[1:])
    d = ROOT / 'results' / p
    if not (d / 'site').is_dir():
        sys.exit(f'There is no site in results/{p}. Example: checks/shot.py site codex/L1/run-01')
    if not (d / 'manual-review.csv').exists():
        sys.exit(f'There is no results/{p}/manual-review.csv. Run checks/manual-init.sh first.')
    return p, d


def current():
    if not CURRENT.exists():
        sys.exit('Choose the site first, for example: checks/shot.py site codex/L1/run-01')
    return site_dir(CURRENT.read_text().strip())


def check_ids(d):
    with open(d / 'manual-review.csv', newline='') as f:
        return [r['check'] for r in csv.DictReader(f)]


def choose(arg):
    p, d = site_dir(arg)
    CURRENT.write_text(str(p))
    print(f'Now reviewing {p}')
    print(f'  Safari:  http://localhost:8800/{p}/site/   (new Private Window)')
    print(f'  VS Code: results/{p}/manual-review.csv')


def shot(check, wait):
    p, d = current()
    check = check.upper()
    if check not in check_ids(d):
        sys.exit(f'{check} is not a check. Checks: {" ".join(check_ids(d))}')
    img = d / 'manual-img'
    img.mkdir(exist_ok=True)
    name, n = f'{check}.png', 1
    while (img / name).exists():
        n += 1
        name = f'{check}-{n}.png'
    if wait:
        print('Click on the Safari title bar now. The screenshot is taken in 4 seconds.')
    subprocess.run(['screencapture', '-x', '-T', '4', str(img / name)] if wait
                   else ['screencapture', '-i', '-x', str(img / name)])
    print(f'Saved {p}/manual-img/{name}' if (img / name).exists() else 'Cancelled, nothing saved.')


def done():
    p, d = current()
    path = d / 'manual-review.csv'
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        fields, rows = reader.fieldnames, list(reader)
    ids = [r['check'] for r in rows]
    files = sorted(x.name for x in (d / 'manual-img').glob('*') if x.suffix.lower() in ('.png', '.jpg', '.jpeg'))
    pattern = re.compile(r'^(' + '|'.join(map(re.escape, ids)) + r')(?![0-9])', re.I)
    changed = 0
    for r in rows:
        old = r['evidence'].split()
        mine = [f for f in files if (m := pattern.match(f)) and m.group(1).upper() == r['check']]
        new = old + [f for f in mine if f not in old]
        if new != old:
            r['evidence'] = ' '.join(new)
            changed += 1
    with open(path, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator='\n')
        w.writeheader()
        w.writerows(rows)
    print(f'{p}: evidence filled for {changed} checks')
    empty = [r['check'] for r in rows if not r['result']]
    missing = [r['check'] for r in rows if r['result'] == 'fail' and not r['evidence']]
    if empty:
        print(f'  No result yet: {" ".join(empty)}')
    if missing:
        print(f'  Fail without a screenshot: {" ".join(missing)}')


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) == 2 and a[0] == 'site':
        choose(a[1])
    elif a == ['done']:
        done()
    elif len(a) == 1 or (len(a) == 2 and a[1] == 'wait'):
        shot(a[0], wait=len(a) == 2)
    else:
        sys.exit(__doc__)
