# -*- coding: utf-8 -*-
from fpdf import FPDF
import os

FONT = '/Library/Fonts/Arial Unicode.ttf'
OUT  = os.path.join(os.path.dirname(__file__), 'BODY CUT 減脂App建置報告.pdf')

# ── 色盤 ──────────────────────────────────────────────────────────
C_DARK       = (8,   8,   8)
C_SURFACE    = (17,  17,  17)
C_ACCENT     = (180, 220,  0)   # 黃綠
C_ORANGE     = (230, 100,  30)
C_CYAN       = ( 0,  180, 220)
C_GREEN      = ( 0,  200, 120)
C_RED        = (200,  60,  60)
C_LIGHT_Y    = (240, 255, 180)
C_LIGHT_B    = (200, 235, 255)
C_LIGHT_G    = (200, 245, 225)
C_LIGHT_R    = (255, 220, 220)
C_LIGHT_O    = (255, 235, 210)
C_GREY       = (240, 240, 243)
C_WHITE      = (255, 255, 255)
C_BLACK      = ( 20,  20,  20)
C_MID        = ( 60,  80, 140)


class PDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font('U', '', FONT)
        self.add_font('U', 'B', FONT)

    def set_ch(self, size=11, color=C_BLACK):
        self.set_font('U', size=size)
        self.set_text_color(*color)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(20, 20, 30)
        self.rect(0, 0, 210, 12, 'F')
        self.set_ch(8, (180, 220, 0))
        self.set_y(2)
        self.cell(0, 8, 'BODY CUT 減脂追蹤 App  建置報告  |  2026-05-31', align='C')
        self.ln(8)

    def footer(self):
        self.set_y(-13)
        self.set_fill_color(20, 20, 30)
        self.rect(0, 284, 210, 13, 'F')
        self.set_ch(8, (180, 220, 0))
        self.cell(0, 13, f'第 {self.page_no()} 頁', align='C')

    # ── helpers ────────────────────────────────────────────────────
    def section_title(self, text, color=C_MID, bg=C_LIGHT_B):
        self.ln(4)
        self.set_fill_color(*bg)
        self.set_draw_color(*color)
        self.set_line_width(0.8)
        self.set_ch(14, color)
        self.cell(0, 10, f'  {text}', border='LB', fill=True, ln=True)
        self.set_line_width(0.2)
        self.ln(2)

    def sub_title(self, text, color=C_MID):
        self.set_ch(12, color)
        self.cell(0, 8, f'▶  {text}', ln=True)
        self.ln(1)

    def body(self, text, indent=5, color=C_BLACK):
        self.set_ch(10, color)
        self.set_x(self.get_x() + indent)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def info_box(self, text, bg=C_LIGHT_G, tc=(0, 80, 40)):
        self.ln(2)
        self.set_fill_color(*bg)
        self.set_ch(10, tc)
        self.set_x(10)
        self.multi_cell(190, 6, f'  {text}', border=0, fill=True)
        self.ln(2)

    def warn_box(self, text):
        self.ln(2)
        self.set_fill_color(*C_LIGHT_Y)
        self.set_draw_color(*C_ORANGE)
        self.set_line_width(0.5)
        self.set_ch(10, (100, 60, 0))
        self.set_x(10)
        self.multi_cell(190, 6, f'  ⚠  {text}', border=1, fill=True)
        self.set_line_width(0.2)
        self.ln(2)

    def code_box(self, text):
        self.ln(1)
        self.set_fill_color(35, 38, 46)
        self.set_ch(9, (180, 220, 0))
        self.set_x(12)
        self.multi_cell(186, 5.5, text, border=0, fill=True)
        self.ln(2)

    def table_row(self, cells, widths, fill=C_WHITE, header=False):
        h = 8
        self.set_ch(10, C_WHITE if header else C_BLACK)
        self.set_fill_color(*(20, 20, 30) if header else fill)
        self.set_draw_color(180, 180, 180)
        for txt, w in zip(cells, widths):
            self.cell(w, h, f' {txt}', border=1, fill=True)
        self.ln()

    def feature_row(self, icon, title, desc):
        self.set_fill_color(*C_LIGHT_B)
        self.set_ch(11, C_MID)
        self.set_x(10)
        self.cell(10, 8, icon, align='C')
        self.cell(55, 8, title, fill=True)
        self.set_ch(10, C_BLACK)
        self.set_x(75)
        self.multi_cell(125, 8, desc)
        self.ln(1)

    def bug_box(self, num, title, cause, solution, bg=C_LIGHT_R):
        self.set_fill_color(*bg)
        self.set_ch(11, C_MID)
        self.set_x(10)
        self.multi_cell(190, 7, f'  坑 #{num}：{title}', fill=True)
        self.set_ch(10, C_BLACK)
        self.set_x(14); self.multi_cell(186, 6, f'原因：{cause}')
        self.set_x(14); self.multi_cell(186, 6, f'解決：{solution}')
        self.ln(2)


