import os
import io
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

class ReportService:
    """Forensic Cybersecurity PDF Report Generation Engine."""

    def generate_pdf_report(self, scan_data: Dict[str, Any]) -> bytes:
        """Compiles scan telemetry, risk scores, indicators, and actions into a polished PDF document."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom dark-theme inspired palette
        primary_color = colors.HexColor("#0f172a")  # Slate 900
        accent_color = colors.HexColor("#06b6d4")   # Cyan 500
        text_muted = colors.HexColor("#64748b")     # Slate 500
        
        # Risk color mapper
        risk_level = scan_data.get("risk_level", "UNKNOWN")
        if risk_level == "CRITICAL":
            badge_color = colors.HexColor("#dc2626")  # Red 600
        elif risk_level == "HIGH":
            badge_color = colors.HexColor("#ea580c")  # Orange 600
        elif risk_level == "MEDIUM":
            badge_color = colors.HexColor("#eab308")  # Yellow 500
        elif risk_level == "LOW":
            badge_color = colors.HexColor("#3b82f6")  # Blue 500
        else:
            badge_color = colors.HexColor("#10b981")  # Green 500

        # Title Style
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=text_muted,
            spaceAfter=12
        )
        
        heading2_style = ParagraphStyle(
            "Heading2",
            parent=styles["Heading2"],
            fontSize=13,
            leading=16,
            textColor=primary_color,
            spaceBefore=10,
            spaceAfter=6
        )
        
        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#1e293b")
        )
        
        list_style = ParagraphStyle(
            "DocList",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155"),
            leftIndent=12,
            spaceAfter=3
        )

        story = []

        # 1. Header
        story.append(Paragraph("<b>PHISHGUARD AI</b> — Threat Intelligence Report", title_style))
        report_timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        story.append(Paragraph(f"Generated on {report_timestamp} &bull; Forensic Scan ID: <b>{scan_data.get('id', 'N/A')}</b>", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=14))

        # 2. Executive Assessment Banner
        score = scan_data.get("risk_score", 0)
        conf = int(scan_data.get("confidence", 0) * 100)
        scan_type = scan_data.get("scan_type", "UNKNOWN")
        
        assessment_data = [
            [
                Paragraph("<b>Risk Score:</b>", body_style),
                Paragraph(f"<font color='{badge_color.hexval()}'><b>{score}/100</b> ({risk_level})</font>", body_style),
                Paragraph("<b>Confidence:</b>", body_style),
                Paragraph(f"<b>{conf}%</b>", body_style)
            ],
            [
                Paragraph("<b>Vector Type:</b>", body_style),
                Paragraph(f"{scan_type}", body_style),
                Paragraph("<b>Classification:</b>", body_style),
                Paragraph(f"<b>{scan_data.get('classification', 'N/A')}</b>", body_style)
            ]
        ]
        
        t_assess = Table(assessment_data, colWidths=[90, 170, 90, 170])
        t_assess.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(t_assess)
        story.append(Spacer(1, 10))

        # 3. Target Payload
        story.append(Paragraph("<b>Target Analyzed</b>", heading2_style))
        target_text = str(scan_data.get("target_text", "N/A"))
        if len(target_text) > 400:
            target_text = target_text[:397] + "..."
        story.append(Paragraph(f"<code>{target_text}</code>", body_style))
        story.append(Spacer(1, 8))

        # 4. Identified Threat Indicators
        story.append(Paragraph("<b>Threat Indicators</b>", heading2_style))
        indicators = scan_data.get("threat_indicators", [])
        if indicators:
            for ind in indicators:
                title = ind.get("title", "Threat Signal")
                sev = ind.get("severity", "MEDIUM")
                desc = ind.get("description", "")
                story.append(Paragraph(f"&bull; <b>[{sev}] {title}</b>: {desc}", list_style))
        else:
            story.append(Paragraph("&bull; No malicious threat indicators detected.", list_style))
        story.append(Spacer(1, 8))

        # 5. Explainable AI Rationale
        story.append(Paragraph("<b>Explainable AI (XAI) Analysis</b>", heading2_style))
        explanations = scan_data.get("explanations", [])
        if explanations:
            for exp in explanations:
                story.append(Paragraph(f"&bull; {exp}", list_style))
        else:
            story.append(Paragraph("&bull; The input exhibited typical benign baseline patterns.", list_style))
        story.append(Spacer(1, 8))

        # 6. Actionable Defensive Recommendations
        story.append(Paragraph("<b>Recommended Countermeasures</b>", heading2_style))
        recommendations = scan_data.get("recommendations", [])
        if recommendations:
            for rec in recommendations:
                story.append(Paragraph(f"&bull; {rec}", list_style))
        else:
            story.append(Paragraph("&bull; Maintain standard digital cyber hygiene.", list_style))
        story.append(Spacer(1, 14))

        # 7. Disclaimer Footer
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=8))
        disclaimer = (
            "<b>Disclaimer:</b> PhishGuard AI provides automated heuristic and statistical machine learning risk assessments. "
            "Predictions are defensive indicators and do not constitute absolute security guarantees."
        )
        story.append(Paragraph(disclaimer, subtitle_style))

        # Build PDF document
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

report_service = ReportService()
