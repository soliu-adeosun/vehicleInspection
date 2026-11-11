import * as React from "react";

require("drivers");

declare global {
  interface Window {
    loadDriversComponent: () => void;
  }
}

export default class Drivers extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
      <section className="view active" aria-labelledby="drivers-title">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h2 className="section-title" id="drivers-title">
            Manage Drivers
          </h2>
        </div>

        <div className="form-card" style={{ marginBottom: 20 }}>
          <h3 className="form-card-title" id="driver-form-title">
            Add Driver
          </h3>
          <form id="driver-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="driver-title">
                  Driver Name
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="driver-title"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                id="driver-save-btn"
              >
                <i className="fa-solid fa-plus" aria-hidden="true" /> Add Driver
              </button>
              <button
                type="button"
                className="btn btn-ghost hidden"
                id="driver-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="filter-row" role="toolbar">
          <button
            type="button"
            id="driver-refresh-btn"
            className="btn btn-sm btn-copper"
            style={{ marginLeft: "auto" }}
          >
            <i className="fa-solid fa-rotate" aria-hidden="true" /> Refresh
          </button>
        </div>
        <p className="record-info" aria-live="polite">
          Total Records: <span id="drivers-recordcount">0</span>
        </p>
        <div className="table-wrap">
          <table aria-label="Drivers">
            <thead>
              <tr>
                <th scope="col">Driver Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="drivers-table-body" />
          </table>
        </div>
      </section>
    );
  }

  public componentDidMount(): void {
    window.loadDriversComponent();
  }
}
