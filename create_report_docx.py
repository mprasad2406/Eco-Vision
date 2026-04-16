#!/usr/bin/env python3
"""
Convert PROJECT_COMPLETION_REPORT.md and IOT_SETUP_GUIDE_DETAILED.md
into a single professional DOCX document
"""

import re
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT

def read_markdown(filename):
    """Read markdown file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()

def parse_markdown_to_docx(content, doc):
    """Parse markdown content and add to docx document"""
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Skip empty lines
        if not line.strip():
            i += 1
            continue
        
        # H1 heading
        if line.startswith('# '):
            text = line[2:].strip()
            p = doc.add_heading(text, level=1)
            p.paragraph_format.space_after = Pt(12)
            i += 1
        
        # H2 heading
        elif line.startswith('## '):
            text = line[3:].strip()
            p = doc.add_heading(text, level=2)
            p.paragraph_format.space_after = Pt(10)
            i += 1
        
        # H3 heading
        elif line.startswith('### '):
            text = line[4:].strip()
            p = doc.add_heading(text, level=3)
            p.paragraph_format.space_after = Pt(8)
            i += 1
        
        # H4 heading
        elif line.startswith('#### '):
            text = line[5:].strip()
            p = doc.add_heading(text, level=4)
            p.paragraph_format.space_after = Pt(6)
            i += 1
        
        # Code block
        elif line.startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1  # Skip closing ```
            
            if code_lines:
                code_text = '\n'.join(code_lines).strip()
                p = doc.add_paragraph(code_text)
                p.style = 'Normal'
                for run in p.runs:
                    run.font.name = 'Courier New'
                    run.font.size = Pt(9)
                    run.font.color.rgb = RGBColor(0, 0, 139)
                p.paragraph_format.left_indent = Inches(0.3)
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(6)
        
        # Table (simple markdown table)
        elif '|' in line and i + 1 < len(lines) and '|' in lines[i + 1]:
            # Parse table header
            headers = [h.strip() for h in line.split('|')[1:-1]]
            i += 2  # Skip header and separator
            
            rows = []
            while i < len(lines) and '|' in lines[i]:
                row_data = [col.strip() for col in lines[i].split('|')[1:-1]]
                if len(row_data) == len(headers):
                    rows.append(row_data)
                i += 1
            
            # Create table
            if headers and rows:
                table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
                table.style = 'Light Grid Accent 1'
                
                # Header row
                hdr_cells = table.rows[0].cells
                for i_h, header in enumerate(headers):
                    hdr_cells[i_h].text = header
                    for paragraph in hdr_cells[i_h].paragraphs:
                        for run in paragraph.runs:
                            run.font.bold = True
                
                # Data rows
                for row_idx, row_data in enumerate(rows):
                    row_cells = table.rows[row_idx + 1].cells
                    for col_idx, cell_text in enumerate(row_data):
                        row_cells[col_idx].text = cell_text
        
        # Bold/Italic text patterns
        elif line.strip():
            p = doc.add_paragraph()
            
            # Process inline formatting
            current_pos = 0
            text = line
            
            # Replace **text** with bold
            pattern = r'\*\*([^*]+)\*\*'
            parts = re.split(pattern, text)
            
            for idx, part in enumerate(parts):
                if idx % 2 == 0:  # Normal text
                    if part:
                        run = p.add_run(part)
                else:  # Bold text
                    run = p.add_run(part)
                    run.bold = True
            
            # Apply other formatting (italic, etc)
            for run in p.runs:
                if '_' in run.text:
                    run.italic = True
            
            p.paragraph_format.space_after = Pt(6)
            i += 1
        
        else:
            i += 1

def create_combined_docx():
    """Create combined DOCX document"""
    print("📄 Reading markdown files...")
    
    report_content = read_markdown('PROJECT_COMPLETION_REPORT.md')
    iot_content = read_markdown('IOT_SETUP_GUIDE_DETAILED.md')
    
    print("📝 Creating DOCX document...")
    
    # Create document
    doc = Document()
    
    # Set default font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    
    # Add title page
    title = doc.add_heading('EcoVision AI', level=0)
    title.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    subtitle = doc.add_heading('AI-Based Smart Waste Segregation & Monitoring System', level=2)
    subtitle.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    doc.add_paragraph()
    
    info = doc.add_paragraph()
    info.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    info.add_run('Combined Project Report + IoT Setup Guide\n').bold = True
    info.add_run('April 2026\n')
    info.add_run('Version 1.0 - Production Ready')
    
    doc.add_page_break()
    
    # Table of contents
    doc.add_heading('Table of Contents', level=1)
    toc = doc.add_paragraph()
    toc.add_run('1. Project Completion Report\n')
    toc.add_run('2. IoT Setup Guide & Hardware Integration\n')
    toc.add_run('3. Quick Reference & Troubleshooting')
    
    doc.add_page_break()
    
    # Add report content
    print("  ✓ Adding Project Report...")
    doc.add_heading('SECTION 1: Project Completion Report', level=1)
    parse_markdown_to_docx(report_content, doc)
    
    doc.add_page_break()
    
    # Add IoT guide content
    print("  ✓ Adding IoT Setup Guide...")
    doc.add_heading('SECTION 2: IoT Setup Guide & Hardware Integration', level=1)
    parse_markdown_to_docx(iot_content, doc)
    
    # Save document
    output_file = 'EcoVision_AI_Complete_Report.docx'
    doc.save(output_file)
    
    print(f"\n✅ Document created successfully: {output_file}")
    print(f"   Size: {len(report_content) + len(iot_content):,} characters")
    print(f"   Sections: 2 major sections combined")
    print(f"   Format: Microsoft Word (.docx)")

if __name__ == '__main__':
    try:
        create_combined_docx()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
