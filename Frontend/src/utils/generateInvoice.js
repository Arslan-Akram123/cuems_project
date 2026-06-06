// src/utils/generateInvoice.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (booking) => {
    if (!booking || !booking.event || !booking.user) {
        console.error("Invalid booking data provided for invoice generation.");
        return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Colors
    const primaryColor = [22, 163, 164]; // Teal
    const secondaryColor = [241, 243, 245]; // Light gray
    const darkText = [40, 40, 40];
    const mediumText = [100, 100, 100];
    const lightText = [150, 150, 150];

    // --- 1. Header with Logo and Invoice Details ---
    
    // Company Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 24, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTOPS', 14, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('HUB', 14, 22);
    
    // Invoice Title and Details
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 14, 16, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #${booking._id.slice(-8).toUpperCase()}`, pageWidth - 14, 21, { align: 'right' });
    doc.text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, pageWidth - 14, 26, { align: 'right' });

    // --- 2. Billing Information Section ---
    const billingStartY = 40;
    
    // Bill To section
    doc.setFillColor(...secondaryColor);
    doc.rect(14, billingStartY, pageWidth - 28, 12, 'F');
    doc.setTextColor(...darkText);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("BILL TO", 16, billingStartY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.setFontSize(11);
    doc.text(booking.user.fullName.toUpperCase(), 14, billingStartY + 20);
    doc.setFontSize(9);
    doc.setTextColor(...mediumText);
    doc.text(booking.user.email, 14, billingStartY + 25);
    
    // Invoice details
    // const invoiceDetails = [
    //     { label: "Booking ID", value: `#${booking._id.slice(-8).toUpperCase()}` },
    //     { label: "Date:", value: new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
    //     // { label: "Status", value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }
    // ];
    
    // let detailY = billingStartY + 20;
    // invoiceDetails.forEach(detail => {
    //     doc.setTextColor(...lightText);
    //     doc.text(`${detail.label}:`, pageWidth - 50, detailY);
    //     doc.setTextColor(...darkText);
    //     doc.text(detail.value, pageWidth - 14, detailY, { align: 'right' });
    //     detailY += 5;
    // });

    // --- 3. Invoice Table ---
    const eventDate = booking.event.startDate ? 
        new Date(booking.event.startDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
        }) : 'N/A';
let formattedStartTime = booking.event.startTime;
if (booking.event.startTime) {
    const [hour, minute] = booking.event.startTime.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    formattedStartTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
let formattedEndTime = booking.event.endTime;
if (booking.event.endTime) {
    const [hour, minute] = booking.event.endTime.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    formattedEndTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
    const tableData = [
        [
            { 
                content: `${booking.event.name}\nDate: ${eventDate}\nStart Time: ${formattedStartTime}\nEnd Time: ${formattedEndTime}\nLocation: ${booking.event.location || 'Online'}`,
                styles: { valign: 'middle' }
            },
            { 
                content: `$${booking.event.price.toFixed(2)}`,
                styles: { halign: 'right' }
            }
        ]
    ];

    autoTable(doc, {
        head: [
            [
                { 
                    content: 'DESCRIPTION',
                    styles: { fontStyle: 'bold', halign: 'left' }
                },
                { 
                    content: 'AMOUNT',
                    styles: { fontStyle: 'bold', halign: 'right' }
                }
            ]
        ],
        body: tableData,
        startY: billingStartY + 50,
        margin: { left: 14, right: 14 },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak'
        },
        headStyles: { 
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 10,
            cellPadding: 5
        },
        bodyStyles: {
            textColor: darkText
        },
        alternateRowStyles: {
            fillColor: secondaryColor
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 40 }
        },
        didParseCell: function(data) {
            if (data.column.dataKey === 0 && data.row.index > 0) {
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

   

    // --- 5. Footer ---
    const footerY = pageHeight - 30;
    
    // Payment instructions
    doc.setFontSize(8);
    doc.setTextColor(...lightText);
    doc.text("IMPORTANT INFORMATION", 14, footerY);
    doc.setFontSize(7);
    doc.text("Please take a print of this invoice and present it at the time of the event.", 14, footerY + 5);
    doc.text("please make sure to bring your ID with you.", 14, footerY + 10);
    
    // Thank you message
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text(
        "Thank you for your booking!",
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
    );
    
    // Page number
    doc.setTextColor(...lightText);
    doc.text(`Page 1 of 1`, pageWidth - 14, pageHeight - 10, { align: 'right' });

    // --- Save PDF ---
    doc.save(`Invoice_${booking._id.slice(-8).toUpperCase()}.pdf`);
};