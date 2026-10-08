import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";

// Local image assets
import logoImg from "../../assets/top nav bar logo.png";
import sealImg from "../../assets/seal.jpg";
import msmeImg from "../../assets/msme.png";
import hariSig from "../../assets/hari sig.jpeg";
import maheshSig from "../../assets/mahesh sig.jpeg";
import yrTechImg from "../../assets/yr-tech logo.png";
import vinixImg from "../../assets/vinix.png";

export const defaultImageAssets = {
  logo: logoImg,
  seal: sealImg,
  msme: msmeImg,
  sigFounder: hariSig,
  sigCofounder: maheshSig,
  yrTech: yrTechImg,
  vinix: vinixImg,
};

/* ==========================================================================
   1. OFFER LETTER PDF TEMPLATE
   ========================================================================== */

const offerStyles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 26,
    fontSize: 8.5,
    color: "#0f172a",
    fontFamily: "Helvetica",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  frameOuter: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1.2,
    borderColor: "#07284a",
    borderRadius: 4,
  },
  frameInner: {
    position: "absolute",
    top: 12.5,
    left: 12.5,
    right: 12.5,
    bottom: 12.5,
    borderWidth: 0.5,
    borderColor: "#0284c7",
    opacity: 0.25,
    borderRadius: 3,
  },
  watermark: {
    position: "absolute",
    top: 320,
    left: 0,
    right: 0,
    alignItems: "center",
    opacity: 0.02,
  },
  watermarkText: {
    fontSize: 60,
    color: "#07284a",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 8,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 9,
    borderBottomWidth: 0.75,
    borderBottomColor: "#cbd5e1",
    marginBottom: 11,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 45,
    height: 45,
    objectFit: "contain",
  },
  headerDivider: {
    width: 0.75,
    height: 36,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 11,
  },
  brandName: {
    fontSize: 16.5,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 8.8,
    fontFamily: "Helvetica-Bold",
    color: "#0284c7",
    marginTop: 0.8,
  },
  brandMeta: {
    fontSize: 7.4,
    color: "#64748b",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  refLabel: {
    fontSize: 7,
    color: "#64748b",
    letterSpacing: 0.8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  refValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    marginTop: 0.5,
  },
  dateLabel: {
    fontSize: 7,
    color: "#64748b",
    letterSpacing: 0.8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginTop: 2.5,
  },
  dateValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    marginTop: 0.5,
  },

  // Title Block
  titleContainer: {
    marginBottom: 9,
  },
  titleText: {
    fontSize: 17.5,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  titleDate: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#b45309",
    marginTop: 2,
  },

  // Greeting & Body
  greeting: {
    fontSize: 9.8,
    marginBottom: 5,
    color: "#0f172a",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  bodyP: {
    fontSize: 8.8,
    lineHeight: 1.5,
    color: "#334155",
    marginBottom: 6,
  },

  // Program Particulars Table
  table: {
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    borderRadius: 3.5,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    backgroundColor: "#07284a",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tableHeaderTitle: {
    color: "#ffffff",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  colKey: {
    width: 180,
    fontSize: 8.2,
    color: "#334155",
    paddingVertical: 4.2,
    paddingHorizontal: 10,
    borderRightWidth: 0.5,
    borderRightColor: "#e2e8f0",
  },
  colVal: {
    flex: 1,
    fontSize: 8.4,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    paddingVertical: 4.2,
    paddingHorizontal: 10,
  },

  // Cards
  cardBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    paddingVertical: 7.5,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  termItem: {
    fontSize: 7.8,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 2.8,
  },
  cardText: {
    fontSize: 7.8,
    color: "#475569",
    lineHeight: 1.42,
  },

  // Closing Acceptance
  acceptanceText: {
    fontSize: 8.4,
    color: "#334155",
    lineHeight: 1.44,
    marginTop: 4,
    marginBottom: 12,
  },

  // Signatures & Seal Section
  authSection: {
    position: "absolute",
    bottom: 96,
    left: 26,
    right: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signBlockLeft: {
    alignItems: "flex-start",
    width: 175,
  },
  signBlockRight: {
    alignItems: "flex-end",
    width: 175,
  },
  centerSealBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sealImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  sealLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
  },
  signImgContainer: {
    height: 46,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  signImgContainerRight: {
    height: 46,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  signImg: {
    height: 44,
    objectFit: "contain",
  },
  signLine: {
    borderTopWidth: 1.2,
    borderTopColor: "#334155",
    width: 165,
    marginTop: 2,
    marginBottom: 2.5,
  },
  signName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
  },
  signTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginTop: 0.5,
  },
  signOrg: {
    fontSize: 6.2,
    color: "#94a3b8",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 26,
    right: 26,
    borderTopWidth: 0.75,
    borderTopColor: "#cbd5e1",
    paddingTop: 4,
    paddingBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    width: 155,
    flexDirection: "row",
    alignItems: "center",
  },
  footerMsme: {
    height: 36,
    width: 76,
    marginRight: 8,
    objectFit: "contain",
  },
  footerVinix: {
    height: 32,
    width: 66,
    objectFit: "contain",
  },
  footerCenter: {
    flex: 1,
    alignItems: "center",
  },
  footerCompanyName: {
    fontSize: 9.8,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 0.3,
  },
  footerRegistry: {
    fontSize: 8.2,
    color: "#334155",
    marginTop: 1.5,
  },
  footerContact: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0284c7",
    marginTop: 1.5,
  },
  footerRight: {
    width: 155,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  footerYrTech: {
    height: 32,
    width: 50,
    objectFit: "contain",
  },
});

export function OfferLetterDoc({
  fullName,
  internId,
  domain = "Full Stack Development",
  issuedAt = new Date().toISOString(),
  duration = 3,
  imageAssets = defaultImageAssets,
}) {
  const date = new Date(issuedAt);
  const dateStr = !isNaN(date.getTime()) 
    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : issuedAt;
  const domainName = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : "Full Stack Development";
  const isSixMonths = String(duration || "").includes("6");
  const durationNum = isSixMonths ? 6 : 3;
  const durLabel = `${durationNum} Months`;

  const endDate = !isNaN(date.getTime()) ? new Date(date) : new Date();
  if (!isNaN(date.getTime())) {
    endDate.setMonth(endDate.getMonth() + durationNum);
  }
  const endDateStr = endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const resolvedAssets = { ...defaultImageAssets, ...imageAssets };

  return (
    <Document>
      <Page size="A4" style={offerStyles.page}>
        <View style={offerStyles.frameOuter} />
        <View style={offerStyles.frameInner} />

        {/* Watermark */}
        <View style={offerStyles.watermark}>
          <Text style={offerStyles.watermarkText}>SKYROVIX</Text>
        </View>

        {/* Header */}
        <View style={offerStyles.header}>
          <View style={offerStyles.headerLeft}>
            {resolvedAssets?.logo && <Image src={resolvedAssets.logo} style={offerStyles.brandLogo} />}
            <View style={offerStyles.headerDivider} />
            <View>
              <Text style={offerStyles.brandName}>SKYROVIX</Text>
              <Text style={offerStyles.brandTagline}>Empowering Future Innovators</Text>
              <Text style={offerStyles.brandMeta}>www.skyrovix.in | skyrovix@gmail.com</Text>
            </View>
          </View>
          <View style={offerStyles.headerRight}>
            <Text style={offerStyles.refLabel}>INTERNSHIP ID</Text>
            <Text style={offerStyles.refValue}>{internId}</Text>
            <Text style={offerStyles.dateLabel}>ISSUE DATE</Text>
            <Text style={offerStyles.dateValue}>{dateStr}</Text>
          </View>
        </View>

        {/* Title Block */}
        <View style={offerStyles.titleContainer}>
          <Text style={offerStyles.titleText}>INTERNSHIP OFFER LETTER</Text>
          <Text style={offerStyles.titleDate}>Date: {dateStr}</Text>
        </View>

        {/* Candidate Salutation */}
        <Text style={offerStyles.greeting}>
          Dear <Text style={offerStyles.bold}>{fullName}</Text>,
        </Text>

        <Text style={offerStyles.bodyP}>
          We are delighted to offer you the position of{" "}
          <Text style={offerStyles.bold}>Virtual Intern – {domainName}</Text> at{" "}
          <Text style={offerStyles.bold}>Skyrovix</Text> (accessible at{" "}
          <Text style={offerStyles.bold}>skyrovix.in</Text>). After reviewing your application and technical aptitude,
          we are confident that your skills will make you a valuable addition to our engineering cohort.
        </Text>
        <Text style={offerStyles.bodyP}>
          Your virtual internship particulars and engagement details are summarized below:
        </Text>

        {/* Program Particulars Table */}
        <View style={offerStyles.table}>
          <View style={offerStyles.tableHeader}>
            <Text style={offerStyles.tableHeaderTitle}>INTERNSHIP PROGRAM PARTICULARS</Text>
          </View>
          <View style={offerStyles.tableRow}>
            <Text style={offerStyles.colKey}>Internship Track</Text>
            <Text style={offerStyles.colVal}>{domainName}</Text>
          </View>
          <View style={offerStyles.tableRowAlt}>
            <Text style={offerStyles.colKey}>Intern ID</Text>
            <Text style={offerStyles.colVal}>{internId}</Text>
          </View>
          <View style={offerStyles.tableRow}>
            <Text style={offerStyles.colKey}>Program Duration</Text>
            <Text style={offerStyles.colVal}>{durLabel}</Text>
          </View>
          <View style={offerStyles.tableRowAlt}>
            <Text style={offerStyles.colKey}>Commencement Date</Text>
            <Text style={offerStyles.colVal}>{dateStr}</Text>
          </View>
          <View style={offerStyles.tableRow}>
            <Text style={offerStyles.colKey}>Estimated Completion</Text>
            <Text style={offerStyles.colVal}>{endDateStr}</Text>
          </View>
          <View style={offerStyles.tableRowAlt}>
            <Text style={offerStyles.colKey}>Stipend Specification</Text>
            <Text style={offerStyles.colVal}>Performance-Based / Unpaid Internship</Text>
          </View>
          <View style={offerStyles.tableRow}>
            <Text style={offerStyles.colKey}>Location & Model</Text>
            <Text style={offerStyles.colVal}>Remote / Virtual (Task-Based, Flexible Hours)</Text>
          </View>
          <View style={offerStyles.tableRowAlt}>
            <Text style={offerStyles.colKey}>Official Domain Portal</Text>
            <Text style={offerStyles.colVal}>https://skyrovix.in</Text>
          </View>
        </View>

        {/* General Terms & Conditions */}
        <View style={offerStyles.cardBox}>
          <Text style={offerStyles.cardTitle}>GENERAL TERMS & CONDITIONS OF INTERNSHIP:</Text>
          <Text style={offerStyles.termItem}>
            <Text style={offerStyles.bold}>1. Task Execution & Milestones: </Text>
            You will complete production-grade tasks aligned with {domainName}. Timely milestone submissions via skyrovix.in are mandatory.
          </Text>
          <Text style={offerStyles.termItem}>
            <Text style={offerStyles.bold}>2. Code of Conduct & Integrity: </Text>
            Plagiarism, unauthorized dissemination, or professional misconduct will lead to immediate cancellation of your internship program.
          </Text>
          <Text style={offerStyles.termItem}>
            <Text style={offerStyles.bold}>3. Confidentiality: </Text>
            All source code, datasets, and architecture designs shared during this program remain proprietary to Skyrovix.
          </Text>
          <Text style={offerStyles.termItem}>
            <Text style={offerStyles.bold}>4. Mentorship: </Text>
            You will receive technical guidance and code review feedback throughout your tenure.
          </Text>
          <Text style={offerStyles.termItem}>
            <Text style={offerStyles.bold}>5. Certification: </Text>
            An official Certificate of Completion will be issued upon mentor approval of all milestone tasks.
          </Text>
        </View>

        {/* Certificate Clause */}
        <View style={offerStyles.cardBox}>
          <Text style={offerStyles.cardTitle}>CERTIFICATE OF COMPLETION</Text>
          <Text style={offerStyles.cardText}>
            Upon successful completion of all assigned tasks, you will receive an official verifiable certificate on our portal at skyrovix.in/verify-certificate.
          </Text>
        </View>

        <Text style={offerStyles.acceptanceText}>
          Please retain this letter as your official offer and confirmation. We look forward to a mutually rewarding learning experience.
        </Text>

        {/* Dual Signatures & Seal */}
        <View style={offerStyles.authSection}>
          <View style={offerStyles.signBlockLeft}>
            <View style={offerStyles.signImgContainer}>
              {resolvedAssets?.sigFounder && <Image src={resolvedAssets.sigFounder} style={offerStyles.signImg} />}
            </View>
            <View style={offerStyles.signLine} />
            <Text style={offerStyles.signName}>Hariharan S</Text>
            <Text style={offerStyles.signTitle}>Founder & CEO</Text>
            <Text style={offerStyles.signOrg}>Skyrovix</Text>
          </View>

          <View style={offerStyles.centerSealBlock}>
            {resolvedAssets?.seal && <Image src={resolvedAssets.seal} style={offerStyles.sealImage} />}
            <Text style={offerStyles.sealLabel}>OFFICIAL SEAL</Text>
          </View>

          <View style={offerStyles.signBlockRight}>
            <View style={offerStyles.signImgContainerRight}>
              {resolvedAssets?.sigCofounder && <Image src={resolvedAssets.sigCofounder} style={offerStyles.signImg} />}
            </View>
            <View style={offerStyles.signLine} />
            <Text style={offerStyles.signName}>Maheshwaran S</Text>
            <Text style={offerStyles.signTitle}>Co-Founder</Text>
            <Text style={offerStyles.signOrg}>Skyrovix</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={offerStyles.footer}>
          <View style={offerStyles.footerLeft}>
            {resolvedAssets?.msme && <Image src={resolvedAssets.msme} style={offerStyles.footerMsme} />}
            {resolvedAssets?.vinix && <Image src={resolvedAssets.vinix} style={offerStyles.footerVinix} />}
          </View>
          <View style={offerStyles.footerCenter}>
            <Text style={offerStyles.footerCompanyName}>SKYROVIX</Text>
            <Text style={offerStyles.footerRegistry}>UDYAM Registry: UDYAM-TN-17-0076606</Text>
            <Text style={offerStyles.footerContact}>skyrovix@gmail.com | www.skyrovix.in</Text>
          </View>
          <View style={offerStyles.footerRight}>
            {resolvedAssets?.yrTech && <Image src={resolvedAssets.yrTech} style={offerStyles.footerYrTech} />}
          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ==========================================================================
   2. CERTIFICATE PDF TEMPLATE
   ========================================================================== */

const certStyles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
    color: "#1e293b",
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  outerBorder: {
    borderWidth: 6,
    borderColor: "#07284a",
    padding: 20,
    height: "100%",
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 22,
    height: "100%",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandTitleBlock: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 4,
  },
  brandTagline: {
    fontSize: 8.5,
    color: "#64748b",
    marginTop: 2,
  },
  partnerLogo: {
    height: 32,
    width: 65,
    objectFit: "contain",
  },

  // Titles
  titleBlock: {
    alignItems: "center",
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    letterSpacing: 4,
  },
  subTitle: {
    fontSize: 11,
    color: "#64748b",
    letterSpacing: 7,
    marginTop: 4,
    textTransform: "uppercase",
  },

  // Recipient Block
  recipientBlock: {
    alignItems: "center",
    marginTop: 18,
  },
  awardedText: {
    fontSize: 10.5,
    color: "#64748b",
  },
  recipientName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
    marginTop: 8,
    marginBottom: 8,
    textDecoration: "underline",
    textDecorationColor: "#0284c7",
  },
  descriptionText: {
    fontSize: 10,
    color: "#475569",
    textAlign: "center",
    maxWidth: 620,
    lineHeight: 1.55,
  },
  highlightText: {
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
  },

  // Verification Badge
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  qrImage: {
    width: 44,
    height: 44,
  },
  qrVerifiedText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
  },
  qrSubText: {
    fontSize: 7,
    color: "#64748b",
  },

  // Signatures & Seal
  signSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
  },
  sigBlock: {
    alignItems: "center",
    width: 140,
  },
  sigImg: {
    height: 30,
    marginBottom: 2,
    objectFit: "contain",
  },
  sigLine: {
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    width: "100%",
    marginBottom: 3,
  },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#07284a",
  },
  sigRole: {
    fontSize: 7,
    color: "#64748b",
  },
  sealImage: {
    width: 72,
    height: 72,
    objectFit: "contain",
  },

  // Metadata Footer
  metaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
    fontSize: 7.5,
    color: "#64748b",
  },
});

