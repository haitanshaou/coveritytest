package com.esen.study.pdf;

import java.io.FileOutputStream;

import org.junit.Test;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

public class CreateSimplePDF {
	private Font FontChinese;

	@Test
	public void test() {
		simplePDF();
	}
	public void simplePDF() {
		try {
			BaseFont bfChinese = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
			FontChinese = new Font(bfChinese, 12, Font.NORMAL);
			Document document = new Document();
			PdfWriter.getInstance(document, new FileOutputStream("F:\\a.pdf"));
			document.open();

			PdfPTable table = new PdfPTable(4);
			table.addCell(getCell("姓名", 1, 1));
			table.addCell(getCell("", 1, 1));
			table.addCell(getCell("编号", 1, 1));
			table.addCell(getCell("", 1, 1));

			table.addCell(getCell("部门", 1, 1));
			table.addCell(getCell("", 1, 1));
			table.addCell(getCell("岗位名称", 1, 1));
			table.addCell(getCell("", 1, 1));

			table.addCell(getCell("到职日期", 1, 1));
			table.addCell(getCell("", 1, 1));
			table.addCell(getCell("预定离职日期", 1, 1));
			table.addCell(getCell("", 1, 1));

			table.addCell(getCell("事由", 1, 3));
			table.addCell(getCell("", 3, 3));

			table.addCell(getCell("部门意见", 1, 3));
			table.addCell(getCell("", 3, 3));
			document.add(table);
			document.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private PdfPCell getCell(String cellValue, int colspan, int rowSpan) {
		PdfPCell cell = new PdfPCell();
		try {
			cell = new PdfPCell(new Phrase(cellValue, FontChinese));
			cell.setRowspan(rowSpan);
			cell.setColspan(colspan);
			cell.setHorizontalAlignment(Element.ALIGN_CENTER);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cell;
	}
}