# ════════════════════════════════════════════════════════════════
pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=18)

# ── 封面 ─────────────────────────────────────────────────────────
pdf.add_page()
pdf.set_fill_color(8, 8, 8)
pdf.rect(0, 0, 210, 297, 'F')

# 裝飾線
pdf.set_fill_color(180, 220, 0)
pdf.rect(0, 52, 210, 1.5, 'F')
pdf.rect(0, 58, 210, 0.4, 'F')

pdf.set_y(18)
pdf.set_ch(11, (100, 160, 60))
pdf.cell(0, 8, 'BODY CUT — 個人減脂追蹤系統', align='C', ln=True)

pdf.set_y(66)
pdf.set_ch(42, (180, 220, 0))
pdf.cell(0, 24, 'BODY CUT', align='C', ln=True)

pdf.set_ch(18, (230, 100, 30))
pdf.cell(0, 12, '減脂 App  建置完整報告', align='C', ln=True)

pdf.set_y(130)
pdf.set_fill_color(30, 30, 40)
pdf.rect(25, 130, 160, 80, 'F')
pdf.set_fill_color(180, 220, 0)
pdf.rect(25, 130, 3, 80, 'F')

pdf.set_y(138)
pdf.set_ch(11, (200, 230, 180))
items = [
    '  全端純前端 Web App（單一 HTML 檔案）',
    '  Firebase Realtime Database 雲端即時同步',
    '  iOS 捷徑自動從 Omron Connect 匯入體重',
    '  飲食日誌 × 7-11 食物資料庫 × AI 熱量查詢',
    '  三裝置跨平台 PWA 同步架構',
    '  Claude AI 食物營養自動辨識',
]
for it in items:
    pdf.cell(0, 10, it, align='L', ln=True)

pdf.set_y(232)
pdf.set_fill_color(180, 220, 0)
pdf.rect(25, 232, 160, 0.8, 'F')

pdf.set_y(238)
pdf.set_ch(10, (140, 170, 100))
pdf.cell(0, 8, '建置日期：2026-05-31', align='C', ln=True)
pdf.cell(0, 8, 'App 網址：https://precious-prison.surge.sh', align='C', ln=True)
pdf.cell(0, 8, 'Sync ID：willy-bodycut', align='C', ln=True)
pdf.cell(0, 8, '使用者：Willy Lin  |  目標：83.7kg → 79.1kg  |  9 週計畫', align='C', ln=True)

# ── P2 專案概述 ──────────────────────────────────────────────────
pdf.add_page()
pdf.section_title('一、專案概述與背景')

pdf.body(
    '本專案為個人客製化減脂追蹤 App，基於 2026-05-30 健身工廠 InBody 920 測量數據建立，\n'
    '採用 9 週專業減脂計畫（2026.05.30 — 2026.08.03），目標從 83.7 kg 降至 79.1 kg，\n'
    '體脂率從 16.9% 降至 12.0%，保留骨骼肌 39.8 kg。'
)

