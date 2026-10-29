import os
import re
import html
import zipfile
import shutil

MD_PATH = "/mnt/c/Users/LENOVO/waranusa-collab/UINIC8#2026_WEBDEV_Im Back To Come_SMK Negeri 1 Bantul.md"
TEMPLATE_DOCX = "/mnt/c/Users/LENOVO/OneDrive/Documents/Template Proposal Peserta Lomba WEBDEV UINIC 8.0 (1).docx"
OUT_DOCX_LOCAL = "/mnt/c/Users/LENOVO/waranusa-collab/UINIC8#2026_WEBDEV_Im Back To Come_SMK Negeri 1 Bantul.docx"
OUT_DOCX_ONEDRIVE = "/mnt/c/Users/LENOVO/OneDrive/Documents/UINIC8#2026_WEBDEV_Im Back To Come_SMK Negeri 1 Bantul.docx"

def xml_escape(text):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    return text

def parse_inlines_to_xml(text, default_mono=False, default_color=None):
    # parses bold, italic, inline code, and returns OpenXML <w:r> elements
    # tokens: `code`, **bold**, *italic*, normal text
    pattern = re.compile(r'(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))')
    parts = pattern.split(text)
    
    runs = []
    for part in parts:
        if not part:
            continue
        is_bold = False
        is_italic = False
        is_code = default_mono
        run_text = part
        
        if part.startswith("`") and part.endswith("`") and len(part) >= 2:
            is_code = True
            run_text = part[1:-1]
        elif part.startswith("**") and part.endswith("**") and len(part) >= 4:
            is_bold = True
            run_text = part[2:-2]
        elif part.startswith("*") and part.endswith("*") and len(part) >= 2:
            is_italic = True
            run_text = part[1:-1]
        elif part.startswith("[") and "](" in part and part.endswith(")"):
            # Markdown link [text](url) -> display text
            m = re.match(r'\[([^\]]+)\]\(([^)]+)\)', part)
            if m:
                run_text = f"{m.group(1)} ({m.group(2)})"
                is_italic = True
        
        # Split line breaks <br> or <br/> if any
        subparts = re.split(r'<br\s*/?>', run_text, flags=re.IGNORECASE)
        for i, sp in enumerate(subparts):
            if i > 0:
                runs.append('<w:r><w:br/></w:r>')
            
            clean_t = xml_escape(sp)
            rpr = []
            if is_bold:
                rpr.append('<w:b/>')
            if is_italic:
                rpr.append('<w:i/>')
            if is_code:
                rpr.append('<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>')
                rpr.append('<w:color w:val="8C5E3C"/>')
                rpr.append('<w:shd w:val="clear" w:color="auto" w:fill="F5ECE1"/>')
            elif default_color:
                rpr.append(f'<w:color w:val="{default_color}"/>')
            
            rpr_xml = f"<w:rPr>{''.join(rpr)}</w:rPr>" if rpr else ""
            runs.append(f'<w:r>{rpr_xml}<w:t xml:space="preserve">{clean_t}</w:t></w:r>')
            
    return "".join(runs)

def make_paragraph(inlines_xml, style=None, align=None, spacing_after=120, spacing_before=0, left_indent=0):
    p_pr = []
    if style:
        p_pr.append(f'<w:pStyle w:val="{style}"/>')
    if align:
        p_pr.append(f'<w:jc w:val="{align}"/>')
    
    sp_attr = []
    if spacing_after:
        sp_attr.append(f'w:after="{spacing_after}"')
    if spacing_before:
        sp_attr.append(f'w:before="{spacing_before}"')
    if sp_attr:
        p_pr.append(f"<w:spacing {' '.join(sp_attr)}/>")
        
    if left_indent:
        p_pr.append(f'<w:ind w:left="{left_indent}"/>')
        
    p_pr_xml = f"<w:pPr>{''.join(p_pr)}</w:pPr>" if p_pr else ""
    return f"<w:p>{p_pr_xml}{inlines_xml}</w:p>"

