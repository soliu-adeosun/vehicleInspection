import * as React from "react";
// import { FilterBox } from "../../../../Global/FilterBox";
require("report");

export default class Report extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
      <section
        className="view active"
        id="view-staffbookings"
        aria-labelledby="staff-title"
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h2 className="section-title" id="staff-title">
            Report
          </h2>
        </div>
        <div className="filter-row" role="toolbar">
          <button
          id="exportbtn"
            className="btn btn-sm btn-copper"
            style={{ marginLeft: "auto" }}
          >
            <i className="fa-solid fa-download" aria-hidden="true" /> Export CSV
          </button>
        </div>
        <p className="record-info" aria-live="polite">Total Records: 
          <span id="recordcount" ></span>
        </p>
        <div className="table-wrap">
          <table aria-label="Staff bookings">
            <thead>
              <tr>
                <th>S/N</th>
                <th speed-table-data="DriverName" scope="col">
                  Driver Name
                </th>
                <th speed-table-data="Date" scope="col">
                  Date 
                </th>
                <th speed-table-data="WeekNumber" scope="col">
                  Week Number 
                </th>
                <th speed-table-data="Vehicle" scope="col">
                  Vehicle 
                </th>
                <th speed-table-data="Registration" scope="col">
                  Registeration 
                </th>
                <th speed-table-data="Mileage" scope="col">
                  Mileage 
                </th>
                <th speed-table-data="ProcessStatus" scope="col">
                  Status 
                </th>
                <th speed-table-data="Title" scope="col">
                  Action 
                </th>
              </tr>
            </thead>
            <tbody id="speed-data-table" />
          </table>
          
        </div>
        <div style={ {marginTop: "10px"} } id="myrequestpagination" className="pagination" />
      </section>
    );
  }

  public componentDidMount(): void {
    window.loadReportComponent();
  }
}