pdf.sub_title('核心使用場景')
pdf.set_ch(10, C_BLACK)
scenarios = [
    ('早上 7:30', '手機捷徑自動從 Omron 體重計讀取空腹體重 → 自動儲存並同步雲端'),
    ('三餐前後',  '開啟 App → 飲食日誌 → 搜尋 7-11 食物 → 紀錄熱量與營養素'),
    ('街邊小吃',  '不知道熱量 → 輸入食物名稱 → AI 自動估算並填入'),
    ('晚上',      '捷徑自動讀取睡前體重 → App 自動計算早晚平均，圖表顯示早上藍點/晚上紅點'),
    ('跨裝置',    '三台裝置（iPhone × 2 + Mac）Firebase 即時同步，下拉更新或按↻'),
]
ws = [35, 155]
pdf.table_row(['時機', '動作'], ws, header=True)
for i, (t, d) in enumerate(scenarios):
    pdf.table_row([t, d], ws, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(5)
pdf.sub_title('InBody 920 測量數據（2026-05-30）')
metrics = [
    ('體重', '83.7 kg', '骨骼肌', '39.8 kg'),
    ('體脂率', '16.9%',   'BMI',    '28.3'),
    ('除脂體重', '69.6 kg', 'InBody 評分', '92 / 100'),
    ('基礎代謝率', '1,873 kcal', 'TDEE', '≈ 2,913 kcal'),
]
ws2 = [38, 30, 42, 30, 38, 22]
for r in metrics:
    pdf.table_row(r, ws2, fill=C_GREY)

# ── P3 技術架構 ──────────────────────────────────────────────────
pdf.add_page()
pdf.section_title('二、技術架構總覽')

pdf.sub_title('整體架構圖')
pdf.set_fill_color(35, 38, 46)
pdf.set_ch(9, (180, 220, 0))
pdf.set_x(10)
diagram = (
    '  Omron 體重計（藍牙）\n'
    '         |\n'
    '         v\n'
    '  Omron Connect App  ──→  Apple Health\n'
    '                                |\n'
    '                                v\n'
    '              iOS 捷徑（自動化，每日 7:30 / 22:00）\n'
    '                                |\n'
    '                          URL 參數傳遞\n'
    '                    ?mw=83.5&date=2026-05-31\n'
    '                                |\n'
    '                                v\n'
    '    ┌─────────────────────────────────────────────┐\n'
    '    │   BODY CUT App (precious-prison.surge.sh)    │\n'
    '    │                                              │\n'
    '    │   readUrlParams() → addEntry() → save()      │\n'
    '    │          ↓               ↓                   │\n'
    '    │   localStorage    debouncedPush()             │\n'
    '    └─────────────────────┬───────────────────────┘\n'
    '                          |\n'
    '                          v\n'
    '        Firebase Realtime Database (willy-bodycut)\n'
    '                    ↕ pollOnce() 每 15 秒\n'
    '            iPhone A ← → iPhone B ← → Mac\n'
)
pdf.multi_cell(190, 5, diagram, border=0, fill=True)
pdf.ln(3)

pdf.sub_title('技術選型說明')
tech = [
    ('純 HTML/CSS/JS', '無框架、無建構工具，單一 .html 檔案部署', '零依賴，任何裝置開啟即用'),
    ('Surge.sh',       '靜態網站免費部署平台',                    'npx surge 一行指令部署'),
    ('Firebase RTDB',  'Google 即時資料庫（REST API）',           '三裝置毫秒級同步，免費方案足夠'),
    ('iOS Shortcuts',  'Apple 自動化工具，橋接 HealthKit',        '無需原生 App，直接讀取 Apple Health'),
    ('Claude Haiku',   'Anthropic AI 食物熱量查詢',              '每次查詢 ~$0.001，極低費用'),
    ('LocalStorage',   '本地資料快取，結合 Firebase 雙層儲存',    '離線可用，有網路時自動同步'),
]
ws3 = [40, 65, 85]
pdf.table_row(['技術', '用途', '選擇理由'], ws3, header=True)
for i, r in enumerate(tech):
    pdf.table_row(r, ws3, fill=C_WHITE if i % 2 == 0 else C_GREY)

# ── P4 功能清單 ──────────────────────────────────────────────────
pdf.add_page()
pdf.section_title('三、功能清單')

pdf.sub_title('頁面一：作戰計畫')
pdf.body(
    '基於 InBody 數據生成的 9 週專業減脂計畫，包含：\n'
    '・4個訓練階段（W1-2 適應期 / W3-5 主力減脂 / W6-7 強化期 / W8-9 衝刺收尾）\n'
    '・每階段：熱量目標、訓練計畫、飲食策略\n'
    '・動態進度條（根據今日日期自動計算百分比）\n'
    '・9週目標體重曲線圖（SVG）\n'
    '・巨量營養素分配（蛋白質35% / 碳水33% / 脂肪32%）\n'
    '・Refeed Day 協議說明、黃金準則、補劑建議'
)

pdf.sub_title('頁面二：進度追蹤')
features_tracker = [
    ('⚖', '雙量測體重輸入', '早上空腹 + 睡前，自動計算平均，滿足科學量體重協議'),
    ('📊', '體重趨勢圖表',   '平均線（黃）+ 早上點（藍圈）+ 晚上點（紅圈）+ 數值標籤'),
    ('📋', '記錄清單',       '顯示早晚明細（早X.X/晚X.X）、體脂率、InBody 標記'),
    ('☁', '雲端即時同步',   'Firebase Realtime Database，pollOnce 每15秒，手動↻更新'),
    ('📱', 'Apple Health',   'URL 參數橋接，自動儲存並推送雲端，無需手動按記錄'),
    ('🤖', 'InBody AI 解析', '上傳照片 → Claude Vision 自動讀取體重/體脂/骨骼肌數值'),
    ('📤', '匯出/匯入',      'JSON 格式，支援跨裝置手動備份與還原'),
]
for icon, title, desc in features_tracker:
    pdf.feature_row(icon, title, desc)

pdf.ln(3)
pdf.sub_title('頁面三：飲食日誌')
features_food = [
    ('🔍', '7-11 食物搜尋', '內建 80+ 種常見食物（御飯糰、便當、飲料、關東煮、舒肥雞胸肉等）'),
    ('🤖', 'AI 熱量查詢',   '輸入任意食物名稱 → Claude Haiku 估算份量/熱量/蛋白質/碳水/脂肪'),
    ('📊', '每日營養看板',  '熱量/蛋白質/碳水/脂肪，實際 vs 目標，進度條 + 剩餘顯示'),
    ('📅', '自動對應目標',  '依計畫週次自動切換目標（W1-2: 2250kcal / W3-5: 2100kcal 等）'),
    ('🍽', '手動輸入',      '食物名稱 + 熱量 + 份量 + 三大營養素，支援乘以份數'),
    ('🗑', '刪除食物',      '任何記錄隨時刪除，立即同步雲端'),
]
for icon, title, desc in features_food:
    pdf.feature_row(icon, title, desc)

# ── P5 飲食日誌資料庫 ────────────────────────────────────────────
pdf.add_page()
pdf.section_title('四、飲食資料庫分類')

pdf.body('共 90+ 種食物，涵蓋以下分類：')

categories = [
    ('御飯糰 (8)',    '鮭魚、明太子、燒肉、鮪魚、雞肉、梅子、昆布、蟹味棒'),
    ('便當 (6)',      '雞腿、排骨、控肉、雞排、燒肉、鮭魚'),
    ('三明治 (6)',    '總匯、鮪魚、火腿蛋、BLT、雞蛋沙拉、燻雞'),
    ('麵包點心 (6)',  '香酥奶油、紅豆、克林姆、肉鬆、起司蛋糕、巧克力蛋糕'),
    ('晨光嚴選 (4)', '原味、全麥、鮮奶、巧克力吐司（2片）'),
    ('飲料 (14)',     'CITY CAFE 系列、麥茶、綠茶、紅茶、鮮奶、豆漿、舒跑、寶礦力'),
    ('關東煮 (10)',   '茶葉蛋、溏心蛋、貢丸、豆腐、蘿蔔、玉米、福袋、高麗菜捲、豬血糕、魚板'),
    ('即食熟食 (4)', '茄汁義大利麵、肉燥飯、炒飯、關廟麵'),
    ('舒肥雞胸肉 (7)','原味、黑胡椒、照燒、辣味、鹽蔥、南洋咖哩、香草'),
    ('水果 (5)',      '香蕉（中/小）、蘋果、芭樂、奇異果'),
    ('食材 (6)',      '雞蛋、燕麥片、地瓜、白飯、糙米飯、雞腿、鮭魚'),
    ('蛋白質補充 (4)','即食雞胸肉、希臘優格、低脂起司片、Tryall 水解乳清蛋白（25g）'),
]
ws4 = [50, 140]
pdf.table_row(['分類', '品項'], ws4, header=True)
for i, (cat, items) in enumerate(categories):
    pdf.table_row([cat, items], ws4, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(5)
pdf.sub_title('Tryall 水解乳清蛋白（每匙 25g 正確數值）')
tryall_data = [
    ('熱量', '93.3 kcal', '蛋白質', '20 g'),
    ('脂肪', '1.5 g',     '飽和脂肪', '1.3 g'),
    ('碳水', '1 g',       '糖', '1 g'),
]
ws5 = [38, 28, 38, 28, 38, 28]
pdf.table_row(['項目', '數值', '項目', '數值', '項目', '數值'], ws5, header=True)
for r in tryall_data:
    pdf.table_row(r, ws5, fill=C_GREY)

# ── P6 同步架構 ──────────────────────────────────────────────────
pdf.add_page()
pdf.section_title('五、雲端同步與跨裝置架構')

pdf.sub_title('Firebase Realtime Database 配置')
pdf.body(
    '專案 ID  ：bodycut-6109d\n'
    '資料庫 URL：https://bodycut-6109d-default-rtdb.firebaseio.com\n'
    'Sync ID  ：willy-bodycut\n'
    '資料結構  ：/users/willy-bodycut/{ entries, foodLog, ts, deviceId }'
)

pdf.sub_title('同步機制說明')
sync_details = [
    ('pushToCloud()', '每次儲存（體重/飲食）→ debounce 1.5秒 → PUT 到 Firebase', '即時'),
    ('pollOnce()',    '輪詢 Firebase，每 15 秒自動執行', '15秒更新'),
    ('manualRefresh()', '↻ 按鈕或下拉更新手勢觸發', '立即'),
    ('mergeCloudData()', '比較 cloud.ts vs localTs，雲端較新則全覆蓋（含刪除同步）', '覆蓋式同步'),
    ('DEVICE_ID', '每台裝置唯一 ID，避免自己推的資料觸發覆蓋', '防自循環'),
]
ws6 = [42, 100, 48]
pdf.table_row(['函式 / 機制', '說明', '觸發時機'], ws6, header=True)
for i, r in enumerate(sync_details):
    pdf.table_row(r, ws6, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(4)
pdf.sub_title('跨裝置 Sync ID 設定方式')
pdf.body(
    '由於 Safari 瀏覽器與主畫面 PWA 的 localStorage 完全隔離，\n'
    '採用 URL hash 攜帶 Sync ID 解決跨環境同步問題：\n\n'
    '1. 設定 Sync ID（進度追蹤 → ☁ 雲端同步 → 輸入 willy-bodycut → 設定）\n'
    '2. 點「📋 複製含 ID 的網址」→ 取得帶有 hash 的網址：\n'
    '   https://precious-prison.surge.sh#syncid=willy-bodycut\n'
    '3. 使用此網址加入主畫面，每次開啟自動讀取 hash 中的 Sync ID\n'
    '4. 其他裝置/環境：開啟含 hash 的網址或手動輸入 Sync ID'
)
pdf.warn_box('三台裝置必須使用相同 Sync ID。初次設定後約 15 秒內自動合併所有資料。')

# ── P7 Omron 捷徑整合 ────────────────────────────────────────────
pdf.add_page()
pdf.section_title('六、Omron Connect × iOS 捷徑整合')

pdf.sub_title('資料流程')
pdf.code_box(
    'Omron 體重計（藍牙測量）\n'
    '    ↓ 自動同步（Omron Connect App）\n'
    'Apple Health（體重樣本，公斤單位）\n'
    '    ↓ iOS 捷徑讀取（尋找健康樣本 → 取得數值）\n'
    '    ↓ 格式化當前日期（yyyy-MM-dd）\n'
    '    ↓ 打開 URL\n'
    'https://precious-prison.surge.sh?mw=[數值]&date=[日期]  ← 早上捷徑\n'
    'https://precious-prison.surge.sh?ew=[數值]&date=[日期]  ← 晚上捷徑\n'
    '    ↓ readUrlParams() 解析 URL 參數\n'
    '    ↓ 自動儲存 entry（含早/晚欄位，自動計算平均）\n'
    '    ↓ save() → debouncedPush() → Firebase 同步'
)

pdf.sub_title('兩個捷徑設定')
shortcuts = [
    ('BODY CUT 早上體重', '每日 07:30 自動執行', '使用 ?mw= 參數，存為「早上空腹」'),
    ('BODY CUT 晚上體重', '每日 22:00 自動執行', '使用 ?ew= 參數，存為「睡前」'),
]
ws7 = [50, 55, 85]
pdf.table_row(['捷徑名稱', '自動化時間', '行為'], ws7, header=True)
for i, r in enumerate(shortcuts):
    pdf.table_row(r, ws7, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(3)
pdf.sub_title('捷徑內部動作順序（以早上捷徑為例）')
actions = [
    ('1', '尋找健康樣本',         '類型 Weight，最新優先，限制 1 筆'),
    ('2', '從健康樣本取得數值',    '屬性：值（純數字，單位公斤）'),
    ('3', '取得目前日期',          '取得當下裝置時間'),
    ('4', '格式化日期',            '自訂格式：yyyy-MM-dd'),
    ('5', '打開 URL（Safari）',   'https://precious-prison.surge.sh?mw=[數值]&date=[格式化的日期]'),
]
ws8 = [8, 52, 130]
pdf.table_row(['#', '動作', '設定'], ws8, header=True)
for i, r in enumerate(actions):
    pdf.table_row(r, ws8, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(4)
pdf.sub_title('圖表顯示邏輯')
pdf.body(
    '早晚各有一筆時（hasBoth = true）：\n'
    '  ・🔵 淡藍小點 = 早上空腹體重，數值標示於點上方\n'
    '  ・🔴 淡紅小點 = 睡前體重，數值標示於點下方\n'
    '  ・🟡 黃色大點 = avg 平均體重（早+晚÷2），數值標示最上方\n\n'
    '只有一筆時：\n'
    '  ・黃色主點 + 外圈顏色（藍圈=早，紅圈=晚）+ 「早」/「晚」小字'
)

# ── P8 踩坑記錄 ──────────────────────────────────────────────────
pdf.add_page()
pdf.section_title('七、建置過程踩到的坑', (160, 40, 40), C_LIGHT_R)

bugs = [
    (
        '1', 'iOS Shortcuts Health 動作識別碼不相容',
        '嘗試從 Mac 用 Python plistlib 生成 .shortcut 檔案時，Health 動作識別碼\n'
        '（is.workflow.actions.health.quantity.query）在用戶 iPhone 上顯示「未知的動作」。\n'
        'AEA 加密格式導致無法反向工程現有捷徑的正確識別碼。',
        '放棄程式生成，改為手把手指導用戶在 iPhone 直接建立捷徑。\n'
        '最終用戶成功建立包含「尋找健康樣本」的有效捷徑。',
        C_LIGHT_R,
    ),
    (
        '2', 'iOS Safari vs PWA localStorage 隔離問題',
        'Safari 瀏覽器與加入主畫面的 PWA 各自有獨立的 localStorage，\n'
        '導致 Sync ID 在不同環境下不一致，資料無法同步。',
        '採用 URL hash（#syncid=xxx）攜帶 Sync ID。\n'
        '用戶只需複製含 hash 的網址並用此網址加入主畫面，永久解決。',
        C_LIGHT_O,
    ),
    (
        '3', 'Firebase SSE（即時串流）在 iOS Safari 不穩定',
        'EventSource 長連線在 iOS Safari / PWA 環境下會卡在「連線中…」，\n'
        '尤其在背景切換後連線會中斷且無法恢復。',
        '改為 pollOnce() 輪詢機制（每 15 秒 GET 一次 Firebase），\n'
        '搭配 ↻ 按鈕和下拉更新手勢，所有裝置穩定可用。',
        C_LIGHT_O,
    ),
    (
        '4', 'Omron 體重值帶小數精度問題（81.69999694824219）',
        'Apple Health 存儲的體重值經 JavaScript parseFloat() 後，\n'
        '受 IEEE 754 浮點數精度限制，出現超長小數。',
        '在 readUrlParams() 中加入 Math.round(val * 10) / 10 四捨五入到小數點一位。\n'
        '同時在 Firebase 資料清理腳本中對歷史資料做同樣處理。',
        C_LIGHT_G,
    ),
    (
        '5', '日期格式 2026/6/7（斜線）vs 2026-06-07（橫線）導致錯誤資料',
        '捷徑中「格式化 ❤️製作日期」取到的是健康樣本建立時間而非量測日期，\n'
        '加上格式字串設定錯誤，產生了 2026/6/7 的無效日期記錄。',
        '1. 改用「取得目前日期」+ 自訂格式 yyyy-MM-dd 確保日期正確。\n'
        '2. App 啟動時自動過濾不符合 /^\\d{4}-\\d{2}-\\d{2}$/ 的記錄。\n'
        '3. Firebase 清理腳本同步移除無效日期記錄。',
        C_LIGHT_G,
    ),
    (
        '6', '三台裝置用不同 Sync ID，資料完全分散',
        '用戶在三台裝置分別設定，每台都生成了不同的自動 Sync ID（bc_xxx），\n'
        '導致 Firebase 出現 4 個獨立節點，互相不同步。',
        '從 Firebase Admin REST API 讀取所有節點，合併體重與飲食記錄，\n'
        '寫入統一的 willy-bodycut 節點，再指導三台裝置切換到此 ID。',
        C_LIGHT_O,
    ),
    (
        '7', 'CSS Media Query 順序導致 Food Log 手機版破版',
        'Food Log 的 CSS（display:grid;grid-template-columns:340px 1fr）\n'
        '寫在 @media(max-width:900px) 之後，後定義的規則優先級更高，\n'
        '導致手機版 grid 無法被 media query 覆蓋，側邊欄擠在右側顯示垂直文字。',
        '將 Food Log 相關的手機版覆蓋規則移到 CSS 末端，\n'
        '並加入 !important 確保 display:block 正確覆蓋。\n'
        '同時加入 JS tab 切換（今日記錄 / 加入食物）改善手機 UX。',
        C_LIGHT_R,
    ),
]

for num, title, cause, solution, bg in bugs:
    pdf.bug_box(num, title, cause, solution, bg)

# ── P9 重要設定備忘 ──────────────────────────────────────────────
pdf.add_page()
pdf.section_title('八、重要網址與設定備忘', (0, 100, 60), C_LIGHT_G)

links = [
    ('App 網址',             'https://precious-prison.surge.sh'),
    ('含 Sync ID 網址',      'https://precious-prison.surge.sh#syncid=willy-bodycut'),
    ('Firebase 資料庫',      'https://bodycut-6109d-default-rtdb.firebaseio.com'),
    ('Firebase Console',     'console.firebase.google.com（專案：bodycut-6109d）'),
    ('Surge 部署指令',       'npx surge . precious-prison.surge.sh'),
    ('Anthropic Console',    'console.anthropic.com（Claude Haiku 食物查詢）'),
    ('Omron Connect',        'App Store 下載，需開啟「Apple 健康連接」'),
    ('捷徑：早上',           'BODY CUT 早上體重，自動化 07:30，使用 ?mw= 參數'),
    ('捷徑：晚上',           'BODY CUT 晚上體重，自動化 22:00，使用 ?ew= 參數'),
    ('Sync ID',              'willy-bodycut（三台裝置統一使用）'),
]

ws9 = [48, 142]
pdf.table_row(['項目', '內容'], ws9, header=True)
for i, (label, val) in enumerate(links):
    pdf.table_row([label, val], ws9, fill=C_WHITE if i % 2 == 0 else C_GREY)

pdf.ln(6)
pdf.section_title('九、Firebase 安全性說明')
pdf.body(
    '目前 Firebase Realtime Database 採「Test Mode」規則（開放讀寫）。\n'
    'Test Mode 有效期 30 天（約到 2026-07-01），到期後資料庫會拒絕所有讀寫。\n\n'
    '到期前請到 Firebase Console → Realtime Database → 規則，改為：'
)
pdf.code_box(
    '{\n'
    '  "rules": {\n'
    '    "users": {\n'
    '      "$uid": {\n'
    '        ".read": true,\n'
    '        ".write": true\n'
    '      }\n'
    '    }\n'
    '  }\n'
    '}'
)
pdf.warn_box(
    '安全性提醒：Sync ID（willy-bodycut）充當「密碼」。\n'
    '任何知道此 ID 的人都能讀寫你的資料。勿在公開場合分享含 syncid 的網址。'
)

pdf.ln(5)
pdf.section_title('十、費用總覽')
costs = [
    ('Surge.sh',           '靜態網站部署，免費方案',   '免費'),
    ('Firebase RTDB',      '1GB 儲存，10GB 傳輸/月',  '免費'),
    ('iOS Shortcuts',       'Apple 內建',              '免費'),
    ('Omron Connect',       'App Store 免費下載',      '免費'),
    ('Claude Haiku API',    '食物查詢，~每次 $0.001', '極低（視使用量）'),
    ('合計', '', '≈ 免費（AI 查詢費用忽略不計）'),
]
wsc = [48, 90, 52]
pdf.table_row(['服務', '說明', '費用'], wsc, header=True)
cost_colors = [C_WHITE, C_GREY, C_WHITE, C_GREY, C_WHITE, C_LIGHT_Y]
for r, c in zip(costs, cost_colors):
    pdf.table_row(r, wsc, fill=c)

pdf.ln(10)
pdf.set_fill_color(20, 20, 30)
pdf.set_ch(10, (180, 220, 0))
pdf.cell(0, 10,
    '  BODY CUT  ．  建置日期 2026-05-31  ．  目標：83.7kg → 79.1kg  ．  9週計畫',
    fill=True, align='C', ln=True)

pdf.output(OUT)
print(f'PDF 已產生：{OUT}')
