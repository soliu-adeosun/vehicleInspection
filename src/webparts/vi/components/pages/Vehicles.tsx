import * as React from "react";

require("vehicles");

declare global {
  interface Window {
    loadVehiclesComponent: () => void;
  }
}

export default class Vehicles extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
      <section className="view active" aria-labelledby="vehicles-title">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h2 className="section-title" id="vehicles-title">
            Manage Vehicles
          </h2>
        </div>

        <div className="form-card" style={{ marginBottom: 20 }}>
          <h3 className="form-card-title" id="vehicle-form-title">
            Add Vehicle
          </h3>
          <form id="vehicle-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="vehicle-title">
                  Title / Name
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="vehicle-title"
                  placeholder="e.g. Toyota Hilux"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vehicle-registration">
                  Registration
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="vehicle-registration"
                  placeholder="e.g. ABC-123XY"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="vehicle-licenseplate">
                  License Plate
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="vehicle-licenseplate"
                  placeholder="e.g. LAG-123-AB"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                id="vehicle-save-btn"
              >
                <i className="fa-solid fa-plus" aria-hidden="true" /> Add
                Vehicle
              </button>
              <button
                type="button"
                className="btn btn-ghost hidden"
                id="vehicle-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="filter-row" role="toolbar">
          <button
            type="button"
            id="vehicle-refresh-btn"
            className="btn btn-sm btn-copper"
            style={{ marginLeft: "auto" }}
          >
            <i className="fa-solid fa-rotate" aria-hidden="true" /> Refresh
          </button>
        </div>
        <p className="record-info" aria-live="polite">
          Total Records: <span id="vehicles-recordcount">0</span>
        </p>
        <div className="table-wrap">
          <table aria-label="Vehicles">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Registration</th>
                <th scope="col">License Plate</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="vehicles-table-body" />
          </table>
        </div>
      </section>
    );
  }

  public componentDidMount(): void {
    window.loadVehiclesComponent();
  }
}
