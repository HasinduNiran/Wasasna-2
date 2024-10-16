import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#FAFAFA", // Light background color
  },
  section: {
    marginBottom: 20,
    padding: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#007BFF", // Primary color for headers
  },
  companyName: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#FF5733", // Company name color
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    border: "1px solid black",
    padding: 5,
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableColTotal: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  textBold: {
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 12,
    color: "#333",
  },
  sectionHeader: {
    backgroundColor: "#007BFF", // Primary header background
    color: "#FFFFFF", // White text color
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

const EstimatePDFDocument = ({ repairEstimate, estimateList }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Company Name */}
      <View>
        <Text style={styles.companyName}>Wasana Service Centre</Text>
      </View>

      {/* Vehicle Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Vehicle Information</Text>
        <Text style={styles.infoText}>
          Vehicle No: {repairEstimate.Register_Number}
        </Text>
        <Text style={styles.infoText}>
          Engine: {repairEstimate.Engine_Details}
        </Text>
        <Text style={styles.infoText}>Model: {repairEstimate.Model}</Text>
        <Text style={styles.infoText}>Year: {repairEstimate.Year}</Text>
        <Text style={styles.infoText}>Make: {repairEstimate.Make}</Text>
        <Text style={styles.infoText}>
          Vehicle Color: {repairEstimate.Vehicle_Color}
        </Text>
        <Text style={styles.infoText}>
          Transmission: {repairEstimate.Transmission_Details}
        </Text>
      </View>

      {/* Customer Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Customer Information</Text>
        <Text style={styles.infoText}>CUS Id: {repairEstimate.cusID}</Text>
        <Text style={styles.infoText}>
          First Name: {repairEstimate.firstName}
        </Text>
        <Text style={styles.infoText}>
          Last Name: {repairEstimate.lastName}
        </Text>
        <Text style={styles.infoText}>Email: {repairEstimate.email}</Text>
        <Text style={styles.infoText}>Contact: {repairEstimate.phone}</Text>
        <Text style={styles.infoText}>NIC: {repairEstimate.NIC}</Text>
      </View>

      {/* Insurance Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Insurance Information</Text>
        <Text style={styles.infoText}>
          Insurance Provider: {repairEstimate.insuranceProvider}
        </Text>
        <Text style={styles.infoText}>
          Agent Name: {repairEstimate.agentName}
        </Text>
        <Text style={styles.infoText}>
          Agent Email: {repairEstimate.agentEmail}
        </Text>
        <Text style={styles.infoText}>
          Agent Contact: {repairEstimate.agentContact}
        </Text>
        <Text style={styles.infoText}>
          Description: {repairEstimate.shortDescription}
        </Text>
      </View>

      {/* Estimate Table Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Estimate Details</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Name</Text>
            <Text style={styles.tableCol}>Unit Price</Text>
            <Text style={styles.tableCol}>Quantity</Text>
            <Text style={styles.tableCol}>Total</Text>
          </View>
          {/* Table Body */}
          {estimateList.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.unitPrice}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>
                {item.quantity * item.unitPrice}
              </Text>
            </View>
          ))}
          {/* Subtotal Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableColTotal]}>
              Subtotal:
            </Text>
            <Text style={styles.tableCol}>{repairEstimate.totalAmount}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default EstimatePDFDocument;
