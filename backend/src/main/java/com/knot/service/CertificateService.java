package com.knot.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class CertificateService {

    public byte[] generateCertificate(String attendeeName, String eventTitle, String dateStr) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 16);

            Paragraph title = new Paragraph("Certificate of Attendance", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            title.setSpacingAfter(50);
            document.add(title);

            Paragraph p1 = new Paragraph("This is to certify that", textFont);
            p1.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            p1.setSpacingAfter(20);
            document.add(p1);

            Paragraph name = new Paragraph(attendeeName, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20));
            name.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            name.setSpacingAfter(20);
            document.add(name);

            Paragraph p2 = new Paragraph("has successfully attended the event", textFont);
            p2.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            p2.setSpacingAfter(20);
            document.add(p2);

            Paragraph eventName = new Paragraph(eventTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20));
            eventName.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            eventName.setSpacingAfter(50);
            document.add(eventName);

            Paragraph date = new Paragraph("Date: " + dateStr, textFont);
            date.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(date);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}