export function CertificateDoc({
  fullName,
  internId,
  domain = "Full Stack Development",
  certId,
  issuedAt = new Date().toISOString(),
  verifyUrl,
  qrCodeDataUri,
  imageAssets = defaultImageAssets,
}) {
  const date = new Date(issuedAt);
  const dateFormatted = !isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : issuedAt;

  const resolvedAssets = { ...defaultImageAssets, ...imageAssets };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={certStyles.page}>
        <View style={certStyles.outerBorder}>
          <View style={certStyles.innerBorder}>
            
            {/* Header: Logos & Brand */}
            <View style={certStyles.header}>
              <View style={certStyles.logoRow}>
                {resolvedAssets?.logo && <Image src={resolvedAssets.logo} style={{ width: 44, height: 44 }} />}
                {resolvedAssets?.vinix && <Image src={resolvedAssets.vinix} style={certStyles.partnerLogo} />}
              </View>
              <View style={certStyles.brandTitleBlock}>
                <Text style={certStyles.brandName}>SKYROVIX</Text>
                <Text style={certStyles.brandTagline}>Empowering Future Innovators</Text>
              </View>
              <View style={certStyles.logoRow}>
                {resolvedAssets?.yrTech && <Image src={resolvedAssets.yrTech} style={certStyles.partnerLogo} />}
                {resolvedAssets?.msme && <Image src={resolvedAssets.msme} style={certStyles.partnerLogo} />}
              </View>
            </View>

            {/* Title Section */}
            <View style={certStyles.titleBlock}>
              <Text style={certStyles.mainTitle}>CERTIFICATE</Text>
              <Text style={certStyles.subTitle}>OF INTERNSHIP COMPLETION</Text>
            </View>

            {/* Recipient Details */}
            <View style={certStyles.recipientBlock}>
              <Text style={certStyles.awardedText}>This certificate is proudly presented to</Text>
              <Text style={certStyles.recipientName}>{fullName}</Text>
              <Text style={certStyles.descriptionText}>
                for successfully completing the rigorous task-based virtual internship in{" "}
                <Text style={certStyles.highlightText}>{domain}</Text> at Skyrovix, demonstrating consistent technical competence, problem-solving skills, and dedication to industry-standard deliverables.
              </Text>
            </View>

            {/* QR Verification Badge */}
            {qrCodeDataUri && (
              <View style={certStyles.qrContainer}>
                <Image src={qrCodeDataUri} style={certStyles.qrImage} />
                <View>
                  <Text style={certStyles.qrVerifiedText}>Digitally Verified</Text>
                  <Text style={certStyles.qrSubText}>Scan to verify credential integrity</Text>
                </View>
              </View>
            )}

            {/* Endorsements & Seal */}
            <View style={certStyles.signSection}>
              <View style={certStyles.sigBlock}>
                {resolvedAssets?.sigFounder && <Image src={resolvedAssets.sigFounder} style={certStyles.sigImg} />}
                <View style={certStyles.sigLine} />
                <Text style={certStyles.sigName}>Hariharan S</Text>
                <Text style={certStyles.sigRole}>Founder & CEO</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                {resolvedAssets?.seal && <Image src={resolvedAssets.seal} style={certStyles.sealImage} />}
              </View>

              <View style={certStyles.sigBlock}>
                {resolvedAssets?.sigCofounder && <Image src={resolvedAssets.sigCofounder} style={certStyles.sigImg} />}
                <View style={certStyles.sigLine} />
                <Text style={certStyles.sigName}>Maheshwaran S</Text>
                <Text style={certStyles.sigRole}>Co-Founder</Text>
              </View>
            </View>

            {/* Bottom Metadata */}
            <View style={certStyles.metaFooter}>
              <View>
                <Text>Certificate ID: {certId}</Text>
                <Text>Intern ID: {internId}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text>Issue Date: {dateFormatted}</Text>
                <Text>Verification Portal: {verifyUrl || "skyrovix.online/verify"}</Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ==========================================================================
   3. DOWNLOAD & EXPORT UTILITIES
   ========================================================================== */

/**
 * Downloads any React-PDF document element directly in browser.
 */
export async function downloadPdf(doc, filename) {
  try {
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Could not generate the PDF file. Please try again.");
  }
}

/**
 * Trigger Offer Letter download with QR code
 */
export async function handleDownloadOfferLetter(data) {
  const internId = data.internId || data.student_id_formatted || data.student_id || "SKX-2026-9055";
  const verifyUrl = data.verifyUrl || `https://skyrovix.online/verify?id=${encodeURIComponent(internId)}`;
  
  let qrCodeDataUri = data.qrCodeDataUri;
  if (!qrCodeDataUri) {
    try {
      qrCodeDataUri = await QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 });
    } catch (e) {
      console.warn("QR generation failed", e);
    }
  }

  const docData = {
    fullName: data.fullName || data.student_name || "Intern",
    internId: internId,
    domain: data.domain || "Full Stack Development",
    issuedAt: data.issuedAt || data.issue_date || new Date().toISOString(),
    duration: String(data.duration || '').includes('6') ? 6 : 3,
    imageAssets: data.imageAssets || defaultImageAssets,
    verifyUrl,
    qrCodeDataUri,
  };

  await downloadPdf(
    <OfferLetterDoc {...docData} />,
    `OfferLetter_${internId}.pdf`
  );
}

