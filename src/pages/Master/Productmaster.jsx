import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { PlusOutlined } from "@ant-design/icons";

export default function MasterSearchCard() {
  const [master, setMaster] = useState("");
  const [masterList, setMasterList] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState("");
  const [showExtraCard, setShowExtraCard] = useState(false);

  const [newRow, setNewRow] = useState({
    code: "",
    name: "",
    uom: "",
    category: "",
  });

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
    flex: 1,
  };

  const columnDefs = [
    { headerName: "Product Code", field: "code", editable: true },
    { headerName: "Product Description", field: "name", editable: true },
    { headerName: "Product UOM Code", field: "uom", editable: true },
    { headerName: "Product Category Code", field: "category", editable: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (master) {
      if (!masterList.find((m) => m.code === master)) {
        setMasterList([
        //   ...masterList,
          {
            code: '1PM-H1450-10',
            // name: master.replace("1PM-H1450-10.Adhesive_1", "1PM-H1450-10.Adhesive_1 "),
            name:"1PM-H1450-10.Adhesive_1",
            uom: "U0001", // static data
            category: "CI", // static data
          },
          {
            code: "1PM-H1450-10.Adhesive_2",
            // name: master.replace("1PM-H1450-10.Adhesive_2", "1PM-H1450-10.Adhesive_2 "),
            name:"1PM-H1450-10.Adhesive_2",
            uom: 'U0001', // static data
            category: 'FG', // static data
          },
          {
            code: "1PM-H1450-10.Balancing_Machine",
            // name: master.replace("1PM-H1450-10.Balancing_Machine", "1PM-H1450-10.Balancing_Machine "),
            name:"1PM-H1450-10.Balancing_Machine",
            uom: 'U0001', // static data
            category: 'CI', // static data
          },
        ]);
      }
      setSelectedHeader(master.replace("master", "Master "));
    }
    setShowExtraCard(false); 
  };

  const handleCancel = () => {
    setMaster("");
    setMasterList([]);
    setShowExtraCard(false);
  };

  const handleAdd = () => {
    setShowExtraCard(true);
    setMasterList([]); // Show input form
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const handleInsertRow = (e) => {
    e.preventDefault();
    if (newRow.code && newRow.name && newRow.uom && newRow.category) {
      setMasterList([...masterList, newRow]);
      setNewRow({ code: "", name: "", uom: "", category: "" }); // reset inputs
      setShowExtraCard(false); // hide form after adding
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="container mt-1">
      {/* First Card - Form */}
      <div className="card shadow" style={{ borderRadius: "6px" }}>
        <div
          className="card-header text-white fw-bold d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#00264d" }}
        >
          Master
          <PlusOutlined
            style={{ fontSize: "20px", cursor: "pointer", color: "white" }}
            onClick={handleAdd}
            title="Add Master"
          />
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <span className="text-danger">*</span> Master
                </label>
                <select
                  className="form-select"
                  value={master}
                  onChange={(e) => setMaster(e.target.value)}
                  required
                >
                  <option value="">-- Select Master --</option>
                  <option value="master1">Master 1</option>
                  <option value="master2">Master 2</option>
                  <option value="master3">Master 3</option>
                </select>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn text-white me-2"
                style={{ backgroundColor: "#00264d", minWidth: "90px" }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn text-white"
                style={{ backgroundColor: "#00264d", minWidth: "90px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Second Card - Table */}
      {masterList.length > 0 && (
        <div className="card shadow mt-4" style={{ borderRadius: "6px" }}>
          <div
            className="card-header text-white fw-bold"
            style={{ backgroundColor: "#00264d" }}
          >
            {selectedHeader} Details
          </div>
          <div className="card-body p-3">
            <AgGridReact
              rowData={masterList}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              paginationPageSize={10}
              pagination={true}
              domLayout="autoHeight"
              singleClickEdit={true}
              onCellValueChanged={(params) => {
                const updatedList = [...masterList];
                updatedList[params.rowIndex] = params.data;
                setMasterList(updatedList);
              }}
            />
          </div>
        </div>
      )}

      {/* Extra Card shown when Plus is clicked */}
      {showExtraCard && (
        <div className="card shadow mt-4" style={{ borderRadius: "6px" }}>
          <div
            className="card-header text-white fw-bold"
            style={{ backgroundColor: "#00264d" }}
          >
            Add New Product
          </div>
          <div className="card-body">
            <form onSubmit={handleInsertRow}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Product Code</label>
                  <input
                    type="text"
                    name="code"
                    value={newRow.code}
                    onChange={handleNewRowChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Product Description</label>
                  <input
                    type="text"
                    name="name"
                    value={newRow.name}
                    onChange={handleNewRowChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">UOM Code</label>
                  <input
                    type="text"
                    name="uom"
                    value={newRow.uom}
                    onChange={handleNewRowChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Category Code</label>
                  <input
                    type="text"
                    name="category"
                    value={newRow.category}
                    onChange={handleNewRowChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn text-white me-2"
                  style={{ backgroundColor: "#00264d", minWidth: "90px" }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowExtraCard(false)}
                  className="btn btn-secondary"
                  style={{ minWidth: "90px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
