import React, { useState } from "react";
import { Card, Table, DatePicker, Input, Button, Form } from "antd";

const { RangePicker } = DatePicker;

export default function TraceabilityReport() {
  const [form] = Form.useForm();

  // ✅ Sample mock data
  const data = [
    {
      key: "1",
      product: "Product A",
      lotNo: "LOT-123",
      batchNo: "BATCH-001",
      status: "Completed",
      date: "2025-09-09",
    },
    {
      key: "2",
      product: "Product B",
      lotNo: "LOT-456",
      batchNo: "BATCH-002",
      status: "In Progress",
      date: "2025-09-08",
    },
  ];

  const columns = [
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Lot No", dataIndex: "lotNo", key: "lotNo" },
    { title: "Batch No", dataIndex: "batchNo", key: "batchNo" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const handleSearch = (values) => {
    console.log("Filter values:", values);
    // TODO: hook up real API for filtering
  };

  return (
    <div className="p-3">
      <Card title="Traceability Report" bordered={false}>
        {/* 🔍 Filter Form */}
        <Form
          layout="inline"
          form={form}
          onFinish={handleSearch}
          className="mb-3"
        >
          <Form.Item name="dateRange">
            <RangePicker />
          </Form.Item>

          <Form.Item name="product">
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item name="lotNo">
            <Input placeholder="Lot No" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>

        {/* 📊 Data Table */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
}