/**
 * Trigger Certificate download with QR code
 */
export async function handleDownloadCertificate(data) {
  const certId = data.certId || data.certificate_id || data.id || "SKX-CERT-001";
  const internId = data.internId || data.intern_id || data.student_id_formatted || "SKX-2026-9055";
  const verifyUrl = data.verifyUrl || `https://skyrovix.online/verify-certificate?id=${encodeURIComponent(certId)}`;
  
  let qrCodeDataUri = data.qrCodeDataUri;
  if (!qrCodeDataUri) {
    try {
      qrCodeDataUri = await QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 });
    } catch (e) {
      console.warn("QR generation failed", e);
    }
  }

  const docData = {
    fullName: data.fullName || data.student_name || "Intern",
    internId: internId,
    domain: data.domain || "Full Stack Development",
    certId: certId,
    issuedAt: data.issuedAt || data.issue_date || new Date().toISOString(),
    verifyUrl,
    qrCodeDataUri,
    imageAssets: data.imageAssets || defaultImageAssets,
  };

  await downloadPdf(
    <CertificateDoc {...docData} />,
    `Certificate_${certId}.pdf`
  );
}

/* ==========================================================================
   4. INTERACTIVE HTML PREVIEW
   ========================================================================== */

export function HtmlCertificatePreview({
  fullName,
  domain = "Full Stack Development",
  certId,
  issuedAt = new Date().toISOString(),
}) {
  return (
    <div className="w-[1122px] h-[793px] bg-white p-6 shadow-2xl relative border-[8px] border-[#07284a] print:w-full print:h-screen print:border-none">
      <div className="border border-slate-300 h-full p-8 flex flex-col justify-between text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-widest text-[#07284a]">SKYROVIX</h1>
            <p className="text-xs text-slate-500 tracking-wider">EMPOWERING FUTURE INNOVATORS</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">MSME UDYAM REGISTRY</p>
            <p>UDYAM-TN-17-0076606</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-4">
          <h2 className="text-4xl font-black text-[#07284a] tracking-wider uppercase">
            Certificate of Completion
          </h2>
          <p className="text-sm text-sky-700 uppercase tracking-widest font-semibold mt-1">
            Virtual Internship Program
          </p>
        </div>

        {/* Candidate Presentation */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">This is to certify that</p>
          <p className="text-3xl font-bold text-[#07284a] underline decoration-sky-500 underline-offset-8">
            {fullName}
          </p>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            has successfully completed the task-based virtual internship in{" "}
            <span className="font-bold text-slate-900">{domain}</span>, demonstrating commendable dedication,
            technical proficiency, and delivery of production-grade milestone projects.
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="w-36 border-b-2 border-slate-700 mb-1" />
            <p className="font-bold text-sm text-[#07284a]">Hariharan S</p>
            <p className="text-xs text-slate-500">Founder & CEO</p>
          </div>
          <div className="text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Certificate ID: {certId}</p>
            <p>Issued on: {new Date(issuedAt).toLocaleDateString()}</p>
            <p className="text-sky-600 font-medium">verify at: skyrovix.online/verify</p>
          </div>
          <div className="text-center">
            <div className="w-36 border-b-2 border-slate-700 mb-1" />
            <p className="font-bold text-sm text-[#07284a]">Maheshwaran S</p>
            <p className="text-xs text-slate-500">Co-Founder</p>
          </div>
        </div>

      </div>
    </div>
  );
}