def make_table(rows_data):
    # rows_data: list of list of str
    if not rows_data:
        return ""
    
    num_cols = max(len(r) for r in rows_data)
    # estimate cell width evenly across 9360 dxa (approx 6.5 inches printable width)
    cell_w = max(1000, 9360 // num_cols)
    
    xml = ['<w:tbl>']
    xml.append('<w:tblPr>')
    xml.append(f'<w:tblW w:w="{cell_w * num_cols}" w:type="dxa"/>')
    xml.append('<w:jc w:val="center"/>')
    xml.append('<w:tblBorders>')
    xml.append('<w:top w:val="single" w:sz="6" w:space="0" w:color="8C5E3C"/>')
    xml.append('<w:left w:val="single" w:sz="4" w:space="0" w:color="D5C4B4"/>')
    xml.append('<w:bottom w:val="single" w:sz="6" w:space="0" w:color="8C5E3C"/>')
    xml.append('<w:right w:val="single" w:sz="4" w:space="0" w:color="D5C4B4"/>')
    xml.append('<w:insideH w:val="single" w:sz="4" w:space="0" w:color="EBDBC9"/>')
    xml.append('<w:insideV w:val="single" w:sz="4" w:space="0" w:color="EBDBC9"/>')
    xml.append('</w:tblBorders>')
    xml.append('<w:tblCellMar>')
    xml.append('<w:top w:w="120" w:type="dxa"/>')
    xml.append('<w:left w:w="160" w:type="dxa"/>')
    xml.append('<w:bottom w:w="120" w:type="dxa"/>')
    xml.append('<w:right w:w="160" w:type="dxa"/>')
    xml.append('</w:tblCellMar>')
    xml.append('</w:tblPr>')
    
    for r_idx, row in enumerate(rows_data):
        is_header = (r_idx == 0)
        xml.append('<w:tr>')
        if is_header:
            xml.append('<w:trPr><w:tblHeader/></w:trPr>')
            
        for c_idx, cell_text in enumerate(row):
            xml.append('<w:tc>')
            tc_pr = [f'<w:tcW w:w="{cell_w}" w:type="dxa"/>']
            if is_header:
                tc_pr.append('<w:shd w:val="clear" w:color="auto" w:fill="FAF4EC"/>')
            else:
                if r_idx % 2 == 1:
                    tc_pr.append('<w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/>')
                else:
                    tc_pr.append('<w:shd w:val="clear" w:color="auto" w:fill="FCF8F5"/>')
            tc_pr.append('<w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>')
            xml.append(f"<w:tcPr>{''.join(tc_pr)}</w:tcPr>")
            
            # format cell content
            align = "center" if (is_header or cell_text.strip().startswith("TC-") or cell_text.strip().isdigit()) else "left"
            inlines = parse_inlines_to_xml(cell_text.strip())
            p = make_paragraph(inlines, align=align, spacing_after=60, spacing_before=60)
            xml.append(p)
            xml.append('</w:tc>')
        xml.append('</w:tr>')
        
    xml.append('</w:tbl>')
    return "".join(xml)

def convert_md_to_docx_body(md_text):
    lines = md_text.splitlines()
    body_elements = []
    
    in_code_block = False
    code_lines = []
    
    in_table = False
    table_rows = []
    
    in_center = False
    
    for idx, line in enumerate(lines):
        raw_line = line
        stripped = line.strip()
        
        # Check code fence
        if stripped.startswith("```"):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                # flush code block
                code_text = "\n".join(code_lines)
                for cl in code_lines:
                    escaped_cl = xml_escape(cl)
                    p_xml = (
                        f'<w:p><w:pPr>'
                        f'<w:pBdr><w:left w:val="single" w:sz="18" w:space="8" w:color="8C5E3C"/></w:pBdr>'
                        f'<w:shd w:val="clear" w:color="auto" w:fill="FAF7F2"/>'
                        f'<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>'
                        f'<w:ind w:left="360" w:right="180"/>'
                        f'</w:pPr>'
                        f'<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="17"/><w:color w:val="2D1E12"/></w:rPr>'
                        f'<w:t xml:space="preserve">{escaped_cl}</w:t></w:r></w:p>'
                    )
                    body_elements.append(p_xml)
                body_elements.append(make_paragraph("", spacing_after=120))
            continue
            
        if in_code_block:
            code_lines.append(raw_line)
            continue
            
        # Check table
        if stripped.startswith("|") and stripped.endswith("|"):
            # check if delimiter line |:---|:---|
            if re.match(r'^\|[\s:-|]+\|$', stripped):
                continue
            cells = [c.strip() for c in stripped.split("|")[1:-1]]
            if not in_table:
                in_table = True
                table_rows = [cells]
            else:
                table_rows.append(cells)
            continue
        else:
            if in_table:
                # flush table
                body_elements.append(make_table(table_rows))
                body_elements.append(make_paragraph("", spacing_after=120))
                in_table = False
                table_rows = []
                
        # Check center tags
        if "<div align=\"center\">" in stripped or "<div align='center'>" in stripped:
            in_center = True
            continue
        if "</div>" in stripped:
            in_center = False
            continue
            
        # Pagebreak
        if stripped == "\\newpage":
            body_elements.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
            continue
            
        # Horizontal Rule
        if stripped in ["---", "***", "___"]:
            hr_p = (
                '<w:p><w:pPr>'
                '<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="8C5E3C"/></w:pBdr>'
                '<w:spacing w:before="120" w:after="180"/>'
                '</w:pPr></w:p>'
            )
            body_elements.append(hr_p)
            continue
            
        # Headings
        if stripped.startswith("#"):
            m = re.match(r'^(#{1,6})\s+(.*)$', stripped)
            if m:
                level = len(m.group(1))
                h_text = m.group(2)
                style_map = {1: "Heading1", 2: "Heading2", 3: "Heading3", 4: "Heading4", 5: "Heading5", 6: "Heading6"}
                style = style_map.get(level, "Heading1")
                align = "center" if in_center else "left"
                
                # Custom heading styling
                inlines = parse_inlines_to_xml(h_text)
                before = 240 if level == 1 else (180 if level == 2 else 120)
                after = 120 if level == 1 else (90 if level == 2 else 60)
                body_elements.append(make_paragraph(inlines, style=style, align=align, spacing_before=before, spacing_after=after))
                continue
                
        # Blockquote
        if stripped.startswith(">"):
            bq_text = stripped.lstrip(">").strip()
            inlines = parse_inlines_to_xml(bq_text)
            p_xml = (
                f'<w:p><w:pPr>'
                f'<w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="8C5E3C"/></w:pBdr>'
                f'<w:shd w:val="clear" w:color="auto" w:fill="FAF6ED"/>'
                f'<w:spacing w:before="120" w:after="120"/>'
                f'<w:ind w:left="400" w:right="200"/>'
                f'</w:pPr>{inlines}</w:p>'
            )
            body_elements.append(p_xml)
            continue
            
        # Bullet list
        if re.match(r'^[-*]\s+', stripped):
            item_text = re.sub(r'^[-*]\s+', '', stripped)
            inlines = parse_inlines_to_xml("• " + item_text)
            body_elements.append(make_paragraph(inlines, left_indent=480, spacing_after=60, spacing_before=0))
            continue
            
        # Numbered list
        if re.match(r'^\d+\.\s+', stripped):
            item_text = stripped
            inlines = parse_inlines_to_xml(item_text)
            body_elements.append(make_paragraph(inlines, left_indent=480, spacing_after=60, spacing_before=0))
            continue
            
        # Blank line
        if not stripped:
            continue
            
        # Regular paragraph
        align = "center" if in_center else "left"
        inlines = parse_inlines_to_xml(stripped)
        body_elements.append(make_paragraph(inlines, style="Normal", align=align, spacing_after=120, spacing_before=0))
        
    if in_table:
        body_elements.append(make_table(table_rows))
        
    return "".join(body_elements)

def build_docx():
    print(f"Reading markdown: {MD_PATH}")
    with open(MD_PATH, "r", encoding="utf-8") as f:
        md_text = f.read()
        
    print("Converting markdown elements to OpenXML...")
    doc_body = convert_md_to_docx_body(md_text)
    
    # sectPr from template
    sect_pr = (
        '<w:sectPr>'
        '<w:pgSz w:h="15840" w:w="12240" w:orient="portrait"/>'
        '<w:pgMar w:bottom="1440" w:top="1440" w:left="1440" w:right="1440" w:header="720" w:footer="720"/>'
        '<w:pgNumType w:start="1"/>'
        '</w:sectPr>'
    )
    
    full_document_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" '
        'xmlns:o="urn:schemas-microsoft-com:office:office" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" '
        'xmlns:v="urn:schemas-microsoft-com:vml" '
        'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
        'xmlns:w10="urn:schemas-microsoft-com:office:word" '
        'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        'xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" '
        'xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" '
        'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" '
        'xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" '
        'xmlns:lc="http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas" '
        'xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram">'
        f'<w:body>{doc_body}{sect_pr}</w:body>'
        '</w:document>'
    )
    
    print(f"Opening template docx: {TEMPLATE_DOCX}")
    with zipfile.ZipFile(TEMPLATE_DOCX, "r") as template_zip:
        with zipfile.ZipFile(OUT_DOCX_LOCAL, "w", compression=zipfile.ZIP_DEFLATED) as out_zip:
            for item in template_zip.infolist():
                if item.filename == "word/document.xml":
                    out_zip.writestr(item, full_document_xml.encode("utf-8"))
                else:
                    data = template_zip.read(item.filename)
                    out_zip.writestr(item, data)
                    
    print(f"Created local docx: {OUT_DOCX_LOCAL} ({os.path.getsize(OUT_DOCX_LOCAL)} bytes)")
    
    # Also copy to OneDrive folder
    try:
        shutil.copy2(OUT_DOCX_LOCAL, OUT_DOCX_ONEDRIVE)
        print(f"Copied to OneDrive: {OUT_DOCX_ONEDRIVE} ({os.path.getsize(OUT_DOCX_ONEDRIVE)} bytes)")
    except Exception as e:
        print(f"Notice copying to OneDrive: {e}")
        
    print("SUCCESSFUL CONVERSION TO .DOCX!")

if __name__ == "__main__":
    build_docx()
