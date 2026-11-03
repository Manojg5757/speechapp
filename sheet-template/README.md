# Product list in Google Sheets

`kadai-products.csv` holds the shop's products, one row per size or type.

## Set up (once)

1. Go to [sheets.google.com](https://sheets.google.com) and start a **Blank** spreadsheet.
2. **File → Import → Upload** and pick `kadai-products.csv`.
   Choose **Replace current sheet**, then **Import data**.
3. Name the spreadsheet, e.g. *Kadai Products*.
4. **File → Share → Publish to web**: pick the sheet, choose
   **Comma-separated values (.csv)**, then **Publish** and copy the link.
5. Paste the link into `src/sheet.js`:
   `export const SHEET_CSV_URL = "https://docs.google.com/…output=csv";`
   Then commit and push. Render redeploys, and from then on the app reads the sheet.

Anyone with the published link can read the list (product names, shelves, prices). Editing
still needs your Google account.

## Columns

| Column | What to write |
|---|---|
| Product | English name. Every size of the same product uses the same name. |
| Tamil name | Tamil name(s), separated by commas. Only needed on the first row. |
| Other names | Other ways people say it, separated by commas. First row only. |
| Category | plumbing, electrical or hardware. A new word makes a new category. |
| Size / type | `½"`, `50 ml`, `9W`, `16A`, `Black`… Leave empty if there's only one kind. |
| Size Tamil | Tamil for the size or type, e.g. கருப்பு (optional) |
| Size other names | Other ways to say the size or type (optional) |
| Shelf, Box, Price | Numbers |
| Unit | each, roll, pack, kg… |
| Picture | A drawing name (pipe, elbow, bulb…), `products/x.jpg`, or a full https image link |
| Colour | e.g. `#C62828`, tints the tape drawing (optional) |

To add a product, add a row. To change a price, change the number. The app picks it up
the next time it is opened. Google takes up to about 5 minutes to update the published copy.
