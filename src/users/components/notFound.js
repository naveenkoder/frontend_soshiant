import NoDataImage from "../../assets/nadata.svg";
import "./notFound.css";
export function NADataPage({ isDataAvailable }) {
  return (
    <div className="na-data">
      <img src={NoDataImage} alt="Data N/A" />
      {isDataAvailable ? (
        <span>Please Select a Route and a Period to See the Charts</span>
      ) : (
        <span>No Data Available</span>
      )}
    </div>
  );
}
