from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
RENDER_DIR = ROOT / "docs" / "_livrables_render"


def main():
    for folder in sorted(p for p in RENDER_DIR.iterdir() if p.is_dir()):
        pages = sorted(folder.glob("page-*.png"))
        if not pages:
            continue

        thumbs = []
        for page in pages:
            img = Image.open(page).convert("RGB")
            img.thumbnail((420, 580))
            thumbs.append((page.name, img.copy()))

        label_h = 30
        pad = 18
        width = 2 * 420 + 3 * pad
        rows = (len(thumbs) + 1) // 2
        height = rows * (580 + label_h + pad) + pad

        sheet = Image.new("RGB", (width, height), "white")
        draw = ImageDraw.Draw(sheet)

        for idx, (name, img) in enumerate(thumbs):
            col = idx % 2
            row = idx // 2
            x = pad + col * (420 + pad)
            y = pad + row * (580 + label_h + pad)
            draw.text((x, y), f"{folder.name} - {name}", fill=(20, 45, 70))
            sheet.paste(img, (x, y + label_h))

        out = RENDER_DIR / f"{folder.name}_contact.png"
        sheet.save(out)
        print(out)


if __name__ == "__main__":
    main()
