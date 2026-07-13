import * as React from "react";
import { Link } from "react-router-dom";

require("viewrequest");

export default class NewRequest extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
          <div className="form-card">
            <h1 className="form-card-title">Vehicle Inspection Checklist</h1>
    
            <div className="form-card">
              <div id="create-menu-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-date">
                      Week Start
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="cm-date"
                      speed-bind="WeekStart"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="">
                      Week End
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      speed-bind="WeekEnd"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                </div>
    
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-seats">
                      Wk. Start Kms
                    </label>
                    <input
                      className="form-input"
                      type="number"
                      id="cm-seats"
                      speed-bind="WkStartKms"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-seats">
                      Wk. End Kms
                    </label>
                    <input
                      className="form-input"
                      type="number"
                      id="cm-seats"
                      speed-bind="WkEndKms"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                </div>
    
                <div className="form-group">
                    <label className="form-label" htmlFor="cm-seats">
                      Operator
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="cm-seats"
                      speed-bind="Operator"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
    
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-seats">
                      Vehicle
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="cm-seats"
                      speed-bind="Vehicle"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-seats">
                      Registration
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="cm-seats"
                      speed-bind="Registration"
                      speed-bind-class="MetaData"
                      readOnly
                    />
                  </div>
                </div>
                
              </div>
    
              <div className="table-wrap" style={{ marginTop: "20px" }}>
              <table aria-label="Staff bookings" id="view-table">

              </table>
              
            </div>
            </div>
    
            <div id="food-inspection-form" style={{ marginTop: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="fh-comments">
                  Comments / Recommendations
                </label>
                <textarea
                  className="form-input"
                  id="fh-comments"
                  rows={4}
                  placeholder="Add any comments or recommendations from the inspection..."
                  speed-bind="Comment"
                  readOnly
                />
              </div>
    
              <div className="form-actions">
                <Link
                  className="btn btn-primary"
                  to="/"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        );
  }

  public componentDidMount(): void {
    window.loadViewRequestComponent();
  }
}
